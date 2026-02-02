import { useRef, useState } from "react";

type Props = {
  fix?: boolean;
}

const FixScroller1: React.FC<Props> = ({ fix }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleClick = () => {
    if (fix) {
      // fix模式：直接切换，由details标签自动处理
      setOpen(!open);
    } else {
      // 非fix模式：需要手动调整滚动位置
      if (!scrollRef.current || !contentRef.current) return;
      
      const scroller = scrollRef.current;
      const scrollPosition = scroller.scrollTop;
      const height = contentRef.current.offsetHeight;
      
      if (open) {
        // 收起：关闭后调整滚动位置
        setOpen(false);
        requestAnimationFrame(() => {
          scroller.scrollTop = scrollPosition + height;
        });
      } else {
        // 展开：先调整滚动位置再打开
        setTimeout(() => {
          setOpen(true);
          requestAnimationFrame(() => {
            scroller.scrollTop = scrollPosition - height;
          });
        }, 50);
      }
    }
  }

  // 思考部分的内容
  const ThinkingContent = () => (
    <div>深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容</div>
  );

  // 思考部分的标题
  const ThinkingHeader = () => (
    <>
      <p className="flex-1 truncate">已深度思考（用时4秒）</p>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="12" 
        height="12" 
        viewBox="0 0 12 12" 
        fill="none" 
        className={`${open ? '' : 'rotate-180'} transition`}
      >
        <path d="M6.00004 4.5L8.75 7.25L3.25 7.25L6.00004 4.5Z" fill="#33373D" fillOpacity="0.58" />
      </svg>
    </>
  );

  return (
    <div 
      ref={fix ? null : scrollRef} 
      className="flex-1 flex items-center gap-5 py-6 bg-gray-100 dark:bg-gray-800 overflow-auto h-[240px] flex-col-reverse"
    >
      {/* 底部文字 */}
      <div className="w-1/2 bg-gray-200 dark:bg-gray-700 shrink-0 h-[200px] flex items-center justify-center">
        底部内容区域
      </div>

      {/* 思考部分 */}
      {fix ? (
        // fix模式：使用details标签
        <details 
          open={open} 
          onClick={handleClick} 
          className="w-1/2 shrink-0"
        >
          <summary className="flex items-center cursor-pointer list-none">
            <ThinkingHeader />
          </summary>
          <ThinkingContent />
        </details>
      ) : (
        // 非fix模式：使用常规标签
        <div className="w-1/2 shrink-0">
          <div 
            onClick={handleClick} 
            className="flex items-center cursor-pointer"
          >
            <ThinkingHeader />
          </div>
          {open && <ThinkingContent />}
          {/* 隐藏的内容用于测量高度 */}
          <div ref={contentRef} className="absolute opacity-0 pointer-events-none w-1/2">
            <ThinkingContent />
          </div>
        </div>
      )}

      {/* 顶部文字 */}
      <div className="w-1/2 bg-gray-200 dark:bg-gray-700 shrink-0 h-[200px] flex items-center justify-center">
        顶部内容区域
      </div>
    </div>
  );
}

export default FixScroller1;