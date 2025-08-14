import styled from '@emotion/styled';
import { Outlet, useMatches } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { theme } from '@/styles/theme';
import { useWebSocket } from '@/hooks/useWebSocket';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { ConnectionStatus } from '@/services/websocket/types';
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
    status === ConnectionStatus.CONNECTED ? '#22c55e'
    : status === ConnectionStatus.CONNECTING || status === ConnectionStatus.RECONNECTING ? '#f59e0b'
    : '#ef4444'};
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

  // 웹소켓 전역 설정
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // 인증된 사용자만 웹소켓 자동 연결 (JWT만 사용)
  const { connectionStatus } = useWebSocket({ 
    autoConnect: isAuthenticated
  });

  return (
    <Shell>
      <Content $hasBottomNav={!hideBottomNav}>
        <Outlet />
      </Content>
      {!hideBottomNav && <BottomNav />}
      
      {/* 개발용 WebSocket 상태 표시 - 운영에서는 제거 가능 */}
      {process.env.NODE_ENV === 'development' && (
        <WSStatus>
          WS: {connectionStatus}
          <Dot status={connectionStatus} />
        </WSStatus>
      )}
    </Shell>
  );
}