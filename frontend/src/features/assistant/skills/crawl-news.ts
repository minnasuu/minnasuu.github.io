import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 🕸️ 资讯爬取 — 雪 */
const crawlNews: SkillHandler = {
  id: 'crawl-news',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[crawl-news] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Crawler / RSS 服务
    return {
      success: true,
      data: { articles: [] },
      summary: '爬取指定网站/RSS，获取最新资讯 → 输出 JSON 资讯列表',
      status: 'success',
    };
  },
};

export default crawlNews;
