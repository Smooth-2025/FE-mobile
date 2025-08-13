import styled from '@emotion/styled';
import { Outlet, useMatches } from 'react-router-dom';
import { theme } from '@/styles/theme';
import BottomNav, { NAV_HEIGHT } from './BottomNav';

const Shell = styled.div`
  width: 100%;
  min-height: 100dvh;
  background-color: ${theme.colors.bg_page};
  box-sizing: border-box;
`;

const Content = styled.div<{ $hasBottomNav: boolean }>`
  height: calc(100dvh - (${(props) => (props.$hasBottomNav ? `${NAV_HEIGHT}px` : '0px')}));
  overflow: auto;
  box-sizing: border-box;
`;

type RouteHandle = { hideBottomNav?: boolean };
type MatchUnknown = { handle?: unknown };

const isRouteHandle = (h: unknown): h is RouteHandle =>
  typeof h === 'object' && h !== null && 'hideBottomNav' in (h as Record<string, unknown>);

export default function AppLayout() {
  const matches = useMatches() as ReadonlyArray<MatchUnknown>;
  const hideBottomNav = matches.some(
    (m) => isRouteHandle(m.handle) && m.handle.hideBottomNav === true,
  );

  return (
    <Shell>
      <Content $hasBottomNav={!hideBottomNav}>
        <Outlet />
      </Content>
      {!hideBottomNav && <BottomNav />}
    </Shell>
  );
}
