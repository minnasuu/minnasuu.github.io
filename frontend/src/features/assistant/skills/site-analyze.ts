import type { SkillHandler, SkillContext, SkillResult } from './types';
import { fetchArticles, fetchCrafts, callSiteAnalyze } from '../../../shared/utils/backendClient';

/** 收集现有文章标题列表 */
async function collectArticleTitles(): Promise<string[]> {
  try {
    const articles = await fetchArticles();
    return articles.map((a: any) => a.title).filter(Boolean);
  } catch {
    return [];
  }
}

/** 收集现有 Crafts 名称列表 */
async function collectCraftNames(): Promise<string[]> {
  try {
    const crafts = await fetchCrafts();
    return crafts.map((c: any) => c.name).filter(Boolean);
  } catch {
    return [];
  }
}

/** 拼接 Dify 输入字符串 */
function buildDifyInput(articleTitles: string[], craftNames: string[]): string {
  const articlesPart = articleTitles.length > 0
    ? articleTitles.map(t => `《${t}》`).join('、')
    : '暂无文章';

  const craftsPart = craftNames.length > 0
    ? craftNames.join('、')
    : '暂无 Crafts';

  return JSON.stringify({
    taskId: 'site-analyze',
    text: `现有文章：${articlesPart}。现有crafts：${craftsPart}`,
  });
}

/** 🔬 网站诊断 — 小白 */
const siteAnalyze: SkillHandler = {
  id: 'site-analyze',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[site-analyze] agent=${ctx.agentId} @${ctx.timestamp}`);

    try {
      // 1. 并行采集文章标题和 Crafts 名称
      const [articleTitles, craftNames] = await Promise.all([
        collectArticleTitles(),
        collectCraftNames(),
      ]);

      // 2. 拼接 Dify 输入
      const difyInput = buildDifyInput(articleTitles, craftNames);
      console.log('[site-analyze] Dify input:', difyInput);

      // 3. 调用 Dify 对话式 API
      const response = await callSiteAnalyze(difyInput);

      if (response.error) {
        return {
          success: false,
          data: { error: response.error },
          summary: `网站诊断失败: ${response.error}`,
          status: 'error',
        };
      }

      // 4. 返回诊断结果
      return {
        success: true,
        data: {
          currentArticles: articleTitles,
          currentCrafts: craftNames,
          analysis: response.answer,
          conversationId: response.conversationId,
        },
        summary: response.answer,
        status: 'success',
      };
    } catch (err) {
      return {
        success: false,
        data: { error: String(err) },
        summary: `网站诊断异常: ${String(err)}`,
        status: 'error',
      };
    }
  },
};

export default siteAnalyze;
