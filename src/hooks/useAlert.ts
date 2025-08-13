import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { connectWebSocket, disconnectWebSocket, sendTestAlert } from '../store/slices/websocketSlice';

export const useAlert = () => {
  const dispatch = useAppDispatch();
  const { alerts, unreadCount } = useAppSelector((state) => state.alert);
  const { connectionStatus, isConnected, userId } = useAppSelector((state) => state.websocket);
  const reduxUserId = useAppSelector((state) => state.user.userId);
  
  const lastAlertCountRef = useRef(0);

  // 새로운 알림 수신 시 웹 알림 표시
  useEffect(() => {
    if (alerts.length > lastAlertCountRef.current) {
      const latestAlert = alerts[0]; // 가장 최근 알림
      
      // 웹 알림 표시 (권한이 있는 경우)
      if (Notification.permission === 'granted') {
        const title = 'title' in latestAlert ? latestAlert.title : '알림';
        const body = 'content' in latestAlert ? latestAlert.content : `${latestAlert.type} 알림`;
        
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      }
    }
    lastAlertCountRef.current = alerts.length;
  }, [alerts]);

  // 웹소켓 연결
  const connect = useCallback(async (explicitUserId?: string) => {
    const targetUserId = explicitUserId || userId || reduxUserId;
    if (!targetUserId) {
      console.warn('⚠️ userId가 설정되지 않았습니다.');
      return;
    }
    dispatch(connectWebSocket({ userId: targetUserId }));
  }, [dispatch, userId, reduxUserId]);

  // 웹소켓 연결 해제
  const disconnect = useCallback(() => {
    dispatch(disconnectWebSocket());
  }, [dispatch]);

  // 웹 알림 권한 요청
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.error('🔔 알림 권한:', permission);
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // 테스트 알림 전송
  const sendTestAlertAction = useCallback((type: string, payload: Record<string, unknown>) => {
    dispatch(sendTestAlert({ type, payload }));
    return true; // 기존 인터페이스 호환성 유지
  }, [dispatch]);

  return {
    alerts,
    unreadCount,
    connectionStatus,
    isConnected,
    connect,
    disconnect,
    requestNotificationPermission,
    sendTestAlert: sendTestAlertAction,
  };
};