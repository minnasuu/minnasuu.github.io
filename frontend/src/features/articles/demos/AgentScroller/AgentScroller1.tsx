import { useEffect, useRef } from "react";

const AgentScroller1: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef?.current?.scrollTo({
      top: scrollRef?.current?.scrollHeight,
    })
  }, []);
  return <div ref={scrollRef} className={'px-12 py-24 width-100 border radius-8 border-box'} style={{ height: '240px', overflow: 'auto' }}>
    <div className={'flex both-center fs-12 color-gray-4'}
      style={{ height: '400px', backgroundColor: 'var(--color-border-1)' }}>历史会话...
    </div>
  </div>
}
export default AgentScroller1;