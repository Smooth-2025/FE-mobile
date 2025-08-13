import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  connectWebSocket, 
  disconnectWebSocket, 
  subscribeToAlerts, 
  sendTestAlert as sendTestAlertAction,
  pingWebSocket 
} from '../store/middleware/websocketActions';
import { markAsRead, clearAlerts } from '../store/slices/alertSlice';
import { ConnectionStatus } from '../services/websocket/types';

export const useWebSocketAlert = () => {
  const dispatch = useAppDispatch();
  const { alerts, unreadCount, connectionStatus } = useAppSelector(state => state.alert);
  const { userId } = useAppSelector(state => state.user);

  const isConnected = connectionStatus === ConnectionStatus.CONNECTED;

  // 웹소켓 연결
  const connect = useCallback(async () => {
    if (!userId) {
      console.error('❌ 사용자 ID가 없습니다.');
      return;
    }

    dispatch(connectWebSocket());
    
    // 연결 후 구독 (약간의 지연을 두어 연결이 완료된 후 구독)
    setTimeout(() => {
      dispatch(subscribeToAlerts(userId));
    }, 1000);
  }, [dispatch, userId]);

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    dispatch(disconnectWebSocket());
  }, [dispatch]);

  // 알림 권한 요청
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.error('🔔 알림 권한:', permission);
      return permission === 'granted';
    }
    return false;
  }, []);

  // 테스트 알림 전송
  const sendTestAlert = useCallback((type: string, payload: Record<string, unknown>) => {
    dispatch(sendTestAlertAction(type, payload));
  }, [dispatch]);

  // 핑 전송
  const ping = useCallback(() => {
    dispatch(pingWebSocket());
  }, [dispatch]);

  // 알림을 읽음으로 표시
  const markAlertAsRead = useCallback((alertId: string) => {
    dispatch(markAsRead(alertId));
  }, [dispatch]);

  // 모든 알림 삭제
  const clearAllAlerts = useCallback(() => {
    dispatch(clearAlerts());
  }, [dispatch]);

  return {
    // 상태
    alerts,
    unreadCount,
    connectionStatus,
    isConnected,
    
    // 액션
    connect,
    disconnect,
    requestNotificationPermission,
    sendTestAlert,
    ping,
    markAlertAsRead,
    clearAllAlerts,
  };
};