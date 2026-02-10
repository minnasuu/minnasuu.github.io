import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import ArticleMarkdown from '../ArticleMarkdown';
import type { Article } from '../../../../shared/types';
import './ArticleSliders.scss';
import { Icon, LandButton } from '@suminhan/land-design';
import BackButton from '../../../../shared/components/BackButton';

interface ArticleSlidersProps {
  article: Article;
  onClose?: () => void;
}

interface SlideData {
  type: 'cover' | 'markdown';
  content?: string;
  title?: string;
}

// 从 token 列表中提取标题
const extractTitle = (tokens: any[], fallbackIndex: number): string => {
  const firstHeading = tokens.find((t: any) => t.type === 'heading');
  if (firstHeading) return firstHeading.text;
  const firstText = tokens.find((t: any) => t.type === 'paragraph' || t.type === 'text');
  if (firstText) return firstText.text.slice(0, 20) + (firstText.text.length > 20 ? '...' : '');
  return `Slide ${fallbackIndex}`;
};

// 第一阶段：粗分 - 按标题 + 字符数
const coarseSplit = (markdown: string): SlideData[] => {
  const slidesList: SlideData[] = [];
  if (!markdown) return slidesList;

  const tokens = marked.lexer(markdown);
  let currentSlideTokens: any[] = [];
  let currentSlideLength = 0;
  const MAX_SLIDE_LENGTH = 1500;

  const pushSlide = (tks: any[]) => {
    if (tks.length > 0) {
      slidesList.push({
        type: 'markdown',
        content: tks.map(t => t.raw).join(''),
        title: extractTitle(tks, slidesList.length + 1),
      });
    }
  };

  tokens.forEach((token: any) => {
    const tokenLength = token.raw?.length || 0;
    if (token.type === 'heading' && token.depth <= 2) {
      pushSlide(currentSlideTokens);
      currentSlideTokens = [token];
      currentSlideLength = tokenLength;
    } else if (currentSlideTokens.length > 0 && currentSlideLength + tokenLength > MAX_SLIDE_LENGTH) {
      pushSlide(currentSlideTokens);
      currentSlideTokens = [token];
      currentSlideLength = tokenLength;
    } else {
      currentSlideTokens.push(token);
      currentSlideLength += tokenLength;
    }
  });
  pushSlide(currentSlideTokens);

  return slidesList;
};

// 第二阶段：将一个溢出 slide 的 markdown 拆分成多个
const splitOverflowSlide = (slideContent: string): string[] => {
  const tokens = marked.lexer(slideContent);
  if (tokens.length <= 1) return [slideContent];

  // 二分拆：前半 / 后半
  const mid = Math.ceil(tokens.length / 2);
  const firstHalf = tokens.slice(0, mid).map(t => t.raw).join('');
  const secondHalf = tokens.slice(mid).map(t => t.raw).join('');

  return [firstHalf, secondHalf];
};

const ArticleSliders: React.FC<ArticleSlidersProps> = ({ article, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isReady, setIsReady] = useState(false);

  // 第一阶段粗分
  const coarseSlides = useMemo<SlideData[]>(() => {
    const markdown = article.markdownContent || '';
    const cover: SlideData = { type: 'cover', title: 'Cover' };
    return [cover, ...coarseSplit(markdown)];
  }, [article]);

  // 第二阶段：渲染后检测溢出并再拆分
  useEffect(() => {
    const container = measureRef.current;
    if (!container) {
      setSlides(coarseSlides);
      setIsReady(true);
      return;
    }

    const refineSlides = async () => {
      const refined: SlideData[] = [];

      for (const slide of coarseSlides) {
        if (slide.type === 'cover') {
          refined.push(slide);
          continue;
        }

        // 检测是否溢出
        let contents = [slide.content || ''];
        let stable = false;
        let iterations = 0;
        const MAX_ITERATIONS = 5;

        while (!stable && iterations < MAX_ITERATIONS) {
          stable = true;
          iterations++;
          const nextContents: string[] = [];

          for (const content of contents) {
            // 渲染到隐藏容器测量高度
            const isOverflow = await measureContent(container, content);

            if (isOverflow) {
              const parts = splitOverflowSlide(content);
              if (parts.length > 1) {
                nextContents.push(...parts);
                stable = false;
              } else {
                nextContents.push(content);
              }
            } else {
              nextContents.push(content);
            }
          }
          contents = nextContents;
        }

        // 将拆分结果加入 refined
        contents.forEach((content, i) => {
          const tokens = marked.lexer(content);
          refined.push({
            type: 'markdown',
            content,
            title: extractTitle(tokens as any[], refined.length + 1),
          });
        });
      }

      setSlides(refined);
      setIsReady(true);
    };

    refineSlides();
  }, [coarseSlides]);

  // 测量内容是否溢出 slide 可视区域
  const measureContent = useCallback((container: HTMLDivElement, content: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // 清空
      container.innerHTML = '';

      // 创建临时渲染节点
      const wrapper = document.createElement('div');
      wrapper.className = 'markdown-content-wrapper';
      wrapper.innerHTML = marked(content) as string;
      container.appendChild(wrapper);

      // 等待一帧让浏览器完成布局
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const isOverflow = container.scrollHeight > container.clientHeight + 2;
          container.innerHTML = '';
          resolve(isOverflow);
        });
      });
    });
  }, []);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };
  
  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevSlide();
        } else if (e.key === 'Escape' && onClose) {
            onClose();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, onClose]);

  // Auto scroll thumbnails
  useEffect(() => {
      if (thumbnailRef.current) {
          const activeThumb = thumbnailRef.current.children[currentSlide] as HTMLElement;
          if (activeThumb) {
              activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
      }
  }, [currentSlide]);

  if (!isReady || slides.length === 0) {
      return (
        <div className="article-sliders-container">
          {/* 隐藏的测量容器 - 模拟 slide-inner 的尺寸 */}
          <div ref={measureRef} className="slide-measure-container" />
          <div className="slide-loading">Loading...</div>
        </div>
      );
  }

  const renderCoverSlide = () => (
    <div className="cover-slide-content">
       {/* Background Visual */}
       <div className="cover-visual">
          <div className="visual-inner">
             {article.coverImage?.endsWith(".mp4") ? (
                 <video src={article.coverImage} autoPlay loop muted playsInline />
             ) : (
                 <img src={article.coverImage || ''} alt={article.title} />
             )}
          </div>
       </div>

       {/* Text Content */}
       <div className="cover-text">
           <div className="article-meta-top">
               <span className="article-date">
                   {new Date(article.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
               </span>
               <span className="article-type-badge">{article.type}</span>
           </div>
           
           <h1 className="article-title">{article.title}</h1>
           <p className="article-summary">{article.summary}</p>
           
           <div className="article-tags">
               {article.tags.map((tag, idx) => (
                   <span key={idx} className="tag-pill">#{tag}</span>
               ))}
           </div>
       </div>
    </div>
  );

  return (
    <div className="article-sliders-container">
      {/* 隐藏的测量容器 */}
      <div ref={measureRef} className="slide-measure-container" />

      <div
        className="slider-track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            className={`slide ${slide.type === "cover" ? "is-cover" : ""}`}
            key={index}
          >
            <div className="slide-inner">
              {slide.type === "cover" ? (
                renderCoverSlide()
              ) : (
                <div className="markdown-content-wrapper">
                  <ArticleMarkdown>{slide.content || ""}</ArticleMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="slider-thumbnails-container">
          <div className="slider-thumbnails" ref={thumbnailRef}>
              {slides.map((slide, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    title={slide.title}
                  >
                      {slide.type === 'cover' ? (
                          <div className="thumb-cover">
                              {article.coverImage?.endsWith(".mp4") ? (
                                 <video src={article.coverImage} muted />
                             ) : (
                                 <img src={article.coverImage || ''} alt="cover" />
                             )}
                          </div>
                      ) : (
                          <div className="thumb-content">
                              <div className="thumb-markdown">
                                  <ArticleMarkdown>{slide.content || ''}</ArticleMarkdown>
                              </div>
                              <div className="thumb-overlay">
                                  <span>{index}</span>
                              </div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div> */}

      <div className="slide-indicator">
        {currentSlide === 0
          ? "Cover"
          : `${currentSlide} / ${slides.length - 1}`}
      </div>

      <div className="slider-controls">
        <LandButton
          type="fill"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <Icon name="arrow-line" className="rotate-90" strokeWidth={4} />
        </LandButton>
        <LandButton
          type="fill"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          <Icon name="arrow-line" className="-rotate-90" strokeWidth={4} />
        </LandButton>
      </div>
      {onClose && (
        <div className="slider-controls-close">
          <BackButton onClick={onClose} />
        </div>
      )}
    </div>
  );
};

export default ArticleSliders;
