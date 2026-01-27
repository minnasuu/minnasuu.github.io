import type { MyToDoListDataType, AIToDoListDataType } from '../types';

export interface DifyResponse {
  goal: string;
  professional_input: {
    human: MyToDoListDataType[];
    ai: AIToDoListDataType[];
  };
  professional_output: {
    human: MyToDoListDataType[];
    ai: AIToDoListDataType[];
  };
}

export interface DifyGenerationResult {
  inputData: {
    myInputs: MyToDoListDataType[];
    aiInputs: AIToDoListDataType[];
  };
  outputData: {
    myOutputs: MyToDoListDataType[];
    aiOutputs: AIToDoListDataType[];
  };
}

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8001';

class DifyService {
  private baseURL = `${API_BASE_URL}/api/dify`;

  async generateGoalData(goal: string): Promise<DifyGenerationResult> {
    try {
      const response = await fetch(`${this.baseURL}/generate-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend Dify API error:', errorData);
        throw new Error(`Failed to generate goal data: ${errorData.error || response.status}`);
      }

      const result = await response.json();
      console.log('Generated goal data:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to generate goal data from Dify:', error);
      
      // 返回模拟数据作为降级方案
      return this.generateMockData(goal);
    }
  }

  private generateMockData(goal: string): DifyGenerationResult {
    return {
      inputData: {
        myInputs: [
          {
            id: `input-${Date.now()}-1`,
            title: '收集相关资料',
            description: `针对"${goal}"收集相关的学习资料和案例`,
            timeSpent: 60,
            difficulty: 'medium' as const,
            is_system: false
          },
          {
            id: `input-${Date.now()}-2`,
            title: '制定学习计划',
            description: '根据目标制定详细的学习计划和时间安排',
            timeSpent: 30,
            difficulty: 'easy' as const,
            is_system: false
          }
        ],
        aiInputs: [
          {
            id: `ai-input-${Date.now()}-1`,
            title: 'AI辅助资料整理',
            description: '使用AI工具整理和分类收集到的学习资料',
            timeSpent: 20,
            difficulty: 'easy' as const,
            is_system: false
          }
        ]
      },
      outputData: {
        myOutputs: [
          {
            id: `output-${Date.now()}-1`,
            title: '完成学习总结',
            description: `针对"${goal}"撰写学习总结和心得体会`,
            timeSpent: 45,
            difficulty: 'medium' as const,
            is_system: false
          },
          {
            id: `output-${Date.now()}-2`,
            title: '实践应用',
            description: '将学到的知识应用到实际项目中',
            timeSpent: 120,
            difficulty: 'hard' as const,
            is_system: false
          }
        ],
        aiOutputs: [
          {
            id: `ai-output-${Date.now()}-1`,
            title: 'AI生成学习报告',
            description: '基于学习过程自动生成详细的学习报告',
            timeSpent: 10,
            difficulty: 'easy' as const,
            is_system: false
          }
        ]
      }
    };
  }
}

export const difyService = new DifyService();