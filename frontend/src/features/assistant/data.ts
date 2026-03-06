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
  },
  {
    id: 'image-pipeline',
    name: '图片处理流水线',
    icon: '🖼️',
    description: 'Pixel 生成图 → 墨墨处理 → 小白检测质量',
    steps: [
      { agentId: 'image', skillId: 'generate-image', action: '调用 Gemini 生成原始图片 → 输出 Image' },
      { agentId: 'text', skillId: 'pixelate-image', action: '将图片像素化处理 → 输出 Image', inputFrom: 'image' },
      { agentId: 'milk', skillId: 'quality-check', action: '检测图片质量分数 → 输出 JSON', inputFrom: 'text' },
    ],
    color: '#90CAF9',
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
  },
];

export const assistants = [
  {
    id: 'manager',
    name: '花椒',
    role: 'Manager',
    description: '总管。统筹调度、任务分配、审批流程，可增删/执行工作流，决定是否招募新猫。',
    accent: '#8DB889',
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
      '让我来安排一下~ 📋',
      '工作流已调整好!',
      '任务分配完毕!',
      '需要招募新猫猫吗? 🐱',
      '一切尽在掌控中~ ✨',
    ]
  },
  {
    id: 'writer',
    name: '发发',
    role: 'Writer',
    description: '根据主人的主题和材料输出文章，整理资讯为可发布内容。',
    accent: '#FF6B6B',
    skills: [
      { id: 'generate-article', name: '文章生成', icon: '📝', description: '根据主题和素材调用 Gemini 生成完整文章', input: 'text', output: 'text', provider: 'Gemini', mockResult: '生成 1200 字文章 (Markdown)' },
      { id: 'polish-text', name: '内容润色', icon: '✨', description: '优化文本表达，调整语气和风格', input: 'text', output: 'text', provider: 'Gemini', mockResult: '润色后文本 (可读性+30%)' },
      { id: 'generate-outline', name: '大纲生成', icon: '📑', description: '根据主题快速生成结构化大纲', input: 'text', output: 'json', provider: 'Gemini', mockResult: '返回 JSON 大纲 (3级标题结构)' },
      { id: 'news-to-article', name: '资讯转文章', icon: '📰', description: '将爬取的资讯摘要整理为可发布的博文', input: 'json', output: 'text', provider: 'Gemini', mockResult: '输出 800 字资讯整理文 (Markdown)' },
    ] as Skill[],
    item: 'notebook',
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
      '灵感来了! ✍️',
      '这段话可以更好~',
      '大纲已经拟好了!',
      '文章润色完成~ 📝',
      '要来点创意写作吗?',
    ]
  },
  {
    id: 'analytics',
    name: '雪',
    role: 'Scout',
    description: '资讯爬取、信息采集与数据分析。定时获取 UX/设计/前端领域最新动态。',
    accent: '#96BAFF',
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
      '今日UV上涨12%~ 📈',
      '跳出率有点高呢...',
      '让我分析一下数据!',
      '转化率创新高了! ✨',
      '用户画像已更新~',
    ]
  },
  {
    id: 'email',
    name: '年年',
    role: 'Messenger',
    description: '邮件发送、通知推送和订阅管理。',
    accent: '#F2A5B9',
    skills: [
      { id: 'send-email', name: '发送邮件', icon: '📧', description: '发送 HTML 格式邮件给指定收件人', input: 'text', output: 'email', provider: 'SMTP/SendGrid', mockResult: '邮件发送成功 → 状态 200' },
      { id: 'send-notification', name: '推送通知', icon: '🔔', description: '向订阅者批量推送通知', input: 'text', output: 'json', provider: 'WebPush', mockResult: '通知已推送给 128 位订阅者' },
      { id: 'manage-subscribers', name: '订阅管理', icon: '📋', description: '查询和管理邮件订阅者列表', input: 'none', output: 'json', provider: 'Database', mockResult: '返回 JSON 订阅者列表 (128人)' },
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
      '有3封新邮件! 📬',
      '周报已送达~',
      '订阅者又增加了!',
      '邮件送达率99%! 💌',
      '通知已全部发出~',
    ]
  },
  {
    id: 'crafts',
    name: '小虎',
    role: 'Builder',
    description: '持续更新 Crafts 创意页面，生成前端组件和交互 demo。',
    accent: '#FFB74D',
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
      '大家都在努力工作呢~',
      '今天的任务已分配好!',
      '所有猫猫状态良好~',
      '工作进度已更新! 📋',
      '让我来协调一下~',
    ]
  },
  {
    id: 'image',
    name: 'Pixel',
    role: 'Image Creator',
    description: '图片生成与图表可视化。调用 AI 生成模型。',
    accent: '#4E342E',
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
      '画面构图中... 🖼️',
      '色彩搭配完成~',
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
      '日志整理好了~ 📒',
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
      '发现一个小问题~',
      '内容审核中...',
      '测试覆盖率 98%! 🧪',
      '让我仔细检查一下~',
    ]
  },
  {
    id: 'hr',
    name: '阿蓝',
    role: 'HR',
    description: '人事专员。负责招募新猫、定义角色技能、团队管理和猫猫培训。',
    accent: '#5C9CE6',
    skills: [
      { id: 'recruit-cat', name: '招募新猫', icon: '🐱', description: '根据花椒的招募决策，招募一只新猫并定义其角色、技能和外观', input: 'json', output: 'json', provider: 'Gemini', mockResult: '新猫已招募 (角色/技能/外观已定义)' },
      { id: 'team-review', name: '团队盘点', icon: '👥', description: '盘点当前猫猫团队的能力分布和缺口', input: 'none', output: 'json', provider: 'Gemini', mockResult: '输出团队能力报告 (9猫/覆盖率 85%)' },
      { id: 'cat-training', name: '技能培训', icon: '📚', description: '为现有猫猫新增或升级技能', input: 'json', output: 'json', provider: 'Gemini', mockResult: '技能培训完成 → 新增 1 项技能' },
    ] as Skill[],
    item: 'clipboard',
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
      '让我看看团队~ 👥',
      '新猫面试中...',
      '人才库已更新!',
      '培训计划制定好了~ 📚',
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