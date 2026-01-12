import React from 'react';
import type { LearningTask } from '../../../shared/types';

interface AILearning {
  completedTasks: LearningTask[];
  newKnowledge: string[];
  suggestions: string[];
  nextPeriodRecommendations: string[];
}

interface AILearningSectionProps {
  aiLearning: AILearning;
  language: 'zh' | 'en';
  theme: string;
}

const AILearningSection: React.FC<AILearningSectionProps> = ({
  aiLearning,
  language
}) => {
  const texts = {
    zh: {
      title: 'AI自动学习',
      completedTasks: '已完成任务',
      newKnowledge: '新学知识',
      suggestions: 'AI建议',
      nextRecommendations: '下周期推荐',
      noCompletedTasks: '本周期暂无已完成的AI任务',
      aiInsight: 'AI洞察',
      learningProgress: '学习进展'
    },
    en: {
      title: 'AI Auto Learning',
      completedTasks: 'Completed Tasks',
      newKnowledge: 'New Knowledge',
      suggestions: 'AI Suggestions',
      nextRecommendations: 'Next Period Recommendations',
      noCompletedTasks: 'No completed AI tasks this period',
      aiInsight: 'AI Insights',
      learningProgress: 'Learning Progress'
    }
  };

  const t = texts[language];

  return (
    <section className="ai-learning-section">
      <h3 className="section-title">{t.title}</h3>
      
      {/* AI学习进展 */}
      <div className="ai-progress">
        <div className="progress-header">
          <h4>{t.learningProgress}</h4>
        </div>
        
        {/* 已完成任务 */}
        <div className="completed-tasks">
          <h5>{t.completedTasks}</h5>
          {aiLearning.completedTasks.length > 0 ? (
            <div className="tasks-grid">
              {aiLearning.completedTasks.map((task) => (
                <div key={task.id} className="ai-task-card completed">
                  <h6>{task.title}</h6>
                  <p>{task.description}</p>
                  <div className="task-completion">
                    <span className="completion-date">
                      完成于: {task.completedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-tasks">{t.noCompletedTasks}</p>
          )}
        </div>
      </div>

      {/* 新学知识 */}
      <div className="knowledge-section">
        <h4>{t.newKnowledge}</h4>
        <div className="knowledge-grid">
          {aiLearning.newKnowledge.map((knowledge, index) => (
            <div key={index} className="knowledge-card">
              <div className="knowledge-icon">🧠</div>
              <span className="knowledge-text">{knowledge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI建议 */}
      <div className="suggestions-section">
        <h4>{t.suggestions}</h4>
        <div className="suggestions-list">
          {aiLearning.suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-card">
              <div className="suggestion-icon">💡</div>
              <p className="suggestion-text">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 下周期推荐 */}
      <div className="recommendations-section">
        <h4>{t.nextRecommendations}</h4>
        <div className="recommendations-list">
          {aiLearning.nextPeriodRecommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-icon">🎯</div>
              <p className="recommendation-text">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI洞察面板 */}
      <div className="ai-insights">
        <h4>{t.aiInsight}</h4>
        <div className="insights-panel">
          <div className="insight-metric">
            <span className="metric-label">知识增长率</span>
            <span className="metric-value">+12%</span>
          </div>
          <div className="insight-metric">
            <span className="metric-label">学习效率</span>
            <span className="metric-value">85%</span>
          </div>
          <div className="insight-metric">
            <span className="metric-label">技能覆盖度</span>
            <span className="metric-value">78%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AILearningSection;