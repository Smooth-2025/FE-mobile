import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

// 페이지 컨테이너
export const Container = styled.div`
  height: 100%;
  background-color: ${theme.colors.white};
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

export const HeaderTitle = styled.h1`
  font-size: ${theme.fontSize[18]}rem;
  font-weight: 600;
  color: ${theme.colors.neutral700};
  margin: 0;
`;

// 콘텐츠
export const ContentSection = styled.div`
  padding: ${theme.spacing.lg}px ${theme.spacing.md}px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg}px;
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md}px 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  font-size: ${theme.fontSize[16]}rem;
  color: ${theme.colors.neutral500};
  font-weight: 400;
`;

export const InfoValue = styled.span`
  font-size: ${theme.fontSize[16]}rem;
  color: ${theme.colors.neutral700};
  font-weight: 500;
  
  &.no-data {
    color: ${theme.colors.neutral400};
    font-style: italic;
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

// 수정 버튼
export const EditButton = styled.button`
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