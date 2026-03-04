import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import BackButton from '../../../shared/components/BackButton';
import { LandButton } from '@suminhan/land-design';
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
      <div className="ai-log-container">
        
        <header className="ai-log-header">
          <div className="header-title-row">
            <div>
              <h1 className="ai-log-title">{t.title}</h1>
              <p className="ai-log-subtitle">{t.subtitle}</p>
            </div>
            <LandButton
              text={t.createGoal}
              variant="background"
              onClick={() => setShowGoalCreator(true)}
            />
          </div>
        </header>

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
              <div className="goals-list">
                {goals.map(goal => (
                  <div 
                    key={goal.id} 
                    className="goal-card" 
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div className="goal-card-header">
                      <h3 className="goal-card-title">{goal.title}</h3>
                      <span className={`goal-status status-${goal.status}`}>
                        {getStatusInfo(goal.status)}
                      </span>
                    </div>
                    
                    {goal.description && (
                      <p className="goal-card-description">{goal.description}</p>
                    )}
                    
                    <div className="goal-card-meta">
                      <span className="meta-item">
                        📅 {formatDate(goal.createdAt)}
                      </span>
                      {goal.progress !== undefined && (
                        <span className="meta-item">
                          📊 {t.progress}: {goal.progress}%
                        </span>
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
                ))}
              </div>
              
              {page < totalPages && (
                <div className="load-more">
                  <LandButton
                    text={t.loadMore}
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={isLoading}
                  />
                </div>
              )}
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
      </div>
    </div>
  );
};

export default AILogPage;