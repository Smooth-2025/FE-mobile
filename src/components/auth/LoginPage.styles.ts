import styled from '@emotion/styled';
import { theme } from '@styles/theme';

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.white};
  padding: 20px;
`;

export const LoginContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${theme.colors.white};
  border-radius: 24px;
`;

export const BrandTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.neutral700};
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
  background: ${(props) => (props.isLoading ? theme.colors.primary400 : theme.colors.primary700)};
  color: ${theme.colors.white};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.isLoading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  margin-top: 24px;

  &:hover {
    background: ${(props) => (props.isLoading ? theme.colors.primary400 : theme.colors.primary700)};
  }

  &:active {
    transform: ${(props) => (props.isLoading ? 'none' : 'translateY(1px)')};
  }
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.danger700};
  font-size: 12px;
  margin: 4px 0 0 0;
  line-height: 1.4;
`;

export const SignupLink = styled.div`
  text-align: center;
  margin-top: 24px;
  color: ${theme.colors.neutral500}
  font-size: 14px;
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.neutral500};
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: ${theme.colors.primary700};
  }
`;