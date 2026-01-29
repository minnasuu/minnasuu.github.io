import { Icon, LandButton, LandSelect } from '@suminhan/land-design';
import React, { useState, useRef, useEffect } from 'react';
import type { MyToDoListDataType, AIToDoListDataType } from '../../../shared/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
      myInputCount: number;
      aiInputCount: number;
      avgDifficulty: number;
    };
  };
  resetToInitialData: () => void;
  getCurrentData: () => { myInputs: MyToDoListDataType[]; aiInputs: AIToDoListDataType[] };
}

const InputSection = React.forwardRef<InputSectionRef, InputSectionProps>(({
  goalTitle='输入',
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
    title: goalTitle,
    subtitle: goalTitle=== '输入' ?'记录学习过程中的所有输入和投入':'记录学习过程中的所有输出',
    myInput: `我的${goalTitle}`,
    aiInput: `AI${goalTitle}`,
    difficulty: '难度',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    minutes: '分钟',
    hours: '小时',
    addInput: `添加${goalTitle}`,
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    title_placeholder: '请输入标题',
    description_placeholder: '请输入描述',
    empty_my_inputs: `暂无${goalTitle}记录`,
    empty_my_inputs_desc: '开始记录你的学习资源、实践练习和研究成果',
    empty_ai_inputs: `暂无AI${goalTitle}记录`,
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
      difficulty: 'medium',
      is_system: false,
      completed: false
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
      difficulty: 'medium',
      is_system: false,
      completed: false
    };
    const updatedInputs = [...aiInputs, newInput];
    setAIInputs(updatedInputs);
    onAIInputsChange?.(updatedInputs);
    setEditingInput(newInput.id); // 立即进入编辑模式
  };

  // 切换完成状态
  const handleToggleMyInputCompleted = (id: string) => {
    if (readonly) return;
    const updatedInputs = myInputs.map(input => 
      input.id === id ? { ...input, completed: !input.completed } : input
    );
    setMyInputs(updatedInputs);
    onMyInputsChange?.(updatedInputs);
  };

  const handleToggleAIInputCompleted = (id: string) => {
    if (readonly) return;
    const updatedInputs = aiInputs.map(input => 
      input.id === id ? { ...input, completed: !input.completed } : input
    );
    setAIInputs(updatedInputs);
    onAIInputsChange?.(updatedInputs);
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

  // 统计数据
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
          <LandButton type='background' status='default'>{texts.save}</LandButton>
          <button type="button" onClick={onCancel} className="btn btn-secondary">{texts.cancel}</button>
        </div>
      </form>
    );
  };

  const EditAIInputForm: React.FC<{ input: AIToDoListDataType; onSave: (input: Partial<AIToDoListDataType>) => void; onCancel: () => void }> = ({ input, onSave, onCancel }) => {
    const [formData, setFormData] = useState(input);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    // 调用后端生成AI结果
    const handleGenerate = async () => {
      if (!formData.prompt) {
        alert('请先输入 prompt');
        return;
      }

      setIsGenerating(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: formData.prompt,
            conversation_id: null, // 可以传入会话ID保持上下文
          }),
        });

        if (!response.ok) {
          throw new Error('生成失败');
        }

        const data = await response.json();
        
        // 将生成的结果更新到 description
        const updatedFormData = {
          ...formData,
          description: data.answer,
        };
        setFormData(updatedFormData);
        
        // 自动保存更新后的数据
        onSave(updatedFormData);
        
      } catch (error) {
        console.error('生成失败:', error);
        alert('生成失败，请稍后重试');
      } finally {
        setIsGenerating(false);
      }
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
        
        {/* Prompt 编辑区域 */}
        <div className="form-row flex-col gap-1!">
          <label className="form-label">Prompt（用于AI生成）</label>
          <textarea
            value={formData.prompt || ''}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            placeholder="输入生成指令..."
            className="form-textarea"
            rows={3}
          />
        </div>

        {/* 生成按钮 */}
        {formData.prompt && (
          <div className="form-row generate-button-row">
            <LandButton
              onClick={handleGenerate}
              disabled={isGenerating}
              icon={<Icon name='cursor-move-fill' />}
              text={isGenerating ? '生成中...' : '生成内容'}
            />
          </div>
        )}

        <div className="form-row">
          {formData.difficulty && (
            <LandSelect
            selectedValues={[formData.difficulty]}
            data={[
              { label: '简单', key: 'easy' },
              { label: '中等', key: 'medium' },
              { label: '困难', key: 'hard' },
            ]}
            onChange={item => setFormData({ ...formData, difficulty: item.key as AIToDoListDataType['difficulty'] })}
            />
          )}
        </div>
        <div className="form-actions">
          <LandButton type='background' status='default'>{texts.save}</LandButton>
          <button type="button" onClick={onCancel} className="btn btn-secondary">{texts.cancel}</button>
        </div>
      </form>
    );
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
  }), [myInputs, aiInputs, myInputCount, aiInputCount, avgDifficulty]);

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
              {/* 我的输入列表 - Todo List 折叠展示 */}
              <div className="inputs-todo-list">
                {myInputs.map((input) => (
                  <details key={input.id} className={`input-todo-item ${input.completed ? 'completed' : ''}`}>
                    <summary className="input-todo-summary">
                      <div className="todo-summary-content">
                        <div 
                          className={`todo-checkbox ${input.completed ? 'checked' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleMyInputCompleted(input.id);
                          }}
                        >
                          {input.completed && <span className="checkbox-icon">✓</span>}
                        </div>
                        <div className="todo-main-info">
                          <h4 className="input-title">{input.title}</h4>
                          <div className="input-meta">
                            <span className={`input-difficulty ${getDifficultyColor(input.difficulty)}`}>
                              {getDifficultyLabel(input.difficulty)}
                            </span>
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
              {/* AI输入列表 - Todo List 折叠展示 */}
              <div className="inputs-todo-list">
                {aiInputs.map((input) => (
                  <details key={input.id} className={`input-todo-item ai-input ${input.completed ? 'completed' : ''}`}>
                    <summary className="input-todo-summary">
                      <div className="todo-summary-content">
                        <div 
                          className={`todo-checkbox ${input.completed ? 'checked' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleAIInputCompleted(input.id);
                          }}
                        >
                          {input.completed && <span className="checkbox-icon">✓</span>}
                        </div>
                        <div className="todo-main-info">
                          <h4 className="input-title">{input.title}</h4>
                          <div className="input-meta">
                            {input.difficulty && (
                              <span className={`input-difficulty ${getDifficultyColor(input.difficulty)}`}>
                                {getDifficultyLabel(input.difficulty)}
                              </span>
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
                              handleDeleteAIInput(input.id);
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
                        <EditAIInputForm
                          input={input}
                          onSave={(updatedInput) => handleEditAIInput(input.id, updatedInput)}
                          onCancel={() => setEditingInput(null)}
                        />
                      ) : (
                        <>
                          <div className="input-description markdown-content">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ node, inline, className, children, ...props }: any) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {input.description || ''}
                            </ReactMarkdown>
                          </div>
                          {input.prompt && (
                            <div className='prompt-section mt-3'>
                              <div className='prompt-label text-xs font-semibold text-gray-500 mb-1'>
                                生成指令:
                              </div>
                              <div className='prompt-content p-2 bg-gray-50 rounded max-h-32 overflow-auto'>
                                <p className="text-xs text-gray-600 whitespace-pre-wrap">{input.prompt}</p>
                              </div>
                            </div>
                          )}
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