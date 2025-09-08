import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const ErrorMessage = styled.p`
  color: ${theme.colors.danger700};
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

export const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  height: 100%;
  background-color: ${theme.colors.white};
`;

export const Content = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${theme.colors.neutral700};
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.neutral500};
  margin-bottom: 32px;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${theme.colors.neutral700};
`;

export const SendButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;

  background-color: ${(props) =>
    props.disabled ? theme.colors.neutral200 : theme.colors.primary600};
  color: ${(props) => (props.disabled ? theme.colors.neutral500 : theme.colors.white)};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? theme.colors.neutral200 : theme.colors.primary600};
  }

  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(1px)')};
  }
`;
