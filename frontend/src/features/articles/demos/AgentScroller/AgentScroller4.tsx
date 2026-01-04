import { useState } from "react";
import UserItem from "./AgentScroller/components/UserItem.tsx";
import AgentScrollLayout from "./AgentScroller/components/AgentScrollLayout.tsx";
import TypewriterMarkdown from "./AgentScroller/components/TypewriterMarkdown.tsx";
import ServerItem from "./AgentScroller/components/ServerItem.tsx";
import { LandButton } from "@suminhan/land-design";
import { MDcontent } from "./mock.ts";

type Props = {
  fix?: boolean;
  scale?: boolean;
}
const AgentScroller4: React.FC<Props> = ({
  fix = false,
  scale,
}) => {
  const [show1, setShow1] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  return <div className={`width-100 flex column border radius-8 ${fix ? 'justify-between' : ''}`} style={{ height: '320px' }}>
    <AgentScrollLayout isEnd className={`px-12 border-box rotate-180 ${fix ? '' : 'flex-1 height-1'}`} style={fix ? { height: 'fit-content', maxHeight: '100%' } : undefined} contentStyle={{direction: scale ? 'rtl' : 'ltr'}}>
      {show2 &&
        <ServerItem className="ml-auto rotate-180">
          <TypewriterMarkdown
            content={MDcontent}
            speed={20}
          onComplete={() => setLoading(false)}
          />
        </ServerItem>
      }
      {show1 && <UserItem message={'问了一个问题'} className="rotate-180" />}
    </AgentScrollLayout>
    <div className={'flex justify-end px-12 py-12'}>
    <LandButton style={{ width: '100px' }} text={loading?'生成中':'开始'} disabled={loading} onClick={() => {
      setLoading(true);
        setShow1(true)
        setTimeout(() => {
          setShow2(true)
        }, 1000);
      }} />
    </div>
  </div>
}

export default AgentScroller4;
