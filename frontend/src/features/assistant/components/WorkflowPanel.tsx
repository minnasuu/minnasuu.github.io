import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { assistants, workHistory as mockWorkHistory, type Workflow, type Skill } from '../data';
import type { HistoryItem } from '../data';
import { getSkillHandler } from '../skills';
import type { SkillResult } from '../skills/types';
import CatSVG from './CatSVG';
import CatMiniAvatar from './CatMiniAvatar';
import '../styles/WorkflowPanel.scss';
import { Icon } from '@suminhan/land-design';
import {
  fetchWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  seedAssistants,
  fetchAIModels,
  setCurrentAIModel,
  getCurrentAIModel,
  fetchWorkflowRuns,
  createWorkflowRun,
  type CreateWorkflowRequest,
  type AIModelInfo,
  type WorkflowRunDB,
} from '../../../shared/utils/backendClient';

const STEP_DURATION = 3000;

/** 执行日志条目 */
interface ExecutionLog {
  stepIndex: number;
  agentId: string;
  agentName: string;
  skillId: string;
  skillName: string;
  skillIcon: string;
  status: 'running' | 'success' | 'warning' | 'error';
  summary?: string;
  timestamp: string;
  duration?: number; // ms
}

/** 每只猫执行时的拟人化台词 */
const workingDialogs: Record<string, string[]> = {
  analytics: ['让我查查数据...', '正在分析中~ 📊', '数据看起来不错!'],
  email: ['邮件编辑中...', '正在发送~ 📧', '送达成功!'],
  writer: ['构思灵感中...', '奋笔疾书~ ✍️', '文章出炉!'],
  crafts: ['排版设计中...', '组件拼装~ 🧩', '页面搭好了!'],
  image: ['调色构图中...', '生成画面~ 🎨', '大作完成!'],
  manager: ['统筹规划中...', '调度安排~ 📋', '一切就绪!'],
  text: ['图片处理中...', '像素运算~ 🔲', '处理完毕!'],
  sing: ['记录整理中...', '纪要生成~ 📝', '记录完毕!'],
  milk: ['仔细检查中...', '质量测试~ 🔎', '检测通过!'],
  hr: ['翻阅简历中...', '面试评估~ 👥', '招募完成!'],
};

const getAgent = (agentId: string) => assistants.find((a) => a.id === agentId);

const getAgentSkill = (agentId: string, skillId: string): Skill | undefined => {
  const agent = getAgent(agentId);
  if (!agent?.skills) return undefined;
  return (agent.skills as Skill[]).find((s) => s.id === skillId);
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${h}:${m}`;
};

const statusIcon = (s: string) => s === 'success' ? <Icon name='check-fill' color='var(--color-green-5)'/> : s === 'warning' ? <Icon name='info-fill' color='var(--color-orange-5)'/> : <Icon name='close-fill' color='var(--color-red-5)'/>;

interface WorkflowPanelProps {
  editorMode?: boolean;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ editorMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [runningStepIndex, setRunningStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDialog, setCurrentDialog] = useState('');
  const [, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [stepResults, setStepResults] = useState<Map<number, SkillResult>>(new Map());
  const stepResultsRef = useRef<Map<number, SkillResult>>(new Map());
  const [workflowList, setWorkflowList] = useState<Workflow[]>(() => []);
  const [isBackendLoaded, setIsBackendLoaded] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [aiModels, setAiModels] = useState<AIModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(getCurrentAIModel());
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [workHistory, setWorkHistory] = useState<HistoryItem[]>(mockWorkHistory);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 从后端加载工作流，失败则使用 mock 数据
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        const dbWorkflows = await fetchWorkflows();
        if (dbWorkflows.length > 0) {
          const mapped: Workflow[] = dbWorkflows.map((w) => ({
            id: w.id,
            name: w.name,
            icon: w.icon,
            description: w.description,
            steps: w.steps as Workflow['steps'],
            startTime: w.startTime ?? undefined,
            endTime: w.endTime ?? undefined,
            scheduled: w.scheduled,
            scheduledEnabled: w.scheduledEnabled,
            cron: w.cron ?? undefined,
            persistent: w.persistent,
          }));
          setWorkflowList(mapped);
          setIsBackendLoaded(true);
        }
      } catch {
        console.log('Backend unavailable, using mock workflows');
      }
    };
    loadWorkflows();
  }, []);

  // 从后端加载执行历史，失败则使用 mock 数据
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { runs } = await fetchWorkflowRuns({ limit: 100 });
        if (runs.length > 0) {
          const mapped: HistoryItem[] = runs.map((r: WorkflowRunDB) => ({
            id: r.id,
            agentId: r.agentId,
            skillId: r.skillId,
            timestamp: r.executedAt,
            summary: r.summary,
            result: r.result,
            workflowName: r.workflowName || undefined,
            status: r.status as HistoryItem['status'],
          }));
          setWorkHistory(mapped);
        }
      } catch {
        console.log('Backend unavailable, using mock history');
      }
    };
    loadHistory();
  }, []);

  // 加载可用 AI 模型
  useEffect(() => {
    fetchAIModels().then(({ models, default: defaultModel }) => {
      setAiModels(models);
      if (!getCurrentAIModel() || getCurrentAIModel() === 'gemini') {
        setSelectedModel(defaultModel);
        setCurrentAIModel(defaultModel);
      }
    });
  }, []);

  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModel(modelId);
    setCurrentAIModel(modelId);
    setIsModelDropdownOpen(false);
  }, []);

  // Seed assistants to database on first editor visit
  useEffect(() => {
    if (!editorMode || seeded) return;
    const doSeed = async () => {
      try {
        const seedData = assistants.map((a) => ({
          assistantId: a.id,
          name: a.name,
          role: a.role,
          description: a.description,
          accent: a.accent,
          systemPrompt: a.systemPrompt,
          skills: a.skills,
          item: a.item,
          catColors: a.catColors,
          messages: a.messages,
        }));
        await seedAssistants(seedData);
        setSeeded(true);
      } catch {
        console.log('Failed to seed assistants (backend may be unavailable)');
      }
    };
    doSeed();
  }, [editorMode, seeded]);

  const toggleScheduled = useCallback(async (wfId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wf = workflowList.find((w) => w.id === wfId);
    if (!wf) return;
    const newValue = !wf.scheduledEnabled;
    setWorkflowList((prev) =>
      prev.map((w) => w.id === wfId ? { ...w, scheduledEnabled: newValue } : w)
    );
    if (isBackendLoaded) {
      try { await updateWorkflow(wfId, { scheduledEnabled: newValue }); } catch { /* ignore */ }
    }
  }, [workflowList, isBackendLoaded]);

  const removeWorkflow = useCallback(async (wfId: string) => {
    setWorkflowList((prev) => prev.filter((wf) => wf.id !== wfId));
    if (isBackendLoaded) {
      try { await deleteWorkflow(wfId); } catch { /* ignore */ }
    }
  }, [isBackendLoaded]);

  const handleAddWorkflow = useCallback(() => {
    setEditingWorkflow({
      id: '',
      name: '',
      icon: '📋',
      description: '',
      steps: [],
      persistent: false,
      scheduled: false,
      scheduledEnabled: false,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleEditWorkflow = useCallback((wf: Workflow, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWorkflow({ ...wf });
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteWorkflow = useCallback(async (wf: Workflow, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`确定删除工作流「${wf.name}」?`)) return;
    setWorkflowList((prev) => prev.filter((w) => w.id !== wf.id));
    if (isBackendLoaded) {
      try { await deleteWorkflow(wf.id); } catch { /* ignore */ }
    }
  }, [isBackendLoaded]);

  const handleSaveWorkflow = useCallback(async (wf: Workflow) => {
    const isNew = !wf.id;
    const req: CreateWorkflowRequest = {
      name: wf.name,
      icon: wf.icon,
      description: wf.description,
      steps: wf.steps,
      startTime: wf.startTime,
      endTime: wf.endTime,
      scheduled: wf.scheduled,
      scheduledEnabled: wf.scheduledEnabled,
      cron: wf.cron,
      persistent: wf.persistent,
    };

    if (isBackendLoaded) {
      try {
        if (isNew) {
          const created = await createWorkflow(req);
          setWorkflowList((prev) => [...prev, { ...wf, id: created.id }]);
        } else {
          await updateWorkflow(wf.id, req);
          setWorkflowList((prev) => prev.map((w) => w.id === wf.id ? wf : w));
        }
      } catch (err) {
        console.error('Save workflow failed:', err);
        // fallback to local
        if (isNew) {
          setWorkflowList((prev) => [...prev, { ...wf, id: `local-${Date.now()}` }]);
        } else {
          setWorkflowList((prev) => prev.map((w) => w.id === wf.id ? wf : w));
        }
      }
    } else {
      if (isNew) {
        setWorkflowList((prev) => [...prev, { ...wf, id: `local-${Date.now()}` }]);
      } else {
        setWorkflowList((prev) => prev.map((w) => w.id === wf.id ? wf : w));
      }
    }
    setIsEditModalOpen(false);
    setEditingWorkflow(null);
  }, [isBackendLoaded]);

  // 按日期分组历史
  const groupedHistory = useMemo(() => {
    const groups: Record<string, HistoryItem[]> = {};
    workHistory.forEach((item) => {
      const dateKey = item.timestamp.slice(0, 10);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [workHistory]);

  const handleRunWorkflow = useCallback((workflow: Workflow) => {
    setActiveWorkflow(workflow);
    setRunningStepIndex(0);
    setCompletedSteps([]);
    setIsRunning(true);
    setCurrentDialog('');
    setExecutionLogs([]);
    const emptyMap = new Map<number, SkillResult>();
    setStepResults(emptyMap);
    stepResultsRef.current = emptyMap;
  }, []);

  // 执行步骤时调用事件处理器并更新对话
  useEffect(() => {
    if (!isRunning || !activeWorkflow || runningStepIndex < 0) return;

    if (runningStepIndex >= activeWorkflow.steps.length) {
      setIsRunning(false);
      setRunningStepIndex(-1);
      setCurrentDialog('');
      return;
    }

    const step = activeWorkflow.steps[runningStepIndex];
    const agent = getAgent(step.agentId);
    const skill = getAgentSkill(step.agentId, step.skillId);
    const dialogs = workingDialogs[step.agentId] ?? ['工作中...'];
    const startTime = Date.now();

    // 添加 running 状态的日志
    const runningLog: ExecutionLog = {
      stepIndex: runningStepIndex,
      agentId: step.agentId,
      agentName: agent?.name ?? step.agentId,
      skillId: step.skillId,
      skillName: skill?.name ?? step.skillId,
      skillIcon: skill?.icon ?? '⚙️',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
    setExecutionLogs((prev) => [...prev, runningLog]);

    // 显示第一句对话
    setCurrentDialog(dialogs[0]);

    // 调用 skill handler
    const handler = getSkillHandler(step.skillId);
    const executePromise = handler
      ? handler.execute({
          agentId: step.agentId,
          input: runningStepIndex > 0 ? stepResultsRef.current.get(runningStepIndex - 1)?.data : undefined,
          timestamp: new Date().toISOString(),
        })
      : Promise.resolve<SkillResult>({
          success: true,
          data: null,
          summary: skill?.mockResult ?? '执行完成',
          status: 'success',
        });

    // 中间切换对话
    const midTimer = setTimeout(() => {
      setCurrentDialog(dialogs[1] ?? dialogs[0]);
    }, STEP_DURATION * 0.4);

    // 完成
    timerRef.current = setTimeout(() => {
      executePromise.then((result) => {
        const duration = Date.now() - startTime;

        // 保存结果（同步 ref + state）
        setStepResults((prev) => {
          const next = new Map(prev);
          next.set(runningStepIndex, result);
          stepResultsRef.current = next;
          return next;
        });

        // 更新日志为完成状态
        setExecutionLogs((prev) =>
          prev.map((log) =>
            log.stepIndex === runningStepIndex && log.status === 'running'
              ? { ...log, status: result.status, summary: result.summary, duration }
              : log
          )
        );

        // 写入后端执行记录
        const runRecord = {
          workflowId: activeWorkflow?.id,
          workflowName: activeWorkflow?.name ?? '',
          agentId: step.agentId,
          skillId: step.skillId,
          stepIndex: runningStepIndex,
          summary: result.summary || '',
          result: typeof result.data === 'string' ? result.data : JSON.stringify(result.data ?? ''),
          status: result.status,
          duration,
        };
        createWorkflowRun(runRecord).then((saved) => {
          if (saved) {
            setWorkHistory((prev) => [{
              id: saved.id,
              agentId: saved.agentId,
              skillId: saved.skillId,
              timestamp: saved.executedAt,
              summary: saved.summary,
              result: saved.result,
              workflowName: saved.workflowName || undefined,
              status: saved.status as HistoryItem['status'],
            }, ...prev]);
          }
        }).catch(() => {});

        setCurrentDialog(result.summary || dialogs[2] || '完成!');
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, runningStepIndex]);
          setRunningStepIndex((prev) => prev + 1);
        }, 500);
      }).catch((err) => {
        const duration = Date.now() - startTime;
        setExecutionLogs((prev) =>
          prev.map((log) =>
            log.stepIndex === runningStepIndex && log.status === 'running'
              ? { ...log, status: 'error', summary: `执行出错: ${err.message}`, duration }
              : log
          )
        );

        // 写入失败记录到后端
        createWorkflowRun({
          workflowId: activeWorkflow?.id,
          workflowName: activeWorkflow?.name ?? '',
          agentId: step.agentId,
          skillId: step.skillId,
          stepIndex: runningStepIndex,
          summary: `执行出错: ${err.message}`,
          result: '',
          status: 'error',
          duration,
        }).catch(() => {});

        setCurrentDialog('出错了...');
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, runningStepIndex]);
          setRunningStepIndex((prev) => prev + 1);
        }, 500);
      });
    }, STEP_DURATION);

    return () => {
      clearTimeout(midTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, runningStepIndex, activeWorkflow]);

  const handleBack = () => {
    setActiveWorkflow(null);
    setRunningStepIndex(-1);
    setCompletedSteps([]);
    setIsRunning(false);
    setCurrentDialog('');
    setExecutionLogs([]);
    const emptyMap: Map<number, SkillResult> = new Map();
    setStepResults(emptyMap);
    stepResultsRef.current = emptyMap;
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsHistoryOpen(false);
    if (activeWorkflow && isRunning) {
      setIsRunning(false);
      setRunningStepIndex(-1);
    }
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
    if (!isHistoryOpen) setIsOpen(false);
  };

  const toggleWorkflow = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsHistoryOpen(false);
  };

  const allDone = activeWorkflow && !isRunning && completedSteps.length === activeWorkflow.steps.length;

  return (
    <>
      {/* FAB 按钮组 */}
      <div className="fab-group">
        {/* 模型选择器 */}
        {editorMode && <div className="model-selector-wrap">
          <button
            className={`workflow-fab model-fab ${isModelDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            title="AI 模型"
          >
            <span className="fab-label">{aiModels.find(m => m.id === selectedModel)?.name || selectedModel}</span>
          </button>
          {isModelDropdownOpen && (
            <div className="model-dropdown">
              {aiModels.map((m) => (
                <button
                  key={m.id}
                  className={`model-option ${m.id === selectedModel ? 'active' : ''} ${!m.available ? 'disabled' : ''}`}
                  onClick={() => m.available && handleModelChange(m.id)}
                  disabled={!m.available}
                >
                  <span className="model-name">{m.name}</span>
                  <span className="model-provider">{m.provider}</span>
                  {m.id === selectedModel && (
                    <span className="model-check">
                      <Icon name='check' size={14} color='var(--color-green-5)'/>
                    </span>
                  )}
                  {!m.available && <span className="model-unavailable">未配置</span>}
                </button>
              ))}
            </div>
          )}
        </div>}

        <button
          className={`workflow-fab ${isHistoryOpen ? 'active' : ''}`}
          onClick={toggleHistory}
          title="历史记录"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="fab-label">历史</span>
        </button>
        {editorMode && (
          <button
            className={`workflow-fab ${isOpen ? 'active' : ''}`}
            onClick={toggleWorkflow}
            title="协作工作流"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="18" r="3" />
              <path d="M9 6h6M6 9v6M18 9v6M9 18h6" />
            </svg>
            <span className="fab-label">协作</span>
          </button>
        )}
      </div>

      {/* 历史面板 */}
      <div className={`history-panel ${isHistoryOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h3 className="panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            历史事项
          </h3>
          <button className="stage-close" onClick={() => setIsHistoryOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="panel-body">
          {groupedHistory.map(([dateKey, items]) => (
            <div key={dateKey} className="history-day-group">
              <div className="history-day-label">{dateKey}</div>
              {items.map((item) => {
                const agent = getAgent(item.agentId);
                const skill = getAgentSkill(item.agentId, item.skillId);
                return (
                  <div key={item.id} className={`global-history-item status-${item.status}`}>
                    <div className="ghi-left">
                      <span className="ghi-status">{statusIcon(item.status)}</span>
                      <span className="ghi-time">{formatTime(item.timestamp).split(' ')[1]}</span>
                    </div>
                    <div className="ghi-body">
                      <div className="ghi-top">
                        <span className="ghi-agent" style={{ backgroundColor: (agent?.accent ?? '#999') + '25', color: agent?.accent }}>
                          {agent && <CatMiniAvatar colors={agent.catColors} size={14} />}
                          {agent?.name ?? item.agentId}
                        </span>
                        {skill && <span className="ghi-skill">{skill.icon} {skill.name}</span>}
                        {item.workflowName && <span className="ghi-wf">📋 {item.workflowName}</span>}
                      </div>
                      <div className="ghi-summary">{item.summary}</div>
                      <div className="ghi-result">{item.result}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 工作流列表面板 */}
      <div className={`workflow-panel ${isOpen && !activeWorkflow ? 'open' : ''}`}>
        <div className="panel-header">
          <h3 className="panel-title">协作工作流</h3>
          <div className="panel-header-actions">
            {editorMode && (
              <button className="add-workflow-btn" onClick={handleAddWorkflow} title="新增工作流">
                <Icon name='add' strokeWidth={4} size={18}/>
              </button>
            )}
            <button className="close-btn" onClick={handleClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="panel-body">
          <div className="workflow-list">
            <p className="panel-desc">每只小猫各司其职，组合协作完成复杂任务</p>
            {workflowList.map((wf) => (
              <div
                key={wf.id}
                className={`workflow-card ${wf.persistent ? 'persistent' : 'oneshot'}`}
                onClick={() => editorMode && handleRunWorkflow(wf)}
              >
                <div className="wf-card-header">
                  <span className="wf-icon">{wf.icon}</span>
                  <span className="wf-name">{wf.name}</span>
                  <div className="wf-tags">
                    {wf.persistent && <span className="wf-tag wf-tag-persistent">常驻</span>}
                    {wf.scheduled && <span className="wf-tag wf-tag-scheduled">定时</span>}
                    {!wf.persistent && !wf.scheduled && <span className="wf-tag wf-tag-oneshot">一次性</span>}
                  </div>
                  {editorMode && (
                    <div className="wf-card-actions">
                      <button className="wf-action-btn" onClick={(e) => handleEditWorkflow(wf, e)} title="编辑">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="wf-action-btn delete" onClick={(e) => handleDeleteWorkflow(wf, e)} title="删除">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <span className="wf-step-count">{wf.steps.length} 步</span>
                </div>
                <p className="wf-desc">{wf.description}</p>
                {/* 时间和定时信息 */}
                <div className="wf-meta">
                  {wf.startTime && (
                    <span className="wf-time">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {wf.startTime}{wf.endTime ? ` - ${wf.endTime}` : ''}
                    </span>
                  )}
                  {wf.cron && (
                    <span className="wf-cron">{wf.cron}</span>
                  )}
                  {wf.scheduled && editorMode && (
                    <button
                      className={`wf-schedule-toggle ${wf.scheduledEnabled ? 'on' : 'off'}`}
                      onClick={(e) => toggleScheduled(wf.id, e)}
                      title={wf.scheduledEnabled ? '关闭定时' : '开启定时'}
                    >
                      <span className="toggle-track">
                        <span className="toggle-thumb" />
                      </span>
                    </button>
                  )}
                </div>
                <div className="wf-agents">
                  {wf.steps.map((step, i) => {
                    const agent = getAgent(step.agentId);
                    const skill = getAgentSkill(step.agentId, step.skillId);
                    return (
                      <span
                        key={i}
                        className="wf-agent-tag"
                        style={{ backgroundColor: (agent?.accent ?? '#999') + '30', color: agent?.accent ?? '#999' }}
                      >
                        {agent && <CatMiniAvatar colors={agent.catColors} size={16} />}
                        {agent?.name ?? step.agentId}
                        <div className='w-px h-3 bg-black/5 mx-1'></div>
                        {skill?.icon ?? '⚙️'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ======== 全屏执行视图 (overlay) ======== */}
      {activeWorkflow && (
        <div className={`workflow-overlay ${activeWorkflow ? 'visible' : ''}`}>
          <div className="overlay-backdrop" onClick={handleClose} />
          <div className="execution-stage">
            {/* 顶部标题栏 */}
            <div className="stage-header">
              <div className="stage-title">
                {activeWorkflow.icon&&<span className="stage-icon">{activeWorkflow.icon}</span>}
                <span className="stage-name">{activeWorkflow.name}</span>
                <span className="stage-model-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="18" r="4" />
                    <path d="M12 14v-2" />
                    <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
                    <path d="M12 2a4 4 0 0 0-4 4c0 1.95 1.4 3.58 3.25 3.93" />
                  </svg>
                  {aiModels.find(m => m.id === selectedModel)?.name || selectedModel}
                </span>
              </div>
              <button className="stage-close" onClick={handleBack}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 舞台 - 猫猫们排列 + 流水线 */}
            <div className="stage-body">
              {/* 流水线连线 */}
              <div className="pipeline">
                {activeWorkflow.steps.map((step, i) => {
                  const agent = getAgent(step.agentId);
                  const skill = getAgentSkill(step.agentId, step.skillId);
                  const isCompleted = completedSteps.includes(i);
                  const isCurrent = runningStepIndex === i;
                  const isPending = !isCompleted && !isCurrent;
                  const statusClass = isCompleted ? 'done' : isCurrent ? 'active' : 'waiting';

                  const result = stepResults.get(i);
                  const resultStatus = result?.status ?? 'success';

                  return (
                    <React.Fragment key={i}>
                      {/* 单个节点 */}
                      <div className={`pipeline-node ${statusClass}`}>
                        {/* 对话气泡 - 仅在执行中时显示 */}
                        {isCurrent && (
                          <div className="cat-bubble show">
                            <span className="bubble-text">{currentDialog}</span>
                          </div>
                        )}

                        {/* 猫猫 */}
                        <div className={`cat-avatar ${isCurrent ? 'working' : ''}`}>
                          {agent && (
                            <CatSVG colors={agent.catColors} className="pipeline-cat" />
                          )}
                        </div>

                        {/* 名字 + skill */}
                        <div className="node-info">
                          <span className="node-name" style={{ color: agent?.accent }}>
                            {agent?.name ?? step.agentId}
                          </span>
                          {skill && (
                            <span className="node-skill">
                              {skill.icon} {skill.name}
                            </span>
                          )}
                        </div>

                        {/* 进度条 */}
                        {isCurrent && (
                          <div className="node-progress">
                            <div className="node-progress-bar" style={{ animationDuration: `${STEP_DURATION}ms` }} />
                          </div>
                        )}

                        {/* 真实执行结果 - 完成后展示在猫猫下方 */}
                        {isCompleted && result && (
                          <div className={`node-result status-${resultStatus}`}>
                            <div className="node-result-header">
                              {resultStatus === 'success' && <Icon name='check-fill' color='var(--color-green-5)' size={13}/>}
                              {resultStatus === 'warning' && <Icon name='attention-fill' color='var(--color-orange-5)' size={13}/>}
                              {resultStatus === 'error' && <Icon name='error-fill' color='var(--color-red-5)' size={13}/>}
                              <span className="node-result-status">
                                {resultStatus === 'success' ? '完成' : resultStatus === 'warning' ? '警告' : '失败'}
                              </span>
                            </div>
                            {result.summary && (
                              <div className="node-result-summary markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {result.summary}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                        )}

                        {/* IO 信息 - 未执行时展示 */}
                        {!isCompleted && skill && (
                          <div className="node-io">
                            <span className="io-tag io-in">{skill.input}</span>
                            <span className="io-arrow">→</span>
                            <span className="io-tag io-out">{skill.output}</span>
                          </div>
                        )}

                        {/* provider */}
                        {!isCompleted && skill?.provider && (
                          <span className="node-provider">via {skill.provider}</span>
                        )}

                        {/* pending遮罩 */}
                        {isPending && <div className="node-dim" />}
                      </div>

                      {/* 箭头连线 */}
                      {i < activeWorkflow.steps.length - 1 && (
                        <div className={`pipeline-arrow ${isCompleted ? 'done' : ''}`}>
                          <div className="arrow-line" />
                          <div className="arrow-head">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          {/* 数据传递标签 */}
                          {isCompleted && (
                            <div className="arrow-data-tag">
                              <span className="data-type">
                                {getAgentSkill(step.agentId, step.skillId)?.output ?? ''}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* 底部状态栏 */}
            <div className="stage-footer">
              {!isRunning && completedSteps.length === 0 && editorMode && (
                <button className="exec-btn" onClick={() => handleRunWorkflow(activeWorkflow)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#5D4037">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  开始执行
                </button>
              )}
              {!isRunning && completedSteps.length === 0 && !editorMode && (
                <div className="exec-status">
                  <span className="exec-label" style={{ opacity: 0.6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    访问 /assistant-editor 解锁执行
                  </span>
                </div>
              )}
              {isRunning && (
                <div className="exec-status">
                  <div className="exec-dots">
                    <span /><span /><span />
                  </div>
                  <span className="exec-label">
                    步骤 {Math.min(runningStepIndex + 1, activeWorkflow.steps.length)} / {activeWorkflow.steps.length} 执行中...
                  </span>
                </div>
              )}
              {allDone && (
                <div className="exec-done">
                  <span className="done-icon">🎉</span>
                  <span className="done-text">
                    {activeWorkflow.persistent
                      ? '全部完成！常驻任务已保留～'
                      : '全部完成！任务已归档～'}
                  </span>
                  {editorMode && activeWorkflow.persistent && (
                    <button className="replay-btn" onClick={() => handleRunWorkflow(activeWorkflow)}>
                      再来一次
                    </button>
                  )}
                  {editorMode && !activeWorkflow.persistent && (
                    <button className="replay-btn" onClick={() => {
                      removeWorkflow(activeWorkflow.id);
                      handleBack();
                    }}>
                      确认归档
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======== 编辑/新增工作流弹窗 ======== */}
      {isEditModalOpen && editingWorkflow && (
        <WorkflowEditModal
          workflow={editingWorkflow}
          onSave={handleSaveWorkflow}
          onClose={() => { setIsEditModalOpen(false); setEditingWorkflow(null); }}
        />
      )}
    </>
  );
};

/** 工作流编辑弹窗 */

interface EditModalProps {
  workflow: Workflow;
  onSave: (wf: Workflow) => void;
  onClose: () => void;
}

const WorkflowEditModal: React.FC<EditModalProps> = ({ workflow, onSave, onClose }) => {
  const [form, setForm] = useState<Workflow>({ ...workflow });

  const isNew = !workflow.id;

  const updateField = <K extends keyof Workflow>(key: K, value: Workflow[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { agentId: '', skillId: '', action: '' }],
    }));
  };

  const updateStep = (index: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => i === index ? { ...s, [field]: value } : s),
    }));
  };

  const removeStep = (index: number) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="wf-edit-overlay">
      <div className="wf-edit-backdrop" onClick={onClose} />
      <div className="wf-edit-modal">
        <div className="wf-edit-header">
          <h3>{isNew ? '新增工作流' : '编辑工作流'}</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="wf-edit-body">
          {/* 基本信息 */}

          <div className="wf-edit-row">
            <label>名称</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="工作流名称"
            />
          </div>

          <div className="wf-edit-row">
            <label>描述</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="简要描述工作流程"
              rows={2}
            />
          </div>

          {/* 时间和定时 */}
          <div className="wf-edit-row-group">
            <div className="wf-edit-row half">
              <label>开始时间</label>
              <input type="text" value={form.startTime || ''} onChange={(e) => updateField('startTime', e.target.value)} placeholder="如 09:00" />
            </div>
            <div className="wf-edit-row half">
              <label>结束时间</label>
              <input type="text" value={form.endTime || ''} onChange={(e) => updateField('endTime', e.target.value)} placeholder="如 09:15" />
            </div>
          </div>

          <div className="wf-edit-row-group">
            <div className="wf-edit-row half">
              <label className="checkbox-label">
                <input type="checkbox" checked={!!form.scheduled} onChange={(e) => updateField('scheduled', e.target.checked)} />
                定时任务
              </label>
            </div>
            <div className="wf-edit-row half">
              <label className="checkbox-label">
                <input type="checkbox" checked={!!form.persistent} onChange={(e) => updateField('persistent', e.target.checked)} />
                常驻任务
              </label>
            </div>
          </div>

          {form.scheduled && (
            <div className="wf-edit-row">
              <label>定时表达式</label>
              <input type="text" value={form.cron || ''} onChange={(e) => updateField('cron', e.target.value)} placeholder="如: 每天 09:00" />
            </div>
          )}

          {/* 步骤 */}
          <div className="wf-edit-steps">
            <div className="wf-edit-steps-header">
              <label>步骤 ({form.steps.length})</label>
              <button className="add-step-btn" onClick={addStep}>+ 添加步骤</button>
            </div>
            {form.steps.map((step, i) => (
              <div key={i} className="wf-step-edit">
                <div className="step-number">{i + 1}</div>
                <div className="step-fields">
                  <select value={step.agentId} onChange={(e) => updateStep(i, 'agentId', e.target.value)}>
                    <option value="">选择猫猫</option>
                    {assistants.map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                    ))}
                  </select>
                  <select value={step.skillId} onChange={(e) => updateStep(i, 'skillId', e.target.value)}>
                    <option value="">选择技能</option>
                    {step.agentId && assistants.find((a) => a.id === step.agentId)?.skills.map((s) => (
                      <option key={s.id} value={s.id}>{(s as Skill).icon} {s.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={step.action}
                    onChange={(e) => updateStep(i, 'action', e.target.value)}
                    placeholder="步骤描述"
                  />
                </div>
                <button className="remove-step-btn" onClick={() => removeStep(i)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="wf-edit-footer">
          <button className="wf-cancel-btn" onClick={onClose}>取消</button>
          <button
            className="wf-save-btn"
            onClick={() => onSave(form)}
            disabled={!form.name.trim()}
          >
            {isNew ? '创建' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPanel;
