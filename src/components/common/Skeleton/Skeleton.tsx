import { type CSSProperties, type ReactNode } from 'react';
import { theme } from '@/styles/theme';
import * as styled from '@/components/common/Skeleton/Skeleton.styles';

export type PropsType = {
  width?: number;
  height?: number;
  circle?: boolean; //원형 스켈레톤
  rounded?: boolean; //모서리
  unit?: string; //px or % 단위
  animation?: boolean; //애니메이션 유무
  color?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function Skeleton({
  animation = true,
  children,
  width,
  height,
  circle,
  rounded,
  unit = 'px',
  color = theme.colors.neutral300,
  style,
}: PropsType) {
  const styles = {
    style: style,
    rounded: rounded,
    circle: circle,
    width: width,
    height: height,
    animation: animation,
    unit: unit,
    color: color,
  };

  return (
    <styled.Base {...styles}>
      <styled.Content>{children}</styled.Content>
    </styled.Base>
  );
}
