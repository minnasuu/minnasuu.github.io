import type { SkillHandler, SkillContext, SkillResult } from './types';

/** ▶️ 执行工作流 — 花椒 */
const runWorkflow: SkillHandler = {
  id: 'run-workflow',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[run-workflow] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Workflow Engine 触发执行指定工作流
    return {
      success: true,
      data: { workflowId: '', triggered: true },
      summary: '工作流已触发执行',
      status: 'success',
    };
  },
};

export default runWorkflow;
