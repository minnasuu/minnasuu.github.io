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
    name: "简历本",
    meta: ["女", "25岁", "3年经验", "本科", "130 7234 9258", "minhansu508@gmail.com"],
    position: "WEB前端开发",
    status: "目前在职，考虑合适新机会",
    avatar: "/resume-avatar.png",
  },
  selfEvaluation: {
    bullets: [
      {
        label: "项目经验",
        content:
          "亿级PV Hybrid App开发经验，精通React、TS、Vue2、NodeJS，熟悉Hybrid开发与组件库建设",
      },
      {
        label: "个性特点",
        content:
          "重视用户体验，善于反思与迭代，具备主人翁意识，能够推动并配合团队内各角色执行任务，高质量完成交付",
      },
      {
        label: "用户体验",
        content:
          "有带领小团队承接复杂项目落地经验（包括跨多部门协同输出技术方案、任务拆分、进度管理等）",
      },
      {
        label: "技术优化",
        content: "擅长性能优化，提升开发效率，确保项目稳定运行",
      },
    ],
  },
  education: [
    {
      period: "2019/09 - 2023/06",
      school: "重庆邮电大学",
      degree: "本科",
      major: "",
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
      period: "2023/02 - 2024/10",
      name: "抖音XXX业务",
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
      period: "2022/10 - 2024/12",
      name: "XXX代码规范建设",
      role: "项目负责人",
      background:
        "为提升电商部门代码质量和规范性，自研并整合常用Lint规则，解决业务痛点。",
      duties: [
        {
          label: "项目职责",
          content:
            "自研两个ESLint规则：强制catch语句错误上报、确保组件命名一致性。",
        },
        {
          label: "",
          content: "吸纳社区优秀Lint规则，推动Lint规范在各业务项目中落地。",
        },
      ],
      achievement: "将常见代码问题暴露于开发阶段，显著节约Code Review时间。",
    },
    {
      period: "2022/08 - 2023/02",
      name: "抖音XX业务",
      role: "技术开发",
      background:
        "抖音XXX业务是字节跳动在内容平台电商化方面的探索，定位为年轻人的潮流时尚电商平台，通过内容种草引导用户下单转化。",
      duties: [
        {
          label: "内容生态建设",
          content: "负责创作者中心、直播间等业务的开发与优化，提升内容创作与互动体验。",
        },
        {
          label: "营销生态建设",
          content: "推动热点营销等营销生态建设，增强平台吸引力和用户转化率。",
        },
      ],
      achievement: "为字节系业务在内容平台电商化方面积累了宝贵经验，助力业务发展。",
    },
  ],
  skills: ["react", "vue", "html", "css", "javascript", "nodejs"],
};
