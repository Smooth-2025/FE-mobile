import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { theme } from '@/styles/theme';
import { Icon } from '@/components/common';
import type { IconName } from '@/components/common/Icons/type';

export const NAV_HEIGHT = 65;

const Bar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${NAV_HEIGHT}px;
  background-color: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.neutral200};
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
`;

const Item = styled(NavLink)`
  flex: 1 0 0;
  height: 100%;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-size: 12px;
  line-height: 1;
  color: ${theme.colors.neutral500};

  &.active {
    color: ${theme.colors.primary600};
    font-weight: 600;
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary300};
    outline-offset: 2px;
    border-radius: 8px;
  }
`;

type Tab = { to: string; label: string; icon: IconName; end?: boolean; 'aria-label'?: string };

const TABS: Tab[] = [
  { to: '/', label: '홈', icon: 'home', end: true, 'aria-label': '홈' },
  { to: '/drive', label: '주행', icon: 'car', 'aria-label': '드라이브' },
  { to: '/report', label: '리포트', icon: 'report', 'aria-label': '리포트' },
  { to: '/mypage', label: '내 정보', icon: 'user', 'aria-label': '마이페이지' },
];

export default function BottomNav() {
  const uiTheme = useTheme();
  return (
    <Bar role="navigation" aria-label="Bottom navigation">
      {TABS.map(({ to, label, icon, end, ...aria }) => (
        <Item
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
          {...aria}
        >
          {({ isActive }) => (
            <>
              <Icon
                name={icon}
                color={isActive ? uiTheme.colors.primary600 : uiTheme.colors.neutral500}
              />
              <span>{label}</span>
            </>
          )}
        </Item>
      ))}
    </Bar>
  );
}
