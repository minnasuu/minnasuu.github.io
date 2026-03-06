/** Skill 事件执行上下文 */
export interface SkillContext {
  /** 触发该 skill 的 agentId */
  agentId: string;
  /** 输入数据（来自上游 step 或用户） */
  input: unknown;
  /** 当前时间戳 */
  timestamp: string;
}

/** Skill 事件执行结果 */
export interface SkillResult {
  /** 是否成功 */
  success: boolean;
  /** 输出数据 */
  data: unknown;
  /** 结果描述（人类可读） */
  summary: string;
  /** 状态 */
  status: 'success' | 'warning' | 'error';
}

/** Skill 事件处理器 */
export interface SkillHandler {
  /** skill id，与 data.ts 中的 Skill.id 一一对应 */
  id: string;
  /** 执行入口 */
  execute: (ctx: SkillContext) => Promise<SkillResult>;
}
