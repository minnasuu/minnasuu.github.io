import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { LandButton } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';
import { goalService } from '../../../shared/services/goalService';
import '../styles/HistoryList.scss';

interface HistoryListProps {
  onViewGoal: (goal: Goal) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onViewGoal }) => {
  const { language } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const texts = {
    zh: {
      loading: '加载中...',
      noHistory: '暂无历史记录',
      completed: '已完成',
      cancelled: '已取消',
      view: '查看',
      delete: '删除',
      confirmDelete: '确定要删除这条记录吗？',
      loadMore: '加载更多',
      duration: '持续时间'
    },
    en: {
      loading: 'Loading...',
      noHistory: 'No History',
      completed: 'Completed',
      cancelled: 'Cancelled',
      view: 'View',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this record?',
      loadMore: 'Load More',
      duration: 'Duration'
    }
  };

  const t = texts[language];

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      // 只获取已完成和已取消的目标
      const response = await goalService.getGoals('completed,cancelled', page, 10);
      
      if (page === 1) {
        setGoals(response.goals);
      } else {
        setGoals(prev => [...prev, ...response.goals]);
      }
      
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (goalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm(t.confirmDelete)) {
      return;
    }

    try {
      await goalService.deleteGoal(goalId);
      // 重新加载当前页
      setGoals(goals.filter(g => g.id !== goalId));
    } catch (error) {
      console.error('Failed to delete goal:', error);
      alert('删除失败，请重试');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (goal: Goal) => {
    if (!goal.actualStartDate) return '-';
    
    const start = new Date(goal.actualStartDate);
    const end = goal.updatedAt ? new Date(goal.updatedAt) : new Date();
    const durationMs = end.getTime() - start.getTime();
    
    // 减去暂停时间
    const actualDurationMs = durationMs - (Number(goal.totalPausedDuration) || 0);
    
    const days = Math.floor(actualDurationMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((actualDurationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return language === 'zh' ? `${days}天${hours}小时` : `${days}d ${hours}h`;
    }
    return language === 'zh' ? `${hours}小时` : `${hours}h`;
  };

  if (isLoading && page === 1) {
    return (
      <div className="history-list">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="history-list">
        <div className="empty-state">
          <p>{t.noHistory}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-list">
      <div className="history-items">
        {goals.map(goal => (
          <div key={goal.id} className="history-item" onClick={() => onViewGoal(goal)}>
            <div className="item-header">
              <h3 className="item-title">{goal.title}</h3>
              <span className={`item-status status-${goal.status}`}>
                {goal.status === 'completed' ? t.completed : t.cancelled}
              </span>
            </div>
            
            {goal.description && (
              <p className="item-description">{goal.description}</p>
            )}
            
            <div className="item-meta">
              <span className="meta-item">
                📅 {formatDate(goal.createdAt)}
              </span>
              <span className="meta-item">
                ⏱️ {t.duration}: {calculateDuration(goal)}
              </span>
              {goal.progress !== undefined && (
                <span className="meta-item">
                  📊 {goal.progress}%
                </span>
              )}
            </div>
            
            <div className="item-actions">
              <LandButton
                text={t.view}
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewGoal(goal);
                }}
              />
              <LandButton
                text={t.delete}
                variant="text"
                onClick={(e) => handleDelete(goal.id, e)}
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
    </div>
  );
};

export default HistoryList;
