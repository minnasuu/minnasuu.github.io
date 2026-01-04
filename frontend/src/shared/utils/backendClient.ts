import type { Article } from '../types';
import type { Craft } from '../../features/crafts/components/CraftNode';
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
  type: 'Engineering' | 'Experience' | 'AI' | 'Thinking';
}

export interface Draft {
  id: string;
  title: string;
  summary: string;
  content: string;
  publishDate: string;
  tags: string[];
  readTime: number;
  coverImage?: string;
  link?: string;
  type: 'Engineering' | 'Experience' | 'AI' | 'Thinking';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDraftRequest {
  title: string;
  summary: string;
  content: string;
  publishDate: string;
  tags: string[];
  readTime: number;
  coverImage?: string;
  link?: string;
  type: 'Engineering' | 'Experience' | 'AI' | 'Thinking';
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

export interface UploadImageResponse {
  success: boolean;
  url: string;
  filename: string;
}

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  // Mock 模式下的图片上传模拟
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data for image upload');
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟上传延迟
    
    // 使用 FileReader 将图片转换为 Data URL（Base64）
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          success: true,
          url: dataUrl, // 返回 Base64 格式的图片
          filename: `mock-${Date.now()}-${file.name}`
        });
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }

  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/upload`;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `Failed to upload image: ${response.status}`);
    }

    const data: UploadImageResponse = await response.json();
    
    // 将相对路径转换为完整 URL
    if (data.url && !data.url.startsWith('http')) {
      data.url = `${backendUrl}${data.url}`;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// 密码验证接口
export interface VerifyPasswordResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const verifyEditorPassword = async (password: string): Promise<VerifyPasswordResponse> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/auth/verify-editor-password`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data: VerifyPasswordResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
};

// ==================== Drafts API ====================

export const fetchDrafts = async (): Promise<Draft[]> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/drafts`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch drafts: ${response.status}`);
    }
    const data: Draft[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return [];
  }
};

export const fetchDraftById = async (id: string): Promise<Draft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/drafts/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch draft ${id}: ${response.status}`);
    }
    const data: Draft = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching draft ${id}:`, error);
    throw error;
  }
};

export const createDraft = async (draft: CreateDraftRequest): Promise<Draft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/drafts`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      throw new Error(`Failed to create draft: ${response.status}`);
    }
    const data: Draft = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating draft:', error);
    throw error;
  }
};

export const updateDraft = async (id: string, draft: CreateDraftRequest): Promise<Draft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/drafts/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      throw new Error(`Failed to update draft: ${response.status}`);
    }
    const data: Draft = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating draft:', error);
    throw error;
  }
};

export const deleteDraft = async (id: string): Promise<void> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/drafts/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete draft: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting draft:', error);
    throw error;
  }
};

// ==================== Crafts API ====================

export interface CreateCraftRequest {
  name: string;
  description: string;
  category: string;
  technologies: string[];
  featured?: boolean;
  weight?: number;
  coverImage?: string;
  demoUrl?: string;
  useCase?: string;
  githubUrl?: string;
  content?: string;
  relations?: { targetId: string; type: string }[];
}

export const fetchCrafts = async (): Promise<Craft[]> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/crafts`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch crafts: ${response.status}`);
    }
    const data: Craft[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crafts:', error);
    return [];
  }
};

export const fetchCraftById = async (id: string): Promise<Craft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/crafts/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch craft ${id}: ${response.status}`);
    }
    const data: Craft = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching craft ${id}:`, error);
    throw error;
  }
};

export const createCraft = async (craft: CreateCraftRequest): Promise<Craft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/crafts`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(craft),
    });

    if (!response.ok) {
      throw new Error(`Failed to create craft: ${response.status}`);
    }
    const data: Craft = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating craft:', error);
    throw error;
  }
};

export const updateCraft = async (id: string, craft: CreateCraftRequest): Promise<Craft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/crafts/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(craft),
    });

    if (!response.ok) {
      throw new Error(`Failed to update craft: ${response.status}`);
    }
    const data: Craft = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating craft:', error);
    throw error;
  }
};

export const deleteCraft = async (id: string): Promise<void> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/crafts/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete craft: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting craft:', error);
    throw error;
  }
};

export const addCraftRelation = async (
  craftId: string, 
  targetId: string, 
  type: string
): Promise<Craft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/crafts/${craftId}/relations`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ targetId, type }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add relation: ${response.status}`);
    }
    const data: Craft = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding relation:', error);
    throw error;
  }
};

export const removeCraftRelation = async (craftId: string, targetId: string): Promise<Craft> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/crafts/${craftId}/relations/${targetId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove relation: ${response.status}`);
    }
    const data: Craft = await response.json();
    return data;
  } catch (error) {
    console.error('Error removing relation:', error);
    throw error;
  }
};
