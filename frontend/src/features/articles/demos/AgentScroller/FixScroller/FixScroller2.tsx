import { useState } from "react";

const FixScroller2 = () => {
    const [open, setOpen] = useState(false)
  return <div className="flex-1 flex items-center gap-20 py-24 height-100 bg-gray overflow-auto" style={{flexDirection:'column-reverse'}}>
    <div className="width-50 bg-gray-3 shrink-0" style={{height:'200px'}}></div>
    <div className="width-50 overflow-hidden shrink-0" style={{height: open ? 'fit-content':'24px'}}>
        <div onClick={()=>setOpen(!open)} className="flex items-center cursor-pointer">深度思考过程
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className={`${open?'':'rotate-180'} transition`}>
                <path d="M6.00004 4.5L8.75 7.25L3.25 7.25L6.00004 4.5Z" fill="#33373D" fill-opacity="0.58" />
            </svg>
        </div>
        <div>深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...</div>
    </div>
    <div className="width-50 bg-gray-3 shrink-0" style={{height:'200px'}}></div>
  </div>;
}
export default FixScroller2;