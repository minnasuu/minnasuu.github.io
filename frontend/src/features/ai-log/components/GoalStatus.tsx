import React from 'react';
import { LandButton } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';

interface GoalStatusProps {
  goal: Goal;
  onEdit: () => void;
  onStart: () => void;
  onComplete: () => void;
  onPause: () => void;
  className?: string;
}

export const GoalStatus: React.FC<GoalStatusProps> = ({
  goal,
  onEdit,
  onStart,
  onComplete,
  onPause,
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
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

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
          <LandButton
            text="编辑"
            type="transparent"
            onClick={onEdit}
          />
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
        </div>
      </div>

      <div className="goal-description">
        <p>{goal.description}</p>
      </div>

      <div className="goal-progress">
        <div className="progress-header">
          <span className="progress-label">完成进度</span>
          <span className="progress-percentage">{goal.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="goal-meta">
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">开始日期</span>
            <span className="meta-value">{formatDate(goal.startDate)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">结束日期</span>
            <span className="meta-value">{formatDate(goal.endDate)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">目标周期</span>
            <span className="meta-value">{goal.duration} 天</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">剩余时间</span>
            <span className={`meta-value ${daysRemaining < 0 ? 'overdue' : ''}`}>
              {daysRemaining < 0 ? `已超期 ${Math.abs(daysRemaining)} 天` : `${daysRemaining} 天`}
            </span>
          </div>
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