import React, { useState, useEffect } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import { useParams } from 'react-router-dom';
import { createArticle, updateArticle, fetchArticles, fetchArticleById, deleteArticle, uploadImage } from '../../../shared/utils/backendClient';
import type { CreateArticleRequest } from '../../../shared/utils/backendClient';
import type { Article } from '../../../shared/types';
import BackButton from '../../../shared/components/BackButton';
import MockIndicator from '../../../shared/components/MockIndicator';
import { Icon, LandButton,  LandHighlightTextarea, LandTagInput, LandNumberInput, LandSelect } from '@suminhan/land-design';
import type { SelectItemType } from '@suminhan/land-design';

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
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [currentArticleId, setCurrentArticleId] = useState<string | undefined>(id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      {/* Mock 数据指示器 */}
      <MockIndicator />
      
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
            icon={<Icon name='home' strokeWidth={4} size={18}/>}
          >
          </LandButton>

          <LandButton
            type='text'
            onClick={() => setShowSettings(!showSettings)}
            icon={<Icon name='setting' strokeWidth={4} size={18}/>}
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
          <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-[#202020] shadow-2xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">发布设置</h2>
              <LandButton type='transparent' icon={<Icon name='close' strokeWidth={4}/>} onClick={() => setShowSettings(false)}/>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">摘要</label>
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
                        <div className="w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-[var(--color-bg-secondary)] dark:bg-gray-800/50 p-4 text-sm text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
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
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-[var(--color-bg-secondary)] dark:bg-gray-800/50 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
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
    </div>
  );
};

export default ArticleEditorPage;

