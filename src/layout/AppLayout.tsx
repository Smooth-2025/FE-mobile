import { useEffect, useState } from 'react';
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

  // 앱 시작 시 토큰 검증용 (새로고침/페이지 이동 시 토큰 상태 체크)
  useEffect(() => {
    let mounted = true;
    
    if (isAuthenticated) {
      // 비동기로 토큰 유효성 검사
      const checkTokenValidity = async () => {
        try {
          await dispatch(fetchUserProfileAsync()).unwrap();
          console.warn('앱 시작 시 토큰 검증 완료');
        } catch (error) {
          if (mounted) {
            console.error('토큰 검증 실패 - 갱신 로직 작동:', error);
            // 401 인터셉터가 자동으로 토큰 갱신 시도
          }
        }
      };
      
      checkTokenValidity();
    }

    return () => {
      mounted = false;
    };
  }, [dispatch, isAuthenticated]); // 마운트 시에만 한 번 실행

  // 페이지 이동 시 토큰 검증 (홈→리포트→마이페이지 이동 시)
  useEffect(() => {
    let mounted = true;
    
    if (isAuthenticated) {
      const checkTokenOnPageChange = async () => {
        try {
          await dispatch(fetchUserProfileAsync()).unwrap();
          console.warn(`페이지 이동 시 토큰 검증 완료: ${location.pathname}`);
        } catch (error) {
          if (mounted) {
            console.error('페이지 이동 시 토큰 검증 실패:', error);
            // 401 인터셉터가 자동으로 토큰 갱신 시도
          }
        }
      };
      
      checkTokenOnPageChange();
    }

    return () => {
      mounted = false;
    };
  }, [location.pathname, isAuthenticated, dispatch]); // 경로가 바뀔 때마다 실행

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
