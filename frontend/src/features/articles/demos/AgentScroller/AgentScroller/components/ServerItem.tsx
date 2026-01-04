import type { CSSProperties } from "styled-components";

type Props = {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}
const ServerItem: React.FC<Props> = ({
  children,
  className = '',
  style,
}) => {
  return <div className={`fs-14 color-gray-2 radius-12 ${className}`} style={{ width: 'fit-content',direction:'ltr',letterSpacing:'0.12em', ...style }}>{children}</div>
}
export default ServerItem;