import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import BackButton from '../../../shared/components/BackButton';
import { LandButton, LandProgress } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';
import type { DifyGenerationResult } from '../../../shared/services/difyService';
import { goalService } from '../../../shared/services/goalService';
import {
  GoalCreator,
  GoalDetailView
} from '../components';
import '../styles/AILogPage.scss';
import '../styles/NewSections.scss';

const AILogPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentTheme } = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 加载所有目标
  const loadGoals = async () => {
    try {
      setIsLoading(true);
      // 获取所有状态的目标,按更新时间倒序（包含 planning 状态）
      const response = await goalService.getGoals('planning,pending,active,paused,completed,cancelled', page, 10);
      
      if (page === 1) {
        setGoals(response.goals);
      } else {
        setGoals(prev => [...prev, ...response.goals]);
      }
      
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // 创建新目标
  const handleCreateGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, difyData?: DifyGenerationResult) => {
    try {
      await goalService.createGoal(goalData, difyData);
      
      setShowGoalCreator(false);
      
      // 重置到第一页并重新加载
      if (page !== 1) {
        setPage(1); // 这会触发 useEffect 重新加载
      } else {
        await loadGoals(); // 如果已经在第一页，直接重新加载
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
      
      let errorMessage = '创建目标失败';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage += '：无法连接到后端服务，请确保后端服务正在运行（http://localhost:8001）';
        } else if (error.message.includes('500')) {
          errorMessage += '：服务器内部错误，请检查后端日志和数据库连接';
        } else if (error.message.includes('400')) {
          errorMessage += '：请求数据格式错误，请检查输入信息';
        } else {
          errorMessage += `：${error.message}`;
        }
      }
      
      alert(errorMessage);
    }
  };

  // 保存编辑后的目标
  const handleSaveEditedGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, difyData?: DifyGenerationResult) => {
    if (!editingGoal) return;

    try {
      await goalService.updateGoal(editingGoal.id, goalData, difyData);
      
      setShowGoalCreator(false);
      setEditingGoal(null);
      
      // 重新加载目标列表
      if (page !== 1) {
        setPage(1); // 这会触发 useEffect 重新加载
      } else {
        await loadGoals(); // 如果已经在第一页，直接重新加载
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
      alert('更新目标失败，请重试');
    }
  };

  // 删除目标
  const handleDeleteGoal = async (goalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm(language === 'zh' ? '确定要删除这个目标吗？' : 'Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalService.deleteGoal(goalId);
      setGoals(goals.filter(g => g.id !== goalId));
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert(language === 'zh' ? '删除失败，请重试' : 'Failed to delete, please retry');
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 获取状态文本和样式
  const getStatusInfo = (status: string) => {
    const statusMap = {
      zh: {
        planning: '规划中',
        pending: '准备中',
        active: '进行中',
        paused: '已暂停',
        completed: '已完成',
        cancelled: '已取消'
      },
      en: {
        planning: 'Planning',
        pending: 'Pending',
        active: 'Active',
        paused: 'Paused',
        completed: 'Completed',
        cancelled: 'Cancelled'
      }
    };
    return statusMap[language][status as keyof typeof statusMap.zh] || status;
  };

  const texts = {
    zh: {
      title: '目标日志',
      subtitle: '设定目标，追踪成长，记录学习轨迹',
      loading: '加载中...',
      noGoals: '还没有任何目标',
      createGoal: '创建新目标',
      goalDescription: '设定一个明确的学习或成长目标，系统将帮助你追踪进度并记录学习过程。',
      view: '查看',
      edit: '编辑',
      delete: '删除',
      progress: '进度',
      loadMore: '加载更多'
    },
    en: {
      title: 'Goal Log',
      subtitle: 'Set Goals, Track Growth, Record Learning Journey',
      loading: 'Loading...',
      noGoals: 'No Goals Yet',
      createGoal: 'Create New Goal',
      goalDescription: 'Set a clear learning or growth goal, and the system will help you track progress and record your learning journey.',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      progress: 'Progress',
      loadMore: 'Load More'
    }
  };

  const t = texts[language];

  // 横向滚动引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 按更新时间排序（最近的在左边）
  const sortedGoals = [...goals].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // 鼠标拖拽滚动
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) container.style.cursor = 'grab';
  }, []);

  // 滚轮横向滚动
  const handleWheel = useCallback((e: WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel, goals]);

  // 格式化简短月份
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // 本地样式调试：用 mock 数据填充
  const isDev = import.meta.env.DEV;
  const loadMockData = () => {
    const mockGoals: Goal[] = [
      {
        id: 'mock-1',
        title: '掌握 React 高级特性',
        description: '深入学习 React 的 Suspense、Concurrent Mode 等高级特性，并完成实战项目。',
        category: 'technical',
        priority: 'high',
        duration: 30,
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        status: 'active',
        progress: 45,
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-03-04T00:00:00Z',
        targetSkills: ['React', 'TypeScript'],
        milestones: [],
        successCriteria: ['能独立开发复杂 React 应用', '掌握性能优化技巧'],
      },
      {
        id: 'mock-2',
        title: '完成个人作品集网站',
        description: '设计并开发一个展示个人项目的作品集网站。',
        category: 'project',
        priority: 'medium',
        duration: 14,
        startDate: '2026-02-20',
        endDate: '2026-03-06',
        status: 'completed',
        progress: 100,
        createdAt: '2026-02-20T00:00:00Z',
        updatedAt: '2026-03-06T00:00:00Z',
        targetSkills: ['Design', 'CSS'],
        milestones: [],
        successCriteria: ['网站上线并通过 Lighthouse 评分 90+'],
      },
      {
        id: 'mock-3',
        title: '学习 Rust 基础',
        description: '通过 Rustlings 和官方教程学习 Rust 基础语法和所有权机制。',
        category: 'technical',
        priority: 'low',
        duration: 60,
        startDate: '2026-03-10',
        endDate: '2026-05-09',
        status: 'planning',
        progress: 0,
        createdAt: '2026-03-04T00:00:00Z',
        updatedAt: '2026-03-04T00:00:00Z',
        targetSkills: ['Rust'],
        milestones: [],
        successCriteria: ['完成 Rustlings 全部练习', '用 Rust 写一个 CLI 工具'],
      },
      {
        id: 'mock-4',
        title: '阅读《系统设计面试》',
        description: '系统学习分布式系统设计知识，每周阅读两章并做笔记。',
        category: 'career',
        priority: 'medium',
        duration: 28,
        startDate: '2026-02-15',
        endDate: '2026-03-15',
        status: 'paused',
        progress: 30,
        createdAt: '2026-02-15T00:00:00Z',
        updatedAt: '2026-03-02T00:00:00Z',
        targetSkills: ['System Design'],
        milestones: [],
        successCriteria: ['完成全书阅读', '整理至少 5 篇学习笔记'],
      },
    ];
    setGoals(mockGoals);
    setIsLoading(false);
    setTotalPages(1);
  };

  if (isLoading && page === 1) {
    return (
      <div className={`ai-log-page ${currentTheme}`}>
        <div className="ai-log-container">
          <BackButton />
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-log-page ${currentTheme}`}>
      <header className="articles-header">
        <div className="header-content">
          <BackButton to="/" />
        </div>
      </header>
      <div className="ai-log-container" style={{justifyContent: goals.length > 0 ? 'flex-start' : 'center'}}>
        
        {goals.length > 0 &&<header className="ai-log-header">
          <LandButton
              text={t.createGoal}
              variant="background"
              onClick={() => setShowGoalCreator(true)}
            />
        </header>}

        <div className="ai-log-content">
          {goals.length === 0 ? (
            <div className="no-goal-state">
              <div className="no-goal-content">
                <h3>{t.noGoals}</h3>
                <p>{t.goalDescription}</p>
                <LandButton
                  text={t.createGoal}
                  variant="background"
                  onClick={() => setShowGoalCreator(true)}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="timeline-wrapper">
                {/* 时间轴 */}
                <div 
                  className="timeline-scroll-container"
                  ref={scrollContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className="timeline-track">
                    {/* 时间轴线 */}
                    <div className="timeline-line" />
                    
                    {/* 时间轴节点 + 卡片 */}
                    <div className="timeline-items">
                      {sortedGoals.map((goal, index) => (
                        <div key={goal.id} className="timeline-item" style={{ animationDelay: `${index * 0.08}s` }}>
                          {/* 时间轴节点 */}
                          <div className="timeline-node-area">
                            <span className="timeline-date">{formatShortDate(goal.updatedAt)}</span>
                            <div className={`timeline-dot status-${goal.status}`}>
                              <div className="dot-inner" />
                            </div>
                          </div>

                          {/* 卡片 */}
                          <div 
                            className={`goal-card status-border-${goal.status}`}
                            onClick={() => setSelectedGoal(goal)}
                          >
                            <div className="goal-card-header">
                              <span className={`goal-status status-${goal.status}`}>
                                {getStatusInfo(goal.status)}
                              </span>
                            </div>

                            <h3 className="goal-card-title">{goal.title}</h3>
                            
                            {goal.description && (
                              <p className="goal-card-description">{goal.description}</p>
                            )}

                            {/* 进度条 */}
                            {goal.progress !== undefined && goal.progress > 0 && (
                              <div className="goal-card-progress">
                                <LandProgress value={goal.progress/100} hideLabel className='mt-6'/>
                                <span className="progress-text">{goal.progress}%</span>
                              </div>
                            )}

                            <div className="goal-card-meta">
                              <span className="meta-item">
                                {formatDate(goal.startDate)} — {formatDate(goal.endDate)}
                              </span>
                              {goal.targetSkills && goal.targetSkills.length > 0 && (
                                <div className="meta-skills">
                                  {goal.targetSkills.slice(0, 3).map(skill => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="goal-card-actions">
                              <LandButton
                                text={t.view}
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGoal(goal);
                                }}
                              />
                              {goal.status !== 'completed' && goal.status !== 'cancelled' && (
                                <LandButton
                                  text={t.edit}
                                  variant="text"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingGoal(goal);
                                    setShowGoalCreator(true);
                                  }}
                                />
                              )}
                              <LandButton
                                text={t.delete}
                                variant="text"
                                onClick={(e) => handleDeleteGoal(goal.id, e)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 加载更多节点 */}
                      {page < totalPages && (
                        <div className="timeline-item timeline-load-more">
                          <div className="timeline-node-area">
                            <div className="timeline-dot load-more-dot">
                              <div className="dot-inner" />
                            </div>
                          </div>
                          <div className="load-more-card">
                            <LandButton
                              text={t.loadMore}
                              variant="outline"
                              onClick={() => setPage(p => p + 1)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 目标创建/编辑对话框 */}
        <GoalCreator
          isOpen={showGoalCreator}
          onClose={() => {
            setShowGoalCreator(false);
            setEditingGoal(null);
          }}
          onSave={editingGoal ? handleSaveEditedGoal : handleCreateGoal}
          editingGoal={editingGoal}
        />

        {/* 目标详情视图 - 包含编辑功能 */}
        <GoalDetailView
          isOpen={!!selectedGoal}
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onUpdate={async () => {
            // 更新当前选中的目标数据
            if (selectedGoal) {
              try {
                const updatedGoal = await goalService.getGoal(selectedGoal.id);
                setSelectedGoal(updatedGoal);
              } catch (error) {
                console.error('Failed to refresh selected goal:', error);
              }
            }
            
            // 重新加载目标列表
            if (page !== 1) {
              setPage(1);
            } else {
              await loadGoals();
            }
          }}
        />

        {isDev && (
          <button
            onClick={loadMockData}
            style={{
              position: 'fixed',
              left: 12,
              bottom: 12,
              zIndex: 9999,
              padding: '4px 10px',
              fontSize: 12,
              borderRadius: 4,
              border: '1px solid #ccc',
              background: '#f5f5f5',
              color: '#666',
              cursor: 'pointer',
              opacity: 0.6,
            }}
          >
            Mock
          </button>
        )}
      </div>
    </div>
  );
};

export default AILogPage;