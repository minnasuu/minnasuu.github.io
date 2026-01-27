import { Icon, LandButton } from '@suminhan/land-design';
import React, { useState, useRef, useEffect } from 'react';
import type { MyToDoListDataType, AIToDoListDataType } from '../../../shared/types';

interface InputSectionProps {
  goalTitle: string;
  theme: string;
  // AI生成的初始数据
  initialMyInputs?: MyToDoListDataType[];
  initialAIInputs?: AIToDoListDataType[];
  // 数据变更回调
  onMyInputsChange?: (inputs: MyToDoListDataType[]) => void;
  onAIInputsChange?: (inputs: AIToDoListDataType[]) => void;
  // 是否只读模式
  readonly?: boolean;
}

// 组件暴露的方法接口
export interface InputSectionRef {
  exportData: () => {
    myInputs: MyToDoListDataType[];
    aiInputs: AIToDoListDataType[];
    summary: {
      totalMyTime: number;
      totalAITime: number;
      myInputCount: number;
      aiInputCount: number;
      avgDifficulty: number;
    };
  };
  resetToInitialData: () => void;
  getCurrentData: () => { myInputs: MyToDoListDataType[]; aiInputs: AIToDoListDataType[] };
}

const InputSection = React.forwardRef<InputSectionRef, InputSectionProps>(({
  initialMyInputs = [],
  initialAIInputs = [],
  onMyInputsChange,
  onAIInputsChange,
  readonly = false
}, ref) => {
  const [activeTab, setActiveTab] = useState<'my' | 'ai'>('my');
  const [myInputs, setMyInputs] = useState<MyToDoListDataType[]>([]);
  const [aiInputs, setAIInputs] = useState<AIToDoListDataType[]>([]);
  const [editingInput, setEditingInput] = useState<string | null>(null);
  
  // 使用 ref 追踪是否已经初始化过，避免无限循环
  const isInitializedRef = useRef(false);

  // 只在首次有数据时初始化一次
  useEffect(() => {
    if (!isInitializedRef.current && (initialMyInputs.length > 0 || initialAIInputs.length > 0)) {
      setMyInputs(initialMyInputs);
      setAIInputs(initialAIInputs);
      isInitializedRef.current = true;
    }
  }, [initialMyInputs, initialAIInputs]);



  const texts = {
    title: '输入',
    subtitle: '记录学习过程中的所有输入和投入',
    myInput: '我的输入',
    aiInput: 'AI输入',
    timeSpent: '投入时间',
    difficulty: '难度',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    minutes: '分钟',
    hours: '小时',
    totalTime: '总投入时间',
    inputCount: '输入数量',
    avgDifficulty: '平均难度',
    addInput: '添加输入',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    title_placeholder: '请输入标题',
    description_placeholder: '请输入描述',
    empty_my_inputs: '暂无学习输入记录',
    empty_my_inputs_desc: '开始记录你的学习资源、实践练习和研究成果',
    empty_ai_inputs: '暂无AI输入记录',
    empty_ai_inputs_desc: '记录AI提供的分析、建议和指导内容'
  };

  // 编辑功能函数 - 添加数据同步
  const handleDeleteMyInput = (id: string) => {
    const updatedInputs = myInputs.filter(input => input.id !== id);
    setMyInputs(updatedInputs);
    onMyInputsChange?.(updatedInputs);
  };

  const handleDeleteAIInput = (id: string) => {
    const updatedInputs = aiInputs.filter(input => input.id !== id);
    setAIInputs(updatedInputs);
    onAIInputsChange?.(updatedInputs);
  };

  const handleEditMyInput = (id: string, updatedInput: Partial<MyToDoListDataType>) => {
    const updatedInputs = myInputs.map(input => 
      input.id === id ? { ...input, ...updatedInput } : input
    );
    setMyInputs(updatedInputs);
    onMyInputsChange?.(updatedInputs);
    setEditingInput(null);
  };

  const handleEditAIInput = (id: string, updatedInput: Partial<AIToDoListDataType>) => {
    const updatedInputs = aiInputs.map(input => 
      input.id === id ? { ...input, ...updatedInput } : input
    );
    setAIInputs(updatedInputs);
    onAIInputsChange?.(updatedInputs);
    setEditingInput(null);
  };

  const handleAddMyInput = () => {
    if (readonly) return;
    
    const newInput: MyToDoListDataType = {
      id: `input-${Date.now()}`,
      title: '新输入项',
      description: '请输入描述',
      timeSpent: 60,
      difficulty: 'medium',
      is_system: false
    };
    const updatedInputs = [...myInputs, newInput];
    setMyInputs(updatedInputs);
    onMyInputsChange?.(updatedInputs);
    setEditingInput(newInput.id); // 立即进入编辑模式
  };

  const handleAddAIInput = () => {
    if (readonly) return;
    
    const newInput: AIToDoListDataType = {
      id: `ai-input-${Date.now()}`,
      title: '新AI输入项',
      description: '请输入描述',
      timeSpent: 30,
      difficulty: 'medium',
      is_system: false
    };
    const updatedInputs = [...aiInputs, newInput];
    setAIInputs(updatedInputs);
    onAIInputsChange?.(updatedInputs);
    setEditingInput(newInput.id); // 立即进入编辑模式
  };



  const getDifficultyLabel = (difficulty: string) => {
    const difficultyMap: { [key: string]: string } = {
      easy: texts.easy,
      medium: texts.medium,
      hard: texts.hard
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

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}${texts.hours} ${remainingMinutes}${texts.minutes}`
        : `${hours}${texts.hours}`;
    }
    return `${minutes}${texts.minutes}`;
  };

  // 统计数据
  const totalMyTime = myInputs.reduce((sum, input) => sum + (input.timeSpent || 0), 0);
  const totalAITime = aiInputs.reduce((sum, input) => sum + (input.timeSpent || 0), 0);
  
  const myInputCount = myInputs.length;
  const aiInputCount = aiInputs.length;
  
  const avgDifficulty = myInputs.reduce((sum, input) => {
    const difficultyScore = input.difficulty === 'easy' ? 1 : input.difficulty === 'medium' ? 2 : 3;
    return sum + difficultyScore;
  }, 0) / (myInputs.length || 1);

  // 编辑表单组件
  const EditMyInputForm: React.FC<{ input: MyToDoListDataType; onSave: (input: Partial<MyToDoListDataType>) => void; onCancel: () => void }> = ({ input, onSave, onCancel }) => {
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
            placeholder={texts.title_placeholder}
            className="form-input"
            required
          />
        </div>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={texts.description_placeholder}
          className="form-textarea"
        />
        <div className="form-row">
          <input
            type="number"
            value={formData.timeSpent || 0}
            onChange={(e) => setFormData({ ...formData, timeSpent: parseInt(e.target.value) })}
            placeholder={texts.timeSpent}
            className="form-input"
            min="1"
          />
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as MyToDoListDataType['difficulty'] })}
            className="form-select"
          >
            <option value="easy">{texts.easy}</option>
            <option value="medium">{texts.medium}</option>
            <option value="hard">{texts.hard}</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{texts.save}</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">{texts.cancel}</button>
        </div>
      </form>
    );
  };

  const EditAIInputForm: React.FC<{ input: AIToDoListDataType; onSave: (input: Partial<AIToDoListDataType>) => void; onCancel: () => void }> = ({ input, onSave, onCancel }) => {
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
            placeholder={texts.title_placeholder}
            className="form-input"
            required
          />
        </div>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={texts.description_placeholder}
          className="form-textarea"
        />
        <div className="form-row">
          <input
            type="number"
            value={formData.timeSpent || 0}
            onChange={(e) => setFormData({ ...formData, timeSpent: parseInt(e.target.value) })}
            placeholder={texts.timeSpent}
            className="form-input"
            min="1"
          />
          {formData.difficulty && (
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as AIToDoListDataType['difficulty'] })}
              className="form-select"
            >
              <option value="easy">{texts.easy}</option>
              <option value="medium">{texts.medium}</option>
              <option value="hard">{texts.hard}</option>
            </select>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{texts.save}</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">{texts.cancel}</button>
        </div>
      </form>
    );
  };

  const getAvgDifficultyLabel = (score: number) => {
    if (score <= 1.5) return texts.easy;
    if (score <= 2.5) return texts.medium;
    return texts.hard;
  };

  // 空状态组件
  const EmptyState: React.FC<{ type: 'my' | 'ai' }> = ({ type }) => {
    const isMyInputs = type === 'my';
    const emptyTitle = isMyInputs ? texts.empty_my_inputs : texts.empty_ai_inputs;
    const emptyDesc = isMyInputs ? texts.empty_my_inputs_desc : texts.empty_ai_inputs_desc;
    const icon = isMyInputs ? '📚' : '🤖';

    return (
      <div className="empty-state">
        <div className="empty-state-icon">{icon}</div>
        <h4 className="empty-state-title">{emptyTitle}</h4>
        <p className="empty-state-description">{emptyDesc}</p>
        {!readonly && (
          <LandButton 
            onClick={isMyInputs ? handleAddMyInput : handleAddAIInput}
            icon={<Icon name="add" />}
            text={texts.addInput}
          />
        )}
      </div>
    );
  };

  // 导出数据的工具函数
  const exportData = () => {
    return {
      myInputs,
      aiInputs,
      summary: {
        totalMyTime,
        totalAITime,
        myInputCount,
        aiInputCount,
        avgDifficulty
      }
    };
  };

  // 重置为初始数据
  const resetToInitialData = () => {
    setMyInputs(initialMyInputs);
    setAIInputs(initialAIInputs);
    onMyInputsChange?.(initialMyInputs);
    onAIInputsChange?.(initialAIInputs);
  };

  // 暴露给父组件的方法
  React.useImperativeHandle(ref, () => ({
    exportData,
    resetToInitialData,
    getCurrentData: () => ({ myInputs, aiInputs })
  }), [myInputs, aiInputs, totalMyTime, totalAITime, myInputCount, aiInputCount, avgDifficulty]);

  return (
    <section className="input-section">
      <div className="section-header">
        <h3 className="section-title">{texts.title}</h3>
        <p className="section-subtitle">{texts.subtitle}</p>
      </div>

      {/* 输入类型切换 */}
      <div className="input-tabs">
        <button 
          className={`input-tab ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          {texts.myInput} ({myInputCount})
        </button>
        <button 
          className={`input-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          {texts.aiInput} ({aiInputCount})
        </button>
      </div>

      {activeTab === 'my' && (
        <div className="my-inputs">
          {myInputs.length > 0 ? (
            <>
              {/* 统计概览 */}
              <div className="input-stats">
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <span className="stat-label">{texts.totalTime}</span>
                    <span className="stat-value">{formatTime(totalMyTime)}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-content">
                    <span className="stat-label">{texts.inputCount}</span>
                    <span className="stat-value">{myInputCount}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <span className="stat-label">{texts.avgDifficulty}</span>
                    <span className="stat-value">{getAvgDifficultyLabel(avgDifficulty)}</span>
                  </div>
                </div>
              </div>

              {/* 我的输入列表 - Todo List 折叠展示 */}
              <div className="inputs-todo-list">
                {myInputs.map((input) => (
                  <details key={input.id} className={`input-todo-item ${input}`}>
                    <summary className="input-todo-summary">
                      <div className="todo-summary-content">
                        <div className="todo-checkbox">
                          <span className="checkbox-icon">✓</span>
                        </div>
                        <div className="todo-main-info">
                          <h4 className="input-title">{input.title}</h4>
                          <div className="input-meta">
                            <span className={`input-difficulty ${getDifficultyColor(input.difficulty)}`}>
                              {getDifficultyLabel(input.difficulty)}
                            </span>
                            {input.timeSpent && (
                              <span className="input-time">{formatTime(input.timeSpent)}</span>
                            )}
                          </div>
                        </div>
                        {!readonly && (
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
                        )}
                        <div className="todo-expand-icon">
                          <Icon name='arrow' className='expand-arrow'/>
                        </div>
                      </div>
                    </summary>
                    
                    <div className="input-details-expanded">
                      {editingInput === input.id && !readonly ? (
                        <EditMyInputForm
                          input={input}
                          onSave={(updatedInput) => handleEditMyInput(input.id, updatedInput)}
                          onCancel={() => setEditingInput(null)}
                        />
                      ) : (
                        <>
                          <p className="input-description">{input.description}</p>

                          <div className="input-details">
                            {input.timeSpent && (
                              <div className="input-time-detail">
                                <span className="detail-label">{texts.timeSpent}:</span>
                                <span className="detail-value">{formatTime(input.timeSpent)}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </details>
                ))}
              </div>

              {/* 添加新输入按钮 */}
              {!readonly && (
                <div className="add-input-section mt-4">
                  <LandButton 
                    onClick={handleAddMyInput}
                    icon={<Icon name="add" />}
                    text={texts.addInput}
                  >
                  </LandButton>
                </div>
              )}
            </>
          ) : (
            <EmptyState type="my" />
          )}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="ai-inputs">
          {aiInputs.length > 0 ? (
            <>
              {/* AI输入统计概览 */}
              <div className="input-stats">
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-content">
                    <span className="stat-label">{texts.totalTime}</span>
                    <span className="stat-value">{formatTime(totalAITime)}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🤖</div>
                  <div className="stat-content">
                    <span className="stat-label">{texts.inputCount}</span>
                    <span className="stat-value">{aiInputCount}</span>
                  </div>
                </div>

              </div>

              {/* AI输入列表 - Todo List 折叠展示 */}
              <div className="inputs-todo-list">
                {aiInputs.map((input) => (
                  <details key={input.id} className={`input-todo-item ai-input`}>
                    <summary className="input-todo-summary">
                      <div className="todo-summary-content">
                        <div className="todo-checkbox">
                          <span className="checkbox-icon">🤖</span>
                        </div>
                        <div className="todo-main-info">
                          <h4 className="input-title">{input.title}</h4>
                          <div className="input-meta">
                            {input.difficulty && (
                              <span className={`input-difficulty ${getDifficultyColor(input.difficulty)}`}>
                                {getDifficultyLabel(input.difficulty)}
                              </span>
                            )}
                            {input.timeSpent && (
                              <span className="input-time">{formatTime(input.timeSpent)}</span>
                            )}
                          </div>
                        </div>
                        {!readonly && (
                          <div className="todo-actions">
                            <button 
                              className="action-btn edit-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                setEditingInput(input.id);
                              }}
                              title={texts.edit}
                            >
                              <Icon name="edit" />
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteAIInput(input.id);
                              }}
                              title={texts.delete}
                            >
                              <Icon name="delete" />
                            </button>
                          </div>
                        )}
                        <div className="todo-expand-icon">
                          <Icon name='arrow' className='expand-arrow'/>
                        </div>
                      </div>
                    </summary>
                    
                    <div className="input-details-expanded">
                      {editingInput === input.id && !readonly ? (
                        <EditAIInputForm
                          input={input}
                          onSave={(updatedInput) => handleEditAIInput(input.id, updatedInput)}
                          onCancel={() => setEditingInput(null)}
                        />
                      ) : (
                        <>
                          <p className="input-description">{input.description}</p>

                          <div className="input-details">
                            {input.timeSpent && (
                              <div className="input-time-detail">
                                <span className="detail-label">{texts.timeSpent}:</span>
                                <span className="detail-value">{formatTime(input.timeSpent)}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </details>
                ))}
              </div>

              {/* 添加新AI输入按钮 */}
              {!readonly && (
                <div className="add-input-section mt-4">
                   <LandButton 
                    onClick={handleAddAIInput}
                    icon={<Icon name="add" />}
                    text={texts.addInput}
                  >
                  </LandButton>
                </div>
              )}
            </>
          ) : (
            <EmptyState type="ai" />
          )}
        </div>
      )}
    </section>
  );
});

// 设置displayName以便调试
InputSection.displayName = 'InputSection';

export default InputSection;