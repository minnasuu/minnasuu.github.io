import type { SkillHandler, SkillContext, SkillResult } from './types';

/** 📧 发送邮件 — 年年 */
const sendEmail: SkillHandler = {
  id: 'send-email',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[send-email] agent=${ctx.agentId} @${ctx.timestamp}`);
    // TODO: 接入 SMTP/SendGrid
    return {
      success: true,
      data: { statusCode: 200 },
      summary: '发送 HTML 格式邮件给指定收件人',
      status: 'success',
    };
  },
};

export default sendEmail;
