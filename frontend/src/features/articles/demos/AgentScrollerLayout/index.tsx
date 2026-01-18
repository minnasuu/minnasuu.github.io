import { useParams } from "react-router-dom";
import AgentScroller1 from "./AgentScroller1";
import AgentScroller2 from "./AgentScroller2";
import AgentScroller3 from "./AgentScroller3";
import AgentScroller4 from "./AgentScroller4";
import AgentScroller5 from "./AgentScroller5";
import BlinkOutput from "./BlinkOutput";
import AgentScroller from "./AgentScroller";
import FixScroller1 from "./FixScroller/FixScroller1";
import FixScroller2 from "./FixScroller/FixScroller2";
import HistoryScroller1 from "./HistoryScroller/HistoryScroller1";
import HistoryScroller2 from "./HistoryScroller/HistoryScroller2";
import HistoryScroller3 from "./HistoryScroller/HistoryScroller3";
import HistoryScrollerDemo1 from "./HistoryScroller/HistoryScrollerDemo1";
import HistoryScrollerDemo2 from "./HistoryScroller/HistoryScrollerDemo2";

export const AgentScrollLayout = () => {
    const type = useParams<{ type: string }>();
    switch (type.type) {
        case 'AgentScroller1':
            return <AgentScroller1/>
        case 'AgentScroller2':
            return <AgentScroller2/>
        case 'AgentScroller3':
            return <AgentScroller3/>
        case 'AgentScroller4':
            return <AgentScroller4/>
        case 'AgentScroller4-fix':
            return <AgentScroller4 fix/>
        case 'AgentScroller4-fix-scale':
            return <AgentScroller4 fix scale/>
        case 'AgentScroller5':
            return <AgentScroller5 fix/>
        case 'BlinkOutput':
            return <BlinkOutput/>
        case 'AgentScroller':
            return <AgentScroller/>
        case 'FixScroller1':
            return <FixScroller1/>
            case 'FixScroller1-fix':
            return <FixScroller1 fix/>
        case 'FixScroller2':
            return <FixScroller2/>
        case 'HistoryScroller1':
            return <HistoryScroller1/>
        case 'HistoryScroller2':
            return <HistoryScroller2 fix/>
        case 'HistoryScroller3':
            return <HistoryScroller3/>
        case 'HistoryScrollerDemo1':
            return <HistoryScrollerDemo1/>
        case 'HistoryScrollerDemo2':
            return <HistoryScrollerDemo2/>
        default:
            return <></>
    }
}