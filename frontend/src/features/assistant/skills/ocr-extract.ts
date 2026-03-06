import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 🔤 文字提取 — 黄金 */
const ocrExtract: SkillHandler = {
  id: 'ocr-extract',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[ocr-extract] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Tesseract OCR
    return {
      success: true,
      data: { text: '', accuracy: 0 },
      summary: '从图片中识别并提取文字内容',
      status: 'success',
    };
  },
};

export default ocrExtract;
