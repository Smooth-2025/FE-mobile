import { useSelector, useDispatch } from 'react-redux';
import Header from '@/layout/Header';
import { theme } from '@/styles/theme';
import { useWebSocket } from '@/hooks/useWebSocket';
import { setToken , selectUser, selectIsAuthenticated } from '@/store/slices/authSlice';
import { sendTestAlert, sendCommand } from '@/store/middleware/websocketActions';
import { selectAlerts, selectUnreadCount } from '@/store/slices/alertSlice';
import type { AppDispatch } from '@/store';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const alerts = useSelector(selectAlerts);
  const unreadCount = useSelector(selectUnreadCount);
  
  const { connectionStatus, isConnected, connect, disconnect } = useWebSocket({ 
    autoConnect: isAuthenticated,
    userId: user?.id 
  });

  // 더미 로그인 (JWT 토큰과 사용자 정보 하드코딩)
  const handleDummyLogin = () => {
    // 더미 JWT 토큰 (실제로는 백엔드에서 발급받음)
    const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    // 토큰 저장 (사용자 정보도 자동으로 설정됨)
    dispatch(setToken(dummyToken));
  };

  // 더미 로그아웃
  const handleDummyLogout = () => {
    dispatch(setToken(null));
    disconnect();
  };

  // 테스트 알림 전송
  const handleSendTestAlert = () => {
    if (!isConnected) {
      alert('웹소켓이 연결되지 않았습니다.');
      return;
    }
    
    dispatch(sendTestAlert({ 
      type: 'accident', 
      payload: { 
        userId: user?.id || 'user123',
        message: '사고 발생 테스트',
        timestamp: new Date().toISOString() 
      } 
    }));
  };

  // Ping 테스트
  const handlePing = () => {
    if (!isConnected) {
      alert('웹소켓이 연결되지 않았습니다.');
      return;
    }
    
    dispatch(sendCommand({ 
      command: '/app/ping', 
      data: { timestamp: new Date().toISOString() } 
    }));
  };

  return (
    <main>
      <Header type="logo" bgColor={theme.colors.bg_page} />
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>HomePage - 웹소켓 테스트</h1>
      
      {/* 인증 상태 */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>인증 상태</h3>
        <p><strong>로그인 여부:</strong> {isAuthenticated ? 'YES' : 'NO'}</p>
        {user && (
          <div>
            <p><strong>사용자 ID:</strong> {user.id}</p>
            <p><strong>사용자 이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
          </div>
        )}
        
        <div style={{ marginTop: '10px' }}>
          {!isAuthenticated ? (
            <button
              onClick={handleDummyLogin}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              더미 로그인 (테스트용)
            </button>
          ) : (
            <button
              onClick={handleDummyLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>

      {/* 웹소켓 상태 */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <h3>웹소켓 상태</h3>
        <p><strong>연결 상태:</strong> <span style={{ color: isConnected ? 'green' : 'red' }}>{connectionStatus}</span></p>
        <p><strong>자동 연결:</strong> {isAuthenticated ? 'ON' : 'OFF'}</p>
        
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button
            onClick={connect}
            disabled={isConnected || !isAuthenticated}
            style={{
              padding: '8px 16px',
              backgroundColor: isConnected || !isAuthenticated ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected || !isAuthenticated ? 'not-allowed' : 'pointer'
            }}
          >
            수동 연결
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            style={{
              padding: '8px 16px',
              backgroundColor: !isConnected ? '#ccc' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isConnected ? 'not-allowed' : 'pointer'
            }}
          >
            연결 해제
          </button>
        </div>
      </div>

      {/* 테스트 기능 */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>웹소켓 테스트</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSendTestAlert}
            disabled={!isConnected}
            style={{
              padding: '8px 16px',
              backgroundColor: !isConnected ? '#ccc' : '#ffc107',
              color: !isConnected ? '#666' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: !isConnected ? 'not-allowed' : 'pointer'
            }}
          >
            테스트 알림 전송
          </button>
          <button
            onClick={handlePing}
            disabled={!isConnected}
            style={{
              padding: '8px 16px',
              backgroundColor: !isConnected ? '#ccc' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isConnected ? 'not-allowed' : 'pointer'
            }}
          >
            Ping 테스트
          </button>
        </div>
      </div>

      {/* 알림 목록 */}
      <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
        <h3>받은 알림 ({unreadCount}개 안읽음)</h3>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          backgroundColor: 'white'
        }}>
          {alerts.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>받은 알림이 없습니다.</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: !alert.isRead ? '#f8f9fa' : 'white',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#333' }}>[{alert.type}]</div>
                {alert.title && <div style={{ fontWeight: '600', marginTop: '4px' }}>{alert.title}</div>}
                <div style={{ color: '#666', marginTop: '2px' }}>{alert.message}</div>
                <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
</main>)}
