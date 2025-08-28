import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Outlet, useMatches } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAlerts } from '@/store/slices/alertSlice';
import { theme } from '@/styles/theme';
import DrivePortal from '@/components/DrivePortal';
import DriveOverlayPage from '@/pages/driveOverlay/DriveOverlayPage';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { ConnectionStatus } from '@/store/websocket/types';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useGetLinkStatusQuery } from '@/store/vehicle/vehicleApi';
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

// WebSocket 상태 표시 컴포넌트 (개발용)
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

  const alert = useSelector(selectAlerts);

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

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: linkStatus } = useGetLinkStatusQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { connectionStatus } = useWebSocket({
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
      <WSStatus>
        WS: {connectionStatus}
        <Dot status={connectionStatus} />
      </WSStatus>
    </>
  );
}
