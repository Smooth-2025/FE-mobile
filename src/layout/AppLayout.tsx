import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Outlet, useMatches } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAlerts } from '@/store/slices/alertSlice';
import { theme } from '@/styles/theme';
import DrivePortal from '@/components/DrivePortal';
import DriveOverlayPage from '@/pages/driveOverlay/DriveOverlayPage';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { ConnectionStatus } from '@/services/websocket/types';
import { useWebSocket } from '@/hooks/useWebSocket';
import BottomNav, { NAV_HEIGHT } from './BottomNav';

const Shell = styled.div`
  width: 100%;
  min-height: 100dvh;
  background-color: ${theme.colors.bg_page};
  box-sizing: border-box;
`;

const Content = styled.main<{ $hasBottomNav: boolean }>`
  height: calc(100dvh - (${(props) => (props.$hasBottomNav ? `${NAV_HEIGHT}px` : '0px')}));
  overflow: auto;
  padding-bottom: 20px;
  box-sizing: border-box;
`;

// WebSocket 상태 표시를 위한 스타일드 컴포넌트 (개발용)
const WSStatus = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  border-radius: 4px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.span<{ status: ConnectionStatus }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ status }) =>
    status === ConnectionStatus.CONNECTED
      ? '#22c55e'
      : status === ConnectionStatus.CONNECTING || status === ConnectionStatus.RECONNECTING
        ? '#f59e0b'
        : '#ef4444'};
`;

type RouteHandle = { hideBottomNav?: boolean };
type MatchUnknown = { handle?: unknown };

const isRouteHandle = (h: unknown): h is RouteHandle =>
  typeof h === 'object' && h !== null && 'hideBottomNav' in (h as Record<string, unknown>);

export default function AppLayout() {
  const [drivingActive, setDrivingActive] = useState(false);

  const matches = useMatches() as ReadonlyArray<MatchUnknown>;
  const hideBottomNav = matches.some(
    (m) => isRouteHandle(m.handle) && m.handle.hideBottomNav === true,
  );

  const alerts = useSelector(selectAlerts);

  useEffect(() => {
    if (!alerts?.length) return;
    const latest = alerts[0];
    if (latest.type === 'start' && drivingActive !== true) {
      setDrivingActive(true);
      return;
    }
    if (latest.type === 'end' && drivingActive !== false) {
      setDrivingActive(false);
      return;
    }
  }, [alerts, drivingActive]);

  // 웹소켓 전역 설정
  const isAuthenticated = useSelector(selectIsAuthenticated);

  //인증된 사용자 웹소켓 자동 연결
  const { connectionStatus } = useWebSocket({
    autoConnect: isAuthenticated,
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
        <WSStatus>
          WS: {connectionStatus}
          <Dot status={connectionStatus} />
        </WSStatus>
    </>
  );
}
