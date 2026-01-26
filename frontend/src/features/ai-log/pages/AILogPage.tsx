import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import BackButton from '../../../shared/components/BackButton';
import { LandButton } from '@suminhan/land-design';
import type { Goal, AILogEntry } from '../../../shared/types';
import {
  InputSection,
  OutputSection,
  ReflectionSection,
  GoalCreator,
  GoalStatus
} from '../components';
import '../styles/AILogPage.scss';
import '../styles/NewSections.scss';

const AILogPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentTheme } = useTheme();
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [currentLog, setCurrentLog] = useState<AILogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // 从localStorage加载当前目标
  useEffect(() => {
    const loadCurrentGoal = () => {
      const savedGoal = localStorage.getItem('currentGoal');
      if (savedGoal) {
        try {
          const goal = JSON.parse(savedGoal) as Goal;
          setCurrentGoal(goal);
          
          // 如果目标是活跃状态，加载对应的日志数据
          if (goal.status === 'active') {
            loadGoalLog(goal.id);
          }
        } catch (error) {
          console.error('Failed to load current goal:', error);
        }
      }
      setIsLoading(false);
    };

    loadCurrentGoal();
  }, []);

  // 加载目标对应的日志数据
  const loadGoalLog = (goalId: string) => {
    // 这里应该从API加载，现在使用模拟数据
    setTimeout(() => {
      const mockLog = generateMockLogForGoal(goalId);
      setCurrentLog(mockLog);
    }, 500);
  };

  // 生成模拟日志数据
  const generateMockLogForGoal = (goalId: string): AILogEntry => {
    return {
      id: `log-${goalId}-${Date.now()}`,
      goalId,
      goal: currentGoal!,
      createdAt: new Date().toISOString(),
      period: currentGoal?.title || '',
      periodType: 'weekly' as const,
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
            description: '基于个人网站开发经验，总结React性能优化的最佳实践',
            type: 'author',
            priority: 'high',
            estimatedTime: '2天',
            status: 'in_progress',
            deadline: '2026-01-15',
            resources: ['React官方文档', '性能优化案例'],
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
          }
        ],
        goals: [
          '提升网站内容质量和用户体验',
          '扩展作品集的技术广度和深度'
        ],
        focus: ['前端技术深度', '用户体验设计', '内容创作能力']
      },
      aiLearning: {
        completedTasks: [],
        newKnowledge: [
          '用户更偏好交互式的Crafts作品展示',
          'React和TypeScript相关内容最受欢迎'
        ],
        suggestions: [
          '建议在Crafts页面增加更多交互式元素',
          '可以考虑开设React进阶技术专栏'
        ],
        nextPeriodRecommendations: [
          '开发WebGL相关的创意作品',
          '撰写前端性能优化系列文章'
        ]
      },
      summary: {
        achievements: [
          '成功发布了2篇高质量技术文章',
          '完成了3个创新性的Crafts作品'
        ],
        challenges: [
          '平衡内容创作与技术开发的时间分配',
          '提升3D图形编程的专业技能'
        ],
        insights: [
          '高质量的内容比数量更重要',
          '用户体验细节决定网站的专业度'
        ],
        nextSteps: [
          '发布React性能优化实践文章',
          '开发下一个3D交互作品'
        ]
      }
    };
  };

  // 创建新目标
  const handleCreateGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      status: 'planning', // 创建时默认为规划状态
      progress: 0,
      totalPausedDuration: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentGoal(newGoal);
    localStorage.setItem('currentGoal', JSON.stringify(newGoal));
    setShowGoalCreator(false);
  };

  // 开始目标 - 正式进入周期
  const handleStartGoal = () => {
    if (!currentGoal) return;

    const now = new Date().toISOString();
    const updatedGoal = {
      ...currentGoal,
      status: 'active' as const,
      actualStartDate: currentGoal.actualStartDate || now, // 首次开始时设置实际开始时间
      pausedAt: undefined, // 清除暂停时间
      updatedAt: now
    };

    setCurrentGoal(updatedGoal);
    localStorage.setItem('currentGoal', JSON.stringify(updatedGoal));
    
    // 加载日志数据
    loadGoalLog(updatedGoal.id);
  };

  // 完成目标
  const handleCompleteGoal = () => {
    if (!currentGoal) return;

    const completedGoal = {
      ...currentGoal,
      status: 'completed' as const,
      progress: 100,
      updatedAt: new Date().toISOString()
    };

    // 保存到历史记录
    const history = JSON.parse(localStorage.getItem('goalHistory') || '[]');
    history.unshift({ goal: completedGoal, log: currentLog });
    localStorage.setItem('goalHistory', JSON.stringify(history));

    // 清除当前目标
    setCurrentGoal(null);
    setCurrentLog(null);
    localStorage.removeItem('currentGoal');
  };

  // 暂停目标 - 记录暂停时间
  const handlePauseGoal = () => {
    if (!currentGoal) return;

    const now = new Date().toISOString();
    const pausedGoal = {
      ...currentGoal,
      status: 'paused' as const,
      pausedAt: now,
      updatedAt: now
    };

    setCurrentGoal(pausedGoal);
    localStorage.setItem('currentGoal', JSON.stringify(pausedGoal));
  };

  // 恢复目标 - 计算暂停时长并重新开始
  const handleResumeGoal = () => {
    if (!currentGoal || !currentGoal.pausedAt) return;

    const now = new Date();
    const pausedTime = new Date(currentGoal.pausedAt);
    const pausedDuration = now.getTime() - pausedTime.getTime();
    
    const resumedGoal = {
      ...currentGoal,
      status: 'active' as const,
      pausedAt: undefined,
      totalPausedDuration: (currentGoal.totalPausedDuration || 0) + pausedDuration,
      updatedAt: now.toISOString()
    };

    setCurrentGoal(resumedGoal);
    localStorage.setItem('currentGoal', JSON.stringify(resumedGoal));
    
    // 重新加载日志数据
    loadGoalLog(resumedGoal.id);
  };

  // 编辑目标
  const handleEditGoal = () => {
    setEditingGoal(currentGoal);
    setShowGoalCreator(true);
  };

  const texts = {
    zh: {
      title: '目标日志',
      subtitle: '设定目标，追踪成长，记录学习轨迹',
      currentGoal: '当前目标',
      history: '历史记录',
      loading: '加载中...',
      noData: '暂无数据',
      noGoal: '还没有设定目标',
      createGoal: '创建新目标',
      goalDescription: '设定一个明确的学习或成长目标，系统将帮助你追踪进度并记录学习过程。'
    },
    en: {
      title: 'Goal Log',
      subtitle: 'Set Goals, Track Growth, Record Learning Journey',
      currentGoal: 'Current Goal',
      history: 'History',
      loading: 'Loading...',
      noData: 'No Data',
      noGoal: 'No Goal Set',
      createGoal: 'Create New Goal',
      goalDescription: 'Set a clear learning or growth goal, and the system will help you track progress and record your learning journey.'
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
      <header className="articles-header">
        <div className="header-content">
          <BackButton to="/" />
        </div>
      </header>
      <div className="ai-log-container">
        
        <header className="ai-log-header">
          <h1 className="ai-log-title">{t.title}</h1>
          <p className="ai-log-subtitle">{t.subtitle}</p>
          
          <div className="period-tabs">
            <button 
              className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              {t.currentGoal}
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              {t.history}
            </button>
          </div>
        </header>

        {activeTab === 'current' && (
          <div className="ai-log-content">
            {!currentGoal ? (
              // 没有目标时显示创建界面
              <div className="no-goal-state">
                <div className="no-goal-content">
                  <h3>{t.noGoal}</h3>
                  <p>{t.goalDescription}</p>
                  <LandButton
                    text={t.createGoal}
                    type="background"
                    onClick={() => setShowGoalCreator(true)}
                  />
                </div>
              </div>
            ) : (
              // 有目标时显示目标状态和日志内容
              <>
                <GoalStatus
                  goal={currentGoal}
                  onEdit={handleEditGoal}
                  onStart={handleStartGoal}
                  onComplete={handleCompleteGoal}
                  onPause={handlePauseGoal}
                  onResume={handleResumeGoal}
                />

                {currentGoal.status === 'active' && currentLog && (
                  <div className="log-sections">
                    {/* 判断标准、输入、输出（我的 & AI）、总结 */}
                    <InputSection 
                      goalTitle={currentGoal.title}
                      language={language}
                      theme={currentTheme}
                    />
                    
                    <OutputSection 
                      goalTitle={currentGoal.title}
                      language={language}
                      theme={currentTheme}
                    />
                    
                    <ReflectionSection 
                      goalTitle={currentGoal.title}
                      language={language}
                      theme={currentTheme}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="ai-log-content">
            <div className="history-placeholder">
              <p>{t.noData}</p>
            </div>
          </div>
        )}

        {/* 目标创建/编辑对话框 */}
        <GoalCreator
          isOpen={showGoalCreator}
          onClose={() => {
            setShowGoalCreator(false);
            setEditingGoal(null);
          }}
          onSave={handleCreateGoal}
          editingGoal={editingGoal}
        />
      </div>
    </div>
  );
};

export default AILogPage;