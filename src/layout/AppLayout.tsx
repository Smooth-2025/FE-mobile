import { useEffect, useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { Outlet, useMatches, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const matches = useMatches() as ReadonlyArray<MatchUnknown>;
  const hideBottomNav = matches.some(
    (m) => isRouteHandle(m.handle) && m.handle.hideBottomNav === true,
  );

  const alert = useSelector(selectAlerts);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // 토큰 검증 중복 방지를 위한 캐싱 로직
  const lastTokenCheckTime = useRef<number>(0);
  const TOKEN_CHECK_COOLDOWN = 200; // 200ms 쿨다운

  const safeTokenCheck = useCallback(async (reason: string): Promise<void> => {
    const now = Date.now();
    if (now - lastTokenCheckTime.current < TOKEN_CHECK_COOLDOWN) {
      console.warn(`토큰 체크 스킵 (${reason}) - 최근에 실행됨`);
      return;
    }
    
    lastTokenCheckTime.current = now;
    
    try {
      await dispatch(fetchUserProfileAsync()).unwrap();
      console.warn(`토큰 검증 완료 (${reason})`);
    } catch (error) {
      console.error(`토큰 검증 실패 (${reason}):`, error);
      // 401 인터셉터가 자동으로 토큰 갱신 시도
    }
  }, [dispatch]);

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

  // 앱 시작 시 토큰 검증용 (새로고침 시 토큰 상태 체크)
  useEffect(() => {
    if (isAuthenticated) {
      safeTokenCheck('앱 시작');
    }
  }, [isAuthenticated, safeTokenCheck]); // 마운트 시에만 한 번 실행

  // 페이지 이동 시 토큰 검증 (홈→리포트→마이페이지 이동 시)
  useEffect(() => {
    if (isAuthenticated) {
      safeTokenCheck(`페이지 이동: ${location.pathname}`);
    }
  }, [location.pathname, isAuthenticated, safeTokenCheck]); // 경로가 바뀔 때마다 실행

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
