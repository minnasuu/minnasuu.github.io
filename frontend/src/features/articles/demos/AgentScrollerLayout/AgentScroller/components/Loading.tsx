import styled from "styled-components";

type Props = {
    loadingText?:string;
}
const Loading:React.FC<Props> = ({
                                     loadingText,
                                 }) => {
    return <div className={'flex column gap-12'}>
        <StyledLoadingDots></StyledLoadingDots>
        {loadingText}
    </div>
}
const StyledLoadingDots = styled.div`
    width: 40px;
    height: 16px;
    --_disc: no-repeat radial-gradient(circle closest-side, #D9D9D9 90%,#0000);
    background: var(--_disc) 0%   50%, var(--_disc) 50%  50%, var(--_disc) 100% 50%;
    background-size: calc(100%/3) 50%;
    animation: l3 1500ms infinite linear;
    @keyframes l3 {
        20% {
            background-position: 0% 0%, 50% 50%, 100% 50%;
        }
        40% {
            background-position: 0% 100%, 50% 0%, 100% 50%;
        }
        60% {
            background-position: 0% 50%, 50% 100%, 100% 0%;
        }
        80% {
            background-position: 0% 50%, 50% 50%, 100% 100%;
        }
    }
`
export default Loading;