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
    className={`ckt-agent-scroll-layout width-100 py-24 border-box ${className}`}
    style={{ overflow: 'auto', ...style }}
    onWheel={onScroll}
  >
    {!isEnd && <div ref={loadIndicatorRef} className="flex items-center mx-auto fs-14"
      style={{ width: 'fit-content', height: '64px' }} onClick={onPreLoad}>
      <Loading />
    </div>}
    <div onScroll={onContentScroll} className={`${contentClassName} flex column gap-24 height-100`} style={{ overflow:'auto',direction: 'ltr', ...contentStyle }}>{children}</div>
  </div>
}
export default AgentScrollLayout;