import React from 'react';
import { useLanguage } from '../../../shared/contexts/LanguageContext';
import { LandButton } from '@suminhan/land-design';
import type { Goal } from '../../../shared/types';
import type { DifyGenerationResult } from '../../../shared/services/difyService';
import '../styles/HistoryDetail.scss';

interface HistoryDetailProps {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ isOpen, goal, onClose }) => {
  const { language } = useLanguage();

  const texts = {
    zh: {
      title: '目标详情',
      close: '关闭',
      goalTitle: '目标名称',
      description: '描述',
      status: '状态',
      progress: '进度',
      createdAt: '创建时间',
      startedAt: '开始时间',
      completedAt: '完成时间',
      duration: '持续时间',
      category: '分类',
      priority: '优先级',
      myInputs: '我的输入',
      aiInputs: 'AI生成的输入',
      myOutputs: '我的输出',
      aiOutputs: 'AI生成的输出',
      noData: '暂无数据',
      statuses: {
        completed: '已完成',
        cancelled: '已取消'
      },
      priorities: {
        low: '低',
        medium: '中',
        high: '高'
      }
    },
    en: {
      title: 'Goal Details',
      close: 'Close',
      goalTitle: 'Goal Title',
      description: 'Description',
      status: 'Status',
      progress: 'Progress',
      createdAt: 'Created',
      startedAt: 'Started',
      completedAt: 'Completed',
      duration: 'Duration',
      category: 'Category',
      priority: 'Priority',
      myInputs: 'My Inputs',
      aiInputs: 'AI Generated Inputs',
      myOutputs: 'My Outputs',
      aiOutputs: 'AI Generated Outputs',
      noData: 'No Data',
      statuses: {
        completed: 'Completed',
        cancelled: 'Cancelled'
      },
      priorities: {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      }
    }
  };

  const t = texts[language];

  if (!isOpen || !goal) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = () => {
    if (!goal.actualStartDate) return '-';
    
    const start = new Date(goal.actualStartDate);
    const end = goal.updatedAt ? new Date(goal.updatedAt) : new Date();
    const durationMs = end.getTime() - start.getTime();
    
    // 减去暂停时间
    const actualDurationMs = durationMs - (Number(goal.totalPausedDuration) || 0);
    
    const days = Math.floor(actualDurationMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((actualDurationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((actualDurationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return language === 'zh' 
        ? `${days}天 ${hours}小时 ${minutes}分钟` 
        : `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return language === 'zh' 
        ? `${hours}小时 ${minutes}分钟` 
        : `${hours}h ${minutes}m`;
    }
    return language === 'zh' ? `${minutes}分钟` : `${minutes}m`;
  };

  const generatedData = goal.generatedData as DifyGenerationResult | undefined;

  return (
    <div className="history-detail-overlay" onClick={onClose}>
      <div className="history-detail-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{t.title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="dialog-content">
          {/* 基本信息 */}
          <section className="detail-section">
            <div className="info-grid">
              <div className="info-item full-width">
                <label>{t.goalTitle}</label>
                <div className="info-value title">{goal.title}</div>
              </div>

              {goal.description && (
                <div className="info-item full-width">
                  <label>{t.description}</label>
                  <div className="info-value">{goal.description}</div>
                </div>
              )}

              <div className="info-item">
                <label>{t.status}</label>
                <div className={`info-value status status-${goal.status}`}>
                  {t.statuses[goal.status as keyof typeof t.statuses]}
                </div>
              </div>

              <div className="info-item">
                <label>{t.progress}</label>
                <div className="info-value">{goal.progress || 0}%</div>
              </div>

              <div className="info-item">
                <label>{t.category}</label>
                <div className="info-value">{goal.category}</div>
              </div>

              <div className="info-item">
                <label>{t.priority}</label>
                <div className="info-value">
                  {t.priorities[goal.priority as keyof typeof t.priorities]}
                </div>
              </div>
            </div>
          </section>

          {/* 时间信息 */}
          <section className="detail-section">
            <div className="info-grid">
              <div className="info-item">
                <label>{t.createdAt}</label>
                <div className="info-value">{formatDate(goal.createdAt)}</div>
              </div>

              {goal.actualStartDate && (
                <div className="info-item">
                  <label>{t.startedAt}</label>
                  <div className="info-value">{formatDate(goal.actualStartDate)}</div>
                </div>
              )}

              <div className="info-item">
                <label>{t.completedAt}</label>
                <div className="info-value">{formatDate(goal.updatedAt)}</div>
              </div>

              <div className="info-item">
                <label>{t.duration}</label>
                <div className="info-value">{calculateDuration()}</div>
              </div>
            </div>
          </section>

          {/* 生成的数据 */}
          {generatedData && (
            <>
              {/* 输入部分 */}
              {(generatedData.inputData?.myInputs?.length > 0 || generatedData.inputData?.aiInputs?.length > 0) && (
                <section className="detail-section">
                  <h3>📥 输入</h3>
                  
                  {generatedData.inputData.myInputs && generatedData.inputData.myInputs.length > 0 && (
                    <div className="content-block">
                      <label>{t.myInputs}</label>
                      <div className="content-list">
                        {generatedData.inputData.myInputs.map((item, index) => (
                          <div key={item.id || index} className="list-item">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            <div className="item-meta">
                              {item.difficulty && <span>📊 {item.difficulty}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedData.inputData.aiInputs && generatedData.inputData.aiInputs.length > 0 && (
                    <div className="content-block">
                      <label>{t.aiInputs}</label>
                      <div className="content-list">
                        {generatedData.inputData.aiInputs.map((item, index) => (
                          <div key={item.id || index} className="list-item">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            <div className="item-meta">
                              {item.difficulty && <span>📊 {item.difficulty}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* 输出部分 */}
              {(generatedData.outputData?.myOutputs?.length > 0 || generatedData.outputData?.aiOutputs?.length > 0) && (
                <section className="detail-section">
                  <h3>📤 输出</h3>
                  
                  {generatedData.outputData.myOutputs && generatedData.outputData.myOutputs.length > 0 && (
                    <div className="content-block">
                      <label>{t.myOutputs}</label>
                      <div className="content-list">
                        {generatedData.outputData.myOutputs.map((item, index) => (
                          <div key={item.id || index} className="list-item">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            <div className="item-meta">
                              {item.difficulty && <span>📊 {item.difficulty}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {generatedData.outputData.aiOutputs && generatedData.outputData.aiOutputs.length > 0 && (
                    <div className="content-block">
                      <label>{t.aiOutputs}</label>
                      <div className="content-list">
                        {generatedData.outputData.aiOutputs.map((item, index) => (
                          <div key={item.id || index} className="list-item">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            <div className="item-meta">
                              {item.difficulty && <span>📊 {item.difficulty}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>

        <div className="dialog-footer">
          <LandButton
            text={t.close}
            type="background"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
