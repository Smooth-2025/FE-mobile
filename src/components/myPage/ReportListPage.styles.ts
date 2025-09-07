import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

export const Container = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.white};
  padding-bottom: env(safe-area-inset-bottom);
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: ${theme.colors.white};
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.neutral100};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.neutral700};
  margin: 0;
`;

export const ContentSection = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 로딩 상태
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
`;

export const LoadingText = styled.p`
  font-size: 16px;
  color: ${theme.colors.neutral500};
  margin: 0;
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
`;

export const ErrorText = styled.p`
  font-size: 16px;
  color: ${theme.colors.danger500};
  margin: 0;
  text-align: center;
`;

export const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
`;

export const EmptyText = styled.p`
  font-size: 16px;
  color: ${theme.colors.neutral400};
  margin: 0;
`;