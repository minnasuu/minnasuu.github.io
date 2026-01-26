import React from 'react';

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 权重 0-100
  metrics: {
    name: string;
    target: string;
    current?: string;
    status: 'achieved' | 'in_progress' | 'not_started';
  }[];
}

interface CriteriaSectionProps {
  goalTitle: string;
  language: 'zh' | 'en';
  theme: string;
}

const CriteriaSection: React.FC<CriteriaSectionProps> = ({
  goalTitle,
  language
}) => {
  const texts = {
    zh: {
      title: '判断标准',
      subtitle: '明确的成功标准和评估指标',
      weight: '权重',
      target: '目标值',
      current: '当前值',
      status: '状态',
      achieved: '已达成',
      in_progress: '进行中',
      not_started: '未开始',
      overall: '整体进度',
      metrics: '评估指标'
    },
    en: {
      title: 'Success Criteria',
      subtitle: 'Clear success standards and evaluation metrics',
      weight: 'Weight',
      target: 'Target',
      current: 'Current',
      status: 'Status',
      achieved: 'Achieved',
      in_progress: 'In Progress',
      not_started: 'Not Started',
      overall: 'Overall Progress',
      metrics: 'Metrics'
    }
  };

  const t = texts[language];

  // 根据目标生成判断标准
  const generateCriteriaFromGoal = (goalTitle: string): Criterion[] => {
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('动画') || lowerTitle.includes('animation')) {
      return [
        {
          id: 'performance',
          name: '性能指标',
          description: '动画性能达到生产环境标准',
          weight: 40,
          metrics: [
            {
              name: '帧率稳定性',
              target: '60fps',
              current: '45fps',
              status: 'in_progress'
            },
            {
              name: '内存占用',
              target: '<50MB',
              current: '65MB',
              status: 'in_progress'
            },
            {
              name: 'CPU使用率',
              target: '<30%',
              current: '45%',
              status: 'in_progress'
            }
          ]
        },
        {
          id: 'user_experience',
          name: '用户体验',
          description: '动画效果符合用户期望和交互标准',
          weight: 35,
          metrics: [
            {
              name: '响应延迟',
              target: '<100ms',
              current: '80ms',
              status: 'achieved'
            },
            {
              name: '视觉流畅度',
              target: '无卡顿',
              current: '偶有卡顿',
              status: 'in_progress'
            },
            {
              name: '交互反馈',
              target: '即时响应',
              current: '基本达成',
              status: 'achieved'
            }
          ]
        },
        {
          id: 'technical_quality',
          name: '技术质量',
          description: '代码质量和可维护性标准',
          weight: 25,
          metrics: [
            {
              name: '代码复用性',
              target: '>80%',
              current: '70%',
              status: 'in_progress'
            },
            {
              name: '浏览器兼容',
              target: '95%+',
              current: '90%',
              status: 'in_progress'
            },
            {
              name: '文档完整度',
              target: '100%',
              current: '60%',
              status: 'not_started'
            }
          ]
        }
      ];
    }
    
    // 默认通用标准
    return [
      {
        id: 'functionality',
        name: '功能完整性',
        description: '核心功能实现完整度',
        weight: 50,
        metrics: [
          {
            name: '核心功能',
            target: '100%',
            current: '80%',
            status: 'in_progress'
          },
          {
            name: '边界处理',
            target: '完善',
            current: '基本完成',
            status: 'in_progress'
          }
        ]
      },
      {
        id: 'quality',
        name: '质量标准',
        description: '代码质量和用户体验',
        weight: 50,
        metrics: [
          {
            name: '代码质量',
            target: 'A级',
            current: 'B级',
            status: 'in_progress'
          },
          {
            name: '用户满意度',
            target: '>90%',
            current: '85%',
            status: 'in_progress'
          }
        ]
      }
    ];
  };

  const criteria = generateCriteriaFromGoal(goalTitle);

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      achieved: t.achieved,
      in_progress: t.in_progress,
      not_started: t.not_started
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      achieved: 'success',
      in_progress: 'warning',
      not_started: 'default'
    };
    return colorMap[status] || 'default';
  };

  // 计算整体进度
  const calculateOverallProgress = () => {
    let totalWeight = 0;
    let achievedWeight = 0;
    let inProgressWeight = 0;

    criteria.forEach(criterion => {
      totalWeight += criterion.weight;
      const achievedMetrics = criterion.metrics.filter(m => m.status === 'achieved').length;
      const inProgressMetrics = criterion.metrics.filter(m => m.status === 'in_progress').length;
      const totalMetrics = criterion.metrics.length;
      
      if (achievedMetrics === totalMetrics) {
        achievedWeight += criterion.weight;
      } else if (achievedMetrics > 0 || inProgressMetrics > 0) {
        inProgressWeight += criterion.weight * (achievedMetrics + inProgressMetrics * 0.5) / totalMetrics;
      }
    });

    return Math.round((achievedWeight + inProgressWeight) / totalWeight * 100);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <section className="criteria-section">
      <div className="section-header">
        <h3 className="section-title">{t.title}</h3>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      {/* 整体进度 */}
      <div className="overall-progress">
        <div className="progress-header">
          <h4>{t.overall}</h4>
          <span className="progress-percentage">{overallProgress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* 判断标准列表 */}
      <div className="criteria-list">
        {criteria.map((criterion) => (
          <div key={criterion.id} className="criterion-card">
            <div className="criterion-header">
              <div className="criterion-info">
                <h4 className="criterion-name">{criterion.name}</h4>
                <p className="criterion-description">{criterion.description}</p>
              </div>
              <div className="criterion-weight">
                <span className="weight-label">{t.weight}</span>
                <span className="weight-value">{criterion.weight}%</span>
              </div>
            </div>

            <div className="metrics-grid">
              {criterion.metrics.map((metric, index) => (
                <div key={index} className="metric-item">
                  <div className="metric-header">
                    <span className="metric-name">{metric.name}</span>
                    <span className={`metric-status ${getStatusColor(metric.status)}`}>
                      {getStatusLabel(metric.status)}
                    </span>
                  </div>
                  <div className="metric-values">
                    <div className="metric-value">
                      <span className="value-label">{t.target}:</span>
                      <span className="value-text target">{metric.target}</span>
                    </div>
                    {metric.current && (
                      <div className="metric-value">
                        <span className="value-label">{t.current}:</span>
                        <span className="value-text current">{metric.current}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CriteriaSection;