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
  return <div className={`text-sm text-gray-700 dark:text-gray-300 rounded-xl w-fit ${className}`} style={{ direction:'ltr', letterSpacing:'0.12em', ...style }}>{children}</div>
}
export default ServerItem;