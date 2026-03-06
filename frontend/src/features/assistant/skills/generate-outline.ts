import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📑 大纲生成 — 发发 */
const generateOutline: SkillHandler = {
  id: 'generate-outline',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[generate-outline] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Gemini 大纲生成
    return {
      success: true,
      data: { outline: [] },
      summary: '根据主题快速生成结构化大纲',
      status: 'success',
    };
  },
};

export default generateOutline;
