import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📰 资讯摘要 — 雪 */
const summarizeNews: SkillHandler = {
  id: 'summarize-news',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[summarize-news] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Gemini 摘要服务
    return {
      success: true,
      data: { summary: '' },
      summary: '对爬取内容进行智能摘要和分类',
      status: 'success',
    };
  },
};

export default summarizeNews;
