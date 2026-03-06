import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📰 资讯转文章 — 发发 */
const newsToArticle: SkillHandler = {
  id: 'news-to-article',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[news-to-article] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Gemini 资讯整理
    return {
      success: true,
      data: { article: '' },
      summary: '将爬取的资讯摘要整理为可发布的博文',
      status: 'success',
    };
  },
};

export default newsToArticle;
