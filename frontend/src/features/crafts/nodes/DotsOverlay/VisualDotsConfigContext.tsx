import React, { createContext, useContext, useState } from 'react';

interface VisualDotsConfig {
  /** 点的颜色 */
  dotColor: string;
  /** 点的大小（半径，单位：px） */
  dotSize: number;
  /** 点的密度（点之间的间距，单位：px） */
  dotSpacing: number;
  /** 是否启用鼠标交互效果 */
  enableInteraction: boolean;
  /** 鼠标交互半径（单位：px） */
  interactionRadius: number;
  /** 排斥力强度（0-1，数值越大排斥越远） */
  repulsionStrength: number;
  /** 交互监听目标层级（向上查找几层父元素） */
  interactionTargetLevel: number;
  /** 是否启用出场动画 */
  enableEntrance: boolean;
  /** 出场动画持续时间（单位：ms） */
  entranceDuration: number;
  /** 是否启用鼠标拖尾效果 */
  enableTrail: boolean;
  /** 拖尾颜色 */
  trailColor: string;
  /** 拖尾持续时间（单位：ms） */
  trailDuration: number;
  /** 拖尾触发半径（单位：px） */
  trailRadius: number;
}

interface VisualDotsConfigContextType {
  config: VisualDotsConfig;
  updateConfig: (updates: Partial<VisualDotsConfig>) => void;
  resetConfig: () => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const defaultConfig: VisualDotsConfig = {
  dotColor: '#94a3b8',
  dotSize: 0.8,
  dotSpacing: 8,
  enableInteraction: true,
  interactionRadius: 200,
  repulsionStrength: 0.3,
  interactionTargetLevel: 1,
  enableEntrance: false,
  entranceDuration: 1000,
  enableTrail: false,
  trailColor: '#6366f1',
  trailDuration: 2000,
  trailRadius: 50,
};

const VisualDotsConfigContext = createContext<VisualDotsConfigContextType | null>(null);

export const VisualDotsConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<VisualDotsConfig>(defaultConfig);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const updateConfig = (updates: Partial<VisualDotsConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    setRefreshKey(prev => prev + 1);
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <VisualDotsConfigContext.Provider value={{ config, updateConfig, resetConfig, refreshKey, triggerRefresh }}>
      {children}
    </VisualDotsConfigContext.Provider>
  );
};

export const useVisualDotsConfig = () => {
  const context = useContext(VisualDotsConfigContext);
  if (!context) {
    throw new Error('useVisualDotsConfig must be used within a VisualDotsConfigProvider');
  }
  return context;
};