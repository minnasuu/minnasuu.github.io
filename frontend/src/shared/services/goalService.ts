import type { Goal } from '../types';
import type { DifyGenerationResult } from './difyService';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8001';

export interface GoalWithData extends Goal {
  generatedData?: DifyGenerationResult;
}

class GoalService {
  private baseURL = `${API_BASE_URL}/api/goals`;

  // 获取当前活跃的目标
  async getCurrentGoal(): Promise<GoalWithData | null> {
    try {
      const response = await fetch(`${this.baseURL}/current`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch current goal: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching current goal:', error);
      return null;
    }
  }

  // 获取所有目标
  async getGoals(status?: string, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${this.baseURL}?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch goals: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  // 获取单个目标
  async getGoal(id: string): Promise<GoalWithData> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch goal: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching goal:', error);
      throw error;
    }
  }

  // 创建新目标
  async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, generatedData?: DifyGenerationResult): Promise<GoalWithData> {
    try {
      const dataToSend = {
        ...goalData,
        generatedData: generatedData || null
      };

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`Failed to create goal: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  // 更新目标
  async updateGoal(id: string, goalData: Partial<Goal>, generatedData?: DifyGenerationResult): Promise<GoalWithData> {
    try {
      const dataToSend = {
        ...goalData,
        ...(generatedData !== undefined && { generatedData })
      };

      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error(`Failed to update goal: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  // 删除目标
  async deleteGoal(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete goal: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  // 更新目标状态
  async updateGoalStatus(
    id: string, 
    status: Goal['status'], 
    additionalData?: {
      actualStartDate?: string;
      pausedAt?: string;
      totalPausedDuration?: number;
    }
  ): Promise<GoalWithData> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          ...additionalData
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update goal status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating goal status:', error);
      throw error;
    }
  }

  // 更新目标进度
  async updateGoalProgress(id: string, progress: number): Promise<GoalWithData> {
    try {
      const response = await fetch(`${this.baseURL}/${id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress })
      });

      if (!response.ok) {
        throw new Error(`Failed to update goal progress: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }
}

export const goalService = new GoalService();
