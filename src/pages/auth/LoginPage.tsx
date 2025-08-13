import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserId } from '../../store/slices/userSlice';
import { useAlert } from '../../hooks/useAlert';
import { AlertToast } from '../../components/common/AlertToast/AlertToast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [inputUserId, setInputUserId] = useState('');

  const {
    alerts,
    unreadCount,
    connectionStatus,
    isConnected,
    connect,
    disconnect,
    requestNotificationPermission,
    sendTestAlert,
  } = useAlert();

  const handleConnect = async () => {
    if (inputUserId.trim()) {
      const userId = inputUserId.trim();
      dispatch(setUserId(userId));
      await requestNotificationPermission();
      await connect(); // userId는 Redux에서 가져옴
    }
  };

  const handleSendTestAlert = (type: string) => {
    // 백엔드에서 처리할 수 있도록 최소한의 데이터만 전송
    const payload = {
      userId: inputUserId,
      timestamp: new Date().toISOString(),
    };

    sendTestAlert(type, payload);
  };

  const handleLogin = () => {
    localStorage.setItem('token', 'test-token');
    window.location.reload();
  };

  return (
    <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>LoginPage - WebSocket 테스트</h1>

      {/* 로그인 버튼 */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>로그인</h3>
        <button
          onClick={handleLogin}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          테스트 로그인 (HomePage로 이동)
        </button>
      </div>

      {/* 웹소켓 테스트 */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>웹소켓 연결 테스트</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            value={inputUserId}
            onChange={(e) => setInputUserId(e.target.value)}
            placeholder="사용자 ID 입력"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button
            onClick={handleConnect}
            disabled={isConnected}
            style={{
              padding: '8px 16px',
              backgroundColor: isConnected ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'not-allowed' : 'pointer',
            }}
          >
            웹소켓 연결
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
              cursor: !isConnected ? 'not-allowed' : 'pointer',
            }}
          >
            연결 해제
          </button>
        </div>
        <p>
          상태: <strong style={{ color: isConnected ? 'green' : 'red' }}>{connectionStatus}</strong>
        </p>
      </div>

      {/* 테스트 알림 전송 */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>테스트 알림 전송</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['accident', 'obstacle', 'pothole'].map((type) => (
            <button
              key={type}
              onClick={() => handleSendTestAlert(type)}
              disabled={!isConnected}
              style={{
                padding: '8px 16px',
                backgroundColor: !isConnected ? '#ccc' : '#ffc107',
                color: !isConnected ? '#666' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: !isConnected ? 'not-allowed' : 'pointer',
              }}
            >
              {type} 알림
            </button>
          ))}
        </div>
      </div>

      {/* 알림 목록 */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>받은 알림 목록 (읽지 않음: {unreadCount})</h3>
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          {alerts.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>알림이 없습니다.</p>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: index < unreadCount ? '#f8f9fa' : 'white',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#333' }}>{alert.type}</div>
                {'title' in alert ? (
                  <>
                    <div style={{ fontWeight: '600', marginTop: '4px' }}>{alert.title}</div>
                    <div style={{ color: '#666', marginTop: '2px' }}>{alert.content}</div>
                  </>
                ) : (
                  <div style={{ color: '#666', marginTop: '2px' }}>시간: {alert.timestamp}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <AlertToast />
    </main>
  );
}
