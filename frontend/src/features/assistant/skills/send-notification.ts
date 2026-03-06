import type { SkillHandler, SkillContext, SkillResult } from './types';
import { sendEmail } from '../../../shared/utils/backendClient';
import { marked } from 'marked';

const DEFAULT_TO = 'minhansu508@gmail.com';

/** 将 markdown 文本转为邮件友好的 HTML */
function markdownToEmailHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** 🔔 推送通知 — 年年（通过邮件发送） */
const sendNotification: SkillHandler = {
  id: 'send-notification',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[send-notification] agent=${ctx.agentId} @${ctx.timestamp}`);

    // 从上游输入中提取内容
    const input = ctx.input as Record<string, unknown> | string | undefined;
    let subject = '🐱 Minna 猫猫团队通知';
    let body = '';

    if (typeof input === 'string') {
      body = input;
    } else if (input && typeof input === 'object') {
      subject = (input.subject as string) || subject;
      body = (input.html as string) || (input.text as string) || (input.summary as string) || JSON.stringify(input, null, 2);
    }

    if (!body) {
      body = '<p>这是一封来自 Minna 猫猫团队的测试通知 🐱✨</p>';
    }

    // 将 markdown 内容转为 HTML
    const bodyHtml = body.startsWith('<') ? body : markdownToEmailHtml(body);

    // 包装为 HTML 邮件
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #FFF3E0, #E8F5E9); border-radius: 16px; padding: 24px; margin-bottom: 16px;">
          <h2 style="margin: 0 0 8px; color: #5D4037;">🐱 ${subject}</h2>
          <p style="margin: 0; color: #8D6E63; font-size: 13px;">${new Date().toLocaleString('zh-CN')}</p>
        </div>
        <div style="background: #fff; border: 1px solid #E0D6CC; border-radius: 12px; padding: 20px; line-height: 1.8; color: #333;">
          ${bodyHtml}
        </div>
        <p style="text-align: center; color: #BCAAA4; font-size: 12px; margin-top: 16px;">
          由年年 🐱 从 Minna 个站发出 — I'm Minna ✨
        </p>
      </div>
    `;

    try {
      const result = await sendEmail({
        to: DEFAULT_TO,
        subject,
        html,
      });

      if (result.success) {
        return {
          success: true,
          data: { messageId: result.messageId, to: DEFAULT_TO },
          summary: `邮件已发送至 ${DEFAULT_TO} (${result.messageId})`,
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

export default sendNotification;
