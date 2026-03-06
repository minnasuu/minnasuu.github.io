import type { SkillHandler, SkillContext, SkillResult } from './types';
import { createWorkflow, callDifySkill } from '../../../shared/utils/backendClient';
import type { CreateWorkflowRequest } from '../../../shared/utils/backendClient';

interface TodoItem {
  category: string;
  title: string;
  description: string;
}

/** 从 AI 返回的 JSON 中解析任务列表，限制 0-5 个 */
function parseAITodos(answer: string): TodoItem[] {
  try {
    // 去掉可能的 markdown 代码块包裹
    let json = answer.trim();
    const codeBlockMatch = json.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      json = codeBlockMatch[1].trim();
    }

    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];

    // 过滤有效条目并限制 5 个
    const validCategories = ['文章', 'Crafts', '功能扩展'];
    return parsed
      .filter(
        (item: any) =>
          item &&
          typeof item.title === 'string' &&
          item.title.trim() &&
          typeof item.category === 'string' &&
          validCategories.includes(item.category)
      )
      .slice(0, 5)
      .map((item: any) => ({
        category: item.category,
        title: item.title.trim(),
        description: (item.description || item.title).trim(),
      }));
  } catch {
    console.warn('[assign-task] Failed to parse AI response as JSON, trying fallback');
    return [];
  }
}

/** 从上游 input 构建发送给 AI 的文本 */
function buildPromptText(input: unknown): string {
  if (!input) return '';

  if (typeof input === 'string') return input;

  if (typeof input === 'object' && input !== null) {
    const obj = input as Record<string, unknown>;
    const parts: string[] = [];

    if (obj.todos && typeof obj.todos === 'string') {
      parts.push(`代办清单：\n${obj.todos}`);
    }
    if (obj.analysis && typeof obj.analysis === 'string') {
      parts.push(`网站诊断：\n${obj.analysis}`);
    }
    if (obj.summary && typeof obj.summary === 'string') {
      parts.push(`产出统计：\n${obj.summary}`);
    }

    if (parts.length > 0) return parts.join('\n\n');

    // fallback: 序列化整个对象
    return JSON.stringify(obj, null, 2);
  }

  return '';
}

/** 根据分类决定负责的猫猫和 skill */
function getAgentForCategory(category: string): { agentId: string; skillId: string } {
  switch (category) {
    case '文章':
      return { agentId: 'writer', skillId: 'generate-article' };
    case 'Crafts':
      return { agentId: 'crafts', skillId: 'generate-component' };
    case '功能扩展':
      return { agentId: 'manager', skillId: 'manage-workflow' };
    default:
      return { agentId: 'manager', skillId: 'manage-workflow' };
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  '文章': '📝',
  'Crafts': '🎨',
  '功能扩展': '🔧',
  '其他': '📌',
};

/** 📌 任务分配 — 花椒（AI 辅助拆解） */
const assignTask: SkillHandler = {
  id: 'assign-task',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[assign-task] agent=${ctx.agentId} @${ctx.timestamp}`);

    try {
      // 构建发给 AI 的文本
      const promptText = buildPromptText(ctx.input);

      if (!promptText) {
        return {
          success: true,
          data: { workflows: [], message: '上游无内容可供分析' },
          summary: '上游未产出可执行的任务条目，跳过分配',
          status: 'warning',
        };
      }

      // 调用 AI 提取任务
      const response = await callDifySkill('assign-task', promptText);

      if (response.error) {
        return {
          success: false,
          data: { error: response.error },
          summary: `AI 任务拆解失败: ${response.error}`,
          status: 'error',
        };
      }

      const todos = parseAITodos(response.answer);

      if (todos.length === 0) {
        return {
          success: true,
          data: { workflows: [], message: 'AI 判断当前无需分配任务' },
          summary: 'AI 分析后认为当前无明确可执行任务，跳过分配',
          status: 'warning',
        };
      }

      // 为每个任务创建一个 workflow
      const created: { name: string; id: string; category: string }[] = [];
      const failed: { name: string; error: string }[] = [];

      for (const todo of todos) {
        const { agentId, skillId } = getAgentForCategory(todo.category);
        const icon = CATEGORY_ICONS[todo.category] || '📌';

        const workflow: CreateWorkflowRequest = {
          name: todo.title,
          icon,
          description: `[${todo.category}] ${todo.description}`,
          steps: [
            {
              agentId,
              skillId,
              action: todo.description,
            },
          ],
          scheduled: false,
          scheduledEnabled: false,
          persistent: false,
        };

        try {
          const result = await createWorkflow(workflow);
          created.push({ name: todo.title, id: result.id, category: todo.category });
        } catch (err) {
          failed.push({ name: todo.title, error: String(err) });
        }
      }

      // 生成摘要
      const parts: string[] = [];
      parts.push(`📌 AI 任务分配完成：共 ${todos.length} 项，成功 ${created.length} 项`);
      if (created.length > 0) {
        parts.push('');
        const grouped = created.reduce(
          (acc, c) => {
            (acc[c.category] = acc[c.category] || []).push(c.name);
            return acc;
          },
          {} as Record<string, string[]>
        );
        for (const [cat, names] of Object.entries(grouped)) {
          const icon = CATEGORY_ICONS[cat] || '📌';
          parts.push(`${icon} ${cat}：${names.join('、')}`);
        }
      }
      if (failed.length > 0) {
        parts.push('');
        parts.push(`⚠️ 失败 ${failed.length} 项：${failed.map((f) => f.name).join('、')}`);
      }

      return {
        success: failed.length === 0,
        data: { created, failed, conversationId: response.conversationId },
        summary: parts.join('\n'),
        status: failed.length === 0 ? 'success' : 'warning',
      };
    } catch (err) {
      return {
        success: false,
        data: { error: String(err) },
        summary: `任务分配异常: ${String(err)}`,
        status: 'error',
      };
    }
  },
};

export default assignTask;
