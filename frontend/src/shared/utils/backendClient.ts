import type { Article } from '../types';
import type { Craft } from '../../features/crafts/components/CraftNode';
import type { Idea } from '../../features/ideas/components/IdeaNode';
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

export interface UploadVideoResponse {
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

export const uploadVideo = async (file: File): Promise<UploadVideoResponse> => {
  // Mock 模式下的视频上传模拟
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data for video upload');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟上传延迟（视频更长）
    
    // 使用 FileReader 将视频转换为 Data URL（Base64）
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          success: true,
          url: dataUrl, // 返回 Base64 格式的视频
          filename: `mock-${Date.now()}-${file.name}`
        });
      };
      reader.onerror = () => reject(new Error('Failed to read video file'));
      reader.readAsDataURL(file);
    });
  }

  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/upload`;

  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `Failed to upload video: ${response.status}`);
    }

    const data: UploadVideoResponse = await response.json();
    
    // 将相对路径转换为完整 URL
    if (data.url && !data.url.startsWith('http')) {
      data.url = `${backendUrl}${data.url}`;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading video:', error);
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
    // 后端不可达时，使用本地环境变量验证（仅限开发环境）
    const localPassword = import.meta.env.VITE_EDITOR_PASSWORD;
    if (localPassword && password === localPassword) {
      console.warn('[Auth] Backend unreachable, using local env fallback');
      return { success: true, message: '本地验证成功' };
    }
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
  htmlCode?: string;
  configSchema?: any[];
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

// ==================== Ideas API ====================

export interface CreateIdeaRequest {
  name: string;
  description: string;
  category: string;
  weight?: number;
  image?: string;
  video?: string;
  useCase?: string;
  linkUrl?: string;
  group?: string;
  relations?: { targetId: string; type: string }[];
}

export const fetchIdeas = async (): Promise<Idea[]> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/ideas`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ideas: ${response.status}`);
    }
    const data: Idea[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }
};

export const fetchIdeaById = async (id: string): Promise<Idea> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/ideas/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch idea ${id}: ${response.status}`);
    }
    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching idea ${id}:`, error);
    throw error;
  }
};

export const createIdea = async (idea: CreateIdeaRequest): Promise<Idea> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/ideas`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(idea),
    });

    if (!response.ok) {
      throw new Error(`Failed to create idea: ${response.status}`);
    }
    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating idea:', error);
    throw error;
  }
};

export const updateIdea = async (id: string, idea: Partial<CreateIdeaRequest>): Promise<Idea> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/ideas/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(idea),
    });

    if (!response.ok) {
      throw new Error(`Failed to update idea: ${response.status}`);
    }
    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating idea:', error);
    throw error;
  }
};

export const deleteIdea = async (id: string): Promise<void> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/ideas/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete idea: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw error;
  }
};

export const addIdeaRelation = async (
  ideaId: string, 
  targetId: string, 
  type: string
): Promise<Idea> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/ideas/${ideaId}/relations`;

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
    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding relation:', error);
    throw error;
  }
};

export const removeIdeaRelation = async (ideaId: string, targetId: string): Promise<Idea> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/ideas/${ideaId}/relations/${targetId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to remove relation: ${response.status}`);
    }
    const data: Idea = await response.json();
    return data;
  } catch (error) {
    console.error('Error removing relation:', error);
    throw error;
  }
};

// ==================== Workflows API ====================

export interface WorkflowStep {
  agentId: string;
  skillId: string;
  action: string;
  inputFrom?: string;
}

export interface WorkflowDB {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: WorkflowStep[];
  startTime?: string | null;
  endTime?: string | null;
  scheduled: boolean;
  scheduledEnabled: boolean;
  cron?: string | null;
  persistent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowRequest {
  name: string;
  icon: string;
  description: string;
  steps: WorkflowStep[];
  startTime?: string;
  endTime?: string;
  scheduled?: boolean;
  scheduledEnabled?: boolean;
  cron?: string;
  persistent?: boolean;
}

export const fetchWorkflows = async (): Promise<WorkflowDB[]> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/workflows`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.status}`);
    }
    const data: WorkflowDB[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return [];
  }
};

export const fetchWorkflowById = async (id: string): Promise<WorkflowDB> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/workflows/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch workflow ${id}: ${response.status}`);
    }
    const data: WorkflowDB = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching workflow ${id}:`, error);
    throw error;
  }
};

export const createWorkflow = async (workflow: CreateWorkflowRequest): Promise<WorkflowDB> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/workflows`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      throw new Error(`Failed to create workflow: ${response.status}`);
    }
    const data: WorkflowDB = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
};

export const updateWorkflow = async (id: string, workflow: Partial<CreateWorkflowRequest>): Promise<WorkflowDB> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/workflows/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      throw new Error(`Failed to update workflow: ${response.status}`);
    }
    const data: WorkflowDB = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating workflow:', error);
    throw error;
  }
};

export const deleteWorkflow = async (id: string): Promise<void> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/workflows/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete workflow: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting workflow:', error);
    throw error;
  }
};

// ==================== Assistants API ====================

export interface AssistantDB {
  id: string;
  assistantId: string;
  name: string;
  role: string;
  description: string;
  accent: string;
  systemPrompt: string;
  skills: any[];
  item: string;
  catColors: any;
  messages: string[];
  createdAt: string;
  updatedAt: string;
}

export const fetchAssistants = async (): Promise<AssistantDB[]> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/assistants`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch assistants: ${response.status}`);
    }
    const data: AssistantDB[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching assistants:', error);
    return [];
  }
};

export const seedAssistants = async (assistants: any[]): Promise<any> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/assistants/seed`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistants }),
    });

    if (!response.ok) {
      throw new Error(`Failed to seed assistants: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error seeding assistants:', error);
    throw error;
  }
};

// --- 邮件发送 ---

// --- Dify Skill 通用调用 ---

export interface DifySkillResponse {
  answer: string;
  conversationId?: string;
  error?: string;
}

/** 通用 Dify Skill 调用：taskId 区分不同 skill */
export const callDifySkill = async (taskId: string, text: string): Promise<DifySkillResponse> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/dify/skill`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, text }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { answer: '', error: data.error || `HTTP ${response.status}` };
    }
    return data;
  } catch (error) {
    console.error(`Error calling dify skill [${taskId}]:`, error);
    return { answer: '', error: String(error) };
  }
};

/** 兼容：site-analyze 快捷方法 */
export const callSiteAnalyze = (text: string) => callDifySkill('site-analyze', text);

// --- 邮件发送 ---

export interface SendEmailRequest {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  to?: string;
  subject?: string;
  error?: string;
}

export const sendEmail = async (req: SendEmailRequest): Promise<SendEmailResponse> => {
  const backendUrl = getBackendUrl();
  const url = `${backendUrl}/api/email/send`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || `HTTP ${response.status}` };
    }
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: String(error) };
  }
};
