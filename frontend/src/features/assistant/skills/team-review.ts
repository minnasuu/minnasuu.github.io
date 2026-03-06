import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 👥 团队盘点 — 蓝蓝 (HR) */
const teamReview: SkillHandler = {
  id: 'team-review',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[team-review] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 盘点当前猫猫团队的能力分布和缺口
    return {
      success: true,
      data: { totalCats: 0, coverage: 0, gaps: [] },
      summary: '团队能力盘点完成',
      status: 'success',
    };
  },
};

export default teamReview;
