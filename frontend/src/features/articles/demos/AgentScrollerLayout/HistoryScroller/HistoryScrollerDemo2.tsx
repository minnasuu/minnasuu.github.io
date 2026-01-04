import { LandLoading } from "@suminhan/land-design";
import { useEffect, useRef, useState } from "react";

const HistoryScrollerDemo2:React.FC = () => {
  const [data,setData] = useState<number[]>([1,2,3])
  const [loading,setLoading] = useState<boolean>(false)
  const loadingRef = useRef<HTMLDivElement>(null);
  
  const loadMore = () => {
      if (loading) return;
      setLoading(true)
      setTimeout(() => {
          setData([...data, ...[1,2,3]])
          setLoading(false)
      }, 1000)
  }
  
  useEffect(() => {
      if (!loadingRef.current) return;
      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting && !loading) {
                  loadMore();
              }
          },
          { threshold: 1.0 } // 当目标元素完全可见时触发
      );
      
      if (loadingRef.current) {
          observer.observe(loadingRef.current);
      }
      
      return () => {
          if (loadingRef.current) {
              observer.unobserve(loadingRef.current);
          }
      };
  }, [loading, data]);
    return <div className="flex-1 flex column items-center width-100 gap-16 p-24 bg-gray overflow-auto border-box" style={{ height: '220px', flexDirection: 'column-reverse' }}>
    {data.map((_i, idx1) => <div key={idx1} className="width-100 bg-gray-3 shrink-0" style={{ height: '120px' }}>对话{idx1 + 1}</div>)}
    <div ref={loadingRef}>{loading && <LandLoading/>}</div>
  </div>
}
export default HistoryScrollerDemo2;