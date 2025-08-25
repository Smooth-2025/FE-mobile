import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from '@/constants/icon';
import type { IconStyleProps } from './type';

export default function ChevronRightIcon({
  size = DEFAULT_ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconStyleProps) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
