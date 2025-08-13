import React, { useState } from 'react';
import { useAppDispatch } from '../store';
import { setUserId } from '../store/slices/userSlice';
import { useWebSocketAlert } from '../hooks/useWebSocketAlert';
import type { AlertMessage } from '../store/slices/alertSlice';

export const WebSocketDemo: React.FC = () => {
  const dispatch = useAppDispatch();
  const [inputUserId, setInputUserId] = useState('');
  const [latitude, setLatitude] = useState('37.5665'); // 서울 시청 기본값
  const [longitude, setLongitude] = useState('126.9780');

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          alert('현재 위치로 설정되었습니다!');
        },
        (error) => {
          console.error('위치 가져오기 실패:', error);
          alert('위치를 가져올 수 없습니다. 기본값을 사용합니다.');
        }
      );
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  };

  const {
    alerts,
    unreadCount,
    connectionStatus,
    isConnected,
    connect,
    disconnect,
    requestNotificationPermission,
    sendTestAlert,
  } = useWebSocketAlert();

  const handleConnect = async () => {
    if (inputUserId.trim()) {
      dispatch(setUserId(inputUserId.trim()));
      await requestNotificationPermission();
      await connect();
    }
  };

  const handleSendTestAlert = async (type: string) => {
    if (!inputUserId.trim()) {
      alert('사용자 ID를 입력해주세요');
      return;
    }

    // WebSocket이 연결되어 있지 않으면 자동으로 연결
    if (!isConnected) {
      
      dispatch(setUserId(inputUserId.trim()));
      await requestNotificationPermission();
      await connect();
      
      // 연결이 완료될 때까지 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    try {
      const baseUrl = '/api/test'; // 프록시 사용
      let url = '';
      const body = new URLSearchParams();

      body.append('userId', inputUserId.trim());

      if (type === 'accident' || type === 'obstacle' || type === 'pothole') {
        body.append('latitude', latitude);
        body.append('longitude', longitude);
        url = `${baseUrl}/${type}`;
      } else if (type === 'simple-message') {
        body.append('message', `${type} 테스트 메시지`);
        url = `${baseUrl}/simple-message`;
      } else {
        // 기존 WebSocket 방식으로 전송
        const payload = {
          userId: inputUserId,
          timestamp: new Date().toISOString(),
        };
        sendTestAlert(type, payload);
        return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const result = await response.json();
      
      
      if (result.status === 'success') {
        alert(`${type} 알림이 성공적으로 전송되었습니다!\nWebSocket을 통해 알림을 받을 수 있습니다.`);
      } else {
        alert(`알림 전송 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('테스트 알림 전송 오류:', error);
      alert('알림 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Drivecast 알림 시스템 테스트</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #b3d9ff' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#0066cc' }}>📋 테스트 방법</h4>
        <ol style={{ margin: '0', paddingLeft: '20px' }}>
          <li><strong>사용자 ID와 위치 입력</strong> (또는 현재 위치 버튼 클릭)</li>
          <li><strong>테스트 버튼 클릭</strong> → 자동으로 WebSocket 연결 + 알림 전송</li>
          <li><strong>알림 목록에서 수신된 알림 확인</strong></li>
        </ol>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
          💡 테스트 버튼을 누르면 WebSocket이 자동으로 연결되고 알림을 받을 수 있어요!
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>WebSocket 연결 설정 (알림 수신용)</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={inputUserId}
            onChange={(e) => setInputUserId(e.target.value)}
            placeholder="사용자 ID 입력"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '150px' }}
          />
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="위도"
            step="0.0001"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
          />
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="경도"
            step="0.0001"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
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
          <button
            type="button"
            onClick={getCurrentLocation}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            현재 위치
          </button>
        </div>
        <p>
          상태: <strong>{connectionStatus}</strong>
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>알림 테스트 (자동 WebSocket 연결)</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['accident', 'obstacle', 'pothole', 'simple-message'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleSendTestAlert(type)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
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
            alerts.map((alert: AlertMessage) => (
              <div
                key={alert.id}
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: !alert.isRead ? '#f8f9fa' : 'white',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#333' }}>{alert.type}</div>
                <div style={{ fontWeight: '600', marginTop: '4px' }}>{alert.title}</div>
                <div style={{ color: '#666', marginTop: '2px' }}>{alert.content}</div>
                <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
