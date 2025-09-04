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
  color: ${theme.colors.neutral600};
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

export const CodeInputWrapper = styled.div`
  position: relative;
  align-items: center;
`;

export const CodeTimerDisplay = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.primary500};
  font-size: 14px;
  font-weight: 600;
  pointer-events: none; // 타이머는 클릭되지 않도록
  z-index: 1;
`;

export const VerifyButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  margin-bottom: 16px;

  background-color: ${(props) => (props.disabled ? theme.colors.neutral200 : theme.colors.primary600)};
  color: ${(props) => (props.disabled ? theme.colors.neutral500 : theme.colors.white)};

  &:hover {
    background-color: ${(props) => (props.disabled ? theme.colors.neutral300 : theme.colors.primary600)};
  }

  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(1px)')};
  }
`;

export const ResendText = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.neutral600};
`;

export const ResendLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary500};
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: ${theme.colors.primary600};
  }
`;