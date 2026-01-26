import { Icon } from '@suminhan/land-design';
import React, { useState } from 'react';

interface LearningInput {
  id: string;
  type: 'resource' | 'practice' | 'research' | 'experiment';
  title: string;
  description: string;
  timeSpent: number; // 分钟
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

interface InputSectionProps {
  goalTitle: string;
  language: 'zh' | 'en';
  theme: string;
}

const InputSection: React.FC<InputSectionProps> = ({
  goalTitle,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'resource' | 'practice' | 'research' | 'experiment'>('all');

  const texts = {
    zh: {
      title: '学习输入',
      subtitle: '记录学习过程中的所有输入和投入',
      all: '全部',
      resource: '学习资源',
      practice: '实践练习',
      research: '研究调研',
      experiment: '实验探索',
      timeSpent: '投入时间',
      difficulty: '难度',
      source: '来源',
      notes: '笔记',
      tags: '标签',
      easy: '简单',
      medium: '中等',
      hard: '困难',
      minutes: '分钟',
      hours: '小时',
      totalTime: '总投入时间',
      inputCount: '输入数量',
      avgDifficulty: '平均难度',
      addInput: '添加输入'
    },
    en: {
      title: 'Learning Input',
      subtitle: 'Record all inputs and investments in the learning process',
      all: 'All',
      resource: 'Resources',
      practice: 'Practice',
      research: 'Research',
      experiment: 'Experiment',
      timeSpent: 'Time Spent',
      difficulty: 'Difficulty',
      source: 'Source',
      notes: 'Notes',
      tags: 'Tags',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      minutes: 'minutes',
      hours: 'hours',
      totalTime: 'Total Time',
      inputCount: 'Input Count',
      avgDifficulty: 'Avg Difficulty',
      addInput: 'Add Input'
    }
  };

  const t = texts[language];

  // 根据目标生成学习输入数据
  const generateInputsFromGoal = (goalTitle: string): LearningInput[] => {
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('动画') || lowerTitle.includes('animation')) {
      return [
        {
          id: 'input-1',
          type: 'resource',
          title: 'CSS动画性能优化指南',
          description: '深入学习CSS动画的性能优化技巧，包括will-change、transform3d等属性的使用',
          timeSpent: 120,
          difficulty: 'medium',
          source: 'MDN Web Docs',
          notes: '重点关注了GPU加速和回流重绘的优化，学会了使用transform代替position变化',
          tags: ['CSS', '性能优化', '动画'],
          createdAt: '2026-01-20'
        },
        {
          id: 'input-2',
          type: 'practice',
          title: 'React Transition实践',
          description: '使用React Transition Group实现复杂的页面切换动画',
          timeSpent: 180,
          difficulty: 'hard',
          source: '个人项目',
          notes: '遇到了状态管理的问题，通过useRef解决了动画状态冲突',
          tags: ['React', 'Transition', '状态管理'],
          createdAt: '2026-01-21'
        },
        {
          id: 'input-3',
          type: 'research',
          title: 'Framer Motion vs React Spring对比',
          description: '调研两个主流React动画库的性能和易用性差异',
          timeSpent: 90,
          difficulty: 'medium',
          source: '技术博客 + 官方文档',
          notes: 'Framer Motion API更友好，React Spring性能更好，根据项目需求选择',
          tags: ['Framer Motion', 'React Spring', '技术选型'],
          createdAt: '2026-01-22'
        },
        {
          id: 'input-4',
          type: 'experiment',
          title: 'Web Animations API实验',
          description: '尝试使用原生Web Animations API实现复杂动画效果',
          timeSpent: 150,
          difficulty: 'hard',
          source: '技术实验',
          notes: '原生API控制力更强但代码复杂度高，适合性能要求极高的场景',
          tags: ['Web API', '原生动画', '性能'],
          createdAt: '2026-01-23'
        },
        {
          id: 'input-5',
          type: 'resource',
          title: '60fps动画最佳实践',
          description: '学习如何确保动画始终保持60fps的流畅度',
          timeSpent: 75,
          difficulty: 'medium',
          source: 'Google Developers',
          notes: '关键是避免布局抖动，使用compositor-only属性进行动画',
          tags: ['性能', '60fps', '最佳实践'],
          createdAt: '2026-01-24'
        }
      ];
    }
    
    // 默认通用输入
    return [
      {
        id: 'input-default-1',
        type: 'resource',
        title: '技术文档学习',
        description: '阅读相关技术文档和教程',
        timeSpent: 120,
        difficulty: 'medium',
        source: '官方文档',
        notes: '重点学习了核心概念和最佳实践',
        tags: ['文档', '学习'],
        createdAt: '2026-01-20'
      },
      {
        id: 'input-default-2',
        type: 'practice',
        title: '动手实践',
        description: '通过实际编码加深理解',
        timeSpent: 180,
        difficulty: 'hard',
        source: '个人项目',
        notes: '在实践中遇到了一些问题，通过调试解决了',
        tags: ['实践', '编码'],
        createdAt: '2026-01-21'
      }
    ];
  };

  const inputs = generateInputsFromGoal(goalTitle);

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      resource: t.resource,
      practice: t.practice,
      research: t.research,
      experiment: t.experiment
    };
    return typeMap[type] || type;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const difficultyMap: { [key: string]: string } = {
      easy: t.easy,
      medium: t.medium,
      hard: t.hard
    };
    return difficultyMap[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap: { [key: string]: string } = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger'
    };
    return colorMap[difficulty] || 'default';
  };

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}${t.hours} ${remainingMinutes}${t.minutes}`
        : `${hours}${t.hours}`;
    }
    return `${minutes}${t.minutes}`;
  };

  const filteredInputs = activeTab === 'all' 
    ? inputs 
    : inputs.filter(input => input.type === activeTab);

  // 统计数据
  const totalTime = inputs.reduce((sum, input) => sum + input.timeSpent, 0);
  const inputCount = inputs.length;
  const avgDifficulty = inputs.reduce((sum, input) => {
    const difficultyScore = input.difficulty === 'easy' ? 1 : input.difficulty === 'medium' ? 2 : 3;
    return sum + difficultyScore;
  }, 0) / inputs.length;

  const getAvgDifficultyLabel = (score: number) => {
    if (score <= 1.5) return t.easy;
    if (score <= 2.5) return t.medium;
    return t.hard;
  };

  return (
    <section className="input-section">
      <div className="section-header">
        <h3 className="section-title">{t.title}</h3>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      {/* 统计概览 */}
      <div className="input-stats">
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <span className="stat-label">{t.totalTime}</span>
            <span className="stat-value">{formatTime(totalTime)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <span className="stat-label">{t.inputCount}</span>
            <span className="stat-value">{inputCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">{t.avgDifficulty}</span>
            <span className="stat-value">{getAvgDifficultyLabel(avgDifficulty)}</span>
          </div>
        </div>
      </div>

      {/* 类型筛选 */}
      <div className="input-tabs">
        <button 
          className={`input-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t.all} ({inputs.length})
        </button>
        <button 
          className={`input-tab ${activeTab === 'resource' ? 'active' : ''}`}
          onClick={() => setActiveTab('resource')}
        >
          {t.resource} ({inputs.filter(i => i.type === 'resource').length})
        </button>
        <button 
          className={`input-tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          {t.practice} ({inputs.filter(i => i.type === 'practice').length})
        </button>
        <button 
          className={`input-tab ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => setActiveTab('research')}
        >
          {t.research} ({inputs.filter(i => i.type === 'research').length})
        </button>
        <button 
          className={`input-tab ${activeTab === 'experiment' ? 'active' : ''}`}
          onClick={() => setActiveTab('experiment')}
        >
          {t.experiment} ({inputs.filter(i => i.type === 'experiment').length})
        </button>
      </div>

      {/* 输入列表 - Todo List 折叠展示 */}
      <div className="inputs-todo-list">
        {filteredInputs.map((input) => (
          <details key={input.id} className={`input-todo-item ${input.type}`}>
            <summary className="input-todo-summary">
              <div className="todo-summary-content">
                <div className="todo-checkbox">
                  <span className="checkbox-icon">✓</span>
                </div>
                <div className="todo-main-info">
                  <h4 className="input-title">{input.title}</h4>
                  <div className="input-meta">
                    <span className={`input-type ${input.type}`}>
                      {getTypeLabel(input.type)}
                    </span>
                    <span className={`input-difficulty ${getDifficultyColor(input.difficulty)}`}>
                      {getDifficultyLabel(input.difficulty)}
                    </span>
                    <span className="input-time">{formatTime(input.timeSpent)}</span>
                  </div>
                </div>
                <div className="todo-expand-icon">
                  <Icon name='arrow' className='expand-arrow'/>
                </div>
              </div>
            </summary>
            
            <div className="input-details-expanded">
              <p className="input-description">{input.description}</p>

              <div className="input-details">
                <div className="input-source">
                  <span className="detail-label">{t.source}:</span>
                  <span className="detail-value">{input.source}</span>
                </div>
                
                {input.notes && (
                  <div className="input-notes">
                    <span className="detail-label">{t.notes}:</span>
                    <p className="notes-content">{input.notes}</p>
                  </div>
                )}

                <div className="input-tags">
                  {input.tags.map((tag, index) => (
                    <span key={index} className="input-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="input-date">
                  {input.createdAt}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default InputSection;