import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

// 페이지 컨테이너
export const Container = styled.div`
  height: 100%;
  background-color: ${theme.colors.white};
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0px 10px 15px ;
  color: ${theme.colors.neutral700};
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.neutral500};
  margin: 0px 0px 10px 15px ;
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

// 혈액형 선택
export const BloodTypeGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm}px;
`;

export const BloodTypeButton = styled.button<{ selected: boolean }>`
  flex: 1;
  height: 48px;
  border: 2px solid ${({ selected }) => 
    selected ? theme.colors.primary600 : 0};
  border-radius: ${theme.borderRadius.sm}px;
  background-color: ${({ selected }) => 
    selected ? theme.colors.white : theme.colors.neutral50};
  color: ${({ selected }) => 
    selected ? theme.colors.primary600 : theme.colors.neutral600};
  font-size: ${theme.fontSize[16]}rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary600};
    background-color: ${theme.colors.primary50};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 에러 메시지
export const ErrorMessage = styled.p`
  font-size: ${theme.fontSize[12]}rem;
  color: ${theme.colors.danger500};
  margin: 0;
  line-height: 1.4;
`;

// 저장 버튼
export const SaveButton = styled.button<{ disabled: boolean }>`
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

// 로딩 상태
export const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl}px;
`;

export const LoadingText = styled.p`
  font-size: ${theme.fontSize[16]}rem;
  color: ${theme.colors.neutral500};
  margin: 0;
`;