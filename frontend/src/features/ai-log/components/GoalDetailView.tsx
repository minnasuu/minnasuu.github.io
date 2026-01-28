import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { LandButton } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';
import type { DifyGenerationResult } from '../../../shared/services/difyService';
import { goalService } from '../../../shared/services/goalService';
import InputSection, { InputSectionRef } from './InputSection';
import OutputSection, { OutputSectionRef } from './OutputSection';
import GoalStatus from './GoalStatus';
import '../styles/GoalDetailView.scss';

interface GoalDetailViewProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onUpdate: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ isOpen, goal, onClose, onUpdate }) => {
  const { language } = useLanguage();
  const { currentTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const inputSectionRef = useRef<InputSectionRef>(null);
  const outputSectionRef = useRef<OutputSectionRef>(null);

  const texts = {
    zh: {
      title: '目标详情',
      close: '关闭',
      save: '保存更改',
      saving: '保存中...',
      saved: '已保存',
      start: '开始',
      pause: '暂停',
      resume: '恢复',
      complete: '完成',
      edit: '编辑基本信息'
    },
    en: {
      title: 'Goal Details',
      close: 'Close',
      save: 'Save Changes',
      saving: 'Saving...',
      saved: 'Saved',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      complete: 'Complete',
      edit: 'Edit Basic Info'
    }
  };

  const t = texts[language];

  // 自动保存功能
  const handleSave = async () => {
    if (!goal) return;

    try {
      setIsSaving(true);
      
      // 获取 Input 和 Output 数据
      const inputData = inputSectionRef.current?.getCurrentData();
      const outputData = outputSectionRef.current?.getCurrentData();

      // 构建更新的 generatedData
      const updatedGeneratedData: DifyGenerationResult | undefined = (inputData || outputData) ? {
        inputData: {
          myInputs: inputData?.myInputs || [],
          aiInputs: inputData?.aiInputs || []
        },
        outputData: {
          myOutputs: outputData?.myOutputs || [],
          aiOutputs: outputData?.aiOutputs || []
        }
      } : undefined;

      // 更新目标
      await goalService.updateGoal(goal.id, {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        status: goal.status,
        progress: goal.progress,
        duration: goal.duration,
        startDate: goal.startDate,
        endDate: goal.endDate,
        targetSkills: goal.targetSkills,
        successCriteria: goal.successCriteria,
        milestones: goal.milestones,
        actualStartDate: goal.actualStartDate,
        pausedAt: goal.pausedAt,
        totalPausedDuration: goal.totalPausedDuration
      }, updatedGeneratedData);

      onUpdate();
      
      // 显示保存成功提示
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error('Failed to save goal:', error);
      alert(language === 'zh' ? '保存失败，请重试' : 'Failed to save, please retry');
      setIsSaving(false);
    }
  };

  // 状态操作处理
  const handleStartGoal = async () => {
    if (!goal) return;
    try {
      const now = new Date().toISOString();
      await goalService.updateGoalStatus(
        goal.id,
        'active',
        {
          actualStartDate: goal.actualStartDate || now
        }
      );
      onUpdate();
    } catch (error) {
      console.error('Failed to start goal:', error);
      alert(language === 'zh' ? '开始目标失败，请重试' : 'Failed to start goal');
    }
  };

  const handlePauseGoal = async () => {
    if (!goal) return;
    try {
      const now = new Date().toISOString();
      await goalService.updateGoalStatus(
        goal.id,
        'paused',
        { pausedAt: now }
      );
      onUpdate();
    } catch (error) {
      console.error('Failed to pause goal:', error);
      alert(language === 'zh' ? '暂停目标失败，请重试' : 'Failed to pause goal');
    }
  };

  const handleResumeGoal = async () => {
    if (!goal || !goal.pausedAt) return;
    try {
      const now = new Date();
      const pausedTime = new Date(goal.pausedAt);
      const pausedDuration = now.getTime() - pausedTime.getTime();
      
      await goalService.updateGoalStatus(
        goal.id,
        'active',
        {
          pausedAt: undefined,
          totalPausedDuration: (goal.totalPausedDuration || 0) + pausedDuration
        }
      );
      onUpdate();
    } catch (error) {
      console.error('Failed to resume goal:', error);
      alert(language === 'zh' ? '恢复目标失败，请重试' : 'Failed to resume goal');
    }
  };

  const handleCompleteGoal = async () => {
    if (!goal) return;
    try {
      await goalService.updateGoalStatus(goal.id, 'completed');
      await goalService.updateGoalProgress(goal.id, 100);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to complete goal:', error);
      alert(language === 'zh' ? '完成目标失败，请重试' : 'Failed to complete goal');
    }
  };

  if (!isOpen || !goal) return null;

  const generatedData = goal.generatedData as DifyGenerationResult | undefined;

  return (
    <div className={`goal-detail-view ${currentTheme}`}>
      <div className="detail-view-header">
        <button className="back-button" onClick={onClose}>
          ← {t.close}
        </button>
        <div className="header-actions">
          <LandButton
            text={isSaving ? t.saving : t.save}
            type="background"
            onClick={handleSave}
            disabled={isSaving}
          />
        </div>
      </div>

      <div className="detail-view-container">
        {/* 目标状态卡片 */}
        <GoalStatus
          goal={goal}
          onEdit={() => {}} // 这里可以添加编辑基本信息的功能
          onStart={handleStartGoal}
          onComplete={handleCompleteGoal}
          onPause={handlePauseGoal}
          onResume={handleResumeGoal}
        />

        {/* 输入输出部分 */}
        <div className="log-sections">
          <InputSection
            ref={inputSectionRef}
            goalTitle={goal.title}
            theme={currentTheme}
            initialMyInputs={generatedData?.inputData?.myInputs}
            initialAIInputs={generatedData?.inputData?.aiInputs}
          />
          
          <OutputSection
            ref={outputSectionRef}
            goalTitle={goal.title}
            theme={currentTheme}
            initialMyOutputs={generatedData?.outputData?.myOutputs}
            initialAIOutputs={generatedData?.outputData?.aiOutputs}
          />
        </div>
      </div>
    </div>
  );
};

export default GoalDetailView;
