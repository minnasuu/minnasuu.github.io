import styled from "styled-components";
import {LandButton} from "@suminhan/land-design";

type Props = {
  onSend?: (e: any) => void;
};
const AgentTextarea: React.FC<Props> = ({
  onSend

}) => {
  return <div className="flex flex-col gap-2 p-3 mt-auto w-full bg-gray-100 dark:bg-gray-800 rounded-xl">
    <StyledAgentTextarea className="w-full"></StyledAgentTextarea>
    <div className="flex justify-end">
      {/*<LandButton text={'添加'}></LandButton>*/}
      <LandButton text={'发送'} onClick={onSend}></LandButton>
    </div>
  </div>
}
const StyledAgentTextarea = styled.textarea`
    appearance: none;
    border: none;
    outline: none;
    resize: none;
    background-color: transparent;
    max-height: 400px;
    caret-color: var(--color-primary-6);
    &:focus,
    &:focus-within{
        background-color: transparent;
        border: none;
    }
`
export default AgentTextarea;
