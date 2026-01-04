//@ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LandButton, LandLoading } from "@suminhan/land-design";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import UserItem from "../AgentScroller/components/UserItem";
import ServerItem from "../AgentScroller/components/ServerItem";
import AgentScrollLayout from "../AgentScroller/components/AgentScrollLayout";
import { MDcontent } from "../mock";

const HistoryScroller1: React.FC = () => {
  useEffect(() => {
    const scroller = document.querySelector('.ckt-agent-scroll-layout2-1');
    scroller?.scrollTo({
      top: scroller?.scrollHeight,
    })
  }, []);

  const autoScrollToBottom = useCallback(() => {
    const scroller = document.querySelector('.ckt-agent-scroll-layout2-1');
    scroller?.scrollTo({
      top: scroller?.scrollHeight,
      behavior: 'smooth',
    })
  }, []);
  const [isAutoSCroll, setIsAutoSCroll] = useState<boolean>(false);

  const initData=[
    <UserItem message={'问题5'} />,
    <ServerItem>回答5</ServerItem>,
    <UserItem message={'问题6'} />,
    <ServerItem>回答6</ServerItem>,
    <UserItem message={'问题7'} />,
    <ServerItem>回答7</ServerItem>
  ]
  const [data, setData] = useState<React.ReactNode[]>(initData)
  const [loading, setLoading] = useState<boolean>(false);
  const [displayContent, setDisplayContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCompleted = useRef(false);

  // 核心逐字输出逻辑
  useEffect(() => {
    if (currentIndex >= MDcontent.length) {
      if (!isCompleted.current) {
        isCompleted.current = true;
        setIsAutoSCroll(false)
        setLoading(false);
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      // 优先保证段落完整性
      const nextNewline = MDcontent.indexOf('\n\n', currentIndex);
      const chunkSize = nextNewline !== -1 && nextNewline - currentIndex < 80
        ? nextNewline - currentIndex + 2
        : 1;

      setDisplayContent(prev => prev + MDcontent.slice(currentIndex, currentIndex + chunkSize));
      setCurrentIndex(prev => prev + chunkSize);
    }, 20);
    isAutoSCroll && autoScrollToBottom()

    return () => clearTimeout(timeoutId);
  }, [isAutoSCroll, currentIndex]);


  // Markdown 渲染组件
  const renderMarkdown = useMemo(() => (
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

  const agentAnswerItem = useMemo(() => {
    return <ServerItem>
    <div
      className="markdown-container"
      style={{
        position: 'relative'
      }}
    >
      {renderMarkdown}
  
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
</ServerItem>
  },[renderMarkdown])

  const [isEnd,setIsEnd] = useState<boolean>(false);
  const [historyLoading,setHistoryLoading] = useState<boolean>(false)
  const loadingMoreRef = useRef<HTMLDivElement>(null);
  
  const loadMore = () => {
      if (historyLoading) return;
      setHistoryLoading(true)
      
      // 记录当前滚动位置
      const scroller = document.querySelector('.ckt-agent-scroll-layout2-1');
      const scrollPosition = scroller?.scrollTop || 0;
      const scrollHeight = scroller?.scrollHeight || 0;
      
      setTimeout(() => {
          // 添加历史数据
          setData([ ...[
            <UserItem message={'问题2'} />,
            <ServerItem>回答2</ServerItem>,
            <UserItem message={'问题3'} />,
            <ServerItem>回答3</ServerItem>,
            <UserItem message={'问题4'} />,
            <ServerItem>回答4</ServerItem>
          ],...data]);
          
          setHistoryLoading(false);
          setIsEnd(true);
          
          // 使用requestAnimationFrame确保DOM已更新
          requestAnimationFrame(() => {
            if (scroller) {
              // 计算新的滚动位置：新内容高度 + 原来的滚动位置
              const newScrollHeight = scroller.scrollHeight;
              const addedHeight = newScrollHeight - scrollHeight;
              scroller.scrollTop = scrollPosition + addedHeight;
            }
          });
      }, 1000);
  }
  useEffect(() => {
      if (!loadingMoreRef.current) return;
      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting && !historyLoading) {
                  loadMore();
              }
          },
          { threshold: 1.0 } // 当目标元素完全可见时触发
      );
      
      if (loadingMoreRef.current) {
          observer.observe(loadingMoreRef.current);
      }
      
      return () => {
              observer.disconnect();
      };
  }, [historyLoading, data]);
  // 移除这个useEffect，因为我们在loadMore中已经处理了滚动位置
  // useEffect(() => {
  //   const scroller = document.querySelector('.ckt-agent-scroll-layout2-1');
  //   if (!isEnd || !scroller) return;
  //   scroller.scrollTop = 168
  // }, [isEnd])
  return <div className="w-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg h-[320px]">
    <AgentScrollLayout 
    isEnd 
    className="px-3 box-border flex-1 h-0" 
    contentClassName="ckt-agent-scroll-layout2-1"
    onScroll={() => setIsAutoSCroll(false)}
    >
      {!isEnd&&<div ref={loadingMoreRef} className="w-full flex justify-center py-3"><LandLoading/></div>}
      {data?.map(item=>item)}
    </AgentScrollLayout>
    <div className="flex justify-end gap-3 px-3 py-3">
      <LandButton text="重置" onClick={()=>{
        setData(initData);
        setIsEnd(false)
        setCurrentIndex(0);
        setDisplayContent('');
        setLoading(false);
      }}/>
    <LandButton style={{width:'100px'}} text={loading?'生成中':'开始'} disabled={loading} onClick={() => {
        setIsAutoSCroll(true)
        setLoading(true);
        setData(prev => [...prev, <UserItem message={'问了一个新的问题8'} />]);
        setTimeout(() => {
          setData(prev => [...prev, agentAnswerItem]);
        }, 1000);
      }} />
    </div>
  </div>
}

export default HistoryScroller1;
