import React, { useState } from 'react';

interface Reflection {
  id: string;
  type: 'achievement' | 'challenge' | 'insight' | 'improvement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionItems: string[];
  lessons: string[];
  createdAt: string;
}

interface GoalProgress {
  overall: number;
  criteria: {
    name: string;
    progress: number;
    status: 'completed' | 'on_track' | 'at_risk' | 'blocked';
  }[];
}

interface ReflectionSectionProps {
  goalTitle: string;
  language: 'zh' | 'en';
  theme: string;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  goalTitle,
  language
}) => {
  const [activeReflectionTab, setActiveReflectionTab] = useState<'all' | 'achievement' | 'challenge' | 'insight' | 'improvement'>('all');

  const texts = {
    zh: {
      title: '总结反思',
      subtitle: '深度反思学习过程，规划未来行动',
      goalProgress: '目标进度',
      reflections: '反思记录',
      nextSteps: '下一步行动',
      all: '全部',
      achievement: '成就',
      challenge: '挑战',
      insight: '洞察',
      improvement: '改进',
      impact: '影响力',
      actionItems: '行动项',
      lessons: '经验教训',
      immediate: '立即行动',
      shortTerm: '短期计划',
      longTerm: '长期规划',
      high: '高',
      medium: '中',
      low: '低',
      completed: '已完成',
      on_track: '进展顺利',
      at_risk: '存在风险',
      blocked: '受阻',
      overallProgress: '整体进度',
      criteriaProgress: '各项标准进度',
      keyReflections: '关键反思',
      futureActions: '未来行动',
      learningCurve: '学习曲线',
      progressTrend: '进度趋势',
      reflectionCount: '反思数量',
      avgImpact: '平均影响力'
    },
    en: {
      title: 'Summary & Reflection',
      subtitle: 'Deep reflection on learning process and future action planning',
      goalProgress: 'Goal Progress',
      reflections: 'Reflections',
      nextSteps: 'Next Steps',
      all: 'All',
      achievement: 'Achievement',
      challenge: 'Challenge',
      insight: 'Insight',
      improvement: 'Improvement',
      impact: 'Impact',
      actionItems: 'Action Items',
      lessons: 'Lessons Learned',
      immediate: 'Immediate',
      shortTerm: 'Short Term',
      longTerm: 'Long Term',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      completed: 'Completed',
      on_track: 'On Track',
      at_risk: 'At Risk',
      blocked: 'Blocked',
      overallProgress: 'Overall Progress',
      criteriaProgress: 'Criteria Progress',
      keyReflections: 'Key Reflections',
      futureActions: 'Future Actions',
      learningCurve: 'Learning Curve',
      progressTrend: 'Progress Trend',
      reflectionCount: 'Reflection Count',
      avgImpact: 'Avg Impact'
    }
  };

  const t = texts[language];

  // 根据目标生成进度数据
  const generateProgressFromGoal = (goalTitle: string): GoalProgress => {
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('动画') || lowerTitle.includes('animation')) {
      return {
        overall: 78,
        criteria: [
          { name: '性能指标', progress: 75, status: 'on_track' },
          { name: '用户体验', progress: 85, status: 'on_track' },
          { name: '技术质量', progress: 70, status: 'at_risk' }
        ]
      };
    }
    
    return {
      overall: 80,
      criteria: [
        { name: '功能完整性', progress: 85, status: 'on_track' },
        { name: '质量标准', progress: 75, status: 'on_track' }
      ]
    };
  };

  // 根据目标生成反思数据
  const generateReflectionsFromGoal = (goalTitle: string): Reflection[] => {
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('动画') || lowerTitle.includes('animation')) {
      return [
        {
          id: 'reflection-1',
          type: 'achievement',
          title: '成功实现60fps流畅动画',
          description: '通过GPU加速和性能优化，成功将动画帧率提升到60fps，用户体验显著改善',
          impact: 'high',
          actionItems: [
            '将优化方案应用到其他项目',
            '编写性能优化最佳实践文档'
          ],
          lessons: [
            'transform比position动画性能更好',
            'will-change属性需要谨慎使用',
            '动画结束后要及时清理资源'
          ],
          createdAt: '2026-01-24'
        },
        {
          id: 'reflection-2',
          type: 'challenge',
          title: '复杂动画状态管理困难',
          description: '在处理多个并发动画时遇到状态冲突问题，需要更好的状态管理方案',
          impact: 'medium',
          actionItems: [
            '研究动画状态机模式',
            '实现动画队列管理系统',
            '添加动画冲突检测机制'
          ],
          lessons: [
            '复杂动画需要状态机管理',
            '动画优先级机制很重要',
            '需要考虑动画的生命周期'
          ],
          createdAt: '2026-01-23'
        },
        {
          id: 'reflection-3',
          type: 'insight',
          title: '用户设备性能差异巨大',
          description: '发现不同设备的动画性能差异很大，需要实现自适应动画策略',
          impact: 'high',
          actionItems: [
            '实现设备性能检测',
            '开发动画降级策略',
            '提供用户自定义选项'
          ],
          lessons: [
            '性能检测应该在应用启动时进行',
            '动画降级要保持视觉一致性',
            '用户选择权很重要'
          ],
          createdAt: '2026-01-22'
        },
        {
          id: 'reflection-4',
          type: 'improvement',
          title: '动画库API设计需要优化',
          description: '当前API使用复杂，开发者学习成本高，需要简化接口设计',
          impact: 'medium',
          actionItems: [
            '重新设计API接口',
            '增加使用示例和文档',
            '收集开发者反馈'
          ],
          lessons: [
            '简单易用比功能丰富更重要',
            '好的API设计需要多次迭代',
            '文档和示例同样重要'
          ],
          createdAt: '2026-01-21'
        }
      ];
    }
    
    return [
      {
        id: 'reflection-default',
        type: 'achievement',
        title: '目标进展良好',
        description: '按计划推进，取得了预期的成果',
        impact: 'medium',
        actionItems: ['继续保持当前节奏'],
        lessons: ['坚持很重要'],
        createdAt: '2026-01-24'
      }
    ];
  };

  const progress = generateProgressFromGoal(goalTitle);
  const reflections = generateReflectionsFromGoal(goalTitle);

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      achievement: t.achievement,
      challenge: t.challenge,
      insight: t.insight,
      improvement: t.improvement
    };
    return typeMap[type] || type;
  };

  const getImpactLabel = (impact: string) => {
    const impactMap: { [key: string]: string } = {
      high: t.high,
      medium: t.medium,
      low: t.low
    };
    return impactMap[impact] || impact;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      completed: t.completed,
      on_track: t.on_track,
      at_risk: t.at_risk,
      blocked: t.blocked
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      completed: 'success',
      on_track: 'success',
      at_risk: 'warning',
      blocked: 'danger'
    };
    return colorMap[status] || 'default';
  };

  const filteredReflections = activeReflectionTab === 'all' 
    ? reflections 
    : reflections.filter(r => r.type === activeReflectionTab);

  // 统计数据
  const reflectionCount = reflections.length;
  const avgImpact = reflections.reduce((sum, r) => {
    const impactScore = r.impact === 'high' ? 3 : r.impact === 'medium' ? 2 : 1;
    return sum + impactScore;
  }, 0) / reflections.length;

  const getAvgImpactLabel = (score: number) => {
    if (score >= 2.5) return t.high;
    if (score >= 1.5) return t.medium;
    return t.low;
  };

  return (
    <section className="reflection-section">
      <div className="section-header">
        <h3 className="section-title">{t.title}</h3>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      {/* 目标进度概览 */}
      <div className="progress-overview">
        <h4>{t.goalProgress}</h4>
        
        <div className="overall-progress">
          <div className="progress-header">
            <span className="progress-label">{t.overallProgress}</span>
            <span className="progress-percentage">{progress.overall}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress.overall}%` }}
            ></div>
          </div>
        </div>

        <div className="criteria-progress">
          <h5>{t.criteriaProgress}</h5>
          <div className="criteria-grid">
            {progress.criteria.map((criterion, index) => (
              <div key={index} className="criterion-progress">
                <div className="criterion-header">
                  <span className="criterion-name">{criterion.name}</span>
                  <span className={`criterion-status ${getStatusColor(criterion.status)}`}>
                    {getStatusLabel(criterion.status)}
                  </span>
                </div>
                <div className="criterion-bar">
                  <div 
                    className={`criterion-fill ${getStatusColor(criterion.status)}`}
                    style={{ width: `${criterion.progress}%` }}
                  ></div>
                </div>
                <span className="criterion-percentage">{criterion.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 反思记录 */}
      <div className="reflections-section">
        <div className="reflections-header">
          <h4>{t.reflections}</h4>
          <div className="reflection-stats">
            <div className="stat-item">
              <span className="stat-label">{t.reflectionCount}</span>
              <span className="stat-value">{reflectionCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t.avgImpact}</span>
              <span className="stat-value">{getAvgImpactLabel(avgImpact)}</span>
            </div>
          </div>
        </div>

        {/* 反思类型筛选 */}
        <div className="reflection-tabs">
          <button 
            className={`reflection-tab ${activeReflectionTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveReflectionTab('all')}
          >
            {t.all} ({reflections.length})
          </button>
          <button 
            className={`reflection-tab ${activeReflectionTab === 'achievement' ? 'active' : ''}`}
            onClick={() => setActiveReflectionTab('achievement')}
          >
            {t.achievement} ({reflections.filter(r => r.type === 'achievement').length})
          </button>
          <button 
            className={`reflection-tab ${activeReflectionTab === 'challenge' ? 'active' : ''}`}
            onClick={() => setActiveReflectionTab('challenge')}
          >
            {t.challenge} ({reflections.filter(r => r.type === 'challenge').length})
          </button>
          <button 
            className={`reflection-tab ${activeReflectionTab === 'insight' ? 'active' : ''}`}
            onClick={() => setActiveReflectionTab('insight')}
          >
            {t.insight} ({reflections.filter(r => r.type === 'insight').length})
          </button>
          <button 
            className={`reflection-tab ${activeReflectionTab === 'improvement' ? 'active' : ''}`}
            onClick={() => setActiveReflectionTab('improvement')}
          >
            {t.improvement} ({reflections.filter(r => r.type === 'improvement').length})
          </button>
        </div>

        {/* 反思列表 */}
        <div className="reflections-grid">
          {filteredReflections.map((reflection) => (
            <div key={reflection.id} className={`reflection-card ${reflection.type}`}>
              <div className="reflection-header">
                <div className="reflection-meta">
                  <span className={`reflection-type ${reflection.type}`}>
                    {getTypeLabel(reflection.type)}
                  </span>
                  <span className={`reflection-impact ${reflection.impact}`}>
                    {getImpactLabel(reflection.impact)}
                  </span>
                </div>
                <span className="reflection-date">{reflection.createdAt}</span>
              </div>

              <h5 className="reflection-title">{reflection.title}</h5>
              <p className="reflection-description">{reflection.description}</p>

              <div className="reflection-content">
                <div className="action-items">
                  <h6>{t.actionItems}</h6>
                  <ul className="action-list">
                    {reflection.actionItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="lessons-learned">
                  <h6>{t.lessons}</h6>
                  <ul className="lessons-list">
                    {reflection.lessons.map((lesson, index) => (
                      <li key={index}>{lesson}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReflectionSection;