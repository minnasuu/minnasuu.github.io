import React from 'react';
import { LandButton } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';

interface GoalStatusProps {
  goal: Goal;
  onEdit?: () => void;
  onStart: () => void;
  onComplete: () => void;
  onPause: () => void;
  onResume: () => void;
  className?: string;
}

export const GoalStatus: React.FC<GoalStatusProps> = ({
  goal,
  onEdit,
  onStart,
  onComplete,
  onPause,
  onResume,
  className = ''
}) => {
  const getStatusText = (status: Goal['status']) => {
    const statusMap = {
      planning: '规划中',
      active: '进行中',
      completed: '已完成',
      paused: '已暂停',
      cancelled: '已取消'
    };
    return statusMap[status];
  };

  const getStatusColor = (status: Goal['status']) => {
    const colorMap = {
      planning: '#666',
      active: '#2067ff',
      completed: '#059669',
      paused: '#f59927',
      cancelled: '#dc2626'
    };
    return colorMap[status];
  };

  const getCategoryText = (category: Goal['category']) => {
    const categoryMap = {
      technical: '技术技能',
      career: '职业发展',
      personal: '个人成长',
      project: '项目目标'
    };
    return categoryMap[category];
  };

  const getPriorityText = (priority: Goal['priority']) => {
    const priorityMap = {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级'
    };
    return priorityMap[priority];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const endDate = new Date(goal.endDate);
    const today = new Date();
    
    // 如果目标还未正式开始，使用计划的结束日期
    if (goal.status === 'planning') {
      const diffTime = endDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // 如果目标已开始，计算实际剩余时间（排除暂停时间）
    if (goal.actualStartDate) {
      const actualStartDate = new Date(goal.actualStartDate);
      const totalPausedMs = goal.totalPausedDuration || 0;
      
      // 如果当前是暂停状态，还需要加上当前暂停的时间
      let currentPausedMs = 0;
      if (goal.status === 'paused' && goal.pausedAt) {
        currentPausedMs = today.getTime() - new Date(goal.pausedAt).getTime();
      }
      
      // 计算实际已用时间（排除暂停时间）
      const actualElapsedMs = today.getTime() - actualStartDate.getTime() - totalPausedMs - currentPausedMs;
      const actualElapsedDays = actualElapsedMs / (1000 * 60 * 60 * 24);
      
      return goal.duration - actualElapsedDays;
    }
    
    // 兜底逻辑
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getActualProgress = () => {
    if (goal.status === 'planning') {
      return 0;
    }
    
    if (goal.actualStartDate) {
      const today = new Date();
      const actualStartDate = new Date(goal.actualStartDate);
      const totalPausedMs = goal.totalPausedDuration || 0;
      
      // 如果当前是暂停状态，还需要加上当前暂停的时间
      let currentPausedMs = 0;
      if (goal.status === 'paused' && goal.pausedAt) {
        currentPausedMs = today.getTime() - new Date(goal.pausedAt).getTime();
      }
      
      // 计算实际已用时间（排除暂停时间）
      const actualElapsedMs = today.getTime() - actualStartDate.getTime() - totalPausedMs - currentPausedMs;
      const actualElapsedDays = actualElapsedMs / (1000 * 60 * 60 * 24);
      
      const progressPercentage = Math.min((actualElapsedDays / goal.duration) * 100, 100);
      return Math.max(progressPercentage, goal.progress); // 取手动进度和时间进度的较大值
    }
    
    return goal.progress;
  };

  const daysRemaining = getDaysRemaining();
  const actualProgress = getActualProgress();

  return (
    <div className={`goal-status ${className}`}>
      <div className="goal-header">
        <div className="goal-title-section">
          <h2 className="goal-title">{goal.title}</h2>
          <div className="goal-badges">
            <span 
              className="status-badge"
              style={{ color: getStatusColor(goal.status) }}
            >
              {getStatusText(goal.status)}
            </span>
            <span className="category-badge">
              {getCategoryText(goal.category)}
            </span>
            <span className={`priority-badge priority-${goal.priority}`}>
              {getPriorityText(goal.priority)}
            </span>
          </div>
        </div>
        
        <div className="goal-actions">
         {onEdit&& <LandButton
            text="编辑"
            type="transparent"
            onClick={onEdit}
          />}
          {goal.status === 'planning' && (
            <LandButton
              text="开始目标"
              type="background"
              onClick={onStart}
            />
          )}
          {goal.status === 'active' && (
            <>
              <LandButton
                text="暂停"
                type="transparent"
                onClick={onPause}
              />
              <LandButton
                text="完成目标"
                type="background"
                onClick={onComplete}
              />
            </>
          )}
          {goal.status === 'paused' && (
            <>
              <LandButton
                text="继续"
                type="background"
                onClick={onResume}
              />
              <LandButton
                text="完成目标"
                type="transparent"
                onClick={onComplete}
              />
            </>
          )}
        </div>
      </div>

      <div className="goal-description">
        <p>{goal.description}</p>
      </div>

      <div className="goal-progress">
        <div className="progress-header">
          <span className="progress-label">完成进度</span>
          <span className="progress-percentage">{Math.round(actualProgress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${actualProgress}%` }}
          />
        </div>
        {goal.status === 'paused' && (
          <div className="progress-note">
            <span className="pause-indicator">⏸️ 目标已暂停，暂停期间不计入周期时间</span>
          </div>
        )}
      </div>

      <div className="goal-meta">
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">计划开始</span>
            <span className="meta-value">{formatDate(goal.startDate)}</span>
          </div>
          {goal.actualStartDate && (
            <div className="meta-item">
              <span className="meta-label">实际开始</span>
              <span className="meta-value">{formatDate(goal.actualStartDate)}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">计划结束</span>
            <span className="meta-value">{formatDate(goal.endDate)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">目标周期</span>
            <span className="meta-value">{goal.duration} 天</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">
              {goal.status === 'planning' ? '计划剩余' : '实际剩余'}
            </span>
            <span className={`meta-value ${daysRemaining < 0 ? 'overdue' : ''}`}>
              {daysRemaining < 0 ? `已超期 ${Math.abs(Math.round(daysRemaining))} 天` : `${Math.round(daysRemaining)} 天`}
            </span>
          </div>
          {goal.totalPausedDuration && goal.totalPausedDuration > 0 && (
            <div className="meta-item">
              <span className="meta-label">累计暂停</span>
              <span className="meta-value">
                {Math.round(goal.totalPausedDuration / (1000 * 60 * 60 * 24))} 天
              </span>
            </div>
          )}
        </div>
      </div>

      {goal.targetSkills.length > 0 && (
        <div className="goal-skills">
          <h4>目标技能</h4>
          <div className="skills-tags">
            {goal.targetSkills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {goal.successCriteria.length > 0 && (
        <div className="goal-criteria">
          <h4>成功标准</h4>
          <ul className="criteria-list">
            {goal.successCriteria.map((criteria, index) => (
              <li key={index} className="criteria-item">
                {criteria}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};