import React, { useState, useEffect } from 'react';
import { LandButton } from '@suminhan/land-design';

interface PeriodControllerProps {
  onPeriodStart: () => void;
  onPeriodEnd: () => void;
  className?: string;
}

interface PeriodState {
  isActive: boolean;
  startTime: Date | null;
  progress: number;
  duration: number; // 周期持续时间（天）
}

export const PeriodController: React.FC<PeriodControllerProps> = ({
  onPeriodStart,
  onPeriodEnd,
  className = ''
}) => {
  const [periodState, setPeriodState] = useState<PeriodState>({
    isActive: false,
    startTime: null,
    progress: 0,
    duration: 7 // 默认7天周期
  });

  // 计算进度
  useEffect(() => {
    if (!periodState.isActive || !periodState.startTime) return;

    const updateProgress = () => {
      const now = new Date();
      const elapsed = now.getTime() - periodState.startTime!.getTime();
      const totalDuration = periodState.duration * 24 * 60 * 60 * 1000; // 转换为毫秒
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      
      setPeriodState(prev => ({ ...prev, progress }));
    };

    // 立即更新一次
    updateProgress();
    
    // 每分钟更新一次进度
    const interval = setInterval(updateProgress, 60000);
    
    return () => clearInterval(interval);
  }, [periodState.isActive, periodState.startTime, periodState.duration]);

  const handleStart = () => {
    const startTime = new Date();
    setPeriodState({
      isActive: true,
      startTime,
      progress: 0,
      duration: 7
    });
    
    // 保存到localStorage
    localStorage.setItem('aiLogPeriod', JSON.stringify({
      isActive: true,
      startTime: startTime.toISOString(),
      progress: 0,
      duration: 7
    }));
    
    onPeriodStart();
  };

  const handleEnd = () => {
    // 生成报告数据
    const reportData = {
      id: `period-${Date.now()}`,
      startTime: periodState.startTime,
      endTime: new Date(),
      duration: periodState.duration,
      actualProgress: periodState.progress,
      completedTasks: [], // 这里可以从实际数据获取
      achievements: [], // 这里可以从实际数据获取
    };

    // 保存到历史记录
    const existingHistory = JSON.parse(localStorage.getItem('aiLogHistory') || '[]');
    existingHistory.unshift(reportData);
    localStorage.setItem('aiLogHistory', JSON.stringify(existingHistory));

    // 重置状态
    setPeriodState({
      isActive: false,
      startTime: null,
      progress: 0,
      duration: 7
    });

    // 清除当前周期数据
    localStorage.removeItem('aiLogPeriod');
    
    onPeriodEnd();
  };

  // 组件加载时恢复状态
  useEffect(() => {
    const savedPeriod = localStorage.getItem('aiLogPeriod');
    if (savedPeriod) {
      try {
        const parsed = JSON.parse(savedPeriod);
        setPeriodState({
          isActive: parsed.isActive,
          startTime: parsed.startTime ? new Date(parsed.startTime) : null,
          progress: parsed.progress || 0,
          duration: parsed.duration || 7
        });
      } catch (error) {
        console.error('Failed to parse saved period data:', error);
      }
    }
  }, []);

  const formatTimeRemaining = () => {
    if (!periodState.startTime || !periodState.isActive) return '';
    
    const now = new Date();
    const elapsed = now.getTime() - periodState.startTime.getTime();
    const totalDuration = periodState.duration * 24 * 60 * 60 * 1000;
    const remaining = Math.max(0, totalDuration - elapsed);
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      return `剩余 ${days} 天 ${hours} 小时`;
    } else if (hours > 0) {
      return `剩余 ${hours} 小时`;
    } else {
      return '即将结束';
    }
  };

  return (
    <div className={`period-controller ${className}`}>
      <div className="period-controls">
        <LandButton
          text="开始"
          type="background"
          onClick={handleStart}
          disabled={periodState.isActive}
        />
        
        <div className="period-progress">
          {periodState.isActive ? (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${periodState.progress}%` }}
                />
              </div>
              <div className="progress-info">
                <span className="progress-percentage">
                  {Math.round(periodState.progress)}%
                </span>
                <span className="time-remaining">
                  {formatTimeRemaining()}
                </span>
              </div>
            </div>
          ) : (
            <div className="period-inactive">
              <span className="inactive-text">点击开始启动新周期</span>
            </div>
          )}
        </div>
        
        <LandButton
          text="结束"
          type="background"
          onClick={handleEnd}
          disabled={!periodState.isActive}
        />
      </div>
    </div>
  );
};