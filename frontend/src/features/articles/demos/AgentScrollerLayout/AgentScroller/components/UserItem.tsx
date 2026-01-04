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
  return <div className={`px-3 py-2 text-sm text-white bg-blue-500 dark:bg-blue-600 rounded-xl shrink-0 w-fit ${className}`} style={{ direction:'ltr', ...style }}>{message}</div>
}
export default UserItem;