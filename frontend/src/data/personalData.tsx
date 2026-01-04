import type { PersonalData } from '../shared/types';
import type { Language } from '../shared/contexts/LanguageContext';

// Import assets
import avatarImg from '../assets/images/avatar.png';
import cktMiniprogramQr from '../assets/images/ckt-miniprogram-qr.jpg';

// 多语言个人数据
export const personalDataMultiLang: Record<Language, PersonalData> = {
  zh: {
    info: {
      name: "苏敏晗",
      avatar: avatarImg,
      title: "UI 开发 @腾讯",
      bio: "我觉得自己是一个热爱生活、用心做体验、追求产品品质的 UI开发工程师。我希望自己成为一个技术与艺术并重的、专业的全栈体验开发工程师。",
      email: "minhansu508@gmail.com",
      location: "深圳, 中国",
      wechat: "minnana1220",
      socialLinks: [
        {
          name: "Github",
          url: "https://github.com/minnasuu",
        },
        // {
        //   name: "CodePen",
        //   url: "https://codepen.io/minhan-su",
        // },
        {
          name: "小红书",
          abbreviation: "Suumhan",
          url: "https://www.xiaohongshu.com/user/profile/5de3f0e60000000001001e98?xsec_token=YB_O8hD8Al3lV4mGSuuDDC4m6bSlsqSBOICoeFzx1KgMU=&xsec_source=app_share&xhsshare=CopyLink&appuid=5de3f0e60000000001001e98&apptime=1754584198&share_id=d50b51a3b3be43288a2cd5ec5bf7c6b3",
        },
      ],
    },
    skills: [
      { name: "React", level: 90, category: "frontend" },
      { name: "TypeScript", level: 85, category: "frontend" },
      { name: "Node.js", level: 80, category: "backend" },
      { name: "SCSS", level: 70, category: "frontend" },
      { name: "微信小程序", level: 70, category: "frontend" },
      { name: "TailwindCSS", level: 50, category: "frontend" },
      { name: "Figma", level: 65, category: "design" },
      { name: "Three.js", level: 50, category: "frontend" },
      { name: "Python", level: 30, category: "backend" },
    ],
    interests: [
      {
        name: "动画",
      },
      {
        name: "AI",
      },
      {
        name: "手工编织",
      },
      {
        name: "摄影",
      },
      {
        name: "猫咪",
      },
      {
        name: "最近在听（孙燕姿-风衣）",
      },
      {
        name: "最近看过（天堂电影院）",
      },
    ],
    projects: [
      {
        id: "tencent-advertising-official-website",
        name: "腾讯广告官网",
        description: "腾讯广告官网，用于展示腾讯广告的产品和服务。",
        technologies: ["React", "TypeScript", "SCSS"],
        liveUrl: "https://e.qq.com/ads",
        featured: true,
        link: "https://e.qq.com/ads",
      },
      {
        id: "tencent-advertising-admuse",
        name: "腾讯广告妙思",
        description: "腾讯广告妙思，腾讯广告AI创意工具集合站。",
        technologies: ["React", "TypeScript", "SCSS"],
        liveUrl: "https://admuse.qq.com/",
        featured: true,
        link: "https://admuse.qq.com/",
      },
      {
        id: "tencent-advertising-miaowen",
        name: "腾讯广告妙问",
        description: "腾讯广告妙问，腾讯广告Agent智能问答工具。",
        technologies: ["React", "TypeScript", "SCSS"],
        liveUrl: "https://miaowen.qq.com/miaowen-station/index",
        featured: true,
        link: "https://miaowen.qq.com/miaowen-station/index",
      },
      {
        id: "crochet-knit-time",
        name: "Minna集（小程序）",
        description: "个人工具集小程序，用户数累计7800+。",
        technologies: ["微信小程序"],
        featured: true,
        imgPopUrl: cktMiniprogramQr,
      },
    ],
    crafts: [
      {
        id: "component-library-test-field",
        name: "组件库试验田",
        description:
          "基于React的组件库试验田，用于测试和展示组件库的实现和效果。",
        technologies: ["React", "TypeScript", "SCSS"],
        githubUrl: "https://github.com/minnasuu/land-design",
        liveUrl: "https://minnasuu.github.io/land-design/",
        featured: true,
        link: "https://minnasuu.github.io/land-design/",
      },
      {
        id: "image-processing-tools-collection",
        name: "图片处理工具集合",
        description: "图片处理工具集合，用于处理和展示图片。",
        technologies: ["React", "TypeScript", "SCSS"],
        githubUrl: "https://github.com/minnasuu/image-tools",
        liveUrl: "https://minnasuu.github.io/image-tools/",
        featured: true,
        link: "https://minnasuu.github.io/image-tools/",
      },
      {
        id: "3d-audio-particle",
        name: "3d粒子音乐播放器",
        description: "通过3d粒子可视化显示音乐，支持自定义上传。",
        technologies: ["React", "TypeScript", "SCSS"],
        githubUrl: "https://github.com/minnasuu/3d-audio-particle",
        liveUrl: "https://minnasuu.github.io/3d-audio-particle/",
        featured: true,
        link: "https://minnasuu.github.io/3d-audio-particle/",
      },
    ],
  },
  en: {
    info: {
      name: "minna",
      avatar: avatarImg,
      title: "UI Developer @Tencent",
      bio: "I think I am a UI developer who is passionate about life, focused on experience, and building products. I hope to become a professional full-stack experience developer who is good at both technology and art.",
      email: "minhansu508@gmail.com",
      location: "Shenzhen, China",
      wechat: "minnana1220",
      socialLinks: [
        {
          name: "Github",
          url: "https://github.com/minnasuu",
        },
        // {
        //   name: "CodePen",
        //   url: "https://codepen.io/minhan-su",
        // },
        {
          name: "Redbook",
          abbreviation: "Suumhan",
          url: "https://www.xiaohongshu.com/user/profile/5de3f0e60000000001001e98?xsec_token=YB_O8hD8Al3lV4mGSuuDDC4m6bSlsqSBOICoeFzx1KgMU=&xsec_source=app_share&xhsshare=CopyLink&appuid=5de3f0e60000000001001e98&apptime=1754584198&share_id=d50b51a3b3be43288a2cd5ec5bf7c6b3",
        },
      ],
    },
    skills: [
      { name: "React", level: 90, category: "frontend" },
      { name: "TypeScript", level: 85, category: "frontend" },
      { name: "Node.js", level: 80, category: "backend" },
      { name: "SCSS", level: 70, category: "frontend" },
      { name: "WeChat Mini Program", level: 70, category: "frontend" },
      { name: "TailwindCSS", level: 50, category: "frontend" },
      { name: "Python", level: 30, category: "backend" },
      { name: "Figma", level: 65, category: "design" },
      { name: "Three.js", level: 50, category: "frontend" },
    ],
    interests: [
      {
        name: "Animation",
      },
      {
        name: "AI",
      },
      {
        name: "Handmade Knitting",
      },
      {
        name: "Photography",
      },
      {
        name: "Cats",
      },
      {
        name: "Recently listening (Singer: Sun Yanzi - Windbreaker)",
      },
      {
        name: "Recently watched (Nuovo Cinema Paradiso)",
      },
    ],
    projects: [
      {
        id: "tencent-advertising-official-website",
        name: "Tencent Advertising Official Website",
        description:
          "Tencent Advertising Official Website, used to show the products and services of Tencent Advertising.",
        technologies: ["React", "TypeScript", "SCSS"],
        liveUrl: "https://e.qq.com/ads",
        featured: true,
        link: "https://e.qq.com/ads",
      },
      {
        id: "tencent-advertising-admuse",
        name: "Tencent Advertising AdMuse",
        description:
          "Tencent Advertising AdMuse, Tencent Advertising AI Creative Tools Collection Site.",
        technologies: ["React", "TypeScript", "SCSS"],
        liveUrl: "https://admuse.qq.com/",
        featured: true,
        link: "https://admuse.qq.com/",
      },
      {
        id: "tencent-advertising-miaowen",
        name: "Tencent Advertising Miaowen",
        description:
          "Tencent Advertising Miaowen, Tencent Advertising Agent Intelligent Question and Answer Tool.",
        technologies: ["React", "TypeScript", "SCSS"],
        liveUrl: "https://miaowen.qq.com/miaowen-station/index",
        featured: true,
        link: "https://miaowen.qq.com/miaowen-station/index",
      },
      {
        id: "crochet-knit-time",
        name: "Minna's Collection(miniprogram)",
        description: "Minna's Collection of tools, with more than 7,800 users.",
        technologies: ["WeChat Mini Program"],
        featured: true,
        imgPopUrl: cktMiniprogramQr,
      },
    ],
    crafts: [
      {
        id: "component-library-test-field",
        name: "Component Library Test Field",
        description:
          "A component library test field based on React, used to test and show the implementation and effect of the component library.",
        technologies: ["React", "TypeScript", "SCSS"],
        githubUrl: "https://github.com/minnasuu/land-design",
        liveUrl: "https://minnasuu.github.io/land-design/",
        featured: true,
        link: "https://minnasuu.github.io/land-design/",
      },
      {
        id: "image-processing-tools-collection",
        name: "Image Processing Tools Collection",
        description:
          "Image processing tools collection, used to process and show images.",
        technologies: ["React", "TypeScript", "SCSS"],
        githubUrl: "https://github.com/minnasuu/image-tools",
        liveUrl: "https://minnasuu.github.io/image-tools/",
        featured: true,
        link: "https://minnasuu.github.io/image-tools/",
      },
      {
        id: "3d-audio-particle",
        name: "3D Audio Particle",
        description:
          "Visualize music through 3D particles, support custom upload.",
        technologies: ["React", "TypeScript", "SCSS"],
        githubUrl: "https://github.com/minnasuu/3d-audio-particle",
        liveUrl: "https://minnasuu.github.io/3d-audio-particle/",
        featured: true,
        link: "https://minnasuu.github.io/3d-audio-particle/",
      },
    ],
  },
};

// 保持向后兼容
export const personalData = personalDataMultiLang.zh;
