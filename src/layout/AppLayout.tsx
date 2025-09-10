import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Outlet, useMatches } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAlerts } from '@/store/slices/alertSlice';
import { theme } from '@/styles/theme';
import DrivePortal from '@/components/portal/DrivePortal';
import DriveOverlayPage from '@/pages/driveOverlay/DriveOverlayPage';
import { selectIsAuthenticated, selectUser, fetchUserProfileAsync } from '@/store/slices/authSlice';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useGetLinkStatusQuery } from '@/store/vehicle/vehicleApi';
import { useAppDispatch } from '@/hooks/useAppRedux';
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
  const [drivingActive, setDrivingActive] = useState(false);
  const dispatch = useAppDispatch();

  const matches = useMatches() as ReadonlyArray<MatchUnknown>;
  const hideBottomNav = matches.some(
    (m) => isRouteHandle(m.handle) && m.handle.hideBottomNav === true,
  );

  const alert = useSelector(selectAlerts);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!alert) return;
    if (alert.type === 'start' && drivingActive !== true) {
      setDrivingActive(true);
      return;
    }
    if (alert.type === 'end' && drivingActive !== false) {
      setDrivingActive(false);
      return;
    }
  }, [alert, drivingActive]);

  // 앱 시작시 사용자 프로필 불러오기
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfileAsync());
    }
  }, [isAuthenticated, user, dispatch]);
  const { data: linkStatus } = useGetLinkStatusQuery(undefined, {
    skip: !isAuthenticated,
  });

  useWebSocket({
    autoConnect: isAuthenticated && linkStatus?.linked === true,
  });

  return (
    <>
      <Shell>
        <Content $hasBottomNav={!hideBottomNav}>
          <Outlet />
        </Content>
        {!hideBottomNav && <BottomNav />}
      </Shell>
      {drivingActive && (
        <DrivePortal>
          <DriveOverlayPage />
        </DrivePortal>
      )}
    </>
  );
}
