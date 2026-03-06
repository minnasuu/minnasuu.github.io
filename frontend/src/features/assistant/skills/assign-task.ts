import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📌 任务分配 — 花椒 */
const assignTask: SkillHandler = {
  id: 'assign-task',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[assign-task] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 TaskQueue 任务分配
    return {
      success: true,
      data: { tasks: [] },
      summary: '将任务拆解并分配给指定猫猫',
      status: 'success',
    };
  },
};

export default assignTask;
