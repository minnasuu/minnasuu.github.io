import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📝 会议纪要 — 咪咪 */
const meetingNotes: SkillHandler = {
  id: 'meeting-notes',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[meeting-notes] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 Gemini 生成结构化会议纪要
    return {
      success: true,
      data: { notes: '' },
      summary: '会议纪要已生成，交由花椒分配新任务',
      status: 'success',
    };
  },
};

export default meetingNotes;
