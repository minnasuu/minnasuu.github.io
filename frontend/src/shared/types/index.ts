// 个人信息数据类型定义
export interface PersonalInfo {
  name: string;
  title: string;
  avatar?: string;
  bio: string;
  email: string;
  location: string;
  wechat?: string;
  socialLinks: { name: string;  url: string ,abbreviation?: string;}[];
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
  link?: string; // 可选的链接
}

export interface Interest {
  name: string;
  link?: string; // 可选的链接
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: React.ReactNode | string; // 支持后端返回的 string 和前端静态数据的 ReactNode
  publishDate: string;
  tags: string[];
  readTime: number; // 分钟
  coverImage?: string;
  link?: string; // 可选的链接
  type: 'Engineering' | 'Experience' | 'AI' | 'Thinking';
  markdownContent?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  link?: string; // 可选的链接
  imgPopUrl?: string; // 可选的图片弹窗链接
}

export interface Craft {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  link?: string; // 可选的链接
}

export interface PersonalData {
  info: PersonalInfo;
  skills: Skill[];
  interests: Interest[];
  projects: Project[];
  crafts: Craft[];
}

// 风格类型定义
export type ThemeStyle = 'terminal' | 'ai' | 'wechat';

export interface ThemeConfig {
  name: ThemeStyle;
  displayName: string;
  description: string;
  icon: string;
}

// AI日志相关类型定义
export interface KnowledgeSkill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'domain' | 'tool';
  level: number; // 1-100 掌握程度
  description: string;
  lastUpdated: string;
  relatedLinks?: string[];
}

export interface LearningTask {
  id: string;
  title: string;
  description: string;
  type: 'author' | 'ai'; // 作者操作 或 AI自动学习
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string; // 预估时间
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  deadline?: string;
  resources?: string[]; // 学习资源链接
  createdAt: string;
  completedAt?: string;
}

export interface AILogEntry {
  id: string;
  period: string; // 周期标识，如 "2026-W02" 或 "2026-01"
  periodType: 'weekly' | 'monthly';
  createdAt: string;
  
  // 知识技能总结
  knowledgeSkills: KnowledgeSkill[];
  skillsGrowth: {
    newSkills: string[]; // 新掌握的技能
    improvedSkills: string[]; // 提升的技能
    totalSkillsCount: number;
    averageSkillLevel: number;
  };
  
  // 学习计划
  learningPlan: {
    authorTasks: LearningTask[]; // 需要作者操作的任务
    aiTasks: LearningTask[]; // AI自动学习的任务
    goals: string[]; // 本周期目标
    focus: string[]; // 重点关注领域
  };
  
  // AI自动学习记录
  aiLearning: {
    completedTasks: LearningTask[];
    newKnowledge: string[]; // AI学到的新知识点
    suggestions: string[]; // AI给出的建议
    nextPeriodRecommendations: string[]; // 下周期推荐
  };
  
  // 总结和反思
  summary: {
    achievements: string[]; // 本周期成就
    challenges: string[]; // 遇到的挑战
    insights: string[]; // 获得的洞察
    nextSteps: string[]; // 下一步行动
  };
}
