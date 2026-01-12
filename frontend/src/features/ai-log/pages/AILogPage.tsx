import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import BackButton from '../../../shared/components/BackButton';
import type { AILogEntry } from '../../../shared/types';
import {
  KnowledgeSkillsSection,
  LearningPlanSection,
  AILearningSection,
  SummarySection
} from '../components';
import '../styles/AILogPage.scss';

const AILogPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentTheme } = useTheme();
  const [currentLog, setCurrentLog] = useState<AILogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // 模拟数据 - 实际项目中应该从API获取
  const mockAILog: AILogEntry = {
    id: '2026-w02',
    period: '2026年第2周',
    periodType: 'weekly',
    createdAt: '2026-01-12',
    knowledgeSkills: [
      {
        id: 'react-advanced',
        name: 'React高级特性',
        category: 'technical',
        level: 85,
        description: '深入理解React Hooks、Context、性能优化等高级特性',
        lastUpdated: '2026-01-12',
        relatedLinks: ['https://react.dev/learn']
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        category: 'technical',
        level: 78,
        description: '类型系统、泛型、高级类型等TypeScript核心概念',
        lastUpdated: '2026-01-10',
        relatedLinks: ['https://www.typescriptlang.org/docs/']
      },
      {
        id: 'system-design',
        name: '系统设计',
        category: 'domain',
        level: 65,
        description: '分布式系统、微服务架构、数据库设计等系统设计能力',
        lastUpdated: '2026-01-08',
      }
    ],
    skillsGrowth: {
      newSkills: ['React Server Components', 'Vite插件开发'],
      improvedSkills: ['TypeScript泛型', '性能优化'],
      totalSkillsCount: 24,
      averageSkillLevel: 76
    },
    learningPlan: {
      authorTasks: [
        {
          id: 'task-1',
          title: '撰写React性能优化实践文章',
          description: '基于个人网站开发经验，总结React性能优化的最佳实践，包括组件优化、状态管理等',
          type: 'author',
          priority: 'high',
          estimatedTime: '2天',
          status: 'in_progress',
          deadline: '2026-01-15',
          resources: ['React官方文档', '性能优化案例'],
          createdAt: '2026-01-12'
        },
        {
          id: 'task-2',
          title: '开发3D交互式作品展示',
          description: '使用Three.js创建一个交互式3D作品展示页面，提升Crafts页面的视觉效果',
          type: 'author',
          priority: 'medium',
          estimatedTime: '1周',
          status: 'pending',
          deadline: '2026-01-20',
          resources: ['Three.js文档', 'WebGL教程'],
          createdAt: '2026-01-12'
        },
        {
          id: 'task-3',
          title: '完善个人网站SEO优化',
          description: '优化网站的SEO设置，提升文章和作品的搜索引擎可见性',
          type: 'author',
          priority: 'medium',
          estimatedTime: '3天',
          status: 'pending',
          deadline: '2026-01-18',
          resources: ['SEO最佳实践', 'React SEO指南'],
          createdAt: '2026-01-12'
        }
      ],
      aiTasks: [
        {
          id: 'ai-task-1',
          title: '自动生成文章摘要和标签',
          description: 'AI自动分析新发布的文章内容，生成合适的摘要和相关标签',
          type: 'ai',
          priority: 'medium',
          estimatedTime: '持续进行',
          status: 'in_progress',
          createdAt: '2026-01-12'
        },
        {
          id: 'ai-task-2',
          title: '智能推荐相关作品',
          description: 'AI根据用户浏览历史和作品特征，智能推荐相关的Crafts作品',
          type: 'ai',
          priority: 'low',
          estimatedTime: '每日',
          status: 'pending',
          createdAt: '2026-01-12'
        },
        {
          id: 'ai-task-3',
          title: '内容质量自动评估',
          description: 'AI定期评估文章和作品的质量，提供改进建议',
          type: 'ai',
          priority: 'low',
          estimatedTime: '每周',
          status: 'pending',
          createdAt: '2026-01-12'
        }
      ],
      goals: [
        '提升网站内容质量和用户体验',
        '扩展作品集的技术广度和深度',
        '建立个人技术品牌影响力'
      ],
      focus: ['前端技术深度', '用户体验设计', '内容创作能力']
    },
    aiLearning: {
      completedTasks: [
        {
          id: 'completed-1',
          title: '分析网站用户行为数据',
          description: 'AI已完成对网站访问数据的分析，识别出用户最感兴趣的内容类型',
          type: 'ai',
          priority: 'medium',
          estimatedTime: '1天',
          status: 'completed',
          createdAt: '2026-01-10',
          completedAt: '2026-01-11'
        }
      ],
      newKnowledge: [
        '用户更偏好交互式的Crafts作品展示',
        '技术类文章的阅读时长普遍较高',
        'React和TypeScript相关内容最受欢迎',
        '移动端访问占比达到65%'
      ],
      suggestions: [
        '建议在Crafts页面增加更多交互式元素',
        '可以考虑开设React进阶技术专栏',
        '优化移动端的文章阅读体验',
        '增加代码示例的可交互性'
      ],
      nextPeriodRecommendations: [
        '开发WebGL相关的创意作品',
        '撰写前端性能优化系列文章',
        '探索AI辅助的内容创作工具',
        '建立技术分享的视频内容'
      ]
    },
    summary: {
      achievements: [
        '成功发布了2篇高质量技术文章',
        '完成了3个创新性的Crafts作品',
        '网站整体用户体验得到显著提升',
        '建立了完整的AI学习日志系统'
      ],
      challenges: [
        '平衡内容创作与技术开发的时间分配',
        '提升3D图形编程的专业技能',
        '扩大个人技术影响力的传播渠道'
      ],
      insights: [
        '高质量的内容比数量更重要',
        '用户体验细节决定网站的专业度',
        'AI工具能有效提升内容创作效率',
        '技术深度与表达能力同样重要'
      ],
      nextSteps: [
        '发布React性能优化实践文章',
        '开发下一个3D交互作品',
        '优化网站的SEO和可访问性',
        '规划技术分享的内容策略'
      ]
    }
  };

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setCurrentLog(mockAILog);
      setIsLoading(false);
    }, 500);
  }, []);

  const texts = {
    zh: {
      title: '日志',
      subtitle: '记录成长轨迹，规划学习路径',
      currentPeriod: '当前周期',
      history: '历史记录',
      loading: '加载中...',
      noData: '暂无数据',
      period: '周期',
      lastUpdated: '最后更新'
    },
    en: {
      title: 'AI Learning Log',
      subtitle: 'Track Growth, Plan Learning Path',
      currentPeriod: 'Current Period',
      history: 'History',
      loading: 'Loading...',
      noData: 'No Data',
      period: 'Period',
      lastUpdated: 'Last Updated'
    }
  };

  const t = texts[language];

  if (isLoading) {
    return (
      <div className={`ai-log-page ${currentTheme}`}>
        <div className="ai-log-container">
          <BackButton />
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-log-page ${currentTheme}`}>
      <div className="ai-log-container">
        <BackButton />
        
        <header className="ai-log-header">
          <h1 className="ai-log-title">{t.title}</h1>
          <p className="ai-log-subtitle">{t.subtitle}</p>
          
          <div className="period-tabs">
            <button 
              className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              {t.currentPeriod}
            </button>
            <button 
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              {t.history}
            </button>
          </div>
        </header>

        {activeTab === 'current' && currentLog && (
          <div className="ai-log-content">
            <div className="period-info">
              <h2>{currentLog.period}</h2>
              <span className="last-updated">
                {t.lastUpdated}: {currentLog.createdAt}
              </span>
            </div>

            <div className="log-sections">
              <KnowledgeSkillsSection 
                skills={currentLog.knowledgeSkills}
                growth={currentLog.skillsGrowth}
                language={language}
                theme={currentTheme}
              />
              
              <LearningPlanSection 
                plan={currentLog.learningPlan}
                language={language}
                theme={currentTheme}
              />
              
              <AILearningSection 
                aiLearning={currentLog.aiLearning}
                language={language}
                theme={currentTheme}
              />
              
              <SummarySection 
                summary={currentLog.summary}
                language={language}
                theme={currentTheme}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="ai-log-content">
            <div className="history-placeholder">
              <p>{t.noData}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILogPage;