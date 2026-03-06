import type { SkillHandler, SkillContext, SkillResult } from './types';
import { sendEmail } from '../../../shared/utils/backendClient';
import { marked } from 'marked';

const DEFAULT_TO = 'minhansu508@gmail.com';

/** 将 markdown 文本转为 HTML */
function mdToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** 构建猫猫风格的通知邮件 HTML 模板 */
function buildCatNotificationHtml(subject: string, bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #FFF9F0;">
      <!-- 头部 -->
      <div style="background: linear-gradient(135deg, #FFF3E0, #E8F5E9); border-radius: 16px; padding: 24px 28px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 6px; color: #4E342E; font-size: 20px;">🐾 ${subject}</h2>
        <p style="margin: 0; color: #8D6E63; font-size: 13px;">${new Date().toLocaleString('zh-CN')}</p>
      </div>

      <!-- 称谓 -->
      <div style="padding: 0 4px; margin-bottom: 4px;">
        <p style="color: #5D4037; font-size: 15px; margin: 0;">老大！</p>
      </div>

      <!-- 正文 -->
      <div style="background: #fff; border: 1px solid #E0D6CC; border-radius: 12px; padding: 24px; line-height: 1.9; color: #333; font-size: 14px;">
        ${bodyHtml}
      </div>

      <!-- 落款 -->
      <div style="text-align: right; padding: 16px 8px 0; color: #8D6E63; font-size: 13px; line-height: 1.6;">
        <p style="margin: 0;">🐾 喵~</p>
        <p style="margin: 4px 0 0;">年年 代 猫咪军团 发出</p>
      </div>

      <!-- 底部 -->
      <div style="text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px dashed #E0D6CC;">
        <p style="color: #BCAAA4; font-size: 11px; margin: 0;">
          🏠 来自 Minna 个站 · I'm Minna ✨
        </p>
      </div>
    </div>
  `;
}

/** 🔔 推送通知 — 年年（通过邮件发送） */
const sendNotification: SkillHandler = {
  id: 'send-notification',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[send-notification] agent=${ctx.agentId} @${ctx.timestamp}`);

    // 从上游输入中提取内容
    const input = ctx.input as Record<string, unknown> | string | undefined;
    let subject = 'I-am-minna 猫猫团队通知';
    let body = '';

    if (typeof input === 'string') {
      body = input;
    } else if (input && typeof input === 'object') {
      subject = (input.subject as string) || subject;
      // 优先读取 notes（会议纪要），再 fallback
      body = (input.notes as string) || (input.html as string) || (input.text as string) || (input.summary as string) || JSON.stringify(input, null, 2);
    }

    if (!body) {
      body = '这是一封来自 Minna 猫猫团队的测试通知 🐱✨';
    }

    // 将 markdown 内容转为 HTML
    const bodyHtml = body.startsWith('<') ? body : mdToHtml(body);

    // 包装为猫猫风格邮件
    const html = buildCatNotificationHtml(subject, bodyHtml);

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
