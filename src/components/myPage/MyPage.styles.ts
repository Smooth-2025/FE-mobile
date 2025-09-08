import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

// 페이지 컨테이너
export const Container = styled.div`
  min-height: 100%;
  padding: 24px 20px;
  box-sizing: border-box;
`;

// 상단 인사말 섹션
export const GreetingSection = styled.div`
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ProfileIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${theme.colors.primary100};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GreetingText = styled.div`
  h1 {
    font-size: 20px;
    font-weight: 600;
    color: ${theme.colors.neutral700};
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: ${theme.colors.neutral600};
    margin: 0;
  }
`;

export const UserName = styled.span`
  color: ${theme.colors.primary600};
`;

export const ProfileLink = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;

  p {
    font-size: 14px;
    color: ${theme.colors.neutral600};
    margin: 0;
  }

  &:hover {
    opacity: 0.7;
  }
`;

// 설정 섹션
export const SettingsSection = styled.div`
  h2 {
    padding: 16px 20px;
    font-size: 14px;
    font-weight: 700;
    color: ${theme.colors.neutral700};
  }
`;

// 메뉴 리스트
export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${theme.borderRadius.lg}px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.neutral200};
  gap: 4px;
`;

// 개별 메뉴 아이템
export const MenuItem = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: none;

  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.neutral50};
    border-color: ${theme.colors.primary300};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const MenuItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const MenuItemText = styled.span`
  font-size: 16px;
  color: ${theme.colors.neutral700};
`;

export const MenuItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${theme.colors.primary50};
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 화살표 아이콘 래퍼 (180도 회전용)
export const ChevronWrapper = styled.div`
  transform: rotate(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
`;
