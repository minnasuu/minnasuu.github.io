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
  { id: 'h1', agentId: 'manager', skillId: 'schedule-meeting', timestamp: '2026-03-06T09:00:00', summary: '创建本周团队周会议程', result: '输出 JSON 议程 (5项议题)', workflowName: '开周会', status: 'success' },
  { id: 'h2', agentId: 'analytics', skillId: 'query-dashboard', timestamp: '2026-03-06T09:05:00', summary: '拉取本周数据看板', result: 'UV 12,340 / PV 45,200 / 转化率 3.2%', workflowName: '开周会', status: 'success' },
  { id: 'h3', agentId: 'writer', skillId: 'generate-article', timestamp: '2026-03-06T09:10:00', summary: '生成周会纪要', result: '输出 1,200 字会议纪要 (Markdown)', workflowName: '开周会', status: 'success' },
  { id: 'h4', agentId: 'email', skillId: 'send-email', timestamp: '2026-03-06T09:12:00', summary: '发送周会纪要邮件', result: '邮件送达 6 位成员 → 状态 200', workflowName: '开周会', status: 'success' },
  { id: 'h5', agentId: 'image', skillId: 'generate-image', timestamp: '2026-03-06T10:30:00', summary: '生成春日主题插画', result: '1024×1024 PNG 樱花风景图', status: 'success' },
  { id: 'h6', agentId: 'text', skillId: 'pixelate-image', timestamp: '2026-03-06T10:35:00', summary: '对春日插画进行像素化', result: '输出 32×32 像素风格图片', workflowName: '图片处理流水线', status: 'success' },
  { id: 'h7', agentId: 'milk', skillId: 'quality-check', timestamp: '2026-03-06T10:38:00', summary: '检测像素图质量', result: '质量分数: 94/100 通过', workflowName: '图片处理流水线', status: 'success' },
  // --- 3/5 ---
  { id: 'h8', agentId: 'writer', skillId: 'generate-article', timestamp: '2026-03-05T14:00:00', summary: '撰写技术博客: React 19 新特性', result: '输出 2,400 字长文 (Markdown)', workflowName: '内容发布', status: 'success' },
  { id: 'h9', agentId: 'image', skillId: 'generate-image', timestamp: '2026-03-05T14:10:00', summary: '为博客生成配图', result: '1024×1024 PNG 科技风格配图', workflowName: '内容发布', status: 'success' },
  { id: 'h10', agentId: 'crafts', skillId: 'generate-component', timestamp: '2026-03-05T14:15:00', summary: '组合为文章页面组件', result: '输出响应式 HTML 博客页', workflowName: '内容发布', status: 'success' },
  { id: 'h11', agentId: 'email', skillId: 'send-notification', timestamp: '2026-03-05T14:20:00', summary: '推送博客发布通知', result: '通知 128 位订阅者', workflowName: '内容发布', status: 'success' },
  { id: 'h12', agentId: 'sing', skillId: 'generate-bgm', timestamp: '2026-03-05T16:00:00', summary: '为视频生成轻松 Lo-Fi BGM', result: '输出 30s MP3 Lo-Fi 节拍', workflowName: '音乐视频制作', status: 'success' },
  { id: 'h13', agentId: 'crafts', skillId: 'css-generate', timestamp: '2026-03-05T16:30:00', summary: '为音乐播放页生成动画样式', result: '输出 SCSS 含波形动画', workflowName: '音乐视频制作', status: 'success' },
  // --- 3/4 ---
  { id: 'h14', agentId: 'analytics', skillId: 'trend-analysis', timestamp: '2026-03-04T10:00:00', summary: '分析二月份用户增长趋势', result: 'MAU +18%，异常点: 2/14 流量峰值', workflowName: '数据周报', status: 'success' },
  { id: 'h15', agentId: 'analytics', skillId: 'user-portrait', timestamp: '2026-03-04T10:30:00', summary: '更新用户画像标签', result: '高活跃用户分群 3 组 (JSON)', status: 'success' },
  { id: 'h16', agentId: 'image', skillId: 'generate-chart', timestamp: '2026-03-04T11:00:00', summary: '生成月度趋势折线图', result: '输出 PNG 折线图 (UV/PV/转化率)', workflowName: '数据周报', status: 'success' },
  { id: 'h17', agentId: 'writer', skillId: 'polish-text', timestamp: '2026-03-04T11:30:00', summary: '润色创意企划文案', result: '可读性提升 35%，语气更活泼', workflowName: '创意企划', status: 'success' },
  { id: 'h18', agentId: 'manager', skillId: 'review-approve', timestamp: '2026-03-04T11:45:00', summary: '审批创意企划方案', result: '审批通过 → 安排 3/7 发布', workflowName: '创意企划', status: 'success' },
  { id: 'h19', agentId: 'milk', skillId: 'content-review', timestamp: '2026-03-04T15:00:00', summary: '审核博客文章合规性', result: '审核结果: safe (无敏感内容)', status: 'success' },
  { id: 'h20', agentId: 'text', skillId: 'ocr-extract', timestamp: '2026-03-04T16:00:00', summary: '从产品截图中提取文字', result: '识别 320 字 (准确率 97%)', status: 'success' },
  { id: 'h21', agentId: 'milk', skillId: 'regression-test', timestamp: '2026-03-04T17:00:00', summary: '对首页组件执行回归测试', result: '12 项测试，11 通过，1 警告', status: 'warning' },
  { id: 'h22', agentId: 'sing', skillId: 'audio-mix', timestamp: '2026-03-04T18:00:00', summary: '混合 BGM 与音效轨道', result: '输出 final-mix.mp3 (45s)', status: 'success' },
  { id: 'h23', agentId: 'crafts', skillId: 'layout-design', timestamp: '2026-03-04T19:00:00', summary: '设计首页 hero 区排版', result: '输出响应式 Hero HTML 模板', status: 'success' },
  { id: 'h24', agentId: 'email', skillId: 'manage-subscribers', timestamp: '2026-03-04T20:00:00', summary: '清理无效订阅者', result: '移除 12 个无效邮箱，剩余 128 人', status: 'success' },
];

// --- Skill 工具/流程定义 ---
export type SkillOutputType = 'text' | 'image' | 'audio' | 'json' | 'html' | 'email' | 'chart' | 'file';
export type SkillInputType = 'text' | 'image' | 'audio' | 'json' | 'url' | 'file' | 'none';

export interface Skill {
  id: string;
  name: string;
  icon: string;           // emoji 图标
  description: string;    // 工具描述
  input: SkillInputType;  // 输入类型
  output: SkillOutputType; // 输出类型
  provider?: string;      // 底层服务 (如 'gemini', 'ffmpeg', 'puppeteer')
  mockResult?: string;    // 模拟结果描述
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
    id: 'weekly-meeting',
    name: '开周会',
    icon: '📋',
    description: 'Tama 召集会议，雪汇报数据看板，发发整理会议纪要，Postman 邮件分发',
    steps: [
      { agentId: 'manager', skillId: 'schedule-meeting', action: '创建会议议程 → 输出 JSON 议程表' },
      { agentId: 'analytics', skillId: 'query-dashboard', action: '查询数据看板 → 输出 JSON 报表数据', inputFrom: 'manager' },
      { agentId: 'writer', skillId: 'generate-article', action: '基于数据生成会议纪要 → 输出 Text', inputFrom: 'analytics' },
      { agentId: 'email', skillId: 'send-email', action: '发送纪要邮件 → 输出邮件状态', inputFrom: 'writer' },
    ],
    color: '#FFB74D',
  },
  {
    id: 'content-publish',
    name: '内容发布',
    icon: '✍️',
    description: '发发撰写文章，Pixel 生成配图，花椒排版成页面组件，Postman 推送通知',
    steps: [
      { agentId: 'writer', skillId: 'generate-article', action: '调用 Gemini 生成文章 → 输出 Text' },
      { agentId: 'image', skillId: 'generate-image', action: '调用 Gemini 生成配图 → 输出 Image', inputFrom: 'writer' },
      { agentId: 'crafts', skillId: 'generate-component', action: '组合为 HTML 页面组件 → 输出 HTML', inputFrom: 'image' },
      { agentId: 'email', skillId: 'send-notification', action: '推送发布通知 → 输出邮件状态', inputFrom: 'crafts' },
    ],
    color: '#E8A0BF',
  },
  {
    id: 'data-report',
    name: '数据周报',
    icon: '📊',
    description: '雪采集分析数据，Pixel 生成可视化图表，发发撰写报告，Postman 邮件发送',
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
    id: 'creative-campaign',
    name: '创意企划',
    icon: '🎨',
    description: '花椒构思创意，Pixel 生成素材，发发撰写文案，Tama 审批发布',
    steps: [
      { agentId: 'crafts', skillId: 'generate-component', action: '构思创意方案 → 输出 HTML 原型' },
      { agentId: 'image', skillId: 'generate-image', action: '生成创意视觉素材 → 输出 Image', inputFrom: 'crafts' },
      { agentId: 'writer', skillId: 'polish-text', action: '撰写宣传文案 → 输出 Text', inputFrom: 'image' },
      { agentId: 'manager', skillId: 'review-approve', action: '审批并安排发布 → 输出 JSON 状态', inputFrom: 'writer' },
    ],
    color: '#A0D8B3',
  },
  {
    id: 'image-pipeline',
    name: '图片处理流水线',
    icon: '🖼️',
    description: 'Pixel 生成图 → 墨墨像素化 → 小白检测质量 → Postman 发送结果',
    steps: [
      { agentId: 'image', skillId: 'generate-image', action: '调用 Gemini 生成原始图片 → 输出 Image' },
      { agentId: 'text', skillId: 'pixelate-image', action: '将图片像素化处理 → 输出 Image', inputFrom: 'image' },
      { agentId: 'milk', skillId: 'quality-check', action: '检测图片质量分数 → 输出 JSON', inputFrom: 'text' },
      { agentId: 'email', skillId: 'send-email', action: '发送处理结果 → 输出邮件状态', inputFrom: 'milk' },
    ],
    color: '#90CAF9',
  },
  {
    id: 'music-video',
    name: '音乐视频制作',
    icon: '🎵',
    description: '咪咪生成音乐 → Pixel 生成封面 → 花椒制作播放页 → Postman 推送',
    steps: [
      { agentId: 'sing', skillId: 'generate-bgm', action: '生成背景音乐 → 输出 Audio' },
      { agentId: 'image', skillId: 'generate-image', action: '根据歌曲意境生成封面 → 输出 Image', inputFrom: 'sing' },
      { agentId: 'crafts', skillId: 'generate-component', action: '制作音乐播放页组件 → 输出 HTML', inputFrom: 'image' },
      { agentId: 'email', skillId: 'send-notification', action: '推送新歌上线通知 → 输出邮件状态', inputFrom: 'crafts' },
    ],
    color: '#B39DDB',
  },
];

export const assistants = [
  {
    id: 'analytics',
    name: '雪',
    role: 'Data Analyst',
    description: '数据采集、分析与可视化。调用数据库查询和统计工具。',
    accent: '#96BAFF',
    skills: [
      { id: 'query-dashboard', name: '数据查询', icon: '🔍', description: '查询数据库获取结构化数据', input: 'text', output: 'json', provider: 'PostgreSQL', mockResult: '返回 JSON 数据集 (UV/PV/转化率)' },
      { id: 'trend-analysis', name: '趋势分析', icon: '📈', description: '对时序数据进行趋势分析和异常检测', input: 'json', output: 'json', provider: 'Python/Pandas', mockResult: '返回 JSON 趋势结论 + 异常点' },
      { id: 'user-portrait', name: '用户画像', icon: '👤', description: '根据行为数据生成用户画像标签', input: 'json', output: 'json', provider: 'ML Model', mockResult: '返回 JSON 用户分群标签' },
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
    name: 'Postman',
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
    id: 'writer',
    name: '发发',
    role: 'Writer',
    description: '文章撰写、内容润色与大纲生成。调用 LLM 进行创作。',
    accent: '#FF6B6B',
    skills: [
      { id: 'generate-article', name: '文章生成', icon: '📝', description: '调用 Gemini 根据主题生成完整文章', input: 'text', output: 'text', provider: 'Gemini', mockResult: '生成 1200 字文章 (Markdown)' },
      { id: 'polish-text', name: '内容润色', icon: '✨', description: '优化文本表达，调整语气和风格', input: 'text', output: 'text', provider: 'Gemini', mockResult: '润色后文本 (可读性+30%)' },
      { id: 'generate-outline', name: '大纲生成', icon: '📑', description: '根据主题快速生成结构化大纲', input: 'text', output: 'json', provider: 'Gemini', mockResult: '返回 JSON 大纲 (3级标题结构)' },
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
    id: 'crafts',
    name: '花椒',
    role: 'Frontend Builder',
    description: '根据设计生成前端组件代码和创意页面。',
    accent: '#A0D8B3',
    skills: [
      { id: 'generate-component', name: '组件生成', icon: '🧩', description: '根据描述生成 React/HTML 组件代码', input: 'text', output: 'html', provider: 'Gemini', mockResult: '输出 HTML/JSX 组件代码' },
      { id: 'layout-design', name: '排版布局', icon: '📐', description: '将内容和图片组合排版为精美页面', input: 'json', output: 'html', provider: 'Template Engine', mockResult: '输出响应式 HTML 页面' },
      { id: 'css-generate', name: '样式生成', icon: '🎨', description: '为组件生成匹配的 CSS/动画代码', input: 'html', output: 'file', provider: 'Gemini', mockResult: '输出 SCSS 样式文件' },
    ] as Skill[],
    item: 'palette',
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
      '新组件出炉了! 🎨',
      '配色方案已生成~',
      '这个动画很流畅!',
      '代码已优化完毕~ ✨',
      '要做点什么创意?',
    ]
  },
  {
    id: 'image',
    name: 'Pixel',
    role: 'Image Creator',
    description: '图片生成与图表可视化。调用 AI 生成模型。',
    accent: '#90CAF9',
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
    id: 'manager',
    name: '小虎',
    role: 'Manager',
    description: '统筹调度、任务分配和流程审批。',
    accent: '#FFB74D',
    skills: [
      { id: 'schedule-meeting', name: '会议调度', icon: '📅', description: '创建会议议程并通知参与者', input: 'text', output: 'json', provider: 'Scheduler', mockResult: '输出 JSON 议程 (时间/议题/参与者)' },
      { id: 'assign-task', name: '任务分配', icon: '📌', description: '将任务分配给指定猫猫并跟踪进度', input: 'text', output: 'json', provider: 'TaskQueue', mockResult: '输出 JSON 任务卡片 (状态/负责人)' },
      { id: 'review-approve', name: '审批流程', icon: '✅', description: '审核工作成果并决定是否发布', input: 'json', output: 'json', provider: 'Workflow Engine', mockResult: '输出审批结果: approved/rejected' },
    ] as Skill[],
    item: 'clipboard',
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
    id: 'text',
    name: '墨墨',
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
    role: 'Audio Creator',
    description: '音乐生成、音效设计和音频处理。',
    accent: '#FDD835',
    skills: [
      { id: 'generate-bgm', name: '音乐生成', icon: '🎵', description: '根据情绪/场景描述生成背景音乐', input: 'text', output: 'audio', provider: 'MusicGen', mockResult: '输出 30s MP3 背景音乐' },
      { id: 'sound-effect', name: '音效合成', icon: '🔊', description: '生成指定类型的音效片段', input: 'text', output: 'audio', provider: 'AudioCraft', mockResult: '输出 WAV 音效文件' },
      { id: 'audio-mix', name: '混音处理', icon: '🎚️', description: '将多个音频轨道混合为一个', input: 'audio', output: 'audio', provider: 'FFmpeg', mockResult: '输出混合后的音频文件' },
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
      '旋律灵感来了~ 🎵',
      '这段节奏很带感!',
      '混音调整中...',
      '新曲目完成! 🎶',
      '要来点什么风格?',
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
];