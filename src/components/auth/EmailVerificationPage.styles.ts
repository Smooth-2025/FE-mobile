import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

export const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 20px;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 24px;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: ${theme.colors.primary500};
  border-radius: 2px;
  transition: width 0.3s ease;
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

export const EmailDisplay = styled.div`
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 16px;
  color: ${theme.colors.neutral700};
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

export const TimerDisplay = styled.div`
  text-align: right;
  color: ${theme.colors.primary500};
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
`;

export const VerifyButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  margin-bottom: 16px;

  background-color: ${(props) => (props.disabled ? '#e5e7eb' : theme.colors.primary500)};
  color: ${(props) => (props.disabled ? '#9ca3af' : '#ffffff')};

  &:hover {
    background-color: ${(props) => (props.disabled ? '#e5e7eb' : theme.colors.primary600)};
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