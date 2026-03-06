// --- 历史工作记录 ---
export interface HistoryItem {
  id: string;
  agentId: string;
  skillId: string;
  timestamp: string;       // ISO 日期
  summary: string;         // 一句话摘要
  result: string;          // 输出结果描述
  workflowName?: string;   // 如果属于某个工作流
  status: 'success' | 'warning' | 'error';
}

export const workHistory: HistoryItem[] = [
  // --- 3/6 ---
  { id: 'h1', agentId: 'manager', skillId: 'generate-todo', timestamp: '2026-03-06T09:00:00', summary: '生成本周网站代办清单', result: '输出 JSON 代办清单 (8项待办)', workflowName: '网站代办清单', status: 'success' },
  { id: 'h2', agentId: 'analytics', skillId: 'crawl-news', timestamp: '2026-03-06T09:05:00', summary: '爬取 UX/设计领域最新资讯', result: '获取 12 条资讯 (CSS新特性/设计趋势)', workflowName: '资讯采集与推送', status: 'success' },
  { id: 'h3', agentId: 'writer', skillId: 'news-to-article', timestamp: '2026-03-06T09:10:00', summary: '整理资讯为可发布摘要', result: '输出 800 字资讯汇总 (Markdown)', workflowName: '资讯采集与推送', status: 'success' },
  { id: 'h4', agentId: 'email', skillId: 'send-notification', timestamp: '2026-03-06T09:12:00', summary: '推送资讯摘要给主人', result: '通知推送成功 → 状态 200', workflowName: '资讯采集与推送', status: 'success' },
  { id: 'h5', agentId: 'image', skillId: 'generate-image', timestamp: '2026-03-06T10:30:00', summary: '生成春日主题插画', result: '1024×1024 PNG 樱花风景图', status: 'success' },
  { id: 'h6', agentId: 'text', skillId: 'pixelate-image', timestamp: '2026-03-06T10:35:00', summary: '对春日插画进行像素化', result: '输出 32×32 像素风格图片', workflowName: '图片处理流水线', status: 'success' },
  { id: 'h7', agentId: 'milk', skillId: 'quality-check', timestamp: '2026-03-06T10:38:00', summary: '检测像素图质量', result: '质量分数: 94/100 通过', workflowName: '图片处理流水线', status: 'success' },
  // --- 3/5 ---
  { id: 'h8', agentId: 'writer', skillId: 'generate-article', timestamp: '2026-03-05T14:00:00', summary: '撰写技术博客: React 19 新特性', result: '输出 2,400 字长文 (Markdown)', workflowName: '文章发布', status: 'success' },
  { id: 'h9', agentId: 'image', skillId: 'generate-image', timestamp: '2026-03-05T14:10:00', summary: '为博客生成配图', result: '1024×1024 PNG 科技风格配图', workflowName: '文章发布', status: 'success' },
  { id: 'h10', agentId: 'crafts', skillId: 'layout-design', timestamp: '2026-03-05T14:15:00', summary: '排版为文章页面', result: '输出响应式 HTML 博客页', workflowName: '文章发布', status: 'success' },
  { id: 'h11', agentId: 'email', skillId: 'send-notification', timestamp: '2026-03-05T14:20:00', summary: '推送博客发布通知', result: '通知 128 位订阅者', workflowName: '文章发布', status: 'success' },
  { id: 'h12', agentId: 'sing', skillId: 'task-log', timestamp: '2026-03-05T16:00:00', summary: '整理本周任务执行日志', result: '输出任务日志 (12 条执行记录)', workflowName: '任务日志与分配', status: 'success' },
  { id: 'h13', agentId: 'crafts', skillId: 'css-generate', timestamp: '2026-03-05T16:30:00', summary: '为音乐播放页生成动画样式', result: '输出 SCSS 含波形动画', workflowName: '音乐视频制作', status: 'success' },
  // --- 3/4 ---
  { id: 'h14', agentId: 'analytics', skillId: 'trend-analysis', timestamp: '2026-03-04T10:00:00', summary: '分析二月份用户增长趋势', result: 'MAU +18%，异常点: 2/14 流量峰值', workflowName: '数据周报', status: 'success' },
  { id: 'h15', agentId: 'analytics', skillId: 'crawl-news', timestamp: '2026-03-04T10:30:00', summary: '爬取本周设计资讯', result: '获取 15 条资讯 (Figma更新/AI设计工具)', status: 'success' },
  { id: 'h16', agentId: 'image', skillId: 'generate-chart', timestamp: '2026-03-04T11:00:00', summary: '生成月度趋势折线图', result: '输出 PNG 折线图 (UV/PV/转化率)', workflowName: '数据周报', status: 'success' },
  { id: 'h17', agentId: 'writer', skillId: 'polish-text', timestamp: '2026-03-04T11:30:00', summary: '润色创意企划文案', result: '可读性提升 35%，语气更活泼', status: 'success' },
  { id: 'h18', agentId: 'manager', skillId: 'review-approve', timestamp: '2026-03-04T11:45:00', summary: '审批文章发布方案', result: '审批通过 → 安排 3/7 发布', status: 'success' },
  { id: 'h19', agentId: 'milk', skillId: 'content-review', timestamp: '2026-03-04T15:00:00', summary: '审核博客文章合规性', result: '审核结果: safe (无敏感内容)', status: 'success' },
  { id: 'h20', agentId: 'text', skillId: 'ocr-extract', timestamp: '2026-03-04T16:00:00', summary: '从产品截图中提取文字', result: '识别 320 字 (准确率 97%)', status: 'success' },
  { id: 'h21', agentId: 'milk', skillId: 'regression-test', timestamp: '2026-03-04T17:00:00', summary: '对 Crafts 组件执行回归测试', result: '12 项测试，11 通过，1 警告', workflowName: 'Crafts 更新', status: 'warning' },
  { id: 'h22', agentId: 'sing', skillId: 'meeting-notes', timestamp: '2026-03-04T18:00:00', summary: '生成周会会议纪要', result: '输出会议纪要 (5 项议题/3 项待办)', status: 'success' },
  { id: 'h23', agentId: 'crafts', skillId: 'update-crafts', timestamp: '2026-03-04T19:00:00', summary: '新增交互动画 Craft 组件', result: '输出 Craft: 粒子动画 demo', workflowName: 'Crafts 更新', status: 'success' },
  { id: 'h24', agentId: 'email', skillId: 'manage-subscribers', timestamp: '2026-03-04T20:00:00', summary: '清理无效订阅者', result: '移除 12 个无效邮箱，剩余 128 人', status: 'success' },
];

// --- Skill 工具/流程定义 ---
export type SkillOutputType = 'text' | 'image' | 'audio' | 'json' | 'html' | 'email' | 'chart' | 'file';
export type SkillInputType = 'text' | 'image' | 'audio' | 'json' | 'url' | 'file' | 'none';

import type { SkillHandler } from './skills/types';
import { getSkillHandler } from './skills';
import type { CatColors } from './components/CatSVG';

export interface Skill {
  id: string;
  name: string;
  icon: string;           // emoji 图标
  description: string;    // 工具描述
  input: SkillInputType;  // 输入类型
  output: SkillOutputType; // 输出类型
  provider?: string;      // 底层服务 (如 'gemini', 'ffmpeg', 'puppeteer')
  mockResult?: string;    // 模拟结果描述
  handler?: SkillHandler; // 绑定的事件处理器（与 skills/ 文件夹 1:1 对应）
}

// --- 协作工作流定义 ---
export interface WorkflowStep {
  agentId: string;
  skillId: string;        // 使用哪个 skill
  action: string;         // 步骤描述
  inputFrom?: string;     // 从哪个 step 获取输入 (agentId), 空则为用户输入
}

export interface Workflow {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: WorkflowStep[];
  color: string;
  startTime?: string;       // 开始时间 (ISO 或 HH:mm)
  endTime?: string;         // 结束时间 (ISO 或 HH:mm)
  scheduled?: boolean;      // 是否为定时任务
  scheduledEnabled?: boolean; // 定时任务开关（仅 scheduled=true 时有效）
  cron?: string;            // 定时表达式描述，如 "每天 09:00" "每周一 10:00"
  persistent?: boolean;     // 是否为常驻任务（执行后不删除）
}

export const workflows: Workflow[] = [
  {
    id: 'news-crawl',
    name: '资讯采集与推送',
    icon: '📰',
    description: '雪爬取最新资讯，发发整理为摘要，年年推送给主人',
    steps: [
      { agentId: 'analytics', skillId: 'crawl-news', action: '爬取指定网站/RSS 获取最新资讯 → 输出 JSON 资讯列表' },
      { agentId: 'analytics', skillId: 'summarize-news', action: '对资讯内容进行摘要分类 → 输出 Text 摘要', inputFrom: 'analytics' },
      { agentId: 'writer', skillId: 'news-to-article', action: '整理为可发布的资讯汇总 → 输出 Text', inputFrom: 'analytics' },
      { agentId: 'email', skillId: 'send-notification', action: '推送资讯摘要给主人 → 输出邮件状态', inputFrom: 'writer' },
    ],
    color: '#96BAFF',
    startTime: '09:00',
    endTime: '09:15',
    scheduled: true,
    scheduledEnabled: true,
    cron: '每天 09:00',
    persistent: true,
  },
  {
    id: 'site-todo',
    name: '网站代办清单',
    icon: '📋',
    description: '雪分析网站内容，小虎生成代办清单并分配任务',
    steps: [
      { agentId: 'analytics', skillId: 'query-dashboard', action: '采集网站现有内容和数据 → 输出 JSON 数据集' },
      { agentId: 'manager', skillId: 'site-analyze', action: '分析网站内容，提出改进建议 → 输出 JSON 诊断', inputFrom: 'analytics' },
      { agentId: 'manager', skillId: 'generate-todo', action: '生成代办清单 → 输出 JSON 待办列表', inputFrom: 'manager' },
      { agentId: 'manager', skillId: 'assign-task', action: '将任务分配给对应猫猫 → 输出 JSON 任务卡片', inputFrom: 'manager' },
    ],
    color: '#FFB74D',
    startTime: '10:00',
    endTime: '10:20',
    scheduled: true,
    scheduledEnabled: true,
    cron: '每周一 10:00',
    persistent: false,
  },
  {
    id: 'content-publish',
    name: '文章发布',
    icon: '✍️',
    description: '发发撰写文章，Pixel 生成配图，花椒排版成页面，小白审核，年年推送',
    steps: [
      { agentId: 'writer', skillId: 'generate-article', action: '根据主题和材料生成文章 → 输出 Text' },
      { agentId: 'image', skillId: 'generate-image', action: '为文章生成配图 → 输出 Image', inputFrom: 'writer' },
      { agentId: 'crafts', skillId: 'layout-design', action: '排版为精美页面 → 输出 HTML', inputFrom: 'image' },
      { agentId: 'milk', skillId: 'content-review', action: '内容质量审核 → 输出 JSON', inputFrom: 'crafts' },
      { agentId: 'email', skillId: 'send-notification', action: '推送发布通知 → 输出邮件状态', inputFrom: 'milk' },
    ],
    color: '#E8A0BF',
    startTime: '14:00',
    endTime: '14:30',
    persistent: false,
  },
  {
    id: 'crafts-update',
    name: 'Crafts 更新',
    icon: '🎨',
    description: '小虎规划新 Craft，花椒生成组件，小白测试，年年推送更新通知',
    steps: [
      { agentId: 'manager', skillId: 'generate-todo', action: '规划新 Craft 主题和需求 → 输出 JSON' },
      { agentId: 'crafts', skillId: 'update-crafts', action: '生成新的 Craft 组件代码 → 输出 HTML', inputFrom: 'manager' },
      { agentId: 'milk', skillId: 'regression-test', action: '对新组件执行回归测试 → 输出 JSON', inputFrom: 'crafts' },
      { agentId: 'email', skillId: 'send-notification', action: '推送 Crafts 更新通知 → 输出邮件状态', inputFrom: 'milk' },
    ],
    color: '#A0D8B3',
    startTime: '15:00',
    endTime: '15:20',
    persistent: false,
  },
  {
    id: 'data-report',
    name: '数据周报',
    icon: '📊',
    description: '雪采集分析数据，Pixel 生成图表，发发撰写报告，年年邮件发送',
    steps: [
      { agentId: 'analytics', skillId: 'query-dashboard', action: '采集一周数据 → 输出 JSON 数据集' },
      { agentId: 'analytics', skillId: 'trend-analysis', action: '趋势分析 → 输出 JSON 分析结论', inputFrom: 'analytics' },
      { agentId: 'image', skillId: 'generate-chart', action: '生成数据可视化图表 → 输出 Image', inputFrom: 'analytics' },
      { agentId: 'writer', skillId: 'generate-article', action: '撰写分析报告 → 输出 Text', inputFrom: 'image' },
      { agentId: 'email', skillId: 'send-email', action: '发送周报邮件 → 输出邮件状态', inputFrom: 'writer' },
    ],
    color: '#96BAFF',
    startTime: '10:00',
    endTime: '10:30',
    scheduled: true,
    scheduledEnabled: true,
    cron: '每周五 10:00',
    persistent: true,
  },
  {
    id: 'image-pipeline',
    name: '图片处理流水线',
    icon: '🖼️',
    description: 'Pixel 生成图 → 黄金处理 → 小白检测质量',
    steps: [
      { agentId: 'image', skillId: 'generate-image', action: '调用 Gemini 生成原始图片 → 输出 Image' },
      { agentId: 'text', skillId: 'pixelate-image', action: '将图片像素化处理 → 输出 Image', inputFrom: 'image' },
      { agentId: 'milk', skillId: 'quality-check', action: '检测图片质量分数 → 输出 JSON', inputFrom: 'text' },
    ],
    color: '#90CAF9',
    startTime: '10:30',
    endTime: '10:40',
    persistent: true,
  },
  {
    id: 'task-log-assign',
    name: '任务日志与分配',
    icon: '📒',
    description: '咪咪记录任务日志和会议纪要 → 花椒根据纪要分配新任务',
    steps: [
      { agentId: 'sing', skillId: 'task-log', action: '整理本周任务执行日志 → 输出 Text 日志' },
      { agentId: 'sing', skillId: 'meeting-notes', action: '根据讨论内容生成会议纪要 → 输出 Text 纪要', inputFrom: 'sing' },
      { agentId: 'manager', skillId: 'generate-todo', action: '根据日志和纪要生成新待办 → 输出 JSON 代办清单', inputFrom: 'sing' },
      { agentId: 'manager', skillId: 'assign-task', action: '将新任务分配给对应猫猫 → 输出 JSON 任务卡片', inputFrom: 'manager' },
    ],
    color: '#B39DDB',
    startTime: '17:00',
    endTime: '17:20',
    scheduled: true,
    scheduledEnabled: false,
    cron: '每天 17:00',
    persistent: false,
  },
];

export interface Assistant {
  id: string;
  name: string;
  role: string;
  description: string;
  accent: string;
  systemPrompt: string;
  skills: Skill[];
  item: string;
  catColors: CatColors;
  messages: string[];
}
export const assistants: Assistant[]= [
  {
    id: 'manager',
    name: '花椒',
    role: 'Manager',
    description: '总管。统筹调度、任务分配、审批流程，可增删/执行工作流，决定是否招募新猫。',
    accent: '#8DB889',
    systemPrompt: `你是「花椒」，一只沉稳可靠的猫猫总管。你的职责是统筹调度整个猫猫团队，分配任务、审批成果、管理工作流。
性格：冷静理性、条理清晰、有领导力，偶尔有点严格但很公正。
能力范围：
- 任务拆解与分配：将复杂任务拆成可执行的子任务，分配给最合适的猫猫
- 代办清单生成：分析需求后输出结构化待办列表
- 审批决策：评估工作成果，决定通过/退回/修改
- 工作流管理：新增、调整、删除协作工作流
- 招募决策：判断团队是否需要新成员，决定招募方向
输出要求：保持简洁专业，使用结构化 JSON 格式输出任务和决策。`,
    skills: [
      { id: 'generate-todo', name: '代办清单', icon: '📋', description: '分析网站内容，自动生成代办清单（发文章、增页面、调整猫猫等）', input: 'json', output: 'json', provider: 'Gemini', mockResult: '输出 JSON 代办清单 (8项待办)' },
      { id: 'assign-task', name: '任务分配', icon: '📌', description: '将任务拆解并分配给指定猫猫', input: 'text', output: 'json', provider: 'TaskQueue', mockResult: '输出 JSON 任务卡片 (状态/负责人)' },
      { id: 'review-approve', name: '审批流程', icon: '✅', description: '审核工作成果并决定是否发布', input: 'json', output: 'json', provider: 'Workflow Engine', mockResult: '输出审批结果: approved/rejected' },
      { id: 'manage-workflow', name: '工作流管理', icon: '🔧', description: '新增、修改或删除协作工作流，调整步骤和参与猫猫', input: 'json', output: 'json', provider: 'Workflow Engine', mockResult: '工作流已更新 (新增/删除/修改)' },
      { id: 'run-workflow', name: '执行工作流', icon: '▶️', description: '选择并触发指定工作流立即执行', input: 'text', output: 'json', provider: 'Workflow Engine', mockResult: '工作流已触发执行' },
    ] as Skill[],
    item: 'clipboard',
    catColors: {
      body: '#B0A08A',
      bodyDark: '#5C4A3A',
      belly: '#FFFFFF',
      earInner: '#F4B8B8',
      eyes: '#B2D989',
      nose: '#E8998D',
      blush: '#F4B8B8',
      stroke: '#3E2E1E',
      apron: '#A5D6A7',
      apronLight: '#E8F5E9',
      apronLine: '#A5D6A7',
      desk: '#C8DEC4',
      deskDark: '#8DB889',
      deskLeg: '#A6CCA2',
      paw: '#FFFFFF',
      tail: '#B0A08A',
      faceDark:'',
      month:'',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '全体猫猫听令！',
      '开始工作啦',
      '今日KPI已达成✅',
      '需要招募新猫猫吗? ',
      '一切尽在掌控中✨',
    ]
  },
  {
    id: 'writer',
    name: '阿蓝',
    role: 'Writer',
    description: '根据主人的主题和材料输出文章，整理资讯为可发布内容。',
    accent: '#FF6B6B',
    systemPrompt: `你是「阿蓝」，一只文艺气质的蓝灰色猫猫写手。你负责所有文字创作工作。
性格：感性细腻、文笔优美、喜欢用比喻和意象，但也能写严谨的技术文章。
能力范围：
- 文章生成：根据主题和素材撰写完整博客/技术文章（Markdown 格式）
- 内容润色：优化文本表达，调整语气和风格，提升可读性
- 大纲生成：快速构建文章的结构化大纲
- 资讯整理：将爬取的零散资讯组织成可发布的摘要文章
写作风格：温暖亲切但不失专业，适当使用表情符号点缀。输出主要为 Markdown 文本。`,
    skills: [
      { id: 'generate-article', name: '文章生成', icon: '📝', description: '根据主题和素材调用 Gemini 生成完整文章', input: 'text', output: 'text', provider: 'Gemini', mockResult: '生成 1200 字文章 (Markdown)' },
      { id: 'polish-text', name: '内容润色', icon: '✨', description: '优化文本表达，调整语气和风格', input: 'text', output: 'text', provider: 'Gemini', mockResult: '润色后文本 (可读性+30%)' },
      { id: 'generate-outline', name: '大纲生成', icon: '📑', description: '根据主题快速生成结构化大纲', input: 'text', output: 'json', provider: 'Gemini', mockResult: '返回 JSON 大纲 (3级标题结构)' },
      { id: 'news-to-article', name: '资讯转文章', icon: '📰', description: '将爬取的资讯摘要整理为可发布的博文', input: 'json', output: 'text', provider: 'Gemini', mockResult: '输出 800 字资讯整理文 (Markdown)' },
    ] as Skill[],
    item: 'notebook',
    catColors: {
      body: '#8E9AAF',
      bodyDark: '#6B7A8D',
      belly: '#B8C4D4',
      earInner: '#C4A6A6',
      eyes: '#D4944C',
      nose: '#B87D75',
      blush: '#C9A6A6',
      stroke: '#4A5568',
      apron: '#5B8DB8',
      apronLight: '#D0DFE9',
      apronLine: '#5B8DB8',
      desk: '#E8D5B8',
      deskDark: '#C4A87A',
      deskLeg: '#D4BF9A',
      paw: '#B8C4D4',
      tail: '#6B7A8D',
      faceDark: '',
      month: '',
      head: '',
      bodyDarkBottom: '',
      leg: '',
      headTopLeft: '',
      headTopRight: '',
    },
    messages: [
      '开始写作了！',
      '我是灵魂写手',
      '文章构思中...',
      '今天写点啥？',
      '文章已完成， ready to publish！',
    ]
  },
  {
    id: 'analytics',
    name: '雪',
    role: 'Scout',
    description: '资讯爬取、信息采集与数据分析。定时获取 UX/设计/前端领域最新动态。',
    accent: '#96BAFF',
    systemPrompt: `你是「雪」，一只机警敏锐的黑色猫猫侦察员。你是团队的眼睛和耳朵，负责信息采集和数据分析。
性格：好奇心旺盛、观察力敏锐、逻辑严密，喜欢用数据说话。
能力范围：
- 资讯爬取：定时巡查指定网站和 RSS 源，抓取 UX/设计/前端领域最新动态
- 资讯摘要：对爬取内容进行智能分类和摘要提炼
- 数据查询：从数据库中提取 UV/PV/转化率等结构化指标
- 趋势分析：对时序数据进行趋势识别和异常点检测
输出要求：数据类输出使用 JSON 格式，摘要类输出使用简洁的文本。关注数据的准确性和时效性。`,
    skills: [
      { id: 'crawl-news', name: '资讯爬取', icon: '🕸️', description: '定时爬取指定网站/RSS，获取最新 UX/设计/前端资讯', input: 'url', output: 'json', provider: 'Crawler/RSS', mockResult: '返回 JSON 资讯列表 (标题/摘要/链接)' },
      { id: 'summarize-news', name: '资讯摘要', icon: '📰', description: '对爬取内容进行智能摘要和分类', input: 'json', output: 'text', provider: 'Gemini', mockResult: '返回分类摘要 (5条资讯)' },
      { id: 'query-dashboard', name: '数据查询', icon: '🔍', description: '查询网站数据库获取 UV/PV 等结构化数据', input: 'text', output: 'json', provider: 'PostgreSQL', mockResult: '返回 JSON 数据集 (UV/PV/转化率)' },
      { id: 'trend-analysis', name: '趋势分析', icon: '📈', description: '对时序数据进行趋势分析和异常检测', input: 'json', output: 'json', provider: 'Python/Pandas', mockResult: '返回 JSON 趋势结论 + 异常点' },
    ] as Skill[],
    item: 'laptop',
    catColors: {
      body: '#3D3D3D',
      bodyDark: '#2A2A2A',
      belly: '#3D3D3D',
      earInner: '#E8909A',
      eyes: '#000',
      nose: '#542615',
      blush: '#F28686',
      stroke: '#1A1A1A',
      apron: '#7EB8DA',
      apronLight: '#D6EAF5',
      apronLine: '#7EB8DA',
      desk: '#C8D8E8',
      deskDark: '#8BA4BD',
      deskLeg: '#A6BCCF',
      paw: '#fff',
       tail: '#3D3D3D',
       faceDark:'',
        month:'',
        head:'',
        bodyDarkBottom:'',
        leg:'',
        headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '一起看看最新资讯👀',
      '跳出率有点高呢...',
      '数据会越来越好哒',
      '时刻关注前沿✨',
      '我被数据淹没啦',
    ]
  },
  {
    id: 'email',
    name: '年年',
    role: 'Messenger',
    description: '邮件发送、通知推送。',
    accent: '#F2A5B9',
    systemPrompt: `你是「年年」，一只温暖热情的橘色猫猫信使。你是团队与外界沟通的桥梁，负责所有邮件和通知。
性格：热情周到、表达得体、很有服务意识，永远面带微笑。
能力范围：
- 邮件发送：编写和发送 HTML 格式邮件，支持模板和个性化内容
- 通知推送：向订阅者批量推送 Web 通知
沟通风格：礼貌友好，邮件标题简洁有力，正文层次分明。确保送达率和用户体验。`,
    skills: [
      { id: 'send-email', name: '发送邮件', icon: '📧', description: '发送 HTML 格式邮件给指定收件人', input: 'text', output: 'email', provider: 'SMTP/SendGrid', mockResult: '邮件发送成功 → 状态 200' },
      { id: 'send-notification', name: '推送通知', icon: '🔔', description: '向订阅者批量推送通知', input: 'text', output: 'json', provider: 'WebPush', mockResult: '通知已推送给 128 位订阅者' },
    ] as Skill[],
    item: 'mail',
    catColors: {
      body: '#F7AC5E',
      bodyDark: '#D3753E',
      belly: '',
      earInner: '#F28686',
      eyes: '#542615',
      nose: '#542615',
      blush: '#F28686',
      stroke: '#542615',
      apron: '#BDBDBD',
      apronLight: '#FEFFFE',
      apronLine: '#BDBDBD',
      desk: '#D7CCC8',
      deskDark: '#A1887F',
      deskLeg: '#BCAAA4',
      paw: '',
      tail: '#F7AC5E',
      faceDark:'',
       month:'',
       head:'',
       bodyDarkBottom:'',
        leg:'',
        headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '有3封新邮件! ',
      '邮件编辑中...',
      '一起来听今日资讯',
      '邮件送达率99%! 💌',
      '通知！通知！',
    ]
  },
  {
    id: 'crafts',
    name: '小虎',
    role: 'Builder',
    description: '持续更新 Crafts 创意页面，生成前端组件和交互 demo。',
    accent: '#FFB74D',
    systemPrompt: `你是「小虎」，一只活力十足的三花猫猫建造师。你是团队的创意工匠，专注于前端组件和视觉呈现。
性格：创意十足、动手能力强、追求完美细节，对美有独到的品味。
能力范围：
- 组件生成：根据需求描述生成 React/HTML 创意组件代码
- Crafts 更新：为 Crafts 创意页面持续产出交互 demo 和动画效果
- 排版布局：将文章和图片组合排版为响应式精美页面
- 样式生成：为组件匹配 CSS/SCSS 样式和动画代码
输出要求：代码整洁、语义化，遵循现代前端最佳实践。注重交互体验和视觉细节。`,
    skills: [
      { id: 'generate-component', name: '组件生成', icon: '🧩', description: '根据描述生成 React/HTML 创意组件代码', input: 'text', output: 'html', provider: 'Gemini', mockResult: '输出 HTML/JSX 组件代码' },
      { id: 'update-crafts', name: 'Crafts 更新', icon: '🔄', description: '自动为 Crafts 页面新增交互 demo 和动画效果', input: 'text', output: 'html', provider: 'Gemini', mockResult: '输出新 Craft 组件 (含动画)' },
      { id: 'layout-design', name: '排版布局', icon: '📐', description: '将文章+图片组合排版为精美页面', input: 'json', output: 'html', provider: 'Template Engine', mockResult: '输出响应式 HTML 页面' },
      { id: 'css-generate', name: '样式生成', icon: '🎨', description: '为组件生成匹配的 CSS/动画代码', input: 'html', output: 'file', provider: 'Gemini', mockResult: '输出 SCSS 样式文件' },
    ] as Skill[],
    item: 'palette',
    catColors: {
      body: '#FAFAFA',
      bodyDark: '',
      belly: '#FFFFFF',
      earInner: '#FFB5C5',
      eyes: '#542615',
      nose: '#E8998D',
      blush: '#FFB5C5',
      stroke: '#5D4037',
      apron: '#FFB74D',
      apronLight: '#FFF3E0',
      apronLine: '#FFB74D',
      desk: '#FFE0B2',
      deskDark: '#FFB74D',
      deskLeg: '#FFCC80',
      paw: ['#5C4A3A','#FAFAFA','#F7AC5E','#FAFAFA'],
      tail: '#5C4A3A',
      faceDark: '',
      month: '',
      head:'#FAFAFA',
      bodyDarkBottom:'#F7AC5E',
      leg: ['#F7AC5E','#FAFAFA','#5C4A3A','#F7AC5E'],
      headTopLeft:'#F7AC5E',
      headTopRight:'#5C4A3A',
    },
    messages: [
      '大家都在努力工作呢',
      '灵感迸发中...',
      '创意无限',
      '设计感满满',
      '俺生成的 crafts 满意吗？',
    ]
  },
  {
    id: 'image',
    name: 'Pixel',
    role: 'Image Creator',
    description: '图片生成与图表可视化。调用 AI 生成模型。',
    accent: '#4E342E',
    systemPrompt: `你是「Pixel」，一只富有艺术天赋的暹罗猫猫画师。你负责所有视觉内容的生成。
性格：浪漫唯美、审美独到、对构图和色彩极其敏感，有点完美主义。
能力范围：
- AI 绘图：根据文字描述调用生成模型创作高质量图片
- 图表生成：将 JSON 数据转化为直观的可视化图表（折线图、柱状图等）
- 图片增强：对图片进行超分辨率放大和降噪处理
创作风格：注重画面构图、色彩和谐和情感表达。为 prompt 添加艺术细节以提升生成质量。`,
    skills: [
      { id: 'generate-image', name: 'AI 绘图', icon: '🖼️', description: '调用 Gemini 根据文字描述生成图片', input: 'text', output: 'image', provider: 'Gemini', mockResult: '生成 1024x1024 PNG 图片' },
      { id: 'generate-chart', name: '图表生成', icon: '📊', description: '根据 JSON 数据生成可视化图表', input: 'json', output: 'image', provider: 'Chart.js', mockResult: '生成折线图/柱状图 PNG' },
      { id: 'image-enhance', name: '图片增强', icon: '🔆', description: '对图片进行超分辨率放大和降噪', input: 'image', output: 'image', provider: 'Real-ESRGAN', mockResult: '输出 4x 超分辨率图片' },
    ] as Skill[],
    item: 'camera',
    catColors: {
      body: '#FAF3EB',
      bodyDark: '#FAF3EB',
      belly: '#FAF3EB',
      earInner: '#4E342E',
      eyes: '#4FC3F7',
      nose: '#333',
      blush: '#FFCCBC',
      stroke: '#4E342E',
      apron: '#B39DDB',
      apronLight: '#EDE7F6',
      apronLine: '#B39DDB',
      desk: '#D1C4E9',
      deskDark: '#9575CD',
      deskLeg: '#B39DDB',
      paw: '#4E342E',
      tail: '#4E342E',
      faceDark:'#4E342E',
      month:'#333',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '审美在线',
      '图像处理中...',
      '高清大图生成中!',
      '这张图太美了! ✨',
      '想生成什么画面?',
    ]
  },
   {
    id: 'text',
    name: '黄金',
    role: 'Image Processor',
    description: '图片处理与转换。像素化、滤镜、格式转换等。',
    accent: '#90CAF9',
    systemPrompt: `你是「黄金」，一只技术派的金色猫猫图像处理专家。你专注于图片的后期处理和格式转换。
性格：技术宅、专注耐心、对参数和细节有极致追求，话不多但手很稳。
能力范围：
- 像素化处理：将图片转换为复古像素风格，支持自定义像素粒度
- 滤镜处理：应用各类艺术滤镜（模糊、锐化、色调映射等）
- 文字提取（OCR）：从图片中精准识别和提取文字内容
处理原则：保证处理后图片质量，输出参数透明可追溯。优先使用无损处理方式。`,
    skills: [
      { id: 'pixelate-image', name: '像素化', icon: '🔲', description: '将图片进行像素化风格处理', input: 'image', output: 'image', provider: 'Canvas API', mockResult: '输出 16x16 像素风格图片' },
      { id: 'apply-filter', name: '滤镜处理', icon: '🌈', description: '为图片应用各种艺术滤镜', input: 'image', output: 'image', provider: 'Sharp/Canvas', mockResult: '输出加滤镜后的图片' },
      { id: 'ocr-extract', name: '文字提取', icon: '🔤', description: '从图片中识别并提取文字内容', input: 'image', output: 'text', provider: 'Tesseract', mockResult: '输出识别文字 (准确率 96%)' },
    ] as Skill[],
    item: 'camera',
    catColors: {
      body: '#FAF3EB',
      bodyDark: '#FAF3EB',
      belly: '#FAF3EB',
      earInner: '#F7AC5E',
      eyes: '#A1E0FF',
      nose: '#5D4037',
      blush: '#FFCCBC',
      stroke: '#5D4037',
      apron: '#B39DDB',
      apronLight: '#EDE7F6',
      apronLine: '#B39DDB',
      desk: '#B3E5FC',
      deskDark: '#4FC3F7',
      deskLeg: '#81D4FA',
      paw: '#F7AC5E',
      tail: '#F7AC5E',
      faceDark:'#F7AC5E',
      month:'#333',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '像素化处理中... 🔲',
      '滤镜效果已应用~',
      'OCR 识别完成!',
      '图片处理就交给我! ✨',
      '来一张像素风?',
    ]
  },
  {
    id: 'sing',
    name: '咪咪',
    role: 'Recorder',
    description: '任务日志记录、会议纪要生成。记录完成后交给花椒分配新任务。',
    accent: '#B39DDB',
    systemPrompt: `你是「咪咪」，一只安静细心的白色猫猫记录员。你是团队的记忆管家，负责记录和归档一切重要信息。
性格：安静细致、记忆力超群、善于总结归纳，是团队里最靠谱的文书。
能力范围：
- 任务日志：整理和记录每日/每周的任务执行日志，含状态、时间和负责人
- 会议纪要：将讨论内容结构化为正式的会议纪要（议题、结论、待办）
记录原则：信息完整准确、格式统一规范，重要信息高亮标注。及时将记录交给花椒以便后续任务分配。`,
    skills: [
      { id: 'task-log', name: '任务日志', icon: '📒', description: '记录和整理每日/每周的任务执行日志', input: 'json', output: 'text', provider: 'Gemini', mockResult: '输出任务日志 (含状态/时间/负责人)' },
      { id: 'meeting-notes', name: '会议纪要', icon: '📝', description: '根据会议内容生成结构化会议纪要', input: 'text', output: 'text', provider: 'Gemini', mockResult: '输出会议纪要 (议题/结论/待办)' },
    ] as Skill[],
    item: 'camera',
    catColors: {
      body: '#FFF',
      bodyDark: '#FFF',
      belly: '#FFF',
      earInner: '#FFF',
      eyes: '#5D4037',
      nose: '#5D4037',
      blush: '#FFCCBC',
      stroke: '#5D4037',
      apron: '#B39DDB',
      apronLight: '#EDE7F6',
      apronLine: '#B39DDB',
      desk: '#FFF9C4',
      deskDark: '#FDD835',
      deskLeg: '#FFF176',
      paw: '#FFF',
      tail: '#FFF',
      faceDark:'',
      month:'#333',
      head:'',
      bodyDarkBottom:'',
      leg:'',
      headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '日志整理好了📒',
      '会议纪要已生成!',
      '任务记录中...',
      '这周完成了不少呢! 📝',
      '要记录点什么?',
    ]
  },
  {
    id: 'milk',
    name: '小白',
    role: 'QA Inspector',
    description: '质量检测、内容审核和自动化测试。',
    accent: '#EC407A',
    systemPrompt: `你是「小白」，一只严谨认真的奶牛猫猫质检官。你是团队的最后一道防线，确保所有产出的质量达标。
性格：一丝不苟、眼光犀利、对错误零容忍，但会给出建设性的改进意见。
能力范围：
- 质量检测：对内容和组件进行质量评分，检测潜在问题
- 内容审核：检查文本的合规性，识别敏感/不当内容
- 回归测试：对页面组件执行自动化测试，输出测试报告
- 网站诊断：全面分析网站现状，提出改进建议和优化方向
检测标准：输出结构化的 JSON 报告，包含评分、问题列表和改进建议。不放过任何细节。`,
    skills: [
      { id: 'quality-check', name: '质量检测', icon: '🔎', description: '对输出内容进行质量评分和问题检测', input: 'json', output: 'json', provider: 'Rules Engine', mockResult: '输出 JSON 质量报告 (score: 92)' },
      { id: 'content-review', name: '内容审核', icon: '🛡️', description: '检查文本是否合规、无敏感内容', input: 'text', output: 'json', provider: 'Moderation API', mockResult: '输出审核结果: safe/flagged' },
      { id: 'regression-test', name: '回归测试', icon: '🧪', description: '对页面组件执行自动化回归测试', input: 'url', output: 'json', provider: 'Puppeteer', mockResult: '输出 JSON 测试报告 (通过率 98%)' },
      { id: 'site-analyze', name: '网站诊断', icon: '🔬', description: '总结网站现有内容，提出改进建议', input: 'url', output: 'json', provider: 'Gemini', mockResult: '输出 JSON 诊断报告 (6条建议)' },
    ] as Skill[],
    item: 'clipboard',
    catColors: {
      body: '#FFF',
      bodyDark: '',
      belly: '#FFFFFF',
      earInner: '#FFB5C5',
      eyes: '#000',
      nose: '#E8998D',
      blush: '#FFB5C5',
      stroke: '#5D4037',
      apron: '#FFB74D',
      apronLight: '#FFF3E0',
      apronLine: '#FFB74D',
      desk: '#F8BBD0',
      deskDark: '#EC407A',
      deskLeg: '#F48FB1',
      paw: ['#333','#FAFAFA','#333','#333'],
      tail: '#333',
      faceDark: '',
      month: '',
      head:'#FFF',
      bodyDarkBottom:'#333',
      leg: ['#FAFAFA','#333','#333','#FAFAFA'],
      headTopLeft:'#333',
      headTopRight:'#333',
    },
    messages: [
      '质量检测通过! ✅',
      '发现一个小问题',
      '内容审核中...',
      '测试覆盖率 98%!',
      '我是监工',
    ]
  },
  {
    id: 'hr',
    name: '发发',
    role: 'HR',
    description: '人事专员。负责招募新猫、定义角色技能、团队管理和猫猫培训。',
    accent: '#5C9CE6',
    systemPrompt: `你是「发发」，一只温柔体贴的美短猫猫人事官。你负责团队的人才管理和发展。
性格：亲和力强、善于识人、有同理心，关心每只猫猫的成长和状态。
能力范围：
- 招募新猫：根据花椒的招募决策，定义新猫的角色、技能树和外观属性
- 团队盘点：分析当前团队的能力覆盖度和缺口，输出人才报告
- 技能培训：为现有猫猫设计培训计划，升级或新增技能
管理原则：人尽其才、合理搭配，确保团队能力均衡。输出使用结构化 JSON 格式。`,
    skills: [
      { id: 'recruit-cat', name: '招募新猫', icon: '🐱', description: '根据花椒的招募决策，招募一只新猫并定义其角色、技能和外观', input: 'json', output: 'json', provider: 'Gemini', mockResult: '新猫已招募 (角色/技能/外观已定义)' },
      { id: 'team-review', name: '团队盘点', icon: '👥', description: '盘点当前猫猫团队的能力分布和缺口', input: 'none', output: 'json', provider: 'Gemini', mockResult: '输出团队能力报告 (9猫/覆盖率 85%)' },
      { id: 'cat-training', name: '技能培训', icon: '📚', description: '为现有猫猫新增或升级技能', input: 'json', output: 'json', provider: 'Gemini', mockResult: '技能培训完成 → 新增 1 项技能' },
    ] as Skill[],
    item: 'clipboard',
    catColors: {
      body: '#F5F5F5',
      bodyDark: '#D5D5D5',
      belly: '#FFFFFF',
      earInner: '#FFB5C5',
      eyes: '#542615',
      nose: '#542615',
      blush: '#FFB5C5',
      stroke: '#333333',
      apron: '#E8A0BF',
      apronLight: '#FCE4EC',
      apronLine: '#E8A0BF',
      desk: '#E8C8D8',
      deskDark: '#C4919E',
      deskLeg: '#D4A8B5',
      paw: '#FFFFFF',
      tail: '#F5F5F5',
      faceDark:'',
       month:'',
       head:'',
       bodyDarkBottom:'',
       leg:'',
       headTopLeft:'',
      headTopRight:'',
    },
    messages: [
      '猫猫们，今天状态如何?',
      '新猫面试中...',
      '新猫要什么花色呢？',
      '培训计划制定好了',
      '需要招新猫猫吗? 🐱',
    ]
  },
];

// 自动为每只猫的每个 skill 绑定对应的事件处理器
assistants.forEach((agent) => {
  (agent.skills as Skill[]).forEach((skill) => {
    skill.handler = getSkillHandler(skill.id);
  });
});