import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { useParams } from 'react-router-dom';
import { createArticle, updateArticle, fetchArticles, fetchArticleById, deleteArticle } from '../../../shared/utils/backendClient';
import type { CreateArticleRequest } from '../../../shared/utils/backendClient';
import type { Article } from '../../../shared/types';
import BackButton from '../../../shared/components/BackButton';
import { LandButton } from '@suminhan/land-design';

const mdParser = new MarkdownIt(/* Markdown-it options */);

const ArticleEditorPage: React.FC = () => {
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
  const [tagsInput, setTagsInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [currentArticleId, setCurrentArticleId] = useState<string | undefined>(id);
  const [isEditMode, setIsEditMode] = useState(false);

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
          setTagsInput(article.tags.join(', '));
          setIsEditMode(true);
        } catch (error) {
          console.error('Failed to load article:', error);
          alert('Failed to load article.');
        }
      }
    };

    loadArticle();
  }, [currentArticleId]);

  const handleEditorChange = ({ text }: { text: string }) => {
    setFormData(prev => ({ ...prev, content: text }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (isEditMode && currentArticleId) {
        await updateArticle(currentArticleId, formData);
        alert('Article updated successfully!');
      } else {
        const newArticle = await createArticle(formData);
        setCurrentArticleId(newArticle.id);
        setIsEditMode(true);
        alert('Article created successfully!');
      }
      // 重新加载文章列表
      const fetchedArticles = await fetchArticles();
      setArticles(fetchedArticles.sort((a, b) => 
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ));
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article.');
    }
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
    setTagsInput('');
    setCurrentArticleId(undefined);
    setIsEditMode(false);
    setShowHistory(false);
  };

  const handleLoadArticle = (article: Article) => {
    setCurrentArticleId(article.id);
    setShowHistory(false);
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

  // Custom toolbar style overrides
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .rc-md-editor {
        border: none !important;
        background: transparent !important;
      }
      .rc-md-navigation {
        background: transparent !important;
        border-bottom: 1px solid rgba(0,0,0,0.05) !important;
      }
      .dark .rc-md-navigation {
        border-bottom: 1px solid rgba(255,255,255,0.05) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#1a1a1a] flex flex-col relative transition-colors duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-[#f9f9f9]/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <BackButton className='!static !m-0 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-full transition-colors'/>
          <span className="text-sm text-gray-400 dark:text-gray-500 font-mono">
            {formData.content.length} chars
          </span>
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
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>}
          >
          </LandButton>

          <LandButton
            type='text'
            onClick={() => setShowSettings(!showSettings)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>}
          >
          </LandButton>
          
          <LandButton
            type='background'
            onClick={() => handleSubmit()}
          >
            {isEditMode ? '更新' : '发布'}
          </LandButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center w-full overflow-hidden">
        <div className="w-full max-w-5xl flex flex-col h-full">
          {/* Title Input */}
          <div className="px-6 pt-8 pb-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Untitled..."
              className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </div>

          {/* Editor */}
          <div className="flex-1 h-full px-2">
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
                }
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
          <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-[#202020] shadow-2xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out border-l dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">发布设置</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">摘要</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                  placeholder="这篇文章讲了什么？"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="React, Design, Tech"
                  className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">日期</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">阅读时长 (分钟)</label>
                  <input
                    type="number"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                  />
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">类型</label>
                 <select
                   name="type"
                   value={formData.type}
                   onChange={handleChange}
                   className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                 >
                   <option value="tech">Tech</option>
                   <option value="essay">Essay</option>
                 </select>
              </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">封面图片 URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                    placeholder="https://..."
                  />
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
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-[#202020] shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out border-r dark:border-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">历史文章</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <button
                onClick={handleNewArticle}
                className="w-full mb-4 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                新建文章
              </button>

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
                        <button
                          onClick={(e) => handleDeleteArticle(article.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
                          title="删除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleEditorPage;

