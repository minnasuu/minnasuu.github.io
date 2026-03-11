import type { SkillHandler, SkillContext, SkillResult } from './types';
import { fetchArticles, fetchCrafts, fetchWorkflows } from '../../../shared/utils/backendClient';

/** 获取本周一 00:00:00 的时间戳 */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=周日, 1=周一...
  const diff = day === 0 ? 6 : day - 1; // 周日时回退6天，其他回退 day-1 天
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/** 判断日期字符串是否在本周范围内 */
function isThisWeek(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  return date >= getWeekStart();
}

interface WeeklyStats {
  period: { start: string; end: string };
  articles: { total: number; thisWeek: number; titles: string[] };
  crafts: { total: number; thisWeek: number; names: string[] };
  workflows: { total: number };
  summary: string;
}

/** 📒 任务日志 — 咪咪 */
const taskLog: SkillHandler = {
  id: 'task-log',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[task-log] agent=${ctx.agentId} @${ctx.timestamp}`);

    const weekStart = getWeekStart();
    const now = new Date();

    try {
      // 并行查询文章、Crafts、工作流
      const [articles, crafts, workflows] = await Promise.all([
        fetchArticles(false).catch(() => []),
        fetchCrafts().catch(() => []),
        fetchWorkflows().catch(() => []),
      ]);

      // 筛选本周新增的文章（按 publishDate 或 createdAt）
      const weekArticles = articles.filter(
        (a: any) => isThisWeek(a.publishDate) || isThisWeek(a.createdAt)
      );

      // 筛选本周新增的 Crafts（按 createdAt）
      const weekCrafts = crafts.filter((c: any) => isThisWeek(c.createdAt));

      const stats: WeeklyStats = {
        period: {
          start: weekStart.toLocaleDateString('zh-CN'),
          end: now.toLocaleDateString('zh-CN'),
        },
        articles: {
          total: articles.length,
          thisWeek: weekArticles.length,
          titles: weekArticles.map((a: any) => a.title),
        },
        crafts: {
          total: crafts.length,
          thisWeek: weekCrafts.length,
          names: weekCrafts.map((c: any) => c.name),
        },
        workflows: {
          total: workflows.length,
        },
        summary: '',
      };

      // 生成可读摘要
      const parts: string[] = [];
      parts.push(`📊 本周产出统计（${stats.period.start} ~ ${stats.period.end}）`);
      parts.push('');

      // 文章
      if (stats.articles.thisWeek > 0) {
        parts.push(`📝 文章：本周新增 ${stats.articles.thisWeek} 篇（总计 ${stats.articles.total} 篇）`);
        stats.articles.titles.forEach((t, i) => parts.push(`   ${i + 1}. ${t}`));
      } else {
        parts.push(`📝 文章：本周无新增（总计 ${stats.articles.total} 篇）`);
      }
      parts.push('');

      // Crafts
      if (stats.crafts.thisWeek > 0) {
        parts.push(`🎨 Crafts：本周新增 ${stats.crafts.thisWeek} 个（总计 ${stats.crafts.total} 个）`);
        stats.crafts.names.forEach((n, i) => parts.push(`   ${i + 1}. ${n}`));
      } else {
        parts.push(`🎨 Crafts：本周无新增（总计 ${stats.crafts.total} 个）`);
      }
      parts.push('');

      // 工作流
      parts.push(`⚙️ 工作流：共 ${stats.workflows.total} 个已配置`);

      stats.summary = parts.join('\n');

      return {
        success: true,
        data: stats,
        summary: stats.summary,
        status: stats.articles.thisWeek > 0 || stats.crafts.thisWeek > 0 ? 'success' : 'warning',
      };
    } catch (err) {
      return {
        success: false,
        data: { error: String(err) },
        summary: `任务日志生成失败: ${String(err)}`,
        status: 'error',
      };
    }
  },
};

export default taskLog;
