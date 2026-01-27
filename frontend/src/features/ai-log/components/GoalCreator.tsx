import React, { useState } from 'react';
import {  LandDialog, LandInput, LandDatePicker } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';
import { difyService, type DifyGenerationResult } from '../../../shared/services/difyService';

interface GoalCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, generatedData?: DifyGenerationResult) => void;
  editingGoal?: Goal | null;
}

export const GoalCreator: React.FC<GoalCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  editingGoal
}) => {
  const [formData, setFormData] = useState({
    title: editingGoal?.title || '',
    description: editingGoal?.description || '',
    category: editingGoal?.category || 'technical' as const,
    priority: editingGoal?.priority || 'medium' as const,
    duration: editingGoal?.duration || 7,
    startDate: editingGoal?.startDate ? new Date(editingGoal.startDate) : new Date() as Date | null,
    endDate: editingGoal?.endDate ? new Date(editingGoal.endDate) : null as Date | null,
    targetSkills: editingGoal?.targetSkills?.join(', ') || '',
    successCriteria: editingGoal?.successCriteria?.join('\n') || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入目标标题';
    }

    if (!formData.description.trim()) {
      newErrors.description = '请输入目标描述';
    }

    if (!formData.startDate) {
      newErrors.startDate = '请选择开始日期';
    }

    if (!formData.endDate) {
      newErrors.endDate = '请选择结束日期';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = '结束日期必须晚于开始日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    
    try {
      // 计算周期天数
      const startDate = formData.startDate!;
      const endDate = formData.endDate!;
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        duration,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        status: 'planning',
        progress: 0,
        targetSkills: formData.targetSkills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0),
        milestones: [],
        successCriteria: formData.successCriteria
          .split('\n')
          .map(criteria => criteria.trim())
          .filter(criteria => criteria.length > 0)
      };

      // 如果不是编辑模式，调用 Dify API 生成输入输出数据
      let generatedData: DifyGenerationResult | undefined;
      if (!editingGoal) {
        try {
          generatedData = await difyService.generateGoalData(formData.title.trim());
        } catch (error) {
          console.error('Failed to generate data from Dify:', error);
          // 继续创建目标，但不包含生成的数据
        }
      }

      onSave(goalData, generatedData);
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'technical',
      priority: 'medium',
      duration: 7,
      startDate: new Date(),
      endDate: null,
      targetSkills: '',
      successCriteria: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <LandDialog
      show={isOpen}
      onClose={handleClose}
      title={editingGoal ? '编辑目标' : '创建新目标'}
      size="large"
      className='fixed'
      onCancel={handleClose}
      onSubmit={handleSave}
      cancelLabel="取消"
      submitLabel={isGenerating ? '生成中...' : (editingGoal ? '保存修改' : '创建目标')}
      submitDisabled={isGenerating}
    >
      <div className="goal-creator">
        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label>目标标题 <span className='required'>*</span></label>
              <LandInput
                value={formData.title}
                onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                placeholder="输入目标标题，如：掌握React高级特性"
                error={errors.title}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>目标描述 <span className='required'>*</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="详细描述你的目标，包括具体要达到的效果和预期成果"
                rows={4}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>开始日期 <span className='required'>*</span></label>
              <LandDatePicker
                value={formData.startDate}
                onChange={(value) => setFormData(prev => ({ ...prev, startDate: value }))}
                placeholder="选择开始日期"
              />
            </div>
            <div className="form-field">
              <label>结束日期 <span className='required'>*</span></label>
              <LandDatePicker
                value={formData.endDate}
                onChange={(value) => setFormData(prev => ({ ...prev, endDate: value }))}
                placeholder="选择结束日期"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>成功标准</label>
              <textarea
                value={formData.successCriteria}
                onChange={(e) => setFormData(prev => ({ ...prev, successCriteria: e.target.value }))}
                placeholder="每行一个成功标准，如：&#10;能够独立开发复杂的React应用&#10;掌握性能优化的核心技巧&#10;完成相关技术文章的撰写"
                rows={4}
              />
              <div className="field-hint">
                每行一个成功标准，用于衡量目标是否达成
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandDialog>
  );
};