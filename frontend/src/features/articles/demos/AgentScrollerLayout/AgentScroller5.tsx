import { useEffect, useState } from "react";
import UserItem from "./AgentScroller/components/UserItem.tsx";
import AgentScrollLayout from "./AgentScroller/components/AgentScrollLayout.tsx";
import TypewriterMarkdown from "./AgentScroller/components/TypewriterMarkdown.tsx";
import ServerItem from "./AgentScroller/components/ServerItem.tsx";
import { LandButton } from "@suminhan/land-design";
import { MDcontent } from "./mock.ts";

type Props = {
  fix?: boolean;
  autoOutPut?: boolean;
  customContent?:string;
}
const AgentScroller5: React.FC<Props> = ({
  fix = false,
  autoOutPut,
  customContent,
}) => {
  useEffect(() => {
    setLoading(true);
        setShow1(true)
        setTimeout(() => {
          setShow2(true)
        }, 1000);
  },[autoOutPut])
  const [show1, setShow1] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  return <div className={`w-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg h-[320px] ${fix ? 'justify-between' : ''}`}>
    <AgentScrollLayout isEnd className={`px-3 box-border ${fix ? '' : 'flex-1 h-0'}`} style={fix ? { height: 'fit-content', maxHeight: '100%' } : undefined} contentStyle={{ flexDirection: 'column-reverse' }}>
      {show2 &&
        <ServerItem>
          <TypewriterMarkdown
            content={customContent||MDcontent}
            speed={20}
          onComplete={() => setLoading(false)}
          />
        </ServerItem>
      }
      {show1 && <UserItem message={'问了一个问题'} />}
    </AgentScrollLayout>
    {!autoOutPut&&<div className="flex justify-end px-3 py-3">
    <LandButton style={{width:'100px'}} text={loading?'生成中':'开始'} disabled={loading} onClick={() => {
      setLoading(true);
        setShow1(true)
        setTimeout(() => {
          setShow2(true)
        }, 1000);
      }} />
    </div>}
  </div>
}

export default AgentScroller5;
