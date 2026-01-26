import { Icon, LandButton } from '@suminhan/land-design';
import React, { useState } from 'react';

interface MyOutput {
  id: string;
  type: 'code' | 'article' | 'demo' | 'documentation' | 'design';
  title: string;
  description: string;
  completionRate: number; // 0-100
  quality: 'excellent' | 'good' | 'average' | 'needs_improvement';
  impact: 'high' | 'medium' | 'low';
  link?: string;
  screenshots?: string[];
  metrics: {
    name: string;
    value: string;
    improvement?: string;
  }[];
  createdAt: string;
}

interface AIOutput {
  id: string;
  type: 'analysis' | 'suggestion' | 'optimization' | 'automation' | 'insight';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionability: 'immediate' | 'short_term' | 'long_term';
  category: 'performance' | 'code_quality' | 'user_experience' | 'learning' | 'strategy';
  content: string;
  evidence?: string[];
  recommendations: string[];
  createdAt: string;
}

interface OutputSectionProps {
  goalTitle: string;
  language: 'zh' | 'en';
  theme: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({
  goalTitle,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'my' | 'ai'>('my');
  const [myOutputs, setMyOutputs] = useState<MyOutput[]>([]);
  const [aiOutputs, setAIOutputs] = useState<AIOutput[]>([]);
  const [editingOutput, setEditingOutput] = useState<string | null>(null);

  // 初始化数据
  React.useEffect(() => {
    setMyOutputs(generateMyOutputsFromGoal(goalTitle));
    setAIOutputs(generateAIOutputsFromGoal(goalTitle));
  }, [goalTitle]);

  const texts = {
    zh: {
      title: '输出',
      subtitle: '展示学习成果和AI分析结果',
      myOutput: '我的输出',
      aiOutput: 'AI输出',
      code: '代码实现',
      article: '技术文章',
      demo: '演示项目',
      documentation: '技术文档',
      design: '设计方案',
      analysis: 'AI分析',
      suggestion: 'AI建议',
      optimization: '优化方案',
      automation: '自动化',
      insight: '深度洞察',
      completionRate: '完成度',
      quality: '质量评级',
      impact: '影响力',
      confidence: '置信度',
      actionability: '可执行性',
      category: '分类',
      excellent: '优秀',
      good: '良好',
      average: '一般',
      needs_improvement: '待改进',
      high: '高',
      medium: '中',
      low: '低',
      immediate: '立即执行',
      short_term: '短期',
      long_term: '长期',
      performance: '性能',
      code_quality: '代码质量',
      user_experience: '用户体验',
      learning: '学习',
      strategy: '策略',
      metrics: '关键指标',
      recommendations: '建议',
      evidence: '支撑证据',
      viewDetails: '查看详情',
      totalOutputs: '总输出数',
      avgQuality: '平均质量',
      avgConfidence: '平均置信度',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',
      addOutput: '添加输出',
      title_placeholder: '请输入标题',
      description_placeholder: '请输入描述',
      link_placeholder: '请输入链接',
      content_placeholder: '请输入内容'
    },
    en: {
      title: 'Output',
      subtitle: 'Showcase learning outcomes and AI analysis results',
      myOutput: 'My Output',
      aiOutput: 'AI Output',
      code: 'Code Implementation',
      article: 'Technical Article',
      demo: 'Demo Project',
      documentation: 'Documentation',
      design: 'Design Solution',
      analysis: 'AI Analysis',
      suggestion: 'AI Suggestion',
      optimization: 'Optimization',
      automation: 'Automation',
      insight: 'Deep Insight',
      completionRate: 'Completion Rate',
      quality: 'Quality Rating',
      impact: 'Impact',
      confidence: 'Confidence',
      actionability: 'Actionability',
      category: 'Category',
      excellent: 'Excellent',
      good: 'Good',
      average: 'Average',
      needs_improvement: 'Needs Improvement',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      immediate: 'Immediate',
      short_term: 'Short Term',
      long_term: 'Long Term',
      performance: 'Performance',
      code_quality: 'Code Quality',
      user_experience: 'User Experience',
      learning: 'Learning',
      strategy: 'Strategy',
      metrics: 'Key Metrics',
      recommendations: 'Recommendations',
      evidence: 'Evidence',
      viewDetails: 'View Details',
      totalOutputs: 'Total Outputs',
      avgQuality: 'Avg Quality',
      avgConfidence: 'Avg Confidence',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      addOutput: 'Add Output',
      title_placeholder: 'Enter title',
      description_placeholder: 'Enter description',
      link_placeholder: 'Enter link',
      content_placeholder: 'Enter content'
    }
  };

  const t = texts[language];

  // 编辑功能函数
  const handleDeleteMyOutput = (id: string) => {
    setMyOutputs(prev => prev.filter(output => output.id !== id));
  };

  const handleDeleteAIOutput = (id: string) => {
    setAIOutputs(prev => prev.filter(output => output.id !== id));
  };

  const handleEditMyOutput = (id: string, updatedOutput: Partial<MyOutput>) => {
    setMyOutputs(prev => prev.map(output => 
      output.id === id ? { ...output, ...updatedOutput } : output
    ));
    setEditingOutput(null);
  };

  const handleEditAIOutput = (id: string, updatedOutput: Partial<AIOutput>) => {
    setAIOutputs(prev => prev.map(output => 
      output.id === id ? { ...output, ...updatedOutput } : output
    ));
    setEditingOutput(null);
  };

  const handleAddMyOutput = () => {
    const newOutput: MyOutput = {
      id: `my-output-${Date.now()}`,
      type: 'code',
      title: '新输出项',
      description: '请输入描述',
      completionRate: 0,
      quality: 'average',
      impact: 'medium',
      link: '',
      screenshots: [],
      metrics: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMyOutputs(prev => [...prev, newOutput]);
    setEditingOutput(newOutput.id); // 立即进入编辑模式
  };

  const handleAddAIOutput = () => {
    const newOutput: AIOutput = {
      id: `ai-output-${Date.now()}`,
      type: 'analysis',
      title: '新AI输出项',
      description: '请输入描述',
      confidence: 80,
      actionability: 'short_term',
      category: 'learning',
      content: '请输入内容',
      evidence: [],
      recommendations: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAIOutputs(prev => [...prev, newOutput]);
    setEditingOutput(newOutput.id); // 立即进入编辑模式
  };

  // 根据目标生成我的输出数据
  const generateMyOutputsFromGoal = (goalTitle: string): MyOutput[] => {
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('动画') || lowerTitle.includes('animation')) {
      return [
        {
          id: 'my-output-1',
          type: 'demo',
          title: '流畅动画组件库',
          description: '开发了一套高性能的React动画组件库，支持多种动画效果',
          completionRate: 85,
          quality: 'good',
          impact: 'high',
          link: 'https://github.com/user/animation-lib',
          metrics: [
            { name: '组件数量', value: '12个', improvement: '+8个' },
            { name: '性能提升', value: '40%', improvement: '+40%' },
            { name: '包大小', value: '15KB', improvement: '-5KB' }
          ],
          createdAt: '2026-01-24'
        },
        {
          id: 'my-output-2',
          type: 'code',
          title: '动画性能优化方案',
          description: '实现了基于GPU加速的动画优化方案，显著提升了动画流畅度',
          completionRate: 90,
          quality: 'excellent',
          impact: 'high',
          metrics: [
            { name: '帧率提升', value: '60fps', improvement: '+15fps' },
            { name: 'CPU占用', value: '25%', improvement: '-20%' },
            { name: '内存优化', value: '30%', improvement: '-30%' }
          ],
          createdAt: '2026-01-23'
        },
        {
          id: 'my-output-3',
          type: 'article',
          title: 'React动画最佳实践指南',
          description: '撰写了一篇详细的React动画开发指南，涵盖性能优化和用户体验',
          completionRate: 75,
          quality: 'good',
          impact: 'medium',
          link: 'https://blog.example.com/react-animation-guide',
          metrics: [
            { name: '阅读量', value: '1.2K', improvement: '+1.2K' },
            { name: '点赞数', value: '89', improvement: '+89' },
            { name: '分享数', value: '23', improvement: '+23' }
          ],
          createdAt: '2026-01-22'
        }
      ];
    }
    
    return [
      {
        id: 'my-output-default',
        type: 'code',
        title: '项目实现',
        description: '完成了目标相关的核心功能实现',
        completionRate: 80,
        quality: 'good',
        impact: 'medium',
        metrics: [
          { name: '功能完成度', value: '80%', improvement: '+80%' }
        ],
        createdAt: '2026-01-24'
      }
    ];
  };

  // 根据目标生成AI输出数据
  const generateAIOutputsFromGoal = (goalTitle: string): AIOutput[] => {
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('动画') || lowerTitle.includes('animation')) {
      return [
        {
          id: 'ai-output-1',
          type: 'analysis',
          title: '动画性能瓶颈分析',
          description: 'AI分析了当前动画实现的性能瓶颈，识别出关键优化点',
          confidence: 92,
          actionability: 'immediate',
          category: 'performance',
          content: '通过分析动画执行过程，发现主要性能瓶颈在于频繁的DOM操作和不必要的重绘。建议使用transform和opacity属性进行动画，避免触发layout和paint。',
          evidence: [
            '检测到45%的动画使用了left/top属性',
            '发现12个动画未使用will-change优化',
            '识别出3个导致强制同步布局的代码段'
          ],
          recommendations: [
            '将position动画改为transform动画',
            '为动画元素添加will-change属性',
            '使用requestAnimationFrame优化动画时序',
            '实现动画对象池减少GC压力'
          ],
          createdAt: '2026-01-24'
        },
        {
          id: 'ai-output-2',
          type: 'optimization',
          title: '动画库架构优化建议',
          description: 'AI基于最佳实践提出了动画库架构的优化方案',
          confidence: 88,
          actionability: 'short_term',
          category: 'code_quality',
          content: '当前动画库架构存在耦合度较高的问题，建议采用插件化架构，将不同类型的动画效果解耦，提高可维护性和扩展性。',
          evidence: [
            '代码耦合度分析显示模块间依赖复杂',
            '扩展新动画类型需要修改核心代码',
            '单元测试覆盖率仅为65%'
          ],
          recommendations: [
            '重构为插件化架构',
            '实现动画效果的热插拔',
            '提升单元测试覆盖率至90%+',
            '添加TypeScript类型定义'
          ],
          createdAt: '2026-01-23'
        },
        {
          id: 'ai-output-3',
          type: 'insight',
          title: '用户体验优化洞察',
          description: 'AI分析用户交互数据，发现动画体验的改进机会',
          confidence: 85,
          actionability: 'long_term',
          category: 'user_experience',
          content: '用户数据显示，过长的动画时长会降低用户满意度，而适当的缓动函数能显著提升体验感知。建议根据用户设备性能动态调整动画参数。',
          evidence: [
            '用户停留时间与动画时长呈负相关',
            '85%用户偏好300ms以内的过渡动画',
            '低端设备用户跳出率高20%'
          ],
          recommendations: [
            '实现设备性能检测',
            '动态调整动画时长和复杂度',
            '提供动画开关选项',
            '优化低端设备的动画体验'
          ],
          createdAt: '2026-01-22'
        }
      ];
    }
    
    return [
      {
        id: 'ai-output-default',
        type: 'analysis',
        title: '学习进度分析',
        description: 'AI分析了当前的学习进度和效果',
        confidence: 80,
        actionability: 'immediate',
        category: 'learning',
        content: '基于学习数据分析，当前进度良好，建议继续保持学习节奏。',
        recommendations: [
          '保持当前学习强度',
          '增加实践项目比重'
        ],
        createdAt: '2026-01-24'
      }
    ];
  };

  const getTypeLabel = (type: string, isAI: boolean = false) => {
    if (isAI) {
      const aiTypeMap: { [key: string]: string } = {
        analysis: t.analysis,
        suggestion: t.suggestion,
        optimization: t.optimization,
        automation: t.automation,
        insight: t.insight
      };
      return aiTypeMap[type] || type;
    } else {
      const myTypeMap: { [key: string]: string } = {
        code: t.code,
        article: t.article,
        demo: t.demo,
        documentation: t.documentation,
        design: t.design
      };
      return myTypeMap[type] || type;
    }
  };

  const getQualityLabel = (quality: string) => {
    const qualityMap: { [key: string]: string } = {
      excellent: t.excellent,
      good: t.good,
      average: t.average,
      needs_improvement: t.needs_improvement
    };
    return qualityMap[quality] || quality;
  };

  const getImpactLabel = (impact: string) => {
    const impactMap: { [key: string]: string } = {
      high: t.high,
      medium: t.medium,
      low: t.low
    };
    return impactMap[impact] || impact;
  };

  const getActionabilityLabel = (actionability: string) => {
    const actionabilityMap: { [key: string]: string } = {
      immediate: t.immediate,
      short_term: t.short_term,
      long_term: t.long_term
    };
    return actionabilityMap[actionability] || actionability;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      performance: t.performance,
      code_quality: t.code_quality,
      user_experience: t.user_experience,
      learning: t.learning,
      strategy: t.strategy
    };
    return categoryMap[category] || category;
  };

  // 统计数据
  const totalMyOutputs = myOutputs.length;

  const totalAIOutputs = aiOutputs.length;
  return (
    <section className="output-section">
      <div className="section-header">
        <h3 className="section-title">{t.title}</h3>
        <p className="section-subtitle">{t.subtitle}</p>
      </div>

      {/* 输出类型切换 */}
      <div className="output-tabs">
        <button 
          className={`output-tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          {t.myOutput} ({totalMyOutputs})
        </button>
        <button 
          className={`output-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          {t.aiOutput} ({totalAIOutputs})
        </button>
      </div>

      {activeTab === 'my' && (
        <div className="my-outputs">

          {/* 我的输出列表 - Todo List 折叠展示 */}
          <div className="outputs-todo-list">
            {myOutputs.map((output) => (
              <details key={output.id} className={`output-todo-item my-output ${output.type}`}>
                <summary className="output-todo-summary">
                  <div className="todo-summary-content">
                    <div className="todo-checkbox">
                      <span className="checkbox-icon">✓</span>
                    </div>
                    <div className="todo-main-info">
                      <h4 className="output-title">{output.title}</h4>
                      <div className="output-meta">
                        <span className={`output-type ${output.type}`}>
                          {getTypeLabel(output.type)}
                        </span>
                        <span className={`output-quality ${output.quality}`}>
                          {getQualityLabel(output.quality)}
                        </span>
                        <div className="completion-rate">
                          <span className="completion-text">{output.completionRate}%</span>
                        </div>
                      </div>
                    </div>
                     <div className="flex">
                        <LandButton type='text' icon={ <Icon name="edit" />}  onClick={(e) => {
                          e.preventDefault();
                          setEditingOutput(output.id);
                        }}/>
                        <LandButton type='text' icon={<Icon name="delete" />}  onClick={(e) => {
                          e.preventDefault();
                          handleDeleteMyOutput(output.id);
                        }}/>
                    </div>
                    <div className="todo-expand-icon">
                      <Icon name='arrow' className='expand-arrow'/>
                    </div>
                  </div>
                </summary>
                
                <div className="output-details-expanded">
                  <p className="output-description">{output.description}</p>

                  <div className="completion-bar">
                    <div 
                      className="completion-fill"
                      style={{ width: `${output.completionRate}%` }}
                    ></div>
                  </div>

                  <div className="output-metrics">
                    <h5>{t.metrics}</h5>
                    <div className="metrics-grid">
                      {output.metrics.map((metric, index) => (
                        <div key={index} className="metric-item">
                          <span className="metric-name">{metric.name}</span>
                          <span className="metric-value">{metric.value}</span>
                          {metric.improvement && (
                            <span className="metric-improvement">{metric.improvement}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="output-footer">
                    <div className="output-impact">
                      <span className={`impact-badge ${output.impact}`}>
                        {getImpactLabel(output.impact)}
                      </span>
                    </div>
                    <div className="output-date">{output.createdAt}</div>
                    {output.link && (
                      <a href={output.link} target="_blank" rel="noopener noreferrer" className="output-link">
                        {t.viewDetails}
                      </a>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* 添加新输出按钮 */}
          <div className="add-output-section mt-4">
            <LandButton 
                          onClick={handleAddMyOutput}
                          icon={<Icon name="add" />}
                          text={t.addOutput}
                        >
                        </LandButton>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="ai-outputs">

          {/* AI输出列表 - Todo List 折叠展示 */}
          <div className="outputs-todo-list">
            {aiOutputs.map((output) => (
              <details key={output.id} className={`output-todo-item ai-output ${output.type}`}>
                <summary className="output-todo-summary">
                  <div className="todo-summary-content">
                    <div className="todo-checkbox ai-checkbox">
                      <span className="checkbox-icon">🤖</span>
                    </div>
                    <div className="todo-main-info">
                      <h4 className="output-title">{output.title}</h4>
                      <div className="output-meta">
                        <span className={`output-type ${output.type}`}>
                          {getTypeLabel(output.type, true)}
                        </span>
                        <span className={`output-category ${output.category}`}>
                          {getCategoryLabel(output.category)}
                        </span>
                        <div className="confidence-score">
                          <span className="confidence-text">{output.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingOutput(output.id);
                        }}
                        title={t.edit}
                      >
                        <Icon name="edit" />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAIOutput(output.id);
                        }}
                        title={t.delete}
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                    <div className="todo-expand-icon">
                        <Icon name='arrow' className='expand-arrow'/>
                    </div>
                  </div>
                </summary>
                
                <div className="output-details-expanded">
                  <p className="output-description">{output.description}</p>
                  <p className="output-content">{output.content}</p>

                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${output.confidence}%` }}
                    ></div>
                  </div>

                  {output.evidence && output.evidence.length > 0 && (
                    <div className="output-evidence">
                      <h5>{t.evidence}</h5>
                      <ul className="evidence-list">
                        {output.evidence.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="output-recommendations">
                    <h5>{t.recommendations}</h5>
                    <ul className="recommendations-list">
                      {output.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="output-footer">
                    <div className="output-actionability">
                      <span className={`actionability-badge ${output.actionability}`}>
                        {getActionabilityLabel(output.actionability)}
                      </span>
                    </div>
                    <div className="output-date">{output.createdAt}</div>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* 添加新AI输出按钮 */}
          <div className="add-output-section">
            <button 
              className="btn btn-primary add-output-btn"
              onClick={handleAddAIOutput}
            >
              <Icon name="plus" />
              {t.addOutput}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OutputSection;