import React, { useState, useEffect, useRef } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, updateArticle, fetchArticles, fetchArticleById, deleteArticle, uploadImage, verifyEditorPassword, fetchDrafts, createDraft, updateDraft, deleteDraft } from '../../../shared/utils/backendClient';
import type { CreateArticleRequest, Draft } from '../../../shared/utils/backendClient';
import type { Article } from '../../../shared/types';
import BackButton from '../../../shared/components/BackButton';
import MockIndicator from '../../../shared/components/MockIndicator';
import { Icon, LandButton,  LandHighlightTextarea, LandTagInput, LandNumberInput, LandSelect, LandDialog, LandPopOver } from '@suminhan/land-design';
import type { SelectItemType } from '@suminhan/land-design';
import '../styles/shared-markdown.css';

// 图片管理接口
interface ImageItem {
  id: string; // 临时ID，用于Markdown中的占位符
  file: File; // 原始文件对象
  dataUrl: string; // 本地预览URL（Base64）
  uploaded: boolean; // 是否已上传
  serverUrl?: string; // 服务器返回的URL
}

// 配置 MarkdownIt 以支持完整的 Markdown 语法
const mdParser = new MarkdownIt({
  html: true,        // 允许 HTML 标签
  linkify: true,     // 自动将 URL 转换为链接
  typographer: false, // 禁用 typographer（可能影响中文解析）
  breaks: true,      // 将换行符转换为 <br>
});

// 自定义渲染函数包装器，修复中文标点符号导致的加粗/斜体解析问题
const originalRender = mdParser.render.bind(mdParser);
mdParser.render = function(src: string, env?: any): string {
  // 预处理：将 **xxx：** 转换为 **xxx**： 的格式（将标点移到加粗标记外面）
  // 这样可以确保 Markdown 正确解析加粗语法
  let fixedSrc = src
    // 修复 **xxx：** -> **xxx**：
    .replace(/\*\*([^*\n]+?)([：。，！？；）】」』、])\*\*/g, '**$1**$2')
    // 修复 __xxx：__ -> __xxx__：
    .replace(/__([^_\n]+?)([：。，！？；）】」』、])__/g, '__$1__$2')
    // 修复单个 * 的情况 *xxx：* -> *xxx*：
    .replace(/\*([^*\n]+?)([：。，！？；）】」』、])\*/g, '*$1*$2')
    // 修复单个 _ 的情况 _xxx：_ -> _xxx_：
    .replace(/_([^_\n]+?)([：。，！？；）】」』、])_/g, '_$1_$2');
  
  return originalRender(fixedSrc, env);
};

const ArticleEditorPage: React.FC = () => {
  const navigator = useNavigate();
  const { id } = useParams<{ id: string }>();
  const editorRef = useRef<any>(null);
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    summary: '',
    content: '',
    publishDate: new Date().toISOString().split('T')[0],
    tags: [],
    readTime: 5,
    coverImage: '',
    link: '',
    type: 'Engineering',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [currentArticleId, setCurrentArticleId] = useState<string | undefined>(id);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isParsingMarkdown, setIsParsingMarkdown] = useState(false);
  
  // 图片管理状态
  const [imageStore, setImageStore] = useState<Map<string, ImageItem>>(new Map());
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());

  // Dialog 状态管理
  const [dialogConfig, setDialogConfig] = useState<{
    show: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }>({
    show: false,
    type: 'alert',
    title: '',
    message: '',
  });

  // 显示提示对话框
  const showAlert = (title: string, message: string) => {
    setDialogConfig({
      show: true,
      type: 'alert',
      title,
      message,
      confirmLabel: '确定',
    });
  };

  // 显示确认对话框
  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmLabel: string = '确定',
    cancelLabel: string = '取消'
  ) => {
    setDialogConfig({
      show: true,
      type: 'confirm',
      title,
      message,
      onConfirm,
      confirmLabel,
      cancelLabel,
    });
  };

  // 关闭对话框
  const closeDialog = () => {
    setDialogConfig(prev => ({ ...prev, show: false }));
  };

  // 编辑器访问密码已移至后端验证，前端不再需要存储

  // 检查本地存储的认证状态
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('editor_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 处理密码验证 - 调用后端 API
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');

    try {
      const data = await verifyEditorPassword(passwordInput);
      
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('editor_authenticated', 'true');
        if (data.token) {
          sessionStorage.setItem('editor_token', data.token);
        }
        setPasswordInput('');
      } else {
        setPasswordError(data.message || '密码错误，请重试');
        setPasswordInput('');
      }
    } catch (error) {
      console.error('密码验证失败:', error);
      setPasswordError('验证失败，请检查网络连接');
    } finally {
      setIsVerifying(false);
    }
  };

  // 加载历史文章列表和草稿列表
  useEffect(() => {
    const loadArticlesAndDrafts = async () => {
      try {
        const [fetchedArticles, fetchedDrafts] = await Promise.all([
          fetchArticles(),
          fetchDrafts()
        ]);
        setArticles(fetchedArticles.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        ));
        setDrafts(fetchedDrafts.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      } catch (error) {
        console.error('Failed to load articles and drafts:', error);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    loadArticlesAndDrafts();
  }, []);

  // 加载指定文章
  useEffect(() => {
    const loadArticle = async () => {
      if (currentArticleId) {
        try {
          const article = await fetchArticleById(currentArticleId);
          
          // 检查草稿
          const draftData = localStorage.getItem(`draft_${currentArticleId}`);
          let shouldUseDraft = false;
          
          if (draftData) {
            try {
              const draft = JSON.parse(draftData);
              const draftTime = new Date(draft.savedAt);
              const articleTime = new Date(article.publishDate);
              
              if (draftTime > articleTime) {
                showConfirm(
                  '检测到较新的本地草稿',
                  '选择"确定"恢复草稿\n选择"取消"加载已发布版本',
                  () => {
                    shouldUseDraft = true;
                    if (shouldUseDraft) {
                      setFormData({
                        title: draft.title || '',
                        summary: draft.summary || '',
                        content: draft.content || '',
                        publishDate: draft.publishDate || article.publishDate,
                        tags: draft.tags || [],
                        readTime: draft.readTime || 5,
                        coverImage: draft.coverImage || '',
                        link: draft.link || '',
                        type: draft.type || 'Engineering',
                      });
                      setIsEditMode(true);
                    }
                    closeDialog();
                  },
                  '恢复草稿',
                  '加载已发布版本'
                );
                return;
              }
            } catch (error) {
              console.error('Failed to parse draft:', error);
            }
          }
          
          // 加载已发布的文章
          setFormData({
            title: article.title,
            summary: article.summary,
            content: typeof article.content === 'string' ? article.content : '',
            publishDate: article.publishDate,
            tags: article.tags,
            readTime: article.readTime,
            coverImage: article.coverImage || '',
            link: article.link || '',
            type: article.type,
          });
          setIsEditMode(true);
        } catch (error) {
          console.error('Failed to load article:', error);
          showAlert('加载失败', '无法加载文章，请稍后重试');
        }
      }
    };

    loadArticle();
  }, [currentArticleId]);

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, summary: e.target.value }));
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setFormData(prev => ({ ...prev, content: text }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (value: string[] | string) => {
    const tags = Array.isArray(value) ? value : value.split(',').map(t => t.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleReadTimeChange = (value: number) => {
    setFormData(prev => ({ ...prev, readTime: value }));
  };

  const handleTypeChange = (item: SelectItemType) => {
    setFormData(prev => ({ ...prev, type: item.key as 'Engineering' || 'Experience' || 'AI' || 'Thinking'}));
  };

  // 保存草稿到服务器
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      if (isDraftMode && currentDraftId) {
        // 更新现有草稿
        await updateDraft(currentDraftId, formData);
        showAlert('草稿已更新', '草稿已成功保存到数据库');
      } else {
        // 创建新草稿
        const newDraft = await createDraft(formData);
        setCurrentDraftId(newDraft.id);
        setIsDraftMode(true);
        showAlert('草稿已保存', '草稿已成功保存到数据库');
      }
      setLastSavedTime(new Date());
      
      // 重新加载草稿列表
      const fetchedDrafts = await fetchDrafts();
      setDrafts(fetchedDrafts.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    } catch (error) {
      console.error('Failed to save draft:', error);
      showAlert('保存失败', '草稿保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 处理图片粘贴和拖拽
  const handleImageDrop = async (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      showAlert('文件类型错误', '只支持图片文件');
      return null;
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      showAlert('文件过大', '图片大小不能超过 5MB');
      return null;
    }

    // 生成唯一ID
    const imageId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    
    // 转换为 Base64 用于本地预览
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 存储图片信息
    const imageItem: ImageItem = {
      id: imageId,
      file,
      dataUrl,
      uploaded: false,
    };

    setImageStore(prev => new Map(prev).set(imageId, imageItem));
    
    // 返回临时的本地图片标记（使用 data URL）
    return dataUrl;
  };

  // 自定义图片上传处理
  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const imageUrl = await handleImageDrop(file);
    return imageUrl || '';
  };

  // 批量上传所有未上传的图片
  const uploadAllImages = async (): Promise<Map<string, string>> => {
    const urlMapping = new Map<string, string>(); // dataUrl -> serverUrl 映射
    const imagesToUpload = Array.from(imageStore.values()).filter(img => !img.uploaded);
    
    if (imagesToUpload.length === 0) {
      return urlMapping;
    }

    console.log(`📤 开始上传 ${imagesToUpload.length} 张图片...`);

    // 并发上传所有图片
    const uploadPromises = imagesToUpload.map(async (imageItem) => {
      try {
        setUploadingImages(prev => new Set(prev).add(imageItem.id));
        
        const result = await uploadImage(imageItem.file);
        
        // 更新图片状态
        imageItem.uploaded = true;
        imageItem.serverUrl = result.url;
        
        // 记录映射关系：dataUrl -> serverUrl
        urlMapping.set(imageItem.dataUrl, result.url);
        
        console.log(`✅ 图片上传成功: ${imageItem.file.name} -> ${result.url}`);
      } catch (error) {
        console.error(`❌ 图片上传失败: ${imageItem.file.name}`, error);
        throw new Error(`图片 ${imageItem.file.name} 上传失败`);
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageItem.id);
          return newSet;
        });
      }
    });

    await Promise.all(uploadPromises);
    
    // 更新 imageStore
    setImageStore(new Map(imageStore));
    
    return urlMapping;
  };

  // 替换 Markdown 内容中的图片 URL
  const replaceImageUrls = (content: string, urlMapping: Map<string, string>): string => {
    let updatedContent = content;
    
    urlMapping.forEach((serverUrl, dataUrl) => {
      // 替换所有出现的 dataUrl
      updatedContent = updatedContent.split(dataUrl).join(serverUrl);
    });
    
    return updatedContent;
  };

  // 发布/更新文章
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      // 1. 先上传所有图片
      const urlMapping = await uploadAllImages();
      
      // 2. 替换 Markdown 中的图片 URL
      const updatedContent = replaceImageUrls(formData.content, urlMapping);
      
      // 3. 准备发布数据
      const publishData = {
        ...formData,
        content: updatedContent,
      };

      // 4. 发布或更新文章
      if (isEditMode && currentArticleId) {
        await updateArticle(currentArticleId, publishData);
        showAlert('更新成功', '文章已成功更新！');
        setLastSavedTime(new Date());
        // 清除对应的草稿
        localStorage.removeItem(`draft_${currentArticleId}`);
      } else {
        const newArticle = await createArticle(publishData);
        setCurrentArticleId(newArticle.id);
        setIsEditMode(true);
        showAlert('发布成功', '文章已成功发布！');
        setLastSavedTime(new Date());
        
        // 如果是从草稿发布，删除草稿
        if (isDraftMode && currentDraftId) {
          await deleteDraft(currentDraftId);
          setIsDraftMode(false);
          setCurrentDraftId(undefined);
        }
        
        // 清除新建文章的草稿
        localStorage.removeItem('draft_new');
      }
      
      // 5. 更新本地 content 为服务器 URL 版本
      setFormData(prev => ({ ...prev, content: updatedContent }));
      
      // 6. 清空图片缓存（已上传的图片）
      setImageStore(new Map());
      
      // 重新加载文章和草稿列表
      const [fetchedArticles, fetchedDrafts] = await Promise.all([
        fetchArticles(),
        fetchDrafts()
      ]);
      setArticles(fetchedArticles.sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ));
      setDrafts(fetchedDrafts.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    } catch (error) {
      console.error('Failed to publish article:', error);
      showAlert('操作失败', error instanceof Error ? error.message : '操作失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 兼容旧的 handleSubmit，供发布按钮使用
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await handlePublish();
  };

  const handleNewArticle = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      publishDate: new Date().toISOString().split('T')[0],
      tags: [],
      readTime: 5,
      coverImage: '',
      link: '',
      type: 'Engineering',
    });
    setCurrentArticleId(undefined);
    setCurrentDraftId(undefined);
    setIsEditMode(false);
    setIsDraftMode(false);
    setShowHistory(false);
    setLastSavedTime(null);
    
    // 清空图片缓存
    setImageStore(new Map());
    
    // 清除本地草稿
    localStorage.removeItem('draft_new');
  };

  const handleLoadArticle = (article: Article) => {
    setCurrentArticleId(article.id);
    setCurrentDraftId(undefined);
    setIsDraftMode(false);
    setShowHistory(false);
    setLastSavedTime(null);
  };

  const handleLoadDraft = (draft: Draft) => {
    setFormData({
      title: draft.title,
      summary: draft.summary,
      content: draft.content,
      publishDate: draft.publishDate,
      tags: draft.tags,
      readTime: draft.readTime,
      coverImage: draft.coverImage || '',
      link: draft.link || '',
      type: draft.type,
    });
    setCurrentDraftId(draft.id);
    setCurrentArticleId(undefined);
    setIsDraftMode(true);
    setIsEditMode(false);
    setShowHistory(false);
    setLastSavedTime(null);
  };

  const handleDeleteArticle = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    showConfirm(
      '确认删除',
      '确定要删除这篇文章吗？此操作无法撤销。',
      async () => {
        try {
          await deleteArticle(articleId);
          showAlert('删除成功', '文章已成功删除');
          
          // 重新加载文章列表
          const fetchedArticles = await fetchArticles();
          setArticles(fetchedArticles.sort((a, b) => 
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          ));
          
          // 如果删除的是当前文章，清空编辑器
          if (articleId === currentArticleId) {
            handleNewArticle();
          }
        } catch (error) {
          console.error('Failed to delete article:', error);
          showAlert('删除失败', '无法删除文章，请稍后重试');
        }
        closeDialog();
      },
      '删除',
      '取消'
    );
  };

  const handleDeleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    showConfirm(
      '确认删除',
      '确定要删除这个草稿吗？此操作无法撤销。',
      async () => {
        try {
          await deleteDraft(draftId);
          showAlert('删除成功', '草稿已成功删除');
          
          // 重新加载草稿列表
          const fetchedDrafts = await fetchDrafts();
          setDrafts(fetchedDrafts.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ));
          
          // 如果删除的是当前草稿，清空编辑器
          if (draftId === currentDraftId) {
            handleNewArticle();
          }
        } catch (error) {
          console.error('Failed to delete draft:', error);
          showAlert('删除失败', '无法删除草稿，请稍后重试');
        }
        closeDialog();
      },
      '删除',
      '取消'
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      showAlert('文件类型错误', '请选择图片文件');
      return;
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      showAlert('文件过大', '图片大小不能超过 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({ ...prev, coverImage: result.url }));
      showAlert('上传成功', '图片上传成功！');
    } catch (error) {
      console.error('Failed to upload image:', error);
      showAlert('上传失败', '图片上传失败，请稍后重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 解析 Markdown frontmatter
  const parseFrontmatter = (content: string): { metadata: Record<string, any>; content: string } => {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { metadata: {}, content };
    }

    const [, frontmatterText, mainContent] = match;
    const metadata: Record<string, any> = {};

    // 解析 YAML 格式的 frontmatter
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value: string | string[] = line.substring(colonIndex + 1).trim();
        
        // 处理引号
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // 处理数组（简单的逗号分隔）
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
        }
        
        metadata[key] = value;
      }
    });

    return { metadata, content: mainContent };
  };

  // 处理 Markdown 文件上传
  const handleMarkdownUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      showAlert('文件类型错误', '请选择 Markdown 文件（.md 或 .markdown）');
      e.target.value = '';
      return;
    }

    // 检查文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      showAlert('文件过大', '文件大小不能超过 10MB');
      e.target.value = '';
      return;
    }

    // 检查是否已有内容，提示用户确认覆盖
    const hasContent = formData.title.trim() || formData.content.trim() || formData.summary.trim();
    if (hasContent) {
      showConfirm(
        '⚠️ 检测到当前编辑器中已有内容',
        '上传新文件将会覆盖以下内容：\n• 标题\n• 摘要\n• 正文内容\n• 标签\n• 其他元数据\n\n是否继续上传？',
        async () => {
          closeDialog();
          await parseAndFillMarkdown(file, e);
        },
        '继续上传',
        '取消'
      );
      return;
    }

    await parseAndFillMarkdown(file, e);
  };

  // 解析并填充 Markdown 内容
  const parseAndFillMarkdown = async (file: File, e: React.ChangeEvent<HTMLInputElement>) => {
    setIsParsingMarkdown(true);
    try {
      const text = await file.text();
      const { metadata, content } = parseFrontmatter(text);

      // 自动填充表单数据
      setFormData(prev => ({
        ...prev,
        title: metadata.title || file.name.replace(/\.md$|\.markdown$/, ''),
        summary: metadata.summary || metadata.description || '',
        content: content.trim(),
        tags: Array.isArray(metadata.tags) ? metadata.tags : 
              typeof metadata.tags === 'string' ? metadata.tags.split(',').map((t: string) => t.trim()) : 
              prev.tags,
        readTime: metadata.readTime || metadata.read_time || prev.readTime,
        coverImage: metadata.coverImage || metadata.cover || metadata.image || prev.coverImage,
        link: metadata.link || metadata.url || prev.link,
        type: ['Engineering', 'Experience', 'AI', 'Thinking'].includes(metadata.type) ? metadata.type : 'Engineering',
        publishDate: metadata.date || metadata.publishDate ? 
                     new Date(metadata.date || metadata.publishDate).toISOString().split('T')[0] : 
                     prev.publishDate,
      }));

      showAlert('解析成功', '✅ Markdown 文件解析成功！已自动填充内容。');
      
      // 清空文件选择器
      e.target.value = '';
    } catch (error) {
      console.error('Failed to parse markdown file:', error);
      showAlert('解析失败', '❌ Markdown 文件解析失败，请检查文件格式');
      e.target.value = '';
    } finally {
      setIsParsingMarkdown(false);
    }
  };

  // 保存快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S (Mac) 或 Ctrl+S (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        
        // 已发布的文章：直接更新发布
        if (isEditMode && currentArticleId) {
          handlePublish();
        } 
        // 草稿或新文章：保存草稿
        else {
          handleSaveDraft();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [formData, isEditMode, currentArticleId, isDraftMode, currentDraftId]);

  // Custom toolbar style overrides
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* 编辑器基础样式 */
      .rc-md-editor {
        border: none !important;
        background: transparent !important;
      }
      
      .rc-md-navigation {
        border-bottom: 1px solid rgba(0,0,0,0.05) !important;
        background: #f9f9f9 !important;
      }
      
      .dark .rc-md-navigation {
        border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        background: #1a1a1a !important;
      }
      
      /* 编辑容器布局 */
      .rc-md-editor .editor-container {
        display: flex !important;
        overflow: hidden !important;
      }
      
      /* 编辑区和预览区独立滚动 */
      .rc-md-editor .sec-md,
      .rc-md-editor .sec-html {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        height: 100% !important;
      }
      
      .rc-md-editor .sec-md .input {
        overflow-y: auto !important;
        height: 100% !important;
      }
      
      /* 预览区布局和滚动 */
      .rc-md-editor .custom-html-style,
      .rc-md-editor .markdown-content {
        overflow-y: auto !important;
        height: 100% !important;
        padding: 20px !important;
      }
      
      /* H1 第一个元素在预览区的特殊处理 */
      .rc-md-editor .markdown-content > h1:first-child {
        margin-top: 0 !important;
      }
      

      /* 全屏状态下的样式优化 */
      .rc-md-editor.full {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        background: #f9f9f9 !important;
      }
      .dark .rc-md-editor.full {
        background: #1a1a1a !important;
      }
      .rc-md-editor.full .editor-container,
      .rc-md-editor.full .sec-md,
      .rc-md-editor.full .sec-html {
        background: #f9f9f9 !important;
      }
      .dark .rc-md-editor.full .editor-container,
      .dark .rc-md-editor.full .sec-md,
      .dark .rc-md-editor.full .sec-html {
        background: #1a1a1a !important;
      }
      .rc-md-editor.full .rc-md-navigation {
        background: #f9f9f9 !important;
        border-bottom: 1px solid rgba(0,0,0,0.1) !important;
      }
      .dark .rc-md-editor.full .rc-md-navigation {
        background: #1a1a1a !important;
        border-bottom: 1px solid rgba(255,255,255,0.1) !important;
      }
      .rc-md-editor.full .editor-container {
        height: calc(100vh - 48px) !important;
      }
      
      /* 滚动条优化 */
      .rc-md-editor .custom-html-style::-webkit-scrollbar,
      .rc-md-editor .sec-md .input::-webkit-scrollbar,
      .rc-md-editor .sec-md::-webkit-scrollbar,
      .rc-md-editor .sec-html::-webkit-scrollbar {
        width: 8px;
      }
      .rc-md-editor .custom-html-style::-webkit-scrollbar-track,
      .rc-md-editor .sec-md .input::-webkit-scrollbar-track,
      .rc-md-editor .sec-md::-webkit-scrollbar-track,
      .rc-md-editor .sec-html::-webkit-scrollbar-track {
        background: transparent;
      }
      .rc-md-editor .custom-html-style::-webkit-scrollbar-thumb,
      .rc-md-editor .sec-md .input::-webkit-scrollbar-thumb,
      .rc-md-editor .sec-md::-webkit-scrollbar-thumb,
      .rc-md-editor .sec-html::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
      }
      .dark .rc-md-editor .custom-html-style::-webkit-scrollbar-thumb,
      .dark .rc-md-editor .sec-md .input::-webkit-scrollbar-thumb,
      .dark .rc-md-editor .sec-md::-webkit-scrollbar-thumb,
      .dark .rc-md-editor .sec-html::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
      }
      .rc-md-editor .custom-html-style::-webkit-scrollbar-thumb:hover,
      .rc-md-editor .sec-md .input::-webkit-scrollbar-thumb:hover,
      .rc-md-editor .sec-md::-webkit-scrollbar-thumb:hover,
      .rc-md-editor .sec-html::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.3);
      }
      .dark .rc-md-editor .custom-html-style::-webkit-scrollbar-thumb:hover,
      .dark .rc-md-editor .sec-md .input::-webkit-scrollbar-thumb:hover,
      .dark .rc-md-editor .sec-md::-webkit-scrollbar-thumb:hover,
      .dark .rc-md-editor .sec-html::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.3);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#1a1a1a] flex flex-col relative transition-colors duration-300">
      {/* 全局 Dialog */}
      <LandDialog
        show={dialogConfig.show}
        title={dialogConfig.title}
        onClose={closeDialog}
        mask={true}
        size="medium"
        cancelLabel={dialogConfig.type === 'confirm' ? dialogConfig.cancelLabel : undefined}
        submitLabel={dialogConfig.confirmLabel}
        onCancel={dialogConfig.type === 'confirm' ? closeDialog : undefined}
        onSubmit={() => {
          if (dialogConfig.type === 'confirm' && dialogConfig.onConfirm) {
            dialogConfig.onConfirm();
          } else {
            closeDialog();
          }
        }}
      >
        <div className="py-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {dialogConfig.message}
        </div>
      </LandDialog>

      {/* 密码验证弹窗 */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#202020] rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-indigo-900/30 mb-4">
                <Icon name="lock" size={30} strokeWidth={3} className="text-gray-800 dark:text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                编辑器访问验证
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                请输入密码以访问文章编辑器
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 items-center">
              <div className='w-full'>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="请输入访问密码"
                  autoFocus
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all outline-none"
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                    <Icon name="warning" size={16} strokeWidth={2} />
                    {passwordError}
                  </p>
                )}
              </div>

              <LandButton
                type="background"
                text="验证访问"
                onClick={handlePasswordSubmit}
                disabled={!passwordInput || isVerifying}
              />

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  提示：密码在后端安全验证，不会暴露到前端
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 主编辑器内容 - 仅在认证后显示 */}
      {isAuthenticated && (
        <>
      {/* Mock 数据指示器 */}
      <MockIndicator />
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-[#f9f9f9]/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <BackButton onClick={() => navigator('/articles')} className='!static !m-0 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full transition-colors'/>
          {/* Title Input */}
          <div className='flex flex-col gap-1'>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Untitled..."
              className="truncate w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
            <div className='flex gap-2 text-xs items-center'>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap">{formData.content.length} 字</span>
             {isDraftMode && (
            <span style={{fontSize: '12px'}} className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              草稿
            </span>
          )}
          {lastSavedTime && (
            <span style={{fontSize: '12px'}} className="text-xs text-gray-400 dark:text-gray-500">
              {isEditMode ? '已更新' : isDraftMode ? '草稿已保存' : '已保存'} {lastSavedTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
            </div>
          </div>
          {isEditMode && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              编辑模式
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <LandButton
            type='text'
            onClick={() => setShowHistory(!showHistory)}
            icon={<Icon name='log' strokeWidth={4} size={18}/>}
              tip='查看历史文章'
              tipProps={{placement:'bottom'}}
          >
          </LandButton>

          <LandPopOver placement='bottom' content='上传并解析 Markdown 文件' theme='dark'>
            <label className='relative w-9 h-9 flex items-center justify-center ounded-lg hover:bg-[var(--color-bg-secondary)] dark:hover:bg-gray-800 transition-colors cursor-pointer z-1 flex-shrink-0'>
            <input
              type="file"
              accept=".md,.markdown"
              onChange={handleMarkdownUpload}
              className="absolute w-full h-full hidden"
              disabled={isParsingMarkdown}
            />
              <Icon name='upload' strokeWidth={4} size={18}/>
          </label>
          </LandPopOver>

          <LandButton
            type='text'
            onClick={() => setShowSettings(!showSettings)}
            icon={<Icon name='setting' strokeWidth={4} size={18}/>}
            tip='设置文章信息'
            tipProps={{placement:'bottom'}}
          >
          </LandButton>
          
          {!isEditMode && (
            <LandButton
              type='fill'
              onClick={handleSaveDraft}
              disabled={isSaving}
              tipProps={{placement:'bottom'}}
              text='保存草稿'
            >
            </LandButton>
          )}
          
          <LandButton
            type='background'
            onClick={() => handleSubmit()}
            disabled={isSaving}
          >
            {isSaving ? '保存中...' : (isEditMode ? '更新' : '发布')}
          </LandButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden h-full">
        <div className="w-full max-w-5xl mx-auto flex flex-col" style={{height: 'calc(100vh - 84px)'}}>

          {/* Editor */}
          <div className="flex-1 h-full">
            <MdEditor
              ref={editorRef}
              style={{ height: '100%', minHeight: '500px', backgroundColor: 'transparent' }}
              renderHTML={(text: string) => mdParser.render(text)}
              onChange={handleEditorChange}
              value={formData.content}
              onImageUpload={handleEditorImageUpload}
              config={{
                view: {
                  menu: true,
                  md: true,
                  html: false
                },
                canView: {
                    menu: true,
                    md: true,
                    html: true,
                    fullScreen: true,
                    hideMenu: true,
                },
                htmlClass: 'markdown-content'
              }}
              className="typora-editor"
            />
            
            {/* 图片上传进度提示 */}
            {uploadingImages.size > 0 && (
              <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Icon name="loading" size={20} strokeWidth={3} />
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    正在上传图片... ({uploadingImages.size} 张)
                  </div>
                </div>
              </div>
            )}
            
            {/* 未上传图片数量提示 */}
            {imageStore.size > 0 && Array.from(imageStore.values()).some(img => !img.uploaded) && (
              <div className="fixed bottom-4 left-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-lg p-3 border border-yellow-200 dark:border-yellow-800 z-50">
                <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                  <Icon name="warning" size={18} strokeWidth={3} />
                  <span>
                    有 {Array.from(imageStore.values()).filter(img => !img.uploaded).length} 张图片未上传，发布时将自动上传
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowSettings(false)}
          />
          <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-[#202020] shadow-2xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">发布设置</h2>
              <LandButton type='transparent' icon={<Icon name='close' strokeWidth={4}/>} onClick={() => setShowSettings(false)}/>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  摘要
                </label>
                <LandHighlightTextarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleSummaryChange}
                  rows={4}
                  placeholder="这篇文章讲了什么？"
                  className='bg-[var(--color-bg-secondary)] dark:bg-[#1a1a1a] p-4 rounded-lg'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
                <LandTagInput
                  tags={formData.tags}
                  onChange={handleTagsChange}
                  placeholder="添加标签..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">日期</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[var(--color-bg-secondary)] dark:bg-gray-800/50 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">阅读时长 (分钟)</label>
                  <LandNumberInput
                  type='background'
                    value={formData.readTime}
                    onChange={handleReadTimeChange}
                  />
                </div>
              </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">类型</label>
                 <LandSelect
                 type='background'
                   selected={formData.type}
                   onChange={handleTypeChange}
                   data={[
                     { key: 'Engineering', label: 'Engineering' },
                     { key: 'Experience', label: 'Experience' },
                     { key: 'AI', label: 'AI' },
                     { key: 'Thinking', label: 'Thinking' }
                   ]}
                 />
              </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">封面图片</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <div className="w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-[var(--color-bg-secondary)] dark:bg-gray-800/50 p-4 text-sm text-center cursor-pointer hover:border-gray-600 dark:hover:border-indigo-500 transition-colors">
                          {isUploading ? (
                            <span className="text-gray-500 dark:text-gray-400">上传中...</span>
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">
                              点击上传图片 (最大 5MB)
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                    <input
                      type="text"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[var(--color-bg-secondary)] dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-gray-600 focus:border-transparent dark:text-white"
                      placeholder="或输入图片 URL"
                    />
                  </div>
                </div>
                
                {formData.coverImage && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={formData.coverImage} alt="Cover" className="w-full h-32 object-cover" />
                  </div>
                )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-center text-gray-400">
                    自动保存已启用 (模拟)
                </p>
            </div>
          </div>
        </>
      )}

      {/* History Drawer */}
      {showHistory && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowHistory(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-[#202020] shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out dark:border-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">历史文章</h2>
                <LandButton type='transparent' icon={<Icon name='close' strokeWidth={4}/>} onClick={() => setShowHistory(false)}/>
              </div>

              <LandButton text='新建文章' type='background' icon={<Icon name='add' strokeWidth={4}/>}  onClick={handleNewArticle}/>

              <div className='mt-6'>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">草稿</h3>
                {drafts.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-xs">
                    暂无草稿
                  </div>
                ) : (
                  <div className="space-y-2">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        onClick={() => handleLoadDraft(draft)}
                        className={`group p-3 rounded-lg cursor-pointer transition-all ${
                          draft.id === currentDraftId
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                              {draft.title || '无标题草稿'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(draft.updatedAt).toLocaleDateString('zh-CN')}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                {draft.type}
                              </span>
                            </div>
                          </div>
                          <LandButton
                            type='transparent'
                            tip='删除'
                            onClick={(e) => handleDeleteDraft(draft.id, e)}
                            icon={<Icon name='delete' strokeWidth={4}/>}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='mt-6'>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">已发布文章</h3>
                {isLoadingArticles ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  加载中...
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-4 text-gray-400 dark:text-gray-500 text-xs">
                  还没有文章
                </div>
              ) : (
                <div className="space-y-2">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => handleLoadArticle(article)}
                      className={`group p-3 rounded-lg cursor-pointer transition-all ${
                        article.id === currentArticleId
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {article.title || '无标题'}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(article.publishDate).toLocaleDateString('zh-CN')}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {article.type}
                            </span>
                          </div>
                        </div>
                        <LandButton
            type='transparent'
            tip='删除'
             onClick={(e) => handleDeleteArticle(article.id, e)}
            icon={<Icon name='delete' strokeWidth={4}/>}
          >
          </LandButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
};

export default ArticleEditorPage;

