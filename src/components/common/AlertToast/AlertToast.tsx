import { useEffect, useState } from 'react';
import { theme } from '@/styles/theme';
import * as Styled from './AlertToast.styles';
import { Icon } from '../Icons';
import type { ToastIconType, ToastProps, ToastType } from './type';

const styleMap: Record<
  ToastType,
  {
    bg: string;
    border: string;
    text: string;
    icon: ToastIconType;
    iconColor: string;
  }
> = {
  success: {
    bg: 'rgba(0, 0, 0, 0.7)',
    border: 'transparent',
    text: theme.colors.white,
    icon: 'checkmarkCircle',
    iconColor: theme.colors.primary600,
  },
  error: {
    bg: 'rgba(0, 0, 0, 0.7)',
    border: 'transparent',
    text: theme.colors.white,
    icon: 'warningCircle',
    iconColor: theme.colors.danger600,
  },
  accident: {
    bg: theme.colors.danger200,
    border: theme.colors.danger700,
    text: theme.colors.neutral600,
    icon: 'warningCircle',
    iconColor: theme.colors.danger700,
  },
  'accident-nearby': {
    bg: theme.colors.danger200,
    border: theme.colors.danger700,
    text: theme.colors.neutral600,
    icon: 'warningCircle',
    iconColor: theme.colors.danger700,
  },
  obstacle: {
    bg: theme.colors.neutral50,
    border: theme.colors.neutral500,
    text: theme.colors.neutral600,
    icon: 'warningTriangle',
    iconColor: theme.colors.neutral500,
  },
  pothole: {
    bg: theme.colors.Warning200,
    border: theme.colors.Warning600,
    text: theme.colors.neutral600,
    icon: 'warningTriangle',
    iconColor: theme.colors.Warning600,
  },
  start: {
    bg: 'rgba(0, 0, 0, 0.7)',
    border: 'transparent',
    text: theme.colors.white,
    icon: 'checkmarkCircle',
    iconColor: theme.colors.primary600,
  },
  end: {
    bg: 'rgba(0, 0, 0, 0.7)',
    border: 'transparent',
    text: theme.colors.white,
    icon: 'checkmarkCircle',
    iconColor: theme.colors.primary600,
  },
  unknown: {
    bg: theme.colors.neutral50,
    border: theme.colors.neutral500,
    text: theme.colors.neutral600,
    icon: 'warningTriangle',
    iconColor: theme.colors.neutral500,
  },
} as const;

export default function AlertToast({
  type,
  title,
  content,
  position = 'bottom',
  duration = 3000,
}: ToastProps) {
  // Safety check: fallback to 'unknown' if type is not in styleMap
  const safeType = styleMap[type] ? type : 'unknown';
  const { bg, border, text, icon, iconColor } = styleMap[safeType];

  const [visible, setVisible] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    const start = setTimeout(() => {
      setOpacity(0);
      const end = setTimeout(() => setVisible(false), 600); // match transition duration
      return () => clearTimeout(end);
    }, duration);
    return () => clearTimeout(start);
  }, [duration]);

  if (!visible) return null;

  return (
    <Styled.ToastContainer
      bg={bg}
      border={border}
      position={position}
      style={{ opacity, transition: 'opacity 600ms ease-out' }}
    >
      <Styled.IconWrapper>
        <Icon name={icon} color={iconColor} />
      </Styled.IconWrapper>
      <Styled.ContentWrapper>
        {title && <Styled.ToastTitle color={text}>{title}</Styled.ToastTitle>}
        <Styled.ToastContent color={text}>{content}</Styled.ToastContent>
      </Styled.ContentWrapper>
    </Styled.ToastContainer>
  );
}