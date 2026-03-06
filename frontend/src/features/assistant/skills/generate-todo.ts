import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📋 代办清单 — 花椒 */
const generateTodo: SkillHandler = {
  id: 'generate-todo',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[generate-todo] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Gemini 代办清单生成
    return {
      success: true,
      data: { todos: [] },
      summary: '分析网站内容，自动生成代办清单',
      status: 'success',
    };
  },
};

export default generateTodo;
