import type { SkillHandler, SkillContext, SkillResult } from './types';
import { sendEmail } from '../../../shared/utils/backendClient';
import { marked } from 'marked';

const DEFAULT_TO = 'minhansu508@gmail.com';

/** 将 markdown 文本转为邮件友好的 HTML */
function markdownToEmailHtml(md: string): string {
  const bodyHtml = marked.parse(md, { async: false }) as string;
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #fff; border: 1px solid #E0D6CC; border-radius: 12px; padding: 20px; line-height: 1.8; color: #333;">
        ${bodyHtml}
      </div>
      <p style="text-align: center; color: #BCAAA4; font-size: 12px; margin-top: 16px;">
        由年年 🐱 从 Minna 个站发出
      </p>
    </div>
  `;
}

/** 📧 发送邮件 — 年年 */
const sendEmailSkill: SkillHandler = {
  id: 'send-email',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[send-email] agent=${ctx.agentId} @${ctx.timestamp}`);

    const input = ctx.input as Record<string, unknown> | string | undefined;
    let to = DEFAULT_TO;
    let subject = '【猫猫周会】🐱 Minna 猫猫邮件';
    let html = '';
    let text = '';

    if (typeof input === 'string') {
      text = input;
    } else if (input && typeof input === 'object') {
      to = (input.to as string) || to;
      subject = (input.subject as string) || subject;
      html = (input.html as string) || '';
      text = (input.text as string) || (input.summary as string) || '';
    }

    if (!html && !text) {
      text = '这是一封来自 Minna 猫猫团队的邮件 🐱';
    }

    // 如果只有 text（可能含 markdown），转为 HTML
    if (!html && text) {
      html = markdownToEmailHtml(text);
    }

    try {
      const result = await sendEmail({ to, subject, html, text });

      if (result.success) {
        return {
          success: true,
          data: { messageId: result.messageId, to, subject },
          summary: `邮件已发送至 ${to} (${result.messageId})`,
          status: 'success',
        };
      } else {
        return {
          success: false,
          data: { error: result.error },
          summary: `邮件发送失败: ${result.error}`,
          status: 'error',
        };
      }
    } catch (err) {
      return {
        success: false,
        data: { error: String(err) },
        summary: `邮件发送异常: ${String(err)}`,
        status: 'error',
      };
    }
  },
};

export default sendEmailSkill;
