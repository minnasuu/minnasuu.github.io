import React, { useState, useEffect, useRef, useCallback } from 'react';
import './LineAnchor.css';

interface LineAnchorProps {
  anchors?: { key: string; title: string }[]; // 可选，如果不提供则自动提取
  contentRef: React.RefObject<HTMLDivElement | null>;
  onSectionChange?: (currentSection: number) => void;
  autoExtract?: boolean; // 是否自动提取标题
}

interface AnchorData {
  key: string;
  title: string;
  progress: number; // 0-1 表示该标题下内容的百分比
  isActive: boolean;
}

const LineAnchor: React.FC<LineAnchorProps> = ({ 
  anchors: providedAnchors, 
  contentRef, 
  onSectionChange,
  autoExtract = true 
}) => {
  const [anchorData, setAnchorData] = useState<AnchorData[]>([]);
  const [extractedAnchors, setExtractedAnchors] = useState<{ key: string; title: string }[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // 获取最终使用的 anchors
  const anchors = providedAnchors || extractedAnchors;

  // 自动提取文章标题
  const extractHeadings = useCallback(() => {
    if (!contentRef.current || !autoExtract || providedAnchors) return;

    const headings = contentRef.current.querySelectorAll('h1');
    const newAnchors: { key: string; title: string }[] = [];

    headings.forEach((heading, index) => {
      const text = heading.textContent?.trim() || '';
      if (!text) return;

      // 生成唯一的 ID
      const id = `heading-${index}-${text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')}`;

      // 设置 ID 到元素上
      heading.id = id;

      // 添加锚点样式类
      heading.classList.add('article-heading-anchor');

      newAnchors.push({
        key: id,
        title: text
      });
    });

    setExtractedAnchors(newAnchors);
  }, [contentRef, autoExtract, providedAnchors]);

  // 计算每个标题的内容百分比
  const calculateProgress = useCallback(() => {
    if (!contentRef.current || anchors.length === 0) return;

    // 获取滚动容器
    const scrollContainer = document.querySelector('.article-detail-page') as HTMLDivElement;
    if (!scrollContainer) return;

    // 使用内容区域的总高度
    const contentHeight = contentRef.current.scrollHeight;
    
    const newAnchorData: AnchorData[] = anchors.map((anchor, index) => {
      const element = document.getElementById(anchor.key);
      if (!element) {
        return {
          key: anchor.key,
          title: anchor.title,
          progress: 0.15, // 默认最小长度
          isActive: false
        };
      }

      // 计算当前标题到下一个标题之间的内容高度
      const currentTop = element.offsetTop;
      const nextElement = anchors[index + 1] ? document.getElementById(anchors[index + 1].key) : null;
      const nextTop = nextElement ? nextElement.offsetTop : (contentRef.current!.offsetTop + contentHeight);
      
      const sectionHeight = nextTop - currentTop;
      
      // 计算该章节内容占全文的百分比  
      const progress = Math.min(sectionHeight / contentHeight, 1);
      
      // 设置最小和最大长度
      const minProgress = 0.15; // 最小15%
      const maxProgress = 0.8;  // 最大80%
      
      return {
        key: anchor.key,
        title: anchor.title,
        progress: Math.max(Math.min(progress, maxProgress), minProgress),
        isActive: false
      };
    });

    setAnchorData(newAnchorData);
  }, [anchors]);

  // 监听滚动，更新当前激活的标题
  const updateActiveAnchor = React.useCallback(() => {
    if (!contentRef.current || anchors.length === 0) return;

    // 获取滚动容器
    const scrollContainer = document.querySelector('.article-detail-page') as HTMLDivElement;
    if (!scrollContainer) return;

    const scrollTop = scrollContainer.scrollTop;
    const containerHeight = scrollContainer.clientHeight;
    const viewportBottom = scrollTop + containerHeight;
    
    let newCurrentSection = 0; // 默认第一个章节
    
    // 从前往后找到最后一个标题在容器视口上方的章节
    for (let index = 0; index < anchors.length; index++) {
      const element = document.getElementById(anchors[index].key);
      if (!element) continue;
      
      // 获取元素相对于页面的位置（因为滚动容器是整个页面）
      const elementTop = element.offsetTop;
      
      // 如果标题在容器视口上方（包括一些偏移量），则这是当前章节
      if (scrollTop >= elementTop - 100) {
        newCurrentSection = index;
      }
    }

    // 更新锚点数据的激活状态
    setAnchorData(prevAnchorData => {
      return prevAnchorData.map((anchor, index) => {
        const element = document.getElementById(anchor.key);
        if (!element) return { ...anchor, isActive: false };

        // 获取元素相对于页面的位置
        const elementTop = element.offsetTop;
        
        const nextElement = anchors[index + 1] ? document.getElementById(anchors[index + 1].key) : null;
        let nextTop = contentRef.current!.scrollHeight + contentRef.current!.offsetTop;
        
        if (nextElement) {
          nextTop = nextElement.offsetTop;
        }
        
        // 简单判断：章节内容是否与容器视口有交集
        const isActive = elementTop <= viewportBottom && nextTop > scrollTop;
        
        return {
          ...anchor,
          isActive
        };
      });
    });

    // 实时更新当前章节状态
    setCurrentSection(prevSection => {
      if (newCurrentSection !== prevSection) {
        onSectionChange?.(newCurrentSection);
      }
      return newCurrentSection;
    });
  }, [anchors, contentRef, onSectionChange]);

  // 点击横线跳转到对应标题
  const handleLineClick = (anchorKey: string) => {
    const element = document.getElementById(anchorKey);
    const scrollContainer = document.querySelector('.article-detail-page') as HTMLDivElement;
    
    if (element && scrollContainer) {
      // 找到对应的章节索引
      const sectionIndex = anchors.findIndex(anchor => anchor.key === anchorKey);
      if (sectionIndex !== -1) {
        setCurrentSection(sectionIndex);
        onSectionChange?.(sectionIndex);
      }
      
      // 获取元素相对于文档的位置
      const elementTop = element.offsetTop;
      
      // 在滚动容器中平滑滚动到目标位置（向上偏移100px避免遮挡）
      scrollContainer.scrollTo({
        top: elementTop - 100,
        behavior: 'smooth'
      });
    }
  };

  // 初始化：先提取标题，再计算进度，并添加滚动监听
  useEffect(() => {
    if (!contentRef.current) return;

    const initTimer = setTimeout(() => {
      // 先提取标题
      extractHeadings();
      
      // 然后计算进度
      const progressTimer = setTimeout(() => {
        calculateProgress();
        // 最后更新激活状态
        setTimeout(updateActiveAnchor, 100);
      }, 100);

      return () => clearTimeout(progressTimer);
    }, 50);
    
    return () => clearTimeout(initTimer);
  }, [contentRef.current, extractHeadings, calculateProgress, updateActiveAnchor]);

  // 监听滚动容器的滚动事件
  useEffect(() => {
    const scrollContainer = document.querySelector('.article-detail-page') as HTMLDivElement;
    if (!scrollContainer) return;

    // 防抖处理，提高性能
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActiveAnchor, 8); // 8ms 防抖，支持 120fps
    };

    scrollContainer.addEventListener('scroll', debouncedUpdate, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, [updateActiveAnchor]);

  // 当提取的标题发生变化时，重新计算进度
  useEffect(() => {
    if (extractedAnchors.length > 0) {
      const timer = setTimeout(() => {
        calculateProgress();
        setTimeout(updateActiveAnchor, 100);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [extractedAnchors, calculateProgress, updateActiveAnchor]);

  // 监听窗口大小变化，重新计算进度
  useEffect(() => {
    const handleResize = () => {
      calculateProgress();
      setTimeout(updateActiveAnchor, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateProgress, updateActiveAnchor]);

  // 监听内容变化，重新计算
  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new MutationObserver(() => {
      setTimeout(calculateProgress, 100);
    });

    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [calculateProgress]);

  // 获取当前章节信息（暂时注释掉，未来可能用到）
  // const getCurrentSectionInfo = () => {
  //   if (currentSection >= 0 && currentSection < anchorData.length) {
  //     return {
  //       index: currentSection,
  //       key: anchorData[currentSection]?.key,
  //       title: anchorData[currentSection]?.title,
  //       progress: anchorData[currentSection]?.progress,
  //       isActive: anchorData[currentSection]?.isActive
  //     };
  //   }
  //   return null;
  // };

  if (anchorData.length === 0) return null;

  return (
    <div className="line-anchor">
      <div className="line-anchor-container">
        {anchorData.map((anchor, index) => (
          <div
            key={anchor.key}
            ref={(el) => {
              lineRefs.current[index] = el;
            }}
            className={`line-anchor-item ${anchor.isActive ? "active" : ""} ${
              hoveredIndex === index ? "hovered" : ""
            } ${currentSection === index ? "current" : ""}`}
            onClick={() => handleLineClick(anchor.key)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={
              {
                "--line-width": `${Math.min(anchor.progress * 50, 50)}px`,
              } as React.CSSProperties
            }
          >
            <div className="line-anchor-line" />
            {hoveredIndex === index && (
              <div className="line-anchor-tooltip">
                <div className="tooltip-title">
                  {anchor.title.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < anchor.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="tooltip-progress">
                  {Math.round(anchor.progress * 100)}% 内容
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineAnchor;
