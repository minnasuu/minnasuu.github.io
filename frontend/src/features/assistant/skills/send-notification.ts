import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 🔔 推送通知 — 年年 */
const sendNotification: SkillHandler = {
  id: 'send-notification',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[send-notification] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 WebPush
    return {
      success: true,
      data: { pushedCount: 0 },
      summary: '向订阅者批量推送通知',
      status: 'success',
    };
  },
};

export default sendNotification;
