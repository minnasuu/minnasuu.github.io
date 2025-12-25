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
  type: 'tech' | 'essay';
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
