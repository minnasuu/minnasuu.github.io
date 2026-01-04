import { useRef, useState } from "react";
type Props = {
  fix?:boolean;
}
const FixScroller1:React.FC<Props> = ({
fix
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const height = contentRef.current?.offsetHeight || 0;
    const handleClick = () => {
        if(!scrollRef.current||!contentRef.current)return;
        const scroller = scrollRef.current;
        const scrollPosition = scroller?.scrollTop || 0;
       if(open){
        if(fix){
             setTimeout(() => {
                setOpen(false);
                requestAnimationFrame(() => {
                    scroller.scrollTop = scrollPosition+height;
                    
                    // 检查思考节点是否在视区内
                    setTimeout(() => {
                        const thinkingElement = contentRef.current?.parentElement;
                        if (thinkingElement) {
                            const rect = thinkingElement.getBoundingClientRect();
                            const scrollerRect = scroller.getBoundingClientRect();
                            
                            // 如果思考节点不完全在视区内（顶部在视区上方或底部在视区下方）
                            if (rect.top < scrollerRect.top || rect.bottom > scrollerRect.bottom) {
                                // 将思考节点滚动到视区中间位置
                                thinkingElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            }
                        }
                    }, 100); // 给DOM更新一些时间
                });
        }, 50);
        }else{
            setOpen(false);
        }
    }
       else{
        if(fix){
             setTimeout(() => {
                setOpen(true);
                requestAnimationFrame(() => {
                    scroller.scrollTop = scrollPosition-height;
                });
        }, 50);
        }else{
            setOpen(true);
        }
       }
        
    }
  return <div ref={scrollRef} className="flex-1 flex items-center gap-20 py-24 bg-gray overflow-auto" style={{height:'240px',flexDirection:'column-reverse'}}>
    <div className="width-50 bg-gray-3 shrink-0" style={{height:'200px'}}></div>
    <div className="relative width-50 overflow-hidden shrink-0" style={{height: open ? `${height+24}px`:'24px'}}>
        <div onClick={handleClick} className="flex items-center cursor-pointer">
            <p className="flex-1 ellipsis">已深度思考（用时4秒）</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className={`${open?'':'rotate-180'} transition`}>
                <path d="M6.00004 4.5L8.75 7.25L3.25 7.25L6.00004 4.5Z" fill="#33373D" fill-opacity="0.58" />
            </svg>
        </div>
        <div>{open ? '深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...':''}</div>
        <div ref={contentRef} className="absolute width-100">深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...</div>
    </div>
    <div className="width-50 bg-gray-3 shrink-0" style={{height:'200px'}}></div>
  </div>;
}
export default FixScroller1;