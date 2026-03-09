import type { SkillHandler, SkillContext, SkillResult } from './types';
import { callDifySkill } from '../../../shared/utils/backendClient';

/** agentId → 猫猫名映射 */
const AGENT_NAMES: Record<string, string> = {
  manager: '花椒',
  writer: '阿蓝',
  analytics: '雪',
  email: '年年',
  crafts: '小虎',
  image: 'Pixel',
  text: '黄金',
  sing: '咪咪',
  milk: '小白',
  hr: '发发',
};

/** 从上游 input 中提取所有出现过的 agentId */
function extractAttendees(input: unknown): string[] {
  if (!input || typeof input !== 'object') return [];

  const obj = input as Record<string, unknown>;
  const agentIds = new Set<string>();

  // 从 assign-task 的 created 列表中提取
  if (Array.isArray(obj.created)) {
    for (const item of obj.created as Record<string, unknown>[]) {
      if (typeof item.agentId === 'string') agentIds.add(item.agentId);
    }
  }

  // 从上游传递的 _attendees 字段（如果有）
  if (Array.isArray(obj._attendees)) {
    for (const id of obj._attendees) {
      if (typeof id === 'string') agentIds.add(id);
    }
  }

  return Array.from(agentIds);
}

/** 汇总上游所有步骤的输出，拼接为周会内容 */
function buildMeetingInput(input: unknown, attendeeNames: string[], date: string): string {
  const parts: string[] = [];

  // 会议元信息
  parts.push(`【会议信息】`);
  parts.push(`日期：${date}`);
  parts.push(`主持人：咪咪`);
  if (attendeeNames.length > 0) {
    parts.push(`参会人：咪咪、${attendeeNames.join('、')}`);
  } else {
    parts.push(`参会人：咪咪`);
  }

  if (!input) return parts.join('\n');

  if (typeof input === 'string') {
    parts.push('');
    parts.push(input);
    return parts.join('\n');
  }

  const obj = input as Record<string, unknown>;

  const contentParts: string[] = [];

  // task-log 产出统计
  if (obj.summary && typeof obj.summary === 'string') {
    contentParts.push(`【产出统计】\n${obj.summary}`);
  }

  // site-analyze 诊断结论
  if (obj.analysis && typeof obj.analysis === 'string') {
    contentParts.push(`【网站诊断】\n${obj.analysis}`);
  }

  // generate-todo 代办清单
  if (obj.todos && typeof obj.todos === 'string') {
    contentParts.push(`【下周代办】\n${obj.todos}`);
  }

  // assign-task 任务分配结果
  if (obj.created && Array.isArray(obj.created)) {
    const list = (obj.created as { name: string; category: string }[])
      .map((c) => `- [${c.category}] ${c.name}`)
      .join('\n');
    contentParts.push(`【任务分配】\n${list}`);
  }

  // 会议纪要（如果已有上游生成）
  if (obj.notes && typeof obj.notes === 'string') {
    contentParts.push(`【会议纪要】\n${obj.notes}`);
  }

  if (contentParts.length > 0) {
    parts.push('');
    parts.push(...contentParts);
    return parts.join('\n\n');
  }

  // fallback：序列化整个对象（排除内部字段）
  const { _attendees, ...rest } = obj;
  parts.push(`\n${JSON.stringify(rest, null, 2)}`);
  return parts.join('\n');
}

/** 📝 会议纪要 — 咪咪 */
const meetingNotes: SkillHandler = {
  id: 'meeting-notes',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[meeting-notes] agent=${ctx.agentId} @${ctx.timestamp}`);

    try {
      // 获取执行日期
      const now = new Date(ctx.timestamp);
      const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

      // 提取参会猫猫
      const attendeeIds = extractAttendees(ctx.input);
      // 咪咪是主持人，不重复列入
      const attendeeNames = attendeeIds
        .filter((id) => id !== 'sing')
        .map((id) => AGENT_NAMES[id] || id);

      const meetingContent = buildMeetingInput(ctx.input, attendeeNames, dateStr);

      // 检查是否有实质性内容（不仅仅是会议元信息）
      const hasContent = meetingContent.includes('【产出统计】') ||
        meetingContent.includes('【网站诊断】') ||
        meetingContent.includes('【下周代办】') ||
        meetingContent.includes('【任务分配】') ||
        meetingContent.includes('【会议纪要】');

      if (!hasContent) {
        return {
          success: true,
          data: { notes: '' },
          summary: '没有收到上游周会内容，跳过纪要生成',
          status: 'warning',
        };
      }

      const text = `请根据以下周会内容生成会议纪要（标题请由你总结，不要用泛称）：\n\n${meetingContent}`;

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
