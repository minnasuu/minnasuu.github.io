import type { Article } from '../types';

// 本地存储的 key
const STORAGE_KEY = 'mock_articles';

// 生成唯一 ID
const generateId = (): string => {
  return `mock_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// 初始 mock 数据
const initialMockArticles: Article[] = [
  {
    id: 'mock_1',
    title: '探索 React 19 的新特性',
    summary: '深入了解 React 19 带来的革新功能，包括自动批处理、Transitions API 和 Server Components。',
    content: `# React 19 新特性详解

React 19 带来了许多激动人心的新特性，让我们的开发体验更加流畅。

## 自动批处理

在 React 18 之前，只有事件处理器中的更新会被批处理。现在，所有更新都会自动批处理。

\`\`\`jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  
  // 现在这些更新会自动批处理
  function handleClick() {
    setCount(c => c + 1);
    setFlag(f => !f);
  }
}
\`\`\`

## Transitions API

Transitions 让你可以标记某些更新为非紧急的。

## Server Components

服务端组件让我们可以在服务器上渲染组件，减少客户端的 JavaScript 包大小。
`,
    publishDate: '2024-12-15',
    tags: ['React', 'Frontend', 'JavaScript'],
    readTime: 8,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    type: 'Engineering',
  },
  {
    id: 'mock_2',
    title: 'TypeScript 实战技巧',
    summary: '分享在实际项目中使用 TypeScript 的最佳实践和技巧。',
    content: `# TypeScript 实战技巧

TypeScript 已经成为现代前端开发的标准配置。

## 类型推断

充分利用 TypeScript 的类型推断能力：

\`\`\`typescript
// 不好
const name: string = "John";

// 好
const name = "John"; // TypeScript 会自动推断为 string
\`\`\`

## 泛型的妙用

泛型让我们的代码更加灵活和类型安全。

## 实用工具类型

TypeScript 提供了许多内置的工具类型，如 Partial、Pick、Omit 等。
`,
    publishDate: '2024-12-10',
    tags: ['TypeScript', 'Frontend', 'Best Practices'],
    readTime: 6,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    type: 'Engineering',
  },
  {
    id: 'mock_3',
    title: '关于编程的思考',
    summary: '编程不仅仅是写代码，更是一种思维方式和解决问题的艺术。',
    content: `# 关于编程的思考

最近在思考编程的本质。

## 编程是一种创造

我们用代码创造出各种工具、应用、体验。这个过程充满了创造的乐趣。

## 持续学习

技术日新月异，保持学习的热情很重要。

## 代码之美

好的代码就像一首诗，简洁、优雅、富有表现力。
`,
    publishDate: '2024-12-05',
    tags: ['思考', '编程', '随笔'],
    readTime: 4,
    type: 'Thinking',
  },
  {
    id: 'mock_4',
    title: '我的远程工作经验分享',
    summary: '在过去三年的远程工作中，我学到了如何保持高效和工作生活平衡。',
    content: `# 我的远程工作经验分享

远程工作已经成为新常态，分享一些个人经验。

## 建立工作仪式感

每天早上换上工作装，营造上班的感觉。

## 时间管理

使用番茄工作法，保持专注和休息的平衡。

## 沟通技巧

在远程环境下，过度沟通比沟通不足要好。
`,
    publishDate: '2024-11-28',
    tags: ['远程工作', '生活', '效率'],
    readTime: 5,
    type: 'Experience',
  },
  {
    id: 'mock_5',
    title: 'AI 辅助编程的未来',
    summary: '探讨 AI 工具如何改变我们的编程方式，以及开发者应该如何适应这个变化。',
    content: `# AI 辅助编程的未来

AI 正在深刻改变软件开发的方式。

## Copilot 与 ChatGPT

这些工具不是要取代开发者，而是让我们更专注于创造性工作。

## 提示工程

学会如何与 AI 对话，将成为开发者的新技能。

## 保持批判性思维

AI 生成的代码需要我们的审核和优化。
`,
    publishDate: '2024-11-20',
    tags: ['AI', 'Copilot', 'Future'],
    readTime: 7,
    type: 'AI',
  },
];

// 从 localStorage 加载数据
const loadFromStorage = (): Article[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const articles = JSON.parse(stored);
      return Array.isArray(articles) ? articles : initialMockArticles;
    }
  } catch (error) {
    console.error('Failed to load mock data from storage:', error);
  }
  return initialMockArticles;
};

// 保存到 localStorage
const saveToStorage = (articles: Article[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Failed to save mock data to storage:', error);
  }
};

// Mock API 实现
export const mockArticlesAPI = {
  // 获取所有文章
  fetchArticles: async (): Promise<Article[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    return loadFromStorage();
  },

  // 根据 ID 获取文章
  fetchArticleById: async (id: string): Promise<Article> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const articles = loadFromStorage();
    const article = articles.find(a => a.id === id);
    if (!article) {
      throw new Error(`Article with id ${id} not found`);
    }
    return article;
  },

  // 创建文章
  createArticle: async (articleData: Omit<Article, 'id'>): Promise<Article> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const articles = loadFromStorage();
    const newArticle: Article = {
      ...articleData,
      id: generateId(),
    };
    articles.push(newArticle);
    saveToStorage(articles);
    return newArticle;
  },

  // 更新文章
  updateArticle: async (id: string, articleData: Omit<Article, 'id'>): Promise<Article> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const articles = loadFromStorage();
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Article with id ${id} not found`);
    }
    const updatedArticle: Article = {
      ...articleData,
      id,
    };
    articles[index] = updatedArticle;
    saveToStorage(articles);
    return updatedArticle;
  },

  // 删除文章
  deleteArticle: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const articles = loadFromStorage();
    const filtered = articles.filter(a => a.id !== id);
    if (filtered.length === articles.length) {
      throw new Error(`Article with id ${id} not found`);
    }
    saveToStorage(filtered);
  },

  // 重置为初始数据
  reset: (): void => {
    saveToStorage(initialMockArticles);
  },

  // 清除所有数据
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};

// 初始化存储（如果没有数据）
if (!localStorage.getItem(STORAGE_KEY)) {
  saveToStorage(initialMockArticles);
}
