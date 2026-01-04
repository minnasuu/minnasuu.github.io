import React, { useState, useMemo, useEffect } from 'react';
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

const ArticleSliders: React.FC<ArticleSlidersProps> = ({ article, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const thumbnailRef = React.useRef<HTMLDivElement>(null);

  const slides = useMemo<SlideData[]>(() => {
    const markdown = article.markdownContent || '';
    const slidesList: SlideData[] = [];
    
    // 1. Add Cover Slide
    slidesList.push({ type: 'cover', title: 'Cover' });

    // 2. Parse Markdown Slides
    if (markdown) {
        const tokens = marked.lexer(markdown);
        let currentSlideTokens: any[] = [];
        let currentSlideLength = 0;
        const MAX_SLIDE_LENGTH = 1200;

        const pushSlide = (tokens: any[]) => {
            if (tokens.length > 0) {
                // Extract title from first heading
                const firstHeading = tokens.find((t: any) => t.type === 'heading');
                let title = `Slide ${slidesList.length + 1}`;
                if (firstHeading) {
                    title = firstHeading.text;
                } else {
                   // Try to get first few words of text
                   const firstText = tokens.find((t: any) => t.type === 'paragraph' || t.type === 'text');
                   if (firstText) {
                       title = firstText.text.slice(0, 20) + (firstText.text.length > 20 ? '...' : '');
                   }
                }

                slidesList.push({
                    type: 'markdown',
                    content: tokens.map(t => t.raw).join(''),
                    title
                });
            }
        };

        tokens.forEach((token: any) => {
            const tokenLength = token.raw?.length || 0;

            // Check if token is a heading of level 1 or 2
            if (token.type === 'heading' && token.depth <= 2) {
                pushSlide(currentSlideTokens);
                currentSlideTokens = [token];
                currentSlideLength = tokenLength;
            } else {
                // Check if adding this token would exceed the limit
                // We only split if we already have content (don't split if it's the first item)
                if (currentSlideTokens.length > 0 && currentSlideLength + tokenLength > MAX_SLIDE_LENGTH) {
                    pushSlide(currentSlideTokens);
                    currentSlideTokens = [token];
                    currentSlideLength = tokenLength;
                } else {
                    currentSlideTokens.push(token);
                    currentSlideLength += tokenLength;
                }
            }
        });
        
        pushSlide(currentSlideTokens);
    }

    return slidesList;
  }, [article]);

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

  if (slides.length === 0) {
      return <div className="article-sliders-container">No content</div>;
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
