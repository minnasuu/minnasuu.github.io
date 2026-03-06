import React, { useState, useCallback, useMemo } from 'react';
import CatSVG from '../components/CatSVG';
import CatMiniAvatar from '../components/CatMiniAvatar';
import WorkflowPanel from '../components/WorkflowPanel';
import '../styles/AssistantPage.scss';
import { assistants, type HistoryItem, type Skill } from '../data';
import { Icon } from '@suminhan/land-design';

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${h}:${m}`;
};

const statusIcon = (s: string) => s === 'success' ? <Icon name='check-fill' color='var(--color-green-5)'/> : s === 'warning' ? <Icon name='info-fill' color='var(--color-orange-5)'/> : <Icon name='close-fill' color='var(--color-red-5)'/>;

interface AssistantPageProps {
  editorMode?: boolean;
}

const AssistantPage: React.FC<AssistantPageProps> = ({ editorMode = false }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverMessage, setHoverMessage] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedAssistant = useMemo(
    () => assistants.find((a) => a.id === selectedId) ?? null,
    [selectedId]
  );

  // 历史日志（未来接入后端 API，目前为空）
  const [historyItems] = useState<HistoryItem[]>([]);

  const selectedHistory = useMemo(
    () => selectedId ? historyItems.filter((h) => h.agentId === selectedId) : [],
    [selectedId, historyItems]
  );

  const handleMouseEnter = useCallback((id: string) => {
    const assistant = assistants.find((a) => a.id === id);
    if (!assistant) return;
    const randomMsg = assistant.messages[Math.floor(Math.random() * assistant.messages.length)];
    setHoverMessage((prev) => ({ ...prev, [id]: randomMsg }));
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handleAssistantClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <div className="assistant-page">
      <div className="office-grid">
        {assistants.map((assistant) => {
          const isHovered = hoveredId === assistant.id;
          const currentMessage = hoverMessage[assistant.id] ?? assistant.messages[0];

          return (
            <div
              key={assistant.id}
              className="desk-workspace"
              onClick={() => handleAssistantClick(assistant.id)}
              onMouseEnter={() => handleMouseEnter(assistant.id)}
              onMouseLeave={handleMouseLeave}
              style={{ '--accent': assistant.accent } as React.CSSProperties}
            >
              <div className={`speech-bubble ${isHovered ? 'visible' : ''}`}>
                <span className="speech-text">{currentMessage}</span>
              </div>
              <div className="cat-worker">
                <CatSVG colors={assistant.catColors} className="cat-svg" />
              </div>
              <div className="name-plate">
                <span className="name-text">{assistant.name}</span>
              </div>
              {assistant.skills && (
                <div className='flex flex-col items-center'>
                    <div className="skill-tags">
                  {(assistant.skills as Skill[]).slice(0,4).map((skill,index) => (
                    <span key={skill.id} className="skill-tag" style={{ color: assistant.accent, borderColor: assistant.accent + '60' }}>
                      {index >0 && <span className='text-base'>·</span>}
                      <span className="skill-name">{skill.name}</span>
                    </span>
                  ))}
                </div>
                <div className="skill-tags">
                  {(assistant.skills as Skill[]).slice(4).map((skill,index) => (
                    <span key={skill.id} className="skill-tag" style={{ color: assistant.accent, borderColor: assistant.accent + '60' }}>
                      {index >0 && <span className='text-base'>·</span>}
                      <span className="skill-name">{skill.name}</span>
                    </span>
                  ))}
                </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 猫猫详情 Overlay - 三栏布局 */}
      {selectedAssistant && (
        <div className="cat-detail-overlay" onClick={handleCloseDetail}>
          <div className="cat-detail-card three-col" onClick={(e) => e.stopPropagation()} style={{ '--cat-accent': selectedAssistant.catColors.deskDark } as React.CSSProperties}>
            {/* 关闭按钮 */}
            <button className="detail-close" onClick={handleCloseDetail}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* 第1栏：头像 + 名字 + 个性签名 */}
            <div className="col col-profile">
              <div className="profile-avatar">
                <CatSVG colors={selectedAssistant.catColors} className="detail-cat-svg" />
              </div>
              <h2 className="profile-name">{selectedAssistant.name}</h2>
              <span className="profile-role" style={{ color: selectedAssistant.catColors.deskDark }}>{selectedAssistant.role}</span>
              <p className="profile-desc">{selectedAssistant.description}</p>
              <div className="profile-signature">
                <span className="signature-quote">"</span>
                <span className="signature-text">{selectedAssistant.messages[0]}</span>
                <span className="signature-quote">"</span>
              </div>
            </div>

            {/* 第2栏：Skills */}
            <div className="col col-skills">
              <h3 className="col-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={selectedAssistant.catColors.deskDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                技能工具
                <span className="col-count">{(selectedAssistant.skills as Skill[]).length}</span>
              </h3>
              <div className="col-scroll">
                <div className="skill-detail-list">
                  {(selectedAssistant.skills as Skill[]).map((skill) => (
                    <div key={skill.id} className="skill-detail-item" style={{ borderLeftColor: selectedAssistant.catColors.deskDark }}>
                      <div className="skill-detail-head">
                        <span className="sd-icon">{skill.icon}</span>
                        <span className="sd-name">{skill.name}</span>
                        <div className="sd-io">
                          <span className="sd-io-tag sd-in">{skill.input}</span>
                          <span className="sd-arrow">→</span>
                          <span className="sd-io-tag sd-out">{skill.output}</span>
                        </div>
                      </div>
                      <p className="sd-desc">{skill.description}</p>
                      <div className="sd-meta">
                        {skill.provider && <span className="sd-provider">via {skill.provider}</span>}
                        {skill.mockResult && <span className="sd-mock">{skill.mockResult}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 第3栏：历史事件 */}
            <div className="col col-history">
              <h3 className="col-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={selectedAssistant.catColors.deskDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                历史事件
                <span className="col-count">{selectedHistory.length}</span>
              </h3>
              <div className="col-scroll">
                <div className="history-list">
                  {selectedHistory.length === 0 ? (
                    <div className="history-empty-state">
                      <div className="empty-cat">
                        <CatMiniAvatar colors={selectedAssistant.catColors} size={48} />
                      </div>
                      <p className="empty-title">还没有工作记录</p>
                      <p className="empty-desc">
                        {selectedAssistant.name}还在等待第一个任务<br/>
                        运行工作流后记录会出现在这里
                      </p>
                    </div>
                  ) : (
                    selectedHistory.map((item) => {
                      const skill = (selectedAssistant.skills as Skill[]).find((s) => s.id === item.skillId);
                      return (
                        <div key={item.id} className={`history-item status-${item.status}`}>
                          <div className="hi-top">
                            <span className="hi-status">{statusIcon(item.status)}</span>
                            <span className="hi-summary">{item.summary}</span>
                            <span className="hi-time">{formatTime(item.timestamp)}</span>
                          </div>
                          <div className="hi-bottom">
                            {skill && <span className="hi-skill">{skill.icon} {skill.name}</span>}
                            {item.workflowName && <span className="hi-wf">📋 {item.workflowName}</span>}
                          </div>
                          <div className="hi-result">{item.result}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <WorkflowPanel editorMode={editorMode} />
    </div>
  );
};

export default AssistantPage;
