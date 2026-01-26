import { Icon, LandButton } from '@suminhan/land-design';
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

interface AIInput {
  id: string;
  type: 'analysis' | 'suggestion' | 'generation' | 'optimization' | 'guidance';
  title: string;
  description: string;
  timeSpent: number; // 分钟
  confidence: number; // 0-100
  helpfulness: 'very_helpful' | 'helpful' | 'somewhat_helpful' | 'not_helpful';
  source: string;
  content: string;
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
  const [activeTab, setActiveTab] = useState<'my' | 'ai'>('my');
  const [myInputs, setMyInputs] = useState<LearningInput[]>([]);
  const [aiInputs, setAIInputs] = useState<AIInput[]>([]);
  const [editingInput, setEditingInput] = useState<string | null>(null);

  // 初始化数据
  React.useEffect(() => {
    setMyInputs(generateMyInputsFromGoal(goalTitle));
    setAIInputs(generateAIInputsFromGoal(goalTitle));
  }, [goalTitle]);

  const texts = {
    zh: {
      title: '输入',
      subtitle: '记录学习过程中的所有输入和投入',
      myInput: '我的输入',
      aiInput: 'AI输入',
      all: '全部',
      resource: '学习资源',
      practice: '实践练习',
      research: '研究调研',
      experiment: '实验探索',
      analysis: 'AI分析',
      suggestion: 'AI建议',
      generation: 'AI生成',
      optimization: 'AI优化',
      guidance: 'AI指导',
      timeSpent: '投入时间',
      difficulty: '难度',
      confidence: '置信度',
      helpfulness: '有用程度',
      source: '来源',
      notes: '笔记',
      content: '内容',
      tags: '标签',
      easy: '简单',
      medium: '中等',
      hard: '困难',
      very_helpful: '非常有用',
      helpful: '有用',
      somewhat_helpful: '一般有用',
      not_helpful: '不太有用',
      minutes: '分钟',
      hours: '小时',
      totalTime: '总投入时间',
      inputCount: '输入数量',
      avgDifficulty: '平均难度',
      avgConfidence: '平均置信度',
      addInput: '添加输入',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',
      title_placeholder: '请输入标题',
      description_placeholder: '请输入描述',
      source_placeholder: '请输入来源',
      notes_placeholder: '请输入笔记',
      content_placeholder: '请输入内容',
      tags_placeholder: '请输入标签，用逗号分隔'
    },
    en: {
      title: 'Input',
      subtitle: 'Record all inputs and investments in the learning process',
      myInput: 'My Input',
      aiInput: 'AI Input',
      all: 'All',
      resource: 'Resources',
      practice: 'Practice',
      research: 'Research',
      experiment: 'Experiment',
      analysis: 'AI Analysis',
      suggestion: 'AI Suggestion',
      generation: 'AI Generation',
      optimization: 'AI Optimization',
      guidance: 'AI Guidance',
      timeSpent: 'Time Spent',
      difficulty: 'Difficulty',
      confidence: 'Confidence',
      helpfulness: 'Helpfulness',
      source: 'Source',
      notes: 'Notes',
      content: 'Content',
      tags: 'Tags',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      very_helpful: 'Very Helpful',
      helpful: 'Helpful',
      somewhat_helpful: 'Somewhat Helpful',
      not_helpful: 'Not Helpful',
      minutes: 'minutes',
      hours: 'hours',
      totalTime: 'Total Time',
      inputCount: 'Input Count',
      avgDifficulty: 'Avg Difficulty',
      avgConfidence: 'Avg Confidence',
      addInput: 'Add Input',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      title_placeholder: 'Enter title',
      description_placeholder: 'Enter description',
      source_placeholder: 'Enter source',
      notes_placeholder: 'Enter notes',
      content_placeholder: 'Enter content',
      tags_placeholder: 'Enter tags, separated by commas'
    }
  };

  const t = texts[language];

  // 编辑功能函数
  const handleDeleteMyInput = (id: string) => {
    setMyInputs(prev => prev.filter(input => input.id !== id));
  };

  const handleDeleteAIInput = (id: string) => {
    setAIInputs(prev => prev.filter(input => input.id !== id));
  };

  const handleEditMyInput = (id: string, updatedInput: Partial<LearningInput>) => {
    setMyInputs(prev => prev.map(input => 
      input.id === id ? { ...input, ...updatedInput } : input
    ));
    setEditingInput(null);
  };

  const handleEditAIInput = (id: string, updatedInput: Partial<AIInput>) => {
    setAIInputs(prev => prev.map(input => 
      input.id === id ? { ...input, ...updatedInput } : input
    ));
    setEditingInput(null);
  };

  const handleAddMyInput = () => {
    const newInput: LearningInput = {
      id: `input-${Date.now()}`,
      type: 'resource',
      title: '新输入项',
      description: '请输入描述',
      timeSpent: 60,
      difficulty: 'medium',
      source: '请输入来源',
      notes: '',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMyInputs(prev => [...prev, newInput]);
    setEditingInput(newInput.id); // 立即进入编辑模式
  };

  const handleAddAIInput = () => {
    const newInput: AIInput = {
      id: `ai-input-${Date.now()}`,
      type: 'guidance',
      title: '新AI输入项',
      description: '请输入描述',
      timeSpent: 30,
      confidence: 80,
      helpfulness: 'helpful',
      source: '请输入来源',
      content: '请输入内容',
      tags: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAIInputs(prev => [...prev, newInput]);
    setEditingInput(newInput.id); // 立即进入编辑模式
  };

  // 根据目标生成我的学习输入数据
  const generateMyInputsFromGoal = (goalTitle: string): LearningInput[] => {
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

  // 根据目标生成AI输入数据
  const generateAIInputsFromGoal = (goalTitle: string): AIInput[] => {
    const lowerTitle = goalTitle.toLowerCase();
    
    if (lowerTitle.includes('动画') || lowerTitle.includes('animation')) {
      return [
        {
          id: 'ai-input-1',
          type: 'generation',
          title: 'AI辅助动画代码生成',
          description: '使用AI工具帮助生成复杂的CSS动画代码和优化建议',
          timeSpent: 45,
          confidence: 85,
          helpfulness: 'very_helpful',
          source: 'Claude AI',
          content: 'AI提供了完整的CSS动画代码模板，包括关键帧定义、性能优化建议和浏览器兼容性处理方案',
          tags: ['AI辅助', 'CSS动画', '代码生成'],
          createdAt: '2026-01-25'
        },
        {
          id: 'ai-input-2',
          type: 'guidance',
          title: 'AI动画效果设计咨询',
          description: '与AI讨论动画的用户体验设计和交互逻辑',
          timeSpent: 60,
          confidence: 78,
          helpfulness: 'helpful',
          source: 'ChatGPT',
          content: 'AI从UX角度分析了动画的必要性和时长设置，提供了基于用户心理学的动画设计原则',
          tags: ['AI咨询', 'UX设计', '交互设计'],
          createdAt: '2026-01-26'
        },
        {
          id: 'ai-input-3',
          type: 'optimization',
          title: 'AI性能优化建议',
          description: 'AI分析现有动画代码并提供性能优化方案',
          timeSpent: 30,
          confidence: 92,
          helpfulness: 'very_helpful',
          source: 'GitHub Copilot',
          content: 'AI识别了代码中的性能瓶颈，建议使用transform3d和will-change属性，并提供了具体的重构方案',
          tags: ['AI优化', '性能分析', '代码重构'],
          createdAt: '2026-01-27'
        }
      ];
    }
    
    // 默认通用AI输入
    return [
      {
        id: 'ai-input-default-1',
        type: 'guidance',
        title: 'AI学习路径指导',
        description: 'AI提供个性化的学习路径和方法建议',
        timeSpent: 30,
        confidence: 80,
        helpfulness: 'helpful',
        source: 'AI助手',
        content: 'AI根据学习目标制定了详细的学习计划，包括学习顺序、重点难点和实践建议',
        tags: ['AI指导', '学习计划'],
        createdAt: '2026-01-22'
      },
      {
        id: 'ai-input-default-2',
        type: 'analysis',
        title: 'AI知识点分析',
        description: 'AI深入分析复杂概念并提供易懂的解释',
        timeSpent: 25,
        confidence: 88,
        helpfulness: 'very_helpful',
        source: 'AI助手',
        content: 'AI将复杂的技术概念拆解为易理解的部分，并提供了丰富的类比和实例',
        tags: ['AI分析', '概念解释'],
        createdAt: '2026-01-23'
      }
    ];
  };

  const getMyTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      resource: t.resource,
      practice: t.practice,
      research: t.research,
      experiment: t.experiment
    };
    return typeMap[type] || type;
  };

  const getAITypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      analysis: t.analysis,
      suggestion: t.suggestion,
      generation: t.generation,
      optimization: t.optimization,
      guidance: t.guidance
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

  const getHelpfulnessLabel = (helpfulness: string) => {
    const helpfulnessMap: { [key: string]: string } = {
      very_helpful: t.very_helpful,
      helpful: t.helpful,
      somewhat_helpful: t.somewhat_helpful,
      not_helpful: t.not_helpful
    };
    return helpfulnessMap[helpfulness] || helpfulness;
  };

  const getHelpfulnessColor = (helpfulness: string) => {
    const colorMap: { [key: string]: string } = {
      very_helpful: 'success',
      helpful: 'primary',
      somewhat_helpful: 'warning',
      not_helpful: 'danger'
    };
    return colorMap[helpfulness] || 'default';
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

  // 统计数据
  const totalMyTime = myInputs.reduce((sum, input) => sum + input.timeSpent, 0);
  const totalAITime = aiInputs.reduce((sum, input) => sum + input.timeSpent, 0);
  
  const myInputCount = myInputs.length;
  const aiInputCount = aiInputs.length;
  
  const avgDifficulty = myInputs.reduce((sum, input) => {
    const difficultyScore = input.difficulty === 'easy' ? 1 : input.difficulty === 'medium' ? 2 : 3;
    return sum + difficultyScore;
  }, 0) / (myInputs.length || 1);

  const avgConfidence = aiInputs.reduce((sum, input) => sum + input.confidence, 0) / (aiInputs.length || 1);

  // 编辑表单组件
  const EditMyInputForm: React.FC<{ input: LearningInput; onSave: (input: Partial<LearningInput>) => void; onCancel: () => void }> = ({ input, onSave, onCancel }) => {
    const [formData, setFormData] = useState(input);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="edit-input-form">
        <div className="form-row">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={t.title_placeholder}
            className="form-input"
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as LearningInput['type'] })}
            className="form-select"
          >
            <option value="resource">{t.resource}</option>
            <option value="practice">{t.practice}</option>
            <option value="research">{t.research}</option>
            <option value="experiment">{t.experiment}</option>
          </select>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t.description_placeholder}
          className="form-textarea"
          required
        />
        <div className="form-row">
          <input
            type="number"
            value={formData.timeSpent}
            onChange={(e) => setFormData({ ...formData, timeSpent: parseInt(e.target.value) })}
            placeholder={t.timeSpent}
            className="form-input"
            min="1"
            required
          />
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as LearningInput['difficulty'] })}
            className="form-select"
          >
            <option value="easy">{t.easy}</option>
            <option value="medium">{t.medium}</option>
            <option value="hard">{t.hard}</option>
          </select>
        </div>
        <input
          type="text"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          placeholder={t.source_placeholder}
          className="form-input"
          required
        />
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t.notes_placeholder}
          className="form-textarea"
        />
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          placeholder={t.tags_placeholder}
          className="form-input"
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{t.save}</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">{t.cancel}</button>
        </div>
      </form>
    );
  };

  const EditAIInputForm: React.FC<{ input: AIInput; onSave: (input: Partial<AIInput>) => void; onCancel: () => void }> = ({ input, onSave, onCancel }) => {
    const [formData, setFormData] = useState(input);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="edit-input-form">
        <div className="form-row">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder={t.title_placeholder}
            className="form-input"
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as AIInput['type'] })}
            className="form-select"
          >
            <option value="analysis">{t.analysis}</option>
            <option value="suggestion">{t.suggestion}</option>
            <option value="generation">{t.generation}</option>
            <option value="optimization">{t.optimization}</option>
            <option value="guidance">{t.guidance}</option>
          </select>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t.description_placeholder}
          className="form-textarea"
          required
        />
        <div className="form-row">
          <input
            type="number"
            value={formData.timeSpent}
            onChange={(e) => setFormData({ ...formData, timeSpent: parseInt(e.target.value) })}
            placeholder={t.timeSpent}
            className="form-input"
            min="1"
            required
          />
          <input
            type="number"
            value={formData.confidence}
            onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
            placeholder={t.confidence}
            className="form-input"
            min="0"
            max="100"
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder={t.source_placeholder}
            className="form-input"
            required
          />
          <select
            value={formData.helpfulness}
            onChange={(e) => setFormData({ ...formData, helpfulness: e.target.value as AIInput['helpfulness'] })}
            className="form-select"
          >
            <option value="very_helpful">{t.very_helpful}</option>
            <option value="helpful">{t.helpful}</option>
            <option value="somewhat_helpful">{t.somewhat_helpful}</option>
            <option value="not_helpful">{t.not_helpful}</option>
          </select>
        </div>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder={t.content_placeholder}
          className="form-textarea"
          required
        />
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          placeholder={t.tags_placeholder}
          className="form-input"
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{t.save}</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">{t.cancel}</button>
        </div>
      </form>
    );
  };

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

      {/* 输入类型切换 */}
      <div className="input-tabs">
        <button 
          className={`input-tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          {t.myInput} ({myInputCount})
        </button>
        <button 
          className={`input-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          {t.aiInput} ({aiInputCount})
        </button>
      </div>

      {activeTab === 'my' && (
        <div className="my-inputs">
          {/* 统计概览 */}
          <div className="input-stats">
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <span className="stat-label">{t.totalTime}</span>
                <span className="stat-value">{formatTime(totalMyTime)}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-label">{t.inputCount}</span>
                <span className="stat-value">{myInputCount}</span>
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

          {/* 我的输入列表 - Todo List 折叠展示 */}
          <div className="inputs-todo-list">
            {myInputs.map((input) => (
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
                          {getMyTypeLabel(input.type)}
                        </span>
                        <span className={`input-difficulty ${getDifficultyColor(input.difficulty)}`}>
                          {getDifficultyLabel(input.difficulty)}
                        </span>
                        <span className="input-time">{formatTime(input.timeSpent)}</span>
                      </div>
                    </div>
                    <div className="flex">
                        <LandButton type='text' icon={ <Icon name="edit" />}  onClick={(e) => {
                          e.preventDefault();
                          setEditingInput(input.id);
                        }}/>
                        <LandButton type='text' icon={<Icon name="delete" />}  onClick={(e) => {
                          e.preventDefault();
                          handleDeleteMyInput(input.id);
                        }}/>
                    </div>
                    <div className="todo-expand-icon">
                      <Icon name='arrow' className='expand-arrow'/>
                    </div>
                  </div>
                </summary>
                
                <div className="input-details-expanded">
                  {editingInput === input.id ? (
                    <EditMyInputForm
                      input={input}
                      onSave={(updatedInput) => handleEditMyInput(input.id, updatedInput)}
                      onCancel={() => setEditingInput(null)}
                    />
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </details>
            ))}
          </div>

          {/* 添加新输入按钮 */}
          <div className="add-input-section mt-4">
            <LandButton 
              onClick={handleAddMyInput}
              icon={<Icon name="add" />}
              text={t.addInput}
            >
            </LandButton>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="ai-inputs">
          {/* AI输入统计概览 */}
          <div className="input-stats">
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <span className="stat-label">{t.totalTime}</span>
                <span className="stat-value">{formatTime(totalAITime)}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🤖</div>
              <div className="stat-content">
                <span className="stat-label">{t.inputCount}</span>
                <span className="stat-value">{aiInputCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <span className="stat-label">{t.avgConfidence}</span>
                <span className="stat-value">{Math.round(avgConfidence)}%</span>
              </div>
            </div>
          </div>

          {/* AI输入列表 - Todo List 折叠展示 */}
          <div className="inputs-todo-list">
            {aiInputs.map((input) => (
              <details key={input.id} className={`input-todo-item ai-input ${input.type}`}>
                <summary className="input-todo-summary">
                  <div className="todo-summary-content">
                    <div className="todo-checkbox">
                      <span className="checkbox-icon">🤖</span>
                    </div>
                    <div className="todo-main-info">
                      <h4 className="input-title">{input.title}</h4>
                      <div className="input-meta">
                        <span className={`input-type ${input.type}`}>
                          {getAITypeLabel(input.type)}
                        </span>
                        <span className={`input-helpfulness ${getHelpfulnessColor(input.helpfulness)}`}>
                          {getHelpfulnessLabel(input.helpfulness)}
                        </span>
                        <span className="input-confidence">{input.confidence}%</span>
                        <span className="input-time">{formatTime(input.timeSpent)}</span>
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setEditingInput(input.id);
                        }}
                        title={t.edit}
                      >
                        <Icon name="edit" />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAIInput(input.id);
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
                
                <div className="input-details-expanded">
                  {editingInput === input.id ? (
                    <EditAIInputForm
                      input={input}
                      onSave={(updatedInput) => handleEditAIInput(input.id, updatedInput)}
                      onCancel={() => setEditingInput(null)}
                    />
                  ) : (
                    <>
                      <p className="input-description">{input.description}</p>

                      <div className="input-details">
                        <div className="input-source">
                          <span className="detail-label">{t.source}:</span>
                          <span className="detail-value">{input.source}</span>
                        </div>
                        
                        <div className="input-content">
                          <span className="detail-label">{t.content}:</span>
                          <p className="content-text">{input.content}</p>
                        </div>

                        <div className="input-tags">
                          {input.tags.map((tag, index) => (
                            <span key={index} className="input-tag ai-tag">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="input-date">
                          {input.createdAt}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </details>
            ))}
          </div>

          {/* 添加新AI输入按钮 */}
          <div className="add-input-section">
            <button 
              className="btn btn-primary add-input-btn"
              onClick={handleAddAIInput}
            >
              <Icon name="plus" />
              {t.addInput}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default InputSection;