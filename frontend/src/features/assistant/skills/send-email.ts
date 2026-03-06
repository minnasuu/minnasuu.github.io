import type { SkillHandler, SkillContext, SkillResult } from './types';
import { sendEmail } from '../../../shared/utils/backendClient';
import { marked } from 'marked';

const DEFAULT_TO = 'minhansu508@gmail.com';

/** 将 markdown 文本转为邮件 HTML（不含外层模板） */
function mdToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** 构建猫猫风格的邮件 HTML 模板 */
function buildCatEmailHtml(subject: string, bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #FFF9F0;">
      <!-- 头部 -->
      <div style="background: linear-gradient(135deg, #FFE0B2, #FFCCBC); border-radius: 16px; padding: 24px 28px; margin-bottom: 20px;">
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
      // 优先读取 notes（会议纪要），再 fallback 到 text/summary
      text = (input.notes as string) || (input.text as string) || (input.summary as string) || '';
    }

    if (!html && !text) {
      text = '这是一封来自 Minna 猫猫团队的邮件 🐱';
    }

    // 如果只有 text（可能含 markdown），转为 HTML 并包裹模板
    if (!html && text) {
      const bodyHtml = mdToHtml(text);
      html = buildCatEmailHtml(subject, bodyHtml);
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
