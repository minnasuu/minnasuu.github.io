import type { SkillHandler, SkillContext, SkillResult } from './types';
import { callDifySkill } from '../../../shared/utils/backendClient';

/** 📋 生成代办清单 — 花椒 */
const generateTodo: SkillHandler = {
  id: 'generate-todo',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[generate-todo] agent=${ctx.agentId} @${ctx.timestamp}`);

    try {
      // 从上游输入中提取诊断数据（来自 task-log + site-analyze）
      const input = ctx.input as Record<string, unknown> | string | undefined;
      let text = '';

      if (typeof input === 'string') {
        text = input;
      } else if (input && typeof input === 'object') {
        // 优先使用上游的 analysis/summary
        const analysis = (input.analysis as string) || '';
        const summary = (input.summary as string) || '';
        const currentArticles = (input.currentArticles as string[]) || [];
        const currentCrafts = (input.currentCrafts as string[]) || [];

        const parts: string[] = [];
        if (currentArticles.length > 0) {
          parts.push(`现有文章：${currentArticles.map(t => `《${t}》`).join('、')}`);
        }
        if (currentCrafts.length > 0) {
          parts.push(`现有crafts：${currentCrafts.join('、')}`);
        }
        if (analysis) {
          parts.push(`诊断结论：${analysis}`);
        }
        if (summary) {
          parts.push(`产出统计：${summary}`);
        }

        text = parts.length > 0 ? parts.join('。') : JSON.stringify(input, null, 2);
      }

      if (!text) {
        text = '请根据个站现状生成下周代办清单，包含文章选题、Crafts 计划、功能扩展三类。';
      }

      // 调用 Dify
      const response = await callDifySkill('generate-todo', text);

      if (response.error) {
        return {
          success: false,
          data: { error: response.error },
          summary: `代办清单生成失败: ${response.error}`,
          status: 'error',
        };
      }

      return {
        success: true,
        data: {
          todos: response.answer,
          conversationId: response.conversationId,
        },
        summary: response.answer,
        status: 'success',
      };
    } catch (err) {
      return {
        success: false,
        data: { error: String(err) },
        summary: `代办清单生成异常: ${String(err)}`,
        status: 'error',
      };
    }
  },
};

export default generateTodo;
