import type { Article } from '../types';

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
    throw error;
  }
};

export const fetchArticleById = async (id: string): Promise<Article> => {
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
    throw error;
  }
};

export const createArticle = async (article: CreateArticleRequest): Promise<Article> => {
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
    throw error;
  }
};

export const updateArticle = async (id: string, article: CreateArticleRequest): Promise<Article> => {
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
    throw error;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
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
