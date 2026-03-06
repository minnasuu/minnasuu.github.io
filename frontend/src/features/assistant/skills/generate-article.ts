import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📝 文章生成 — 发发 */
const generateArticle: SkillHandler = {
  id: 'generate-article',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[generate-article] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Gemini 文章生成
    return {
      success: true,
      data: { markdown: '' },
      summary: '根据主题和素材调用 Gemini 生成完整文章',
      status: 'success',
    };
  },
};

export default generateArticle;
