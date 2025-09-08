import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

// 페이지 컨테이너
export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.white};
  padding-bottom: env(safe-area-inset-bottom);
`;

// 정보 섹션
export const InfoSection = styled.section`
  background-color: ${theme.colors.white};
  padding: 24px 20px;
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`;

export const InfoLabel = styled.span`
  font-size: 16px;
  color: ${theme.colors.neutral500};
`;

export const InfoValue = styled.span`
  font-size: 16px;
  color: ${theme.colors.neutral700};
`;

// 비밀번호 변경 버튼
export const ActionButton = styled.button`
  width: calc(100% - 40px);
  margin: 0 20px 40px 20px;
  padding: 16px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.neutral200};
  border-radius: ${theme.borderRadius.lg}px;
  font-size: 16px;
  color: ${theme.colors.neutral700};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.neutral200};
  }

  &:active {
    transform: translateY(1px);
  }
`;

// 하단 액션 버튼들
export const BottomActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  padding: 80px 20px;
  margin-top: auto;
`;

export const TextButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: ${theme.colors.neutral500};
  cursor: pointer;
  text-decoration: underline;
  padding: 8px 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.neutral700};
  }
`;

// BottomSheet 스타일들
export const SheetContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 4px;
`;

export const SheetTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.neutral700};
  margin: 0;
  text-align: left;
`;

export const SheetDescription = styled.p`
  font-size: 14px;
  color: ${theme.colors.neutral500};
  margin: 0;
  line-height: 1.5;
  text-align: left;
`;

export const SheetButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const SheetPrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: ${theme.colors.primary600};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.lg}px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.primary700};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: ${theme.colors.neutral300};
    color: ${theme.colors.neutral500};
    cursor: not-allowed;
  }
`;

export const SheetSecondaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: ${theme.colors.white};
  color: ${theme.colors.neutral700};
  border: 1px solid ${theme.colors.neutral200};
  border-radius: ${theme.borderRadius.lg}px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.neutral50};
    border-color: ${theme.colors.neutral300};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: ${theme.colors.neutral100};
    color: ${theme.colors.neutral400};
    cursor: not-allowed;
  }
`;
