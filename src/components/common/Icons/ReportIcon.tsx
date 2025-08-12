import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE } from '@/constants/icon';
import type { IconStyleProps } from './type';

export function ReportIcon({
  size = DEFAULT_ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
}: IconStyleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M10.0002 20H7.2002C6.0801 20 5.51962 20 5.0918 19.782C4.71547 19.5903 4.40973 19.2843 4.21799 18.908C4 18.4801 4 17.9201 4 16.8V7.20001C4 6.07991 4 5.51986 4.21799 5.09204C4.40973 4.71572 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.48 4 18.9078 4.21799C19.2841 4.40973 19.5905 4.71572 19.7822 5.09204C20.0002 5.51986 20 6.07991 20 7.20001V10M19 19L16 16M13.5 17C11.567 17 10 15.433 10 13.5C10 11.567 11.567 10 13.5 10C15.433 10 17 11.567 17 13.5C17 15.433 15.433 17 13.5 17Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
