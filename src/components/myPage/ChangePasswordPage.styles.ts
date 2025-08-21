import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

// 페이지 컨테이너
export const Container = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.bg_page};
  display: flex;
  flex-direction: column;
`;

// 헤더
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md}px;
  background-color: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.neutral200};
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.h1`
  font-size: ${theme.fontSize[18]}rem;
  font-weight: 600;
  color: ${theme.colors.neutral700};
  margin: 0;
`;

// 폼 섹션
export const FormSection = styled.div`
  padding: ${theme.spacing.lg}px ${theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg}px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm}px;
`;

export const Label = styled.label`
  font-size: ${theme.fontSize[14]}rem;
  font-weight: 500;
  color: ${theme.colors.neutral700};
  margin-bottom: 4px;
`;

// 비밀번호 입력 래퍼
export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input<{
  $hasError?: boolean;
  $hasSuccess?: boolean;
}>`
  width: 100%;
  height: 48px;
  padding: 0 48px 0 16px;
  border: 1px solid ${({ $hasError, $hasSuccess }) =>
    $hasError ? theme.colors.danger500 : 
    $hasSuccess ? theme.colors.success600 : 
    theme.colors.neutral300};
  border-radius: ${theme.borderRadius.sm}px;
  font-size: ${theme.fontSize[16]}rem;
  background-color: ${theme.colors.white};
  
  &::placeholder {
    color: ${theme.colors.neutral400};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError }) =>
      $hasError ? theme.colors.danger500 : theme.colors.primary500};
  }
`;

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 메시지
export const ErrorMessage = styled.p`
  font-size: ${theme.fontSize[12]}rem;
  color: ${theme.colors.danger500};
  margin: 0;
  line-height: 1.4;
`;

export const SuccessMessage = styled.p`
  font-size: ${theme.fontSize[12]}rem;
  color: ${theme.colors.success600};
  margin: 0;
  line-height: 1.4;
`;

// 변경 버튼
export const SubmitButton = styled.button<{ disabled: boolean }>`
  width: calc(100% - ${theme.spacing.md * 2}px);
  height: 56px;
  margin: ${theme.spacing.xl}px ${theme.spacing.md}px;
  background-color: ${({ disabled }) =>
    disabled ? theme.colors.neutral300 : theme.colors.primary600};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.sm}px;
  font-size: ${theme.fontSize[16]}rem;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primary700};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;