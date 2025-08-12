import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { CardProps } from './Card';

type StyledCardProps = Required<Pick<CardProps, 'variant' | 'padding' | 'radius'>> & {
  backgroundColor?: string;
  borderColor?: string;
};

export const Card = styled.div<StyledCardProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || theme.colors.white};

  ${({ padding }) => {
    switch (padding) {
      case 'none':
        return 'padding: 0px;';
      case 'xs':
        return `padding: ${theme.spacing.xs}px;`;
      case 'sm':
        return `padding: ${theme.spacing.sm}px;`;
      case 'md':
        return `padding: ${theme.spacing.md}px;`;
      case 'lg':
        return `padding: ${theme.spacing.lg}px;`;
      case 'xl':
        return `padding: ${theme.spacing.xl}px;`;
      default:
        return `padding: ${theme.spacing.md}px;`;
    }
  }}

  ${({ radius }) => {
    switch (radius) {
      case 'none':
        return 'border-radius: 0px;';
      case 'sm':
        return `border-radius: ${theme.borderRadius.sm}px;`;
      case 'md':
        return `border-radius: ${theme.borderRadius.md}px;`;
      case 'lg':
        return `border-radius: ${theme.borderRadius.lg}px;`;
      default:
        return `border-radius: ${theme.borderRadius.md}px;`;
    }
  }}
  
${({ variant, borderColor, backgroundColor }) => {
    switch (variant) {
      case 'outlined':
        return `
        background-color: ${backgroundColor ?? 'transparent'};
        border: 1px solid ${borderColor ?? theme.colors.neutral300};
        `;
      default:
        return `
        background-color: ${backgroundColor ?? theme.colors.white};
      `;
    }
  }}
`;
