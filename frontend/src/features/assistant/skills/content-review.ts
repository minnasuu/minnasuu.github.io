import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 🛡️ 内容审核 — 小白 */
const contentReview: SkillHandler = {
  id: 'content-review',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[content-review] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Moderation API 审核
    return {
      success: true,
      data: { result: 'safe' },
      summary: '检查文本是否合规、无敏感内容',
      status: 'success',
    };
  },
};

export default contentReview;
