import React, { useState } from 'react';
import type { LearningTask } from '../../../shared/types';

interface LearningPlan {
  authorTasks: LearningTask[];
  aiTasks: LearningTask[];
  goals: string[];
  focus: string[];
}

interface LearningPlanSectionProps {
  plan: LearningPlan;
  language: 'zh' | 'en';
  theme: string;
}

const LearningPlanSection: React.FC<LearningPlanSectionProps> = ({
  plan,
  language
}) => {
  const [activeTaskTab, setActiveTaskTab] = useState<'author' | 'ai'>('author');

  const texts = {
    zh: {
      title: '学习计划',
      goals: '本周期目标',
      focus: '重点关注',
      authorTasks: '作者任务',
      aiTasks: 'AI任务',
      priority: '优先级',
      status: '状态',
      estimatedTime: '预估时间',
      deadline: '截止时间',
      resources: '学习资源',
      high: '高',
      medium: '中',
      low: '低',
      pending: '待开始',
      in_progress: '进行中',
      completed: '已完成',
      cancelled: '已取消'
    },
    en: {
      title: 'Learning Plan',
      goals: 'Period Goals',
      focus: 'Focus Areas',
      authorTasks: 'Author Tasks',
      aiTasks: 'AI Tasks',
      priority: 'Priority',
      status: 'Status',
      estimatedTime: 'Estimated Time',
      deadline: 'Deadline',
      resources: 'Resources',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
  };

  const t = texts[language];

  const getPriorityLabel = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      high: t.high,
      medium: t.medium,
      low: t.low
    };
    return priorityMap[priority] || priority;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: t.pending,
      in_progress: t.in_progress,
      completed: t.completed,
      cancelled: t.cancelled
    };
    return statusMap[status] || status;
  };

  const TaskList: React.FC<{ tasks: LearningTask[] }> = ({ tasks }) => (
    <div className="tasks-list">
      {tasks.map((task) => (
        <div key={task.id} className={`task-card ${task.status}`}>
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-badges">
              <span className={`priority-badge ${task.priority}`}>
                {getPriorityLabel(task.priority)}
              </span>
              <span className={`status-badge ${task.status}`}>
                {getStatusLabel(task.status)}
              </span>
            </div>
          </div>
          
          <p className="task-description">{task.description}</p>
          
          <div className="task-meta">
            <div className="meta-item">
              <span className="meta-label">{t.estimatedTime}:</span>
              <span className="meta-value">{task.estimatedTime}</span>
            </div>
            
            {task.deadline && (
              <div className="meta-item">
                <span className="meta-label">{t.deadline}:</span>
                <span className="meta-value">{task.deadline}</span>
              </div>
            )}
          </div>
          
          {task.resources && task.resources.length > 0 && (
            <div className="task-resources">
              <span className="resources-label">{t.resources}:</span>
              <div className="resources-list">
                {task.resources.map((resource, index) => (
                  <span key={index} className="resource-tag">
                    {resource}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section className="learning-plan-section">
      <h3 className="section-title">{t.title}</h3>
      
      {/* 目标和重点 */}
      <div className="plan-overview">
        <div className="goals-section">
          <h4>{t.goals}</h4>
          <ul className="goals-list">
            {plan.goals.map((goal, index) => (
              <li key={index} className="goal-item">{goal}</li>
            ))}
          </ul>
        </div>
        
        <div className="focus-section">
          <h4>{t.focus}</h4>
          <div className="focus-tags">
            {plan.focus.map((area, index) => (
              <span key={index} className="focus-tag">{area}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="tasks-section">
        <div className="task-tabs">
          <button 
            className={`task-tab ${activeTaskTab === 'author' ? 'active' : ''}`}
            onClick={() => setActiveTaskTab('author')}
          >
            {t.authorTasks} ({plan.authorTasks.length})
          </button>
          <button 
            className={`task-tab ${activeTaskTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTaskTab('ai')}
          >
            {t.aiTasks} ({plan.aiTasks.length})
          </button>
        </div>
        
        <div className="task-content">
          {activeTaskTab === 'author' && <TaskList tasks={plan.authorTasks} />}
          {activeTaskTab === 'ai' && <TaskList tasks={plan.aiTasks} />}
        </div>
      </div>
    </section>
  );
};

export default LearningPlanSection;