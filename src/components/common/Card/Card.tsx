import * as Styled from './Card.styles';
import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  borderColor?: string;
  children: ReactNode;
}

export const Card = ({
  variant = 'default',
  padding = 'md',
  radius = 'md',
  backgroundColor,
  borderColor,
  children,
  style,
  ...props
}: CardProps) => {
  return (
    <Styled.Card
      variant={variant}
      padding={padding}
      radius={radius}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      style={style}
      {...props}
    >
      {children}
    </Styled.Card>
  );
};
