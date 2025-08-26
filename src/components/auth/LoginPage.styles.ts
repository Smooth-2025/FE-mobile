import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 20px;
`;

export const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

export const BrandTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 40px 0;
  text-align: left;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 16px;
  top: 70%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${theme.colors.neutral100};
  }

  &:focus {
    outline: none;
    background-color: ${theme.colors.neutral100};
  }
`;

export const LoginButton = styled.button<{ isLoading: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(props) => (props.isLoading ? '#93c5fd' : '#3b82f6')};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.isLoading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  margin-top: 24px;

  &:hover {
    background: ${(props) => (props.isLoading ? '#93c5fd' : '#2563eb')};
  }

  &:active {
    transform: ${(props) => (props.isLoading ? 'none' : 'translateY(1px)')};
  }
`;

export const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

export const SignupLink = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;

  &:hover {
    color: #2563eb;
  }
`;