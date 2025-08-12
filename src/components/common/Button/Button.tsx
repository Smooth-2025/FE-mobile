import { useTheme } from '@emotion/react';
import * as Styled from './Button.styles';
import type { Theme } from '@styles/theme';

interface ButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  bgColor?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export const Button = ({
  label,
  onClick,
  disabled = false,
  loading = false,
  bgColor,
  textColor,
  size = 'lg',
  style,
  ...props
}: ButtonProps) => {
  const theme = useTheme() as Theme;

  const inlineStyle: React.CSSProperties = {
    backgroundColor: bgColor ?? (disabled ? theme.colors.neutral200 : theme.colors.primary600),
    ...(style ?? {}),
  };

  return (
    <Styled.ButtonWrapper
      as="button"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      style={inlineStyle}
      {...props}
    >
      {loading ? (
        <span style={{ color: textColor ?? theme.colors.white }}>Loading...</span>
      ) : (
        <Styled.ButtonText style={{ color: textColor ?? theme.colors.white }}>
          {label}
        </Styled.ButtonText>
      )}
    </Styled.ButtonWrapper>
  );
};
