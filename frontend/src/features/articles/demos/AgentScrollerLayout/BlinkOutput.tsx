import { useEffect, useRef, useState } from "react";
import { LandButton } from "@suminhan/land-design";

const content = `这段代码定义了一个名为"blink"的关键帧动画，它会使元素在50%的动画时间点变为透明（不可见），而在0%和100%的时间点保持完全不透明（可见）。这样就能实现光标的闪烁效果。
`;

const BlinkOutput: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [displayContent, setDisplayContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCompleted = useRef(false);
  
  // 逐字输出逻辑
  useEffect(() => {
  if(!loading)return
    if (currentIndex >= content.length) {
      if (!isCompleted.current) {
        isCompleted.current = true;
        setLoading(false);
      }
      return;
    }

    // 开始逐字输出
    const timeoutId = setTimeout(() => {
      // 优先保证段落完整性，如果遇到换行符则一次性输出整个段落
      const nextNewline = content.indexOf('\n\n', currentIndex);
      const chunkSize = nextNewline !== -1 && nextNewline - currentIndex < 50
        ? nextNewline - currentIndex + 2
        : 1;

      setDisplayContent(prev => prev + content.slice(currentIndex, currentIndex + chunkSize));
      setCurrentIndex(prev => prev + chunkSize);
    }, 45); // 控制输出速度

    return () => clearTimeout(timeoutId);
  }, [currentIndex,loading]);

  // 开始输出
  const startOutput = () => {
    setLoading(true);
    setDisplayContent('');
    setCurrentIndex(0);
    isCompleted.current = false;
  };

  return <div className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col items-end box-border h-[240px]">
    <div className="flex-1 flex w-full overflow-auto flex-col-reverse">
      <pre className="whitespace-pre-wrap break-words">
        {displayContent}
        
        {/* 闪烁光标效果 */}
        {!isCompleted.current && (
        <span
            style={{
            display: 'inline-block',
            width: 2,
            height: '1.2em',
            backgroundColor: 'var(--color-text-3)',
            animation: 'blink .6s step-end infinite',
            marginLeft: 0,
            verticalAlign: 'middle'
            }}
        />
        )}
      </pre>
    </div>
    
    <div className="mt-3">
      <LandButton 
        onClick={startOutput} 
        disabled={loading}
      >
        {loading ? '输出中...' : '开始输出'}
      </LandButton>
    </div>
  </div>
}

export default BlinkOutput;