import React from 'react';

interface Summary {
  achievements: string[];
  challenges: string[];
  insights: string[];
  nextSteps: string[];
}

interface SummarySectionProps {
  summary: Summary;
  language: 'zh' | 'en';
  theme: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  language
}) => {
  const texts = {
    zh: {
      title: '总结与反思',
      achievements: '本周期成就',
      challenges: '遇到的挑战',
      insights: '获得的洞察',
      nextSteps: '下一步行动',
      reflection: '深度反思'
    },
    en: {
      title: 'Summary & Reflection',
      achievements: 'Achievements',
      challenges: 'Challenges',
      insights: 'Insights',
      nextSteps: 'Next Steps',
      reflection: 'Deep Reflection'
    }
  };

  const t = texts[language];

  const SummaryCard: React.FC<{
    title: string;
    items: string[];
    icon: string;
    className: string;
  }> = ({ title, items, icon, className }) => (
    <div className={`summary-card ${className}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h4 className="card-title">{title}</h4>
      </div>
      <ul className="card-list">
        {items.map((item, index) => (
          <li key={index} className="card-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="summary-section">
      <h3 className="section-title">{t.title}</h3>
      
      <div className="summary-grid">
        <SummaryCard
          title={t.achievements}
          items={summary.achievements}
          icon="🏆"
          className="achievements"
        />
        
        <SummaryCard
          title={t.challenges}
          items={summary.challenges}
          icon="⚡"
          className="challenges"
        />
        
        <SummaryCard
          title={t.insights}
          items={summary.insights}
          icon="💭"
          className="insights"
        />
        
        <SummaryCard
          title={t.nextSteps}
          items={summary.nextSteps}
          icon="🚀"
          className="next-steps"
        />
      </div>

      {/* 深度反思区域 */}
      <div className="reflection-area">
        <h4>{t.reflection}</h4>
        <div className="reflection-content">
          <div className="reflection-chart">
            <div className="growth-visualization">
              <div className="growth-line">
                <div className="growth-point current" data-label="当前"></div>
                <div className="growth-point target" data-label="目标"></div>
              </div>
            </div>
          </div>
          
          <div className="reflection-insights">
            <p>
              通过本周期的学习和实践，我在技术能力和项目经验方面都有了显著提升。
              特别是在React生态系统的理解上更加深入，同时也意识到了系统设计能力的重要性。
            </p>
            <p>
              下一个周期将重点关注实际项目的架构设计和性能优化，
              同时继续深化对新技术的理解和应用。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummarySection;