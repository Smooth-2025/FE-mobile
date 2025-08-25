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
  border-bottom: 1px solid ${theme.colors.neutral200};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  font-size: ${theme.fontSize[16]}rem;
  color: ${theme.colors.neutral600};
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
  width: calc(100% - ${theme.spacing.md * 2}px);
  height: 56px;
  margin: ${theme.spacing.xl}px ${theme.spacing.md}px;
  background-color: ${theme.colors.primary600};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.sm}px;
  font-size: ${theme.fontSize[16]}rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.primary700};
  }

  &:active {
    transform: translateY(1px);
  }
`;