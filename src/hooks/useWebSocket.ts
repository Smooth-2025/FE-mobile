import { useState, useEffect, useCallback } from 'react';
import WebSocketService from '../services/websocket/WebSocketService';
import { ConnectionStatus, type AlertMessage } from '../services/websocket/types';

interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  alerts: AlertMessage[];
  unreadCount: number;
  connect: (userId?: string) => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  sendTestAlert: (type: string, payload?: Record<string, unknown>) => boolean;
  requestNotificationPermission: () => Promise<boolean>;
  clearAlerts: () => void;
  markAllAsRead: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 웹소켓 서비스 콜백 설정
  useEffect(() => {
    WebSocketService.setCallbacks({
      onConnect: () => {
        console.warn('🔗 웹소켓 연결됨');
      },
      onDisconnect: () => {
        console.warn('🔌 웹소켓 연결 해제됨');
      },
      onError: (error: Error) => {
        console.error('❌ 웹소켓 에러:', error);
      },
      onStatusChange: (status: ConnectionStatus) => {
        setConnectionStatus(status);
      },
      onAlert: (message: AlertMessage) => {
        console.warn('📨 새 알림 수신:', message);
        setAlerts((prev) => [message, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // 브라우저 알림 표시
        if (Notification.permission === 'granted') {
          new Notification(message.title, {
            body: message.content,
            icon: '/favicon.ico',
          });
        }
      },
    });

    // 초기 연결 상태 설정
    setConnectionStatus(WebSocketService.getConnectionStatus());

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  // 연결
  const connect = useCallback(async (userId?: string) => {
    try {
      await WebSocketService.connect(userId);
    } catch (error) {
      console.error('웹소켓 연결 실패:', error);
      throw error;
    }
  }, []);

  // 연결 해제
  const disconnect = useCallback(() => {
    WebSocketService.disconnect();
  }, []);

  // 재연결
  const reconnect = useCallback(async () => {
    try {
      await WebSocketService.reconnect();
    } catch (error) {
      console.error('웹소켓 재연결 실패:', error);
      throw error;
    }
  }, []);

  // 테스트 알림 전송
  const sendTestAlert = useCallback((type: string, payload: Record<string, unknown> = {}) => {
    const testPayload = {
      timestamp: new Date().toISOString(),
      ...payload,
    };

    return WebSocketService.sendTestAlert(type, testPayload);
  }, []);

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.warn('🔔 알림 권한:', permission);
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // 알림 목록 초기화
  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  // 모든 알림을 읽음으로 표시
  const markAllAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;

  return {
    connectionStatus,
    isConnected,
    alerts,
    unreadCount,
    connect,
    disconnect,
    reconnect,
    sendTestAlert,
    requestNotificationPermission,
    clearAlerts,
    markAllAsRead,
  };
};
