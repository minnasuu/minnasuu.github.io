import { useState } from "react";

const FixScroller2 = () => {
    const [open, setOpen] = useState(false)
  return <div className="flex-1 flex items-center gap-5 py-6 h-full bg-gray-100 dark:bg-gray-800 overflow-auto flex-col-reverse">
    <div className="w-1/2 bg-gray-200 dark:bg-gray-700 shrink-0 h-[200px]"></div>
    <div className="w-1/2 overflow-hidden shrink-0 h-6" style={{height: open ? 'fit-content':'24px'}}>
        <div onClick={()=>setOpen(!open)} className="flex items-center cursor-pointer">深度思考过程
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className={`${open?'':'rotate-180'} transition`}>
                <path d="M6.00004 4.5L8.75 7.25L3.25 7.25L6.00004 4.5Z" fill="#33373D" fillOpacity="0.58" />
            </svg>
        </div>
        <div>深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...深度思考的内容...</div>
    </div>
    <div className="w-1/2 bg-gray-200 dark:bg-gray-700 shrink-0 h-[200px]"></div>
  </div>;
}
export default FixScroller2;