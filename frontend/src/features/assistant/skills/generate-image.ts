import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 🖼️ AI 绘图 — Pixel */
const generateImage: SkillHandler = {
  id: 'generate-image',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[generate-image] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Gemini 图片生成
    return {
      success: true,
      data: { imageUrl: '' },
      summary: '调用 Gemini 根据文字描述生成图片',
      status: 'success',
    };
  },
};

export default generateImage;
