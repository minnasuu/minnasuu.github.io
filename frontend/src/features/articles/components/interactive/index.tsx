/**
 * 交互组件注册表
 * 在这里注册你的预设组件
 */

import React from 'react';

// 导入 AgentScrollerLayout 系列组件
import BlinkOutput from '../../demos/AgentScrollerLayout/BlinkOutput';
import AgentScroller1 from '../../demos/AgentScrollerLayout/AgentScroller1';
import AgentScroller2 from '../../demos/AgentScrollerLayout/AgentScroller2';
import AgentScroller3 from '../../demos/AgentScrollerLayout/AgentScroller3';
import AgentScroller4 from '../../demos/AgentScrollerLayout/AgentScroller4';
import AgentScroller5 from '../../demos/AgentScrollerLayout/AgentScroller5';
import HistoryScroller1 from '../../demos/AgentScrollerLayout/HistoryScroller/HistoryScroller1';
import HistoryScroller2 from '../../demos/AgentScrollerLayout/HistoryScroller/HistoryScroller2';
import HistoryScroller3 from '../../demos/AgentScrollerLayout/HistoryScroller/HistoryScroller3';
import HistoryScrollerDemo1 from '../../demos/AgentScrollerLayout/HistoryScroller/HistoryScrollerDemo1';
import HistoryScrollerDemo2 from '../../demos/AgentScrollerLayout/HistoryScroller/HistoryScrollerDemo2';
import FixScroller1 from '../../demos/AgentScrollerLayout/FixScroller/FixScroller1';
import FixScroller2 from '../../demos/AgentScrollerLayout/FixScroller/FixScroller2';

// ==================== 组件类型定义 ====================

export interface InteractiveComponentProps {
  [key: string]: any;
}

export interface ComponentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultProps: Record<string, any>;
  component: React.ComponentType<any>;
  propsSchema?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      label: string;
      default?: any;
      placeholder?: string;
    };
  };
}

// ==================== 示例组件（请替换为你自己的组件）====================

const ExampleCounter: React.FC<{ label?: string; initial?: number }> = ({ 
  label = '点击次数', 
  initial = 0 
}) => {
  const [count, setCount] = React.useState(initial);
  
  return (
    <div className="my-4 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCount(c => c - 1)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            -
          </button>
          <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[3rem] text-center">
            {count}
          </span>
          <button
            onClick={() => setCount(c => c + 1)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

const ExampleAlert: React.FC<{ type?: 'info' | 'warning' | 'error' | 'success'; message?: string }> = ({ 
  type = 'info', 
  message = '这是一条提示信息' 
}) => {
  const colorMap = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  };
  
  return (
    <div className={`my-4 p-4 border-2 rounded-lg ${colorMap[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

// ==================== 组件注册表 ====================

export const INTERACTIVE_COMPONENTS: Record<string, ComponentConfig> = {
  counter: {
    id: 'counter',
    name: '计数器',
    description: '一个简单的计数器组件，可以增加或减少数值',
    icon: 'calculator',
    component: ExampleCounter,
    defaultProps: {
      label: '点击次数',
      initial: 0,
    },
    propsSchema: {
      label: {
        type: 'string',
        label: '标签文字',
        default: '点击次数',
        placeholder: '输入标签文字...',
      },
      initial: {
        type: 'number',
        label: '初始值',
        default: 0,
      },
    },
  },
  alert: {
    id: 'alert',
    name: '提示框',
    description: '显示不同类型的提示信息',
    icon: 'info',
    component: ExampleAlert,
    defaultProps: {
      type: 'info',
      message: '这是一条提示信息',
    },
    propsSchema: {
      type: {
        type: 'string',
        label: '类型',
        default: 'info',
      },
      message: {
        type: 'string',
        label: '提示内容',
        default: '这是一条提示信息',
        placeholder: '输入提示内容...',
      },
    },
  },
  
  // ==================== AgentScroller 系列 ====================
  blinkOutput: {
    id: 'blinkOutput',
    name: '闪烁输出',
    description: '带闪烁光标的逐字输出效果演示',
    icon: 'edit',
    component: BlinkOutput,
    defaultProps: {},
  },
  agentScroller1: {
    id: 'agentScroller1',
    name: 'Agent滚动1',
    description: '基础滚动容器，展示历史会话',
    icon: 'scroll',
    component: AgentScroller1,
    defaultProps: {},
  },
  agentScroller2: {
    id: 'agentScroller2',
    name: 'Agent滚动2',
    description: '问答对话滚动，带打字机效果',
    icon: 'message',
    component: AgentScroller2,
    defaultProps: {},
  },
  agentScroller3: {
    id: 'agentScroller3',
    name: 'Agent滚动3',
    description: '带Markdown渲染的对话滚动',
    icon: 'message',
    component: AgentScroller3,
    defaultProps: {},
  },
  agentScroller4: {
    id: 'agentScroller4',
    name: 'Agent滚动4',
    description: '翻转布局的对话滚动',
    icon: 'message',
    component: AgentScroller4,
    defaultProps: {
      fix: false,
      scale: false,
    },
    propsSchema: {
      fix: {
        type: 'boolean',
        label: '固定高度',
        default: false,
      },
      scale: {
        type: 'boolean',
        label: '缩放模式',
        default: false,
      },
    },
  },
  agentScroller5: {
    id: 'agentScroller5',
    name: 'Agent滚动5',
    description: '反向布局的对话滚动，支持自动输出',
    icon: 'message',
    component: AgentScroller5,
    defaultProps: {
      fix: false,
      autoOutPut: false,
      customContent: '',
    },
    propsSchema: {
      fix: {
        type: 'boolean',
        label: '固定高度',
        default: false,
      },
      autoOutPut: {
        type: 'boolean',
        label: '自动输出',
        default: false,
      },
      customContent: {
        type: 'string',
        label: '自定义内容',
        default: '',
        placeholder: '留空使用默认内容',
      },
    },
  },

  // ==================== HistoryScroller 系列 ====================
  historyScroller1: {
    id: 'historyScroller1',
    name: '历史滚动1',
    description: '带历史记录加载的对话滚动，支持向上加载更多',
    icon: 'history',
    component: HistoryScroller1,
    defaultProps: {},
  },
  historyScroller2: {
    id: 'historyScroller2',
    name: '历史滚动2',
    description: '反向布局的历史对话滚动',
    icon: 'history',
    component: HistoryScroller2,
    defaultProps: {
      fix: false,
    },
    propsSchema: {
      fix: {
        type: 'boolean',
        label: '固定高度',
        default: false,
      },
    },
  },
  historyScroller3: {
    id: 'historyScroller3',
    name: '历史滚动3',
    description: '翻转布局的历史对话滚动',
    icon: 'history',
    component: HistoryScroller3,
    defaultProps: {
      fix: false,
    },
    propsSchema: {
      fix: {
        type: 'boolean',
        label: '固定高度',
        default: false,
      },
    },
  },
  historyScrollerDemo1: {
    id: 'historyScrollerDemo1',
    name: '历史滚动Demo1',
    description: '简单的历史记录加载示例（正向）',
    icon: 'list',
    component: HistoryScrollerDemo1,
    defaultProps: {},
  },
  historyScrollerDemo2: {
    id: 'historyScrollerDemo2',
    name: '历史滚动Demo2',
    description: '简单的历史记录加载示例（反向）',
    icon: 'list',
    component: HistoryScrollerDemo2,
    defaultProps: {},
  },

  // ==================== FixScroller 系列 ====================
  fixScroller1: {
    id: 'fixScroller1',
    name: '固定滚动1',
    description: '可展开/收起的思考过程节点，带滚动位置修正',
    icon: 'expand',
    component: FixScroller1,
    defaultProps: {
      fix: false,
    },
    propsSchema: {
      fix: {
        type: 'boolean',
        label: '修正滚动位置',
        default: false,
      },
    },
  },
  fixScroller2: {
    id: 'fixScroller2',
    name: '固定滚动2',
    description: '简单的展开/收起节点',
    icon: 'expand',
    component: FixScroller2,
    defaultProps: {},
  },
};

// ==================== 工具函数 ====================

/**
 * 获取组件配置
 */
export const getComponentConfig = (type: string): ComponentConfig | undefined => {
  return INTERACTIVE_COMPONENTS[type];
};

/**
 * 获取所有组件列表
 */
export const getAllComponents = (): ComponentConfig[] => {
  return Object.values(INTERACTIVE_COMPONENTS);
};
