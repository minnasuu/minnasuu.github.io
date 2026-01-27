import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import BackButton from '../../../shared/components/BackButton';
import { LandButton } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';
import type { DifyGenerationResult } from '../../../shared/services/difyService';
import { goalService } from '../../../shared/services/goalService';
import {
  InputSection,
  OutputSection,
  GoalCreator,
  GoalStatus,
  HistoryList,
  HistoryDetail
} from '../components';
import '../styles/AILogPage.scss';
import '../styles/NewSections.scss';

const AILogPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentTheme } = useTheme();
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [showGoalCreator, setShowGoalCreator] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [generatedData, setGeneratedData] = useState<DifyGenerationResult | null>(null);
  const [selectedHistoryGoal, setSelectedHistoryGoal] = useState<Goal | null>(null);

  // 从数据库加载当前目标
  useEffect(() => {
    const loadCurrentGoal = async () => {
      try {
        const goal = await goalService.getCurrentGoal();
        if (goal) {
          setCurrentGoal(goal);
          
          // 从数据库中加载生成的数据
          if (goal.generatedData) {
            setGeneratedData(goal.generatedData as DifyGenerationResult);
          }
        }
      } catch (error) {
        console.error('Failed to load current goal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentGoal();
  }, []);

  // 创建新目标
  const handleCreateGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, difyData?: DifyGenerationResult) => {
    try {
      // 保存到数据库
      const newGoal = await goalService.createGoal(goalData, difyData);
      
      setCurrentGoal(newGoal);
      
      // 保存生成的数据
      if (difyData) {
        setGeneratedData(difyData);
      }
      
      setShowGoalCreator(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
      
      // 提供更详细的错误信息
      let errorMessage = '创建目标失败';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage += '：无法连接到后端服务，请确保后端服务正在运行（http://localhost:8001）';
        } else if (error.message.includes('500')) {
          errorMessage += '：服务器内部错误，请检查后端日志和数据库连接';
        } else if (error.message.includes('400')) {
          errorMessage += '：请求数据格式错误，请检查输入信息';
        } else {
          errorMessage += `：${error.message}`;
        }
      }
      
      alert(errorMessage);
    }
  };

  // 开始目标 - 正式进入周期
  const handleStartGoal = async () => {
    if (!currentGoal) return;

    try {
      const now = new Date().toISOString();
      const updatedGoal = await goalService.updateGoalStatus(
        currentGoal.id,
        'active',
        {
          actualStartDate: currentGoal.actualStartDate || now
        }
      );

      setCurrentGoal(updatedGoal);
    } catch (error) {
      console.error('Failed to start goal:', error);
      alert('开始目标失败，请重试');
    }
  };

  // 完成目标
  const handleCompleteGoal = async () => {
    if (!currentGoal) return;

    try {
      await goalService.updateGoalStatus(currentGoal.id, 'completed');
      await goalService.updateGoalProgress(currentGoal.id, 100);

      // 清除当前目标
      setCurrentGoal(null);
      setGeneratedData(null);
    } catch (error) {
      console.error('Failed to complete goal:', error);
      alert('完成目标失败，请重试');
    }
  };

  // 暂停目标 - 记录暂停时间
  const handlePauseGoal = async () => {
    if (!currentGoal) return;

    try {
      const now = new Date().toISOString();
      const updatedGoal = await goalService.updateGoalStatus(
        currentGoal.id,
        'paused',
        { pausedAt: now }
      );

      setCurrentGoal(updatedGoal);
    } catch (error) {
      console.error('Failed to pause goal:', error);
      alert('暂停目标失败，请重试');
    }
  };

  // 恢复目标 - 计算暂停时长并重新开始
  const handleResumeGoal = async () => {
    if (!currentGoal || !currentGoal.pausedAt) return;

    try {
      const now = new Date();
      const pausedTime = new Date(currentGoal.pausedAt);
      const pausedDuration = now.getTime() - pausedTime.getTime();
      
      const updatedGoal = await goalService.updateGoalStatus(
        currentGoal.id,
        'active',
        {
          pausedAt: undefined,
          totalPausedDuration: (currentGoal.totalPausedDuration || 0) + pausedDuration
        }
      );

      setCurrentGoal(updatedGoal);
    } catch (error) {
      console.error('Failed to resume goal:', error);
      alert('恢复目标失败，请重试');
    }
  };

  // 编辑目标
  const handleEditGoal = () => {
    setEditingGoal(currentGoal);
    setShowGoalCreator(true);
  };

  // 保存编辑后的目标
  const handleSaveEditedGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, difyData?: DifyGenerationResult) => {
    if (!editingGoal) return;

    try {
      const updatedGoal = await goalService.updateGoal(editingGoal.id, goalData, difyData);
      
      setCurrentGoal(updatedGoal);
      
      if (difyData) {
        setGeneratedData(difyData);
      }
      
      setShowGoalCreator(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Failed to update goal:', error);
      alert('更新目标失败，请重试');
    }
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

                {/* 只要有目标就显示输入输出部分，可以编辑 */}
                <div className="log-sections">
                  <InputSection 
                    goalTitle={currentGoal.title}
                    theme={currentTheme}
                    initialMyInputs={generatedData?.inputData.myInputs}
                    initialAIInputs={generatedData?.inputData.aiInputs}
                  />
                  
                  <OutputSection 
                    goalTitle={currentGoal.title}
                    theme={currentTheme}
                    initialMyOutputs={generatedData?.outputData.myOutputs}
                    initialAIOutputs={generatedData?.outputData.aiOutputs}
                  />
                  
                  {/* 反思部分仅在活跃状态下显示 */}
                  {/* {currentGoal.status === 'active' && (
                    <ReflectionSection 
                      goalTitle={currentGoal.title}
                      language={language}
                      theme={currentTheme}
                    />
                  )} */}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="ai-log-content">
            <HistoryList onViewGoal={(goal) => setSelectedHistoryGoal(goal)} />
          </div>
        )}

        {/* 目标创建/编辑对话框 */}
        <GoalCreator
          isOpen={showGoalCreator}
          onClose={() => {
            setShowGoalCreator(false);
            setEditingGoal(null);
          }}
          onSave={editingGoal ? handleSaveEditedGoal : handleCreateGoal}
          editingGoal={editingGoal}
        />

        {/* 历史记录详情对话框 */}
        <HistoryDetail
          isOpen={!!selectedHistoryGoal}
          goal={selectedHistoryGoal}
          onClose={() => setSelectedHistoryGoal(null)}
        />
      </div>
    </div>
  );
};

export default AILogPage;