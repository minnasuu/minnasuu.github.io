import type { SkillHandler, SkillContext, SkillResult } from './types';
import { callDifySkill } from '../../../shared/utils/backendClient';

/** 汇总上游所有步骤的输出，拼接为周会内容 */
function buildMeetingInput(input: unknown): string {
  if (!input) return '';

  if (typeof input === 'string') return input;

  const obj = input as Record<string, unknown>;
  const parts: string[] = [];

  // task-log 产出统计
  if (obj.summary && typeof obj.summary === 'string') {
    parts.push(`【产出统计】\n${obj.summary}`);
  }

  // site-analyze 诊断结论
  if (obj.analysis && typeof obj.analysis === 'string') {
    parts.push(`【网站诊断】\n${obj.analysis}`);
  }

  // generate-todo 代办清单
  if (obj.todos && typeof obj.todos === 'string') {
    parts.push(`【下周代办】\n${obj.todos}`);
  }

  // assign-task 任务分配结果
  if (obj.created && Array.isArray(obj.created)) {
    const list = (obj.created as { name: string; category: string }[])
      .map(c => `- [${c.category}] ${c.name}`)
      .join('\n');
    parts.push(`【任务分配】\n${list}`);
  }

  if (parts.length > 0) return parts.join('\n\n');

  // fallback：直接序列化
  return JSON.stringify(input, null, 2);
}

/** 📝 会议纪要 — 咪咪 */
const meetingNotes: SkillHandler = {
  id: 'meeting-notes',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[meeting-notes] agent=${ctx.agentId} @${ctx.timestamp}`);

    try {
      const meetingContent = buildMeetingInput(ctx.input);

      if (!meetingContent) {
        return {
          success: true,
          data: { notes: '' },
          summary: '没有收到上游周会内容，跳过纪要生成',
          status: 'warning',
        };
      }

      const text = `请根据以下周会内容生成结构化的会议纪要：\n\n${meetingContent}`;

      const response = await callDifySkill('meeting-notes', text);

      if (response.error) {
        return {
          success: false,
          data: { error: response.error },
          summary: `会议纪要生成失败: ${response.error}`,
          status: 'error',
        };
      }

      return {
        success: true,
        data: {
          notes: response.answer,
          conversationId: response.conversationId,
        },
        summary: response.answer,
        status: 'success',
      };
    } catch (err) {
      return {
        success: false,
        data: { error: String(err) },
        summary: `会议纪要生成异常: ${String(err)}`,
        status: 'error',
      };
    }
  },
};

export default meetingNotes;
