import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticle, updateArticle, fetchArticles, fetchArticleById, deleteArticle, uploadImage } from '../../../shared/utils/backendClient';
import type { CreateArticleRequest } from '../../../shared/utils/backendClient';
import type { Article } from '../../../shared/types';
import BackButton from '../../../shared/components/BackButton';
import MockIndicator from '../../../shared/components/MockIndicator';
import { Icon, LandButton,  LandHighlightTextarea, LandTagInput, LandNumberInput, LandSelect } from '@suminhan/land-design';
import type { SelectItemType } from '@suminhan/land-design';
import '../styles/shared-markdown.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

const ArticleEditorPage: React.FC = () => {
  const navigator = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    summary: '',
    content: '',
    publishDate: new Date().toISOString().split('T')[0],
    tags: [],
    readTime: 5,
    coverImage: '',
    link: '',
    type: 'tech',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [currentArticleId, setCurrentArticleId] = useState<string | undefined>(id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 编辑器访问密码（从环境变量获取，默认值作为后备）
  const EDITOR_PASSWORD = import.meta.env.VITE_EDITOR_PASSWORD;

  // 检查本地存储的认证状态
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('editor_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 处理密码验证
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === EDITOR_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('editor_authenticated', 'true');
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('密码错误，请重试');
      setPasswordInput('');
    }
  };

  // 加载历史文章列表
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        ));
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    loadArticles();
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
                shouldUseDraft = confirm('检测到较新的本地草稿，是否恢复？\n\n选择"确定"恢复草稿\n选择"取消"加载已发布版本');
              }
              
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
                  type: draft.type || 'tech',
                });
                setIsEditMode(true);
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
          alert('Failed to load article.');
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
    setFormData(prev => ({ ...prev, type: item.key as 'tech' | 'essay' }));
  };

  // 本地保存草稿（使用 localStorage）
  const handleSaveDraft = () => {
    try {
      const draftKey = currentArticleId ? `draft_${currentArticleId}` : 'draft_new';
      localStorage.setItem(draftKey, JSON.stringify({
        ...formData,
        savedAt: new Date().toISOString()
      }));
      setLastSavedTime(new Date());
      console.log('草稿已保存到本地');
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  // 发布/更新文章
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      if (isEditMode && currentArticleId) {
        await updateArticle(currentArticleId, formData);
        alert('文章更新成功！');
        setLastSavedTime(new Date());
        // 清除对应的草稿
        localStorage.removeItem(`draft_${currentArticleId}`);
      } else {
        const newArticle = await createArticle(formData);
        setCurrentArticleId(newArticle.id);
        setIsEditMode(true);
        alert('文章发布成功！');
        setLastSavedTime(new Date());
        // 清除新建文章的草稿
        localStorage.removeItem('draft_new');
      }
      // 重新加载文章列表
      const fetchedArticles = await fetchArticles();
      setArticles(fetchedArticles.sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ));
    } catch (error) {
      console.error('Failed to publish article:', error);
      alert('操作失败，请重试');
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
      type: 'tech',
    });
    setCurrentArticleId(undefined);
    setIsEditMode(false);
    setShowHistory(false);
    setLastSavedTime(null);
    
    // 尝试加载新建文章的草稿
    try {
      const draftData = localStorage.getItem('draft_new');
      if (draftData) {
        const draft = JSON.parse(draftData);
        if (confirm('检测到未发布的草稿，是否恢复？')) {
          setFormData({
            title: draft.title || '',
            summary: draft.summary || '',
            content: draft.content || '',
            publishDate: draft.publishDate || new Date().toISOString().split('T')[0],
            tags: draft.tags || [],
            readTime: draft.readTime || 5,
            coverImage: draft.coverImage || '',
            link: draft.link || '',
            type: draft.type || 'tech',
          });
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  const handleLoadArticle = (article: Article) => {
    setCurrentArticleId(article.id);
    setShowHistory(false);
    setLastSavedTime(null);
    
    // 检查是否有该文章的草稿
    try {
      const draftData = localStorage.getItem(`draft_${article.id}`);
      if (draftData) {
        const draft = JSON.parse(draftData);
        const draftTime = new Date(draft.savedAt);
        const articleTime = new Date(article.publishDate);
        
        if (draftTime > articleTime && confirm('检测到较新的草稿，是否恢复？')) {
          // 不加载，等 useEffect 自动加载文章后再决定
          return;
        }
      }
    } catch (error) {
      console.error('Failed to check draft:', error);
    }
  };

  const handleDeleteArticle = async (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await deleteArticle(articleId);
      alert('Article deleted successfully!');
      
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
      alert('Failed to delete article.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({ ...prev, coverImage: result.url }));
      alert('图片上传成功！');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('图片上传失败，请重试');
    } finally {
      setIsUploading(false);
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
        // 未发布的新文章：保存本地草稿
        else {
          handleSaveDraft();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [formData, isEditMode, currentArticleId]);

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
                disabled={!passwordInput}
              />

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  提示：密码验证仅在当前会话有效
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
              className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap">{formData.content.length} 字</span>
          </div>
          {isEditMode && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              编辑模式
            </span>
          )}
          {lastSavedTime && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {isEditMode ? '已更新' : '已保存'} {lastSavedTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
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

          <LandButton
            type='text'
            onClick={() => setShowSettings(!showSettings)}
            icon={<Icon name='setting' strokeWidth={4} size={18}/>}
            tip='设置文章信息'
            tipProps={{placement:'bottom'}}
          >
          </LandButton>
          
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
              style={{ height: '100%', minHeight: '500px', backgroundColor: 'transparent' }}
              renderHTML={(text: string) => mdParser.render(text)}
              onChange={handleEditorChange}
              value={formData.content}
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
                     { key: 'tech', label: 'Tech' },
                     { key: 'essay', label: 'Essay' }
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

              <div className='mt-3'>
                {isLoadingArticles ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  加载中...
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
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
                              {article.type === 'tech' ? '技术' : '随笔'}
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

