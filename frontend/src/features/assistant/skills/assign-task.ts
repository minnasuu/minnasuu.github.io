import type { SkillHandler, SkillContext, SkillResult } from './types';
import { createWorkflow } from '../../../shared/utils/backendClient';
import type { CreateWorkflowRequest } from '../../../shared/utils/backendClient';

/** 从 generate-todo 的输出中解析任务条目 */
function parseTodos(input: unknown): { category: string; title: string; description: string }[] {
  const todos: { category: string; title: string; description: string }[] = [];

  if (!input) return todos;

  // 如果是字符串（Dify 返回的文本），按行解析
  const text = typeof input === 'string'
    ? input
    : (input as any).todos || (input as any).summary || '';

  if (typeof text === 'string' && text.trim()) {
    const lines = text.split('\n').filter(l => l.trim());

    let currentCategory = '其他';

    for (const line of lines) {
      const trimmed = line.trim();

      // 检测分类标题行
      if (/文章/.test(trimmed) && !/^[-*\d]/.test(trimmed)) {
        currentCategory = '文章';
        continue;
      }
      if (/[Cc]raft/.test(trimmed) && !/^[-*\d]/.test(trimmed)) {
        currentCategory = 'Crafts';
        continue;
      }
      if (/功能|扩展|feature/i.test(trimmed) && !/^[-*\d]/.test(trimmed)) {
        currentCategory = '功能扩展';
        continue;
      }

      // 匹配任务行（以 -、*、数字. 开头）
      const match = trimmed.match(/^[-*•]\s*(.+)$/) || trimmed.match(/^\d+[.)]\s*(.+)$/);
      if (match) {
        todos.push({
          category: currentCategory,
          title: match[1].replace(/[【】《》]/g, '').trim(),
          description: match[1].trim(),
        });
      }
    }
  }

  return todos;
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

/** 📌 任务分配 — 花椒 */
const assignTask: SkillHandler = {
  id: 'assign-task',
  async execute(ctx: SkillContext): Promise<SkillResult> {
    console.log(`[assign-task] agent=${ctx.agentId} @${ctx.timestamp}`);

    try {
      const todos = parseTodos(ctx.input);

      if (todos.length === 0) {
        return {
          success: true,
          data: { workflows: [], message: '没有解析到可分配的任务' },
          summary: '上游未产出可执行的任务条目，跳过分配',
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
      parts.push(`📌 任务分配完成：共 ${todos.length} 项，成功 ${created.length} 项`);
      if (created.length > 0) {
        parts.push('');
        const grouped = created.reduce((acc, c) => {
          (acc[c.category] = acc[c.category] || []).push(c.name);
          return acc;
        }, {} as Record<string, string[]>);
        for (const [cat, names] of Object.entries(grouped)) {
          const icon = CATEGORY_ICONS[cat] || '📌';
          parts.push(`${icon} ${cat}：${names.join('、')}`);
        }
      }
      if (failed.length > 0) {
        parts.push('');
        parts.push(`⚠️ 失败 ${failed.length} 项：${failed.map(f => f.name).join('、')}`);
      }

      return {
        success: failed.length === 0,
        data: { created, failed },
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
