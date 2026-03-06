import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { workflows as initialWorkflows, assistants, workHistory, type Workflow, type Skill } from '../data';
import { getSkillHandler } from '../skills';
import type { SkillResult } from '../skills/types';
import CatSVG from './CatSVG';
import CatMiniAvatar from './CatMiniAvatar';
import '../styles/WorkflowPanel.scss';
import { Icon } from '@suminhan/land-design';

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
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [stepResults, setStepResults] = useState<Map<number, SkillResult>>(new Map());
  const [workflowList, setWorkflowList] = useState<Workflow[]>(() => [...initialWorkflows]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const toggleScheduled = useCallback((wfId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkflowList((prev) =>
      prev.map((wf) => wf.id === wfId ? { ...wf, scheduledEnabled: !wf.scheduledEnabled } : wf)
    );
  }, []);

  const removeWorkflow = useCallback((wfId: string) => {
    setWorkflowList((prev) => prev.filter((wf) => wf.id !== wfId));
  }, []);

  // 按日期分组历史
  const groupedHistory = useMemo(() => {
    const groups: Record<string, typeof workHistory> = {};
    workHistory.forEach((item) => {
      const dateKey = item.timestamp.slice(0, 10);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, []);

  const handleRunWorkflow = useCallback((workflow: Workflow) => {
    setActiveWorkflow(workflow);
    setRunningStepIndex(0);
    setCompletedSteps([]);
    setIsRunning(true);
    setCurrentDialog('');
    setExecutionLogs([]);
    setStepResults(new Map());
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
          input: runningStepIndex > 0 ? stepResults.get(runningStepIndex - 1)?.data : undefined,
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

        // 保存结果
        setStepResults((prev) => {
          const next = new Map(prev);
          next.set(runningStepIndex, result);
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
    setStepResults(new Map());
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
          <button className="close-btn" onClick={() => setIsHistoryOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <button className="close-btn" onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="panel-body">
          <div className="workflow-list">
            <p className="panel-desc">每只小猫各司其职，组合协作完成复杂任务</p>
            {workflowList.map((wf) => (
              <div
                key={wf.id}
                className={`workflow-card ${wf.persistent ? 'persistent' : 'oneshot'}`}
                style={{ '--wf-color': wf.color } as React.CSSProperties}
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
              <button className="stage-back" onClick={handleBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                返回
              </button>
              <div className="stage-title">
                <span className="stage-icon">{activeWorkflow.icon}</span>
                <span className="stage-name">{activeWorkflow.name}</span>
              </div>
              <button className="stage-close" onClick={handleClose}>
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

                  return (
                    <React.Fragment key={i}>
                      {/* 单个节点 */}
                      <div className={`pipeline-node ${statusClass}`}>
                        {/* 对话气泡 */}
                        <div className={`cat-bubble ${isCurrent ? 'show' : isCompleted ? 'show-done' : ''}`}>
                          {isCurrent && <span className="bubble-text">{currentDialog}</span>}
                          {isCompleted && skill?.mockResult && (
                            <span className="bubble-text result">{skill.mockResult}</span>
                          )}
                        </div>

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

                        {/* IO 信息 */}
                        {skill && (
                          <div className="node-io">
                            <span className="io-tag io-in">{skill.input}</span>
                            <span className="io-arrow">→</span>
                            <span className="io-tag io-out">{skill.output}</span>
                          </div>
                        )}

                        {/* provider */}
                        {skill?.provider && (
                          <span className="node-provider">via {skill.provider}</span>
                        )}

                        {/* 进度条 */}
                        {isCurrent && (
                          <div className="node-progress">
                            <div className="node-progress-bar" style={{ animationDuration: `${STEP_DURATION}ms` }} />
                          </div>
                        )}

                        {/* 完成勾 */}
                        {isCompleted && (
                          <div className="node-check">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
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
                <button className="exec-btn" onClick={() => handleRunWorkflow(activeWorkflow)} style={{ borderColor: activeWorkflow.color }}>
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
    </>
  );
};

export default WorkflowPanel;
