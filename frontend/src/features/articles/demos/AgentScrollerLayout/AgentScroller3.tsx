// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import UserItem from "./AgentScroller/components/UserItem.tsx";
import AgentScrollLayout from "./AgentScroller/components/AgentScrollLayout.tsx";
import { LandButton } from "@suminhan/land-design";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ServerItem from "./AgentScroller/components/ServerItem.tsx";
import { MDcontent } from "./mock.ts";

const content = MDcontent;

const AgentScroller2: React.FC = () => {
  useEffect(() => {
    const scroller = document.querySelector('.ckt-agent-scroll-layout2-2');
    scroller?.scrollTo({
      top: scroller?.scrollHeight,
    })
  }, []);

  const autoScrollToBottom = useCallback(() => {
    const scroller = document.querySelector('.ckt-agent-scroll-layout2-2');
    scroller?.scrollTo({
      top: scroller?.scrollHeight,
      behavior: 'smooth',
    })
  }, []);
  const [isAutoSCroll, setIsAutoSCroll] = useState<boolean>(false);

  const [show1, setShow1] = useState<boolean>(false)
  const [show2, setShow2] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const [displayContent, setDisplayContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCompleted = useRef(false);

  // 核心逐字输出逻辑
  useEffect(() => {
    if (currentIndex >= content.length) {
      if (!isCompleted.current) {
        isCompleted.current = true;
        setIsAutoSCroll(false)
        setLoading(false);
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
    }, 20);
    isAutoSCroll && autoScrollToBottom()

    return () => clearTimeout(timeoutId);
  }, [isAutoSCroll, currentIndex]);


  // Markdown 渲染组件
  const renderMarkdown = useCallback(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
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
  return <div className="w-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg h-[320px]">
    <AgentScrollLayout isEnd className="px-3 box-border flex-1 h-0" onScroll={() => setIsAutoSCroll(false)} contentClassName="ckt-agent-scroll-layout2-2">
      {show1 && <UserItem message={'问了一个问题'} />}
      {show2 && <ServerItem>
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
      </ServerItem>}
    </AgentScrollLayout>
    <div className="flex justify-end px-3 py-3">
    <LandButton style={{ width: '100px' }} text={loading?'生成中':'开始'} disabled={loading} onClick={() => {
        setIsAutoSCroll(true)
        setLoading(true);
        setShow1(true)
        setTimeout(() => {
          setShow2(true)
        }, 1000);
      }} />
    </div>
  </div>
}

export default AgentScroller2;
