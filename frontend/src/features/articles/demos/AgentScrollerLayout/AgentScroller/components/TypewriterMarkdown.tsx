//@ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface TypewriterMarkdownProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
  onBlinkComplete?: () => void;
}

const TypewriterMarkdown = ({
  content,
  speed = 30,
  onComplete,
  onBlinkComplete
}: TypewriterMarkdownProps) => {
  const [displayContent, setDisplayContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCompleted = useRef(false);

  // 核心逐字输出逻辑
  useEffect(() => {
    if (currentIndex >= content.length) {
      if (!isCompleted.current) {
        isCompleted.current = true;
        onComplete?.();
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      // 优先保证段落完整性
      const nextNewline = content.indexOf('\n\n', currentIndex);
      const chunkSize = nextNewline !== -1 && nextNewline - currentIndex < 80
        ? nextNewline - currentIndex + 2
        : 1;

      setDisplayContent(prev => prev + content.slice(currentIndex, currentIndex + chunkSize));
      setCurrentIndex(prev => prev + chunkSize);
    }, speed);
    onBlinkComplete?.()

    return () => clearTimeout(timeoutId);
  }, [currentIndex, speed, onComplete, onBlinkComplete]);


  // Markdown 渲染组件
  const renderMarkdown = useCallback(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              PreTag="div"
              wrapLongLines
              showLineNumbers
              customStyle={{        // 自定义容器样式
                borderRadius: '8px',
                backgroundColor: 'var(--color-bg-3)',
                padding: '20px'
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {displayContent}
    </ReactMarkdown>
  ), [displayContent]);

  return (
    <div
      className="markdown-container"
      style={{
        position: 'relative'
      }}
    >
      {renderMarkdown()}

      {/* 闪烁光标效果 */}
      {!isCompleted.current && (
        <div
          style={{
            display: 'inline-block',
            width: 2,
            height: '1.2em',
            backgroundColor: 'var(--od-light-color)',
            animation: 'blink 1s step-end infinite',
            marginLeft: 4,
            verticalAlign: 'middle'
          }}
        />
      )}
    </div>
  );
};

export default TypewriterMarkdown;