import type { Article } from '../types';
import { mockArticlesAPI } from './mockData';

export interface ChatRequest {
  query: string;
  conversation_id?: string;
}

export interface ChatResponse {
  answer: string;
  conversationId: string;
}

export interface CreateArticleRequest {
  title: string;
  summary: string;
  content: string;
  publishDate: string;
  tags: string[];
  readTime: number;
  coverImage?: string;
  link?: string;
  type: string;
}

// Mock 模式配置
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || false;

const getBackendUrl = (): string => {
  // 如果设置了环境变量，优先使用
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  // 生产环境（通过域名访问）使用相对路径，nginx会代理到后端
  if (import.meta.env.PROD) {
    return ''; // 空字符串表示使用相对路径
  }
  // 开发环境默认使用 localhost
  return 'http://localhost:8001';
};

export const sendMessageToBackend = async (
  message: string,
  conversationId: string | undefined,
  signal?: AbortSignal
): Promise<ChatResponse> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        conversation_id: conversationId,
      } as ChatRequest),
      signal, // 支持取消请求
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Backend error: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    
    if (!data.answer) {
      throw new Error('Invalid response from backend: missing answer');
    }

    return data;
  } catch (error) {
    console.error('Error calling backend:', error);
    throw error;
  }
};

export const fetchArticles = async (): Promise<Article[]> => {
  // 如果启用 mock 模式或后端连接失败后的 fallback
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data for articles');
    return mockArticlesAPI.fetchArticles();
  }

  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/articles`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status}`);
    }
    const data: Article[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    console.warn('⚠️ Backend unavailable, switching to mock data');
    return mockArticlesAPI.fetchArticles();
  }
};

export const fetchArticleById = async (id: string): Promise<Article> => {
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock data for article ${id}`);
    return mockArticlesAPI.fetchArticleById(id);
  }

  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/articles/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch article ${id}: ${response.status}`);
    }
    const data: Article = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    console.warn('⚠️ Backend unavailable, switching to mock data');
    return mockArticlesAPI.fetchArticleById(id);
  }
};

export const createArticle = async (article: CreateArticleRequest): Promise<Article> => {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data to create article');
    return mockArticlesAPI.createArticle(article as any);
  }

  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/articles`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
        throw new Error(`Failed to create article: ${response.status}`);
    }
    const data: Article = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating article:', error);
    console.warn('⚠️ Backend unavailable, switching to mock data');
    return mockArticlesAPI.createArticle(article as any);
  }
};

export const updateArticle = async (id: string, article: CreateArticleRequest): Promise<Article> => {
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock data to update article ${id}`);
    return mockArticlesAPI.updateArticle(id, article as any);
  }

  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/articles/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
        throw new Error(`Failed to update article: ${response.status}`);
    }
    const data: Article = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating article:', error);
    console.warn('⚠️ Backend unavailable, switching to mock data');
    return mockArticlesAPI.updateArticle(id, article as any);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock data to delete article ${id}`);
    return mockArticlesAPI.deleteArticle(id);
  }

  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/articles/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete article: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};
