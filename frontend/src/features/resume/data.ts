// 简历数据 - 与图片内容一致，便于后续修改
export interface ResumeBasicInfo {
  name: string;
  meta: string[]; // 性别 | 年龄 | 经验 | 学历 | 电话 | 邮箱
  position: string;
  status: string;
  avatar?: string;
}

export interface ResumeBullet {
  label: string;
  content: string;
}

export interface ResumeSelfEvaluation {
  bullets: ResumeBullet[];
}

export interface ResumeEducationItem {
  period: string;
  school: string;
  degree: string;
  major: string;
}

export interface ResumeWorkItem {
  period: string;
  company: string;
  title: string;
  duties: ResumeBullet[];
}

export interface ResumeProjectItem {
  period: string;
  name: string;
  role: string;
  background?: string;
  duties?: ResumeBullet[];
  achievement?: string;
}

export interface ResumeData {
  basic: ResumeBasicInfo;
  selfEvaluation: ResumeSelfEvaluation;
  education: ResumeEducationItem[];
  works: ResumeWorkItem[];
  projects: ResumeProjectItem[];
  skills: string[];
}

export const resumeData: ResumeData = {
  basic: {
    name: "苏敏晗",
    meta: ["女", "25岁", "3年经验", "130 7234 9258", "minhansu508@gmail.com"],
    status: "目前在职，考虑合适新机会",
    position: "WEB 前端开发",
    avatar: "/resume-avatar.png",
  },
  selfEvaluation: {
    bullets: [
      {
        label: "丰富的项目经验",
        content:
          "3 年腾讯一线开发经验，参与广告创意产品、AI 客服、数字人直播等多个中大型项目的前端开发与交付，具备从 0 到 1 及持续迭代的完整项目经验",
      },
      {
        label: "全面的技术能力",
        content:
          "熟练掌握 React、Vue、TypeScript 等主流前端技术栈，具备前端架构设计、性能优化、组件化开发及工程化建设能力，能独立承担复杂业务模块",
      },
      {
        label: "专业的体验视角",
        content:
          "重视用户体验与交互细节，善于从产品视角出发审视前端实现，结合数据分析持续优化页面性能与可用性，追求高品质交付",
      },
      {
        label: "落地的 AI 实践",
        content:
          "D2C方案及链路落地，独立开发基于知识库的自研工具，实现AI内容生成与发布",
      },
    ],
  },
  education: [
    {
      period: "2019/09 - 2023/06",
      school: "重庆邮电大学",
      degree: "本科",
      major: "电子商务",
    },
  ],
  works: [
    {
      period: "2023/07 - 至今",
      company: "腾讯科技有限公司（深圳）",
      title: "UI 开发",
      duties: [
        {
          label: "前端架构与用户体验",
          content:
            "负责抖音商城C端XXX业务的前端架构设计及落地，优化用户体验（稳定性与性能），针对阶段性业务目标进行共建。",
        },
        {
          label: "性能技术建设",
          content:
            "负责性能方向的技术能力共建，落地性能指标、埋点SDK、指标看板、通用优化方案、性能分析工具及防劣化机制。",
        },
        {
          label: "业务拓展",
          content: "负责抖音XXX业务和抖音XX业务的前端开发与优化。",
        },
        {
          label: "代码规范建设",
          content: "推动电商代码规范的建设与落地，提升代码质量和团队开发效率。",
        },
      ],
    },
  ],
  projects: [
    {
      period: "2023/08 - 至今",
      name: "腾讯广告妙思——营销内容 AIGC 创作平台",
      role: "技术开发",
      background:
        "技术栈：Lynx。抖音XX是抖音商城的本地化线上超市业务，基于自营云仓运营。自11月初在部分城市试运营，现已全量开放，入口位于抖音内搜索。",
      duties: [
        {
          label: "前端架构设计",
          content: "负责抖音XX首页前端架构设计，从0到1完成MVP版本上线。",
        },
        {
          label: "功能迭代",
          content: "增加流量入口，提升营销能力，进行若干性能优化。",
        },
        {
          label: "性能优化",
          content: "接入性能SDK，建设性能看板，优化数据和渲染耗时。",
        },
        {
          label: "业务建议",
          content: "从业务视角为超市业务提供合理建议。",
        },
      ],
      achievement: "XX业务复购率高，购买门槛低，有效吸引新用户，助力供应链云仓发展。",
    },
    {
      period: "2025/05 - 至今",
      name: "腾讯广告智能客服系统",
      role: "技术开发",
      background:
        "面向腾讯广告投放业务建设 AI 智能客服平台，覆盖智能问答、账户诊断、投放复盘、素材审核查询、人工客服接入等场景。项目融合大模型对话、多 Agent 协作与深度思考链路，前端侧重点解决 流式对话体验、复杂 AI 内容渲染、多 Agent 动态交互、业务组件复用 等问题。并支持 嵌入式侧边栏、独立站、小程序 等多端形态接入。",
      duties: [
        {
          label: "AI 流式对话体验建设",
          content:
            "设计并实现 SSE 流式通信与增量渲染机制，处理消息分片、生成中状态、异常中断、重试兜底、自动滚动等场景，优化 AI 对话从“等待结果”到“实时生成”的体验，首 token 响应时间控制在 200ms 内。",
        },
        {
          label:"复杂内容渲染与性能优化",
          content:"建设 AI 消息渲染层，支持 Markdown、代码块、表格等多类型内容；针对长文本输出、频繁增量更新、复杂图表渲染进行拆分渲染与按需加载优化，提升对话内容稳定性与阅读体验。"
        },
        {
          label: "多 Agent 交互抽象",
          content: "围绕账户分析、素材生成、投放复盘、起量诊断等业务 Agent，抽象动态表单、任务卡片、结果卡片、意图路由等通用能力，实现 Agent 场景的配置化接入，减少重复开发。",
        },
        {
          label: "负责多端 AI 客服形态建设",
          content: "围绕嵌入式侧边栏、独立站、小程序等不同使用场景，抽象统一的对话内核与多端渲染适配方案，处理不同端在容器尺寸、路由跳转、登录态、交互手势、样式隔离等方面的差异，保障 AI 客服能力在多业务入口中的一致体验。"
        },
        {
          label: "Monorepo 组件工程化沉淀",
          content: "基于 monorepo 管理 AI 客服前端公共能力，将多端共用的 UI 组件、Agent 卡片渲染逻辑拆分为独立 packages，支持按需引用、独立构建与版本管理；沉淀包含快捷键的Agent富文本输入、虚拟滚动、动效容器等组件，提升嵌入式侧边栏、独立站、小程序等多端场景下的代码复用与交付效率。",
        }
      ],
      // achievement: "⚡ 流式响应体验优化：通过 SSE + 增量渲染优化，首 Token 响应时间 < 200ms，用户等待感知降低 60%。组件库复用率提升：抽离公共 UI 组件库，跨项目复用率达 80%，新需求开发效率提升 40%",
    },
    {
      period: "2023/09 - 2024/12",
      name: "腾讯广告官网",
      role: "项目负责人",
      background: "为提升腾讯广告品牌传达，更新官网设计与内容。"
    }
  ],
  skills: ["react", "html", "css", "javascript", "typescript", "nodejs", "小程序"],
};
