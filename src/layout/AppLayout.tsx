import styled from '@emotion/styled';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ConnectionStatus } from '@/services/websocket/types';
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice';

const Shell = styled.div`
  padding: 16px 24px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary600};
  }
`;

const Dot = styled.span<{ status: ConnectionStatus }>`
  display: inline-block; width: 8px; height: 8px; margin-left: 8px; border-radius: 50%;
  background: ${({ status }) =>
    status === ConnectionStatus.CONNECTED ? '#22c55e'
    : status === ConnectionStatus.CONNECTING || status === ConnectionStatus.RECONNECTING ? '#f59e0b'
    : '#ef4444'};
`;

export default function AppLayout() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // 인증된 사용자만 웹소켓 자동 연결
  const { connectionStatus } = useWebSocket({ 
    autoConnect: isAuthenticated, 
    userId: user?.id || undefined 
  });

  return (
    <Shell>
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/drive">Drive</Link>
        <Link to="/report">Report</Link>
        <Link to="/mypage">MyPage</Link>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#666' }}>
          WS: {connectionStatus}<Dot status={connectionStatus} />
        </span>
      </Nav>
      <Outlet />
    </Shell>
  );
}
