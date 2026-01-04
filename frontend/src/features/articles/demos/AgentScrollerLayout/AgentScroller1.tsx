import { useEffect, useRef } from "react";

const AgentScroller1: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef?.current?.scrollTo({
      top: scrollRef?.current?.scrollHeight,
    })
  }, []);
  return <div ref={scrollRef} className="px-3 py-6 w-full border border-gray-200 dark:border-gray-700 rounded-lg box-border h-[240px] overflow-auto">
    <div className="flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 h-[400px] bg-gray-100 dark:bg-gray-800">
      历史会话...
    </div>
  </div>
}
export default AgentScroller1;