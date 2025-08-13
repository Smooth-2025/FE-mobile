import React, { useState } from 'react';
import { useAppDispatch } from '../store';
import { setUserId } from '../store/slices/userSlice';
import { useAlert } from '../hooks/useAlert';
import { AlertToast } from './common/AlertToast/AlertToast';
import type { AlertMessage } from '../services/websocket/types';

export const WebSocketDemo: React.FC = () => {
  const dispatch = useAppDispatch();
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
      dispatch(setUserId(inputUserId.trim()));
      await requestNotificationPermission();
      await connect();
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>WebSocket 알림 테스트</h1>

      <div style={{ marginBottom: '20px' }}>
        <h3>연결 설정</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
              backgroundColor: isConnected ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'not-allowed' : 'pointer',
            }}
          >
            연결
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
          상태: <strong>{connectionStatus}</strong>
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>테스트 알림 전송</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['accident', 'obstacle', 'pothole', 'start', 'end'].map((type) => (
            <button
              key={type}
              onClick={() => handleSendTestAlert(type)}
              disabled={!isConnected}
              style={{
                padding: '8px 16px',
                backgroundColor: !isConnected ? '#ccc' : '#28a745',
                color: 'white',
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

      <div>
        <h3>알림 목록 (읽지 않음: {unreadCount})</h3>
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          {alerts.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>알림이 없습니다.</p>
          ) : (
            alerts.map((alert: AlertMessage, index: number) => (
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
    </div>
  );
};
