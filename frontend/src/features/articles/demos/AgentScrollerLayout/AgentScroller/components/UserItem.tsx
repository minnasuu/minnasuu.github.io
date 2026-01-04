import type { CSSProperties } from "react";

type Props = {
  message?: string;
  className?: string;
  style?: CSSProperties;
}
const UserItem: React.FC<Props> = ({
  message,
  className = 'ml-auto',
  style
}) => {
  return <div className={`px-12 py-8 fs-14 color-white bg-primary radius-12 shrink-0 ${className}`} style={{ width: 'fit-content',direction:'ltr', ...style }}>{message}</div>
}
export default UserItem;