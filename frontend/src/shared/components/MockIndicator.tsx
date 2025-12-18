import React from 'react';

/**
 * Mock 数据指示器组件
 * 显示当前是否使用 Mock 数据模式
 */
const MockIndicator: React.FC = () => {
  const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

  if (!isMockMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-amber-500/90 backdrop-blur-sm text-white rounded-lg shadow-lg text-xs font-mono">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-pulse"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>Mock 数据模式</span>
    </div>
  );
};

export default MockIndicator;
