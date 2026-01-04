import { useEffect, useRef, type CSSProperties } from "react";
import Loading from "./Loading.tsx";

type Props = {
  onPreLoad?: () => void;
  isEnd?: boolean;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  style?: React.CSSProperties;
  onScroll?: (e: any) => void;
  onContentScroll?: (e: any) => void;

}
const AgentScrollLayout: React.FC<Props> = ({
  onPreLoad,
  isEnd,
  children,
  className = '',
  style,
  contentClassName,
  contentStyle,
  onScroll,
  onContentScroll
}) => {
  const loadIndicatorRef = useRef(null);
  const options = {
    root: null, // 默认视口
    rootMargin: '0px',
    threshold: 1.0 // 完全可见时触发
  }
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // 当元素完全进入视口时触发（entry.isIntersecting）
      if (entry.isIntersecting) {
        onPreLoad?.();
        observer.disconnect(); // 触发后自动停止观察
      }
    }, options);

    if (loadIndicatorRef.current) {
      observer.observe(loadIndicatorRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return <div
    className={`w-full py-6 box-border overflow-auto ${className}`}
    style={style}
    onWheel={onScroll}
  >
    {!isEnd && <div ref={loadIndicatorRef} className="flex items-center mx-auto text-sm w-fit h-16" onClick={onPreLoad}>
      <Loading />
    </div>}
    <div onScroll={onContentScroll} className={`${contentClassName} flex flex-col gap-6 h-full overflow-auto`} style={{ direction: 'ltr', ...contentStyle }}>{children}</div>
  </div>
}
export default AgentScrollLayout;