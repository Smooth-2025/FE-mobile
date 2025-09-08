import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToDriving,
  subscribeToIncident,
  sendCommand as sendCommandAction,
} from '@/store/websocket/websocketActions';
import { ConnectionStatus } from '@/store/websocket/types';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { tokenUtils } from '@/utils/token';
import type { RootState, AppDispatch } from '@/store';
import type { UseWebSocketReturn, UseWebSocketProps } from '@/store/websocket/types';

export const useWebSocket = (props: UseWebSocketProps = {}): UseWebSocketReturn => {
  const { autoConnect = false } = props;
  const dispatch = useDispatch<AppDispatch>();

  const connectionStatus = useSelector((s: RootState) => s.websocket.connectionStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isConnected = useMemo(
    () => connectionStatus === ConnectionStatus.CONNECTED,
    [connectionStatus],
  );

  const connect = useCallback(async () => {
    const token = tokenUtils.getToken();
    if (!token || !isAuthenticated) {
      console.error('❌ 웹소켓 연결 실패: 인증 토큰이 없습니다.');
      return;
    }

    dispatch(connectWebSocket());

    dispatch(subscribeToDriving());
    dispatch(subscribeToIncident());
  }, [dispatch, isAuthenticated]);

  const disconnect = useCallback(() => {
    dispatch(disconnectWebSocket());
  }, [dispatch]);

  const reconnect = useCallback(async () => {
    const token = tokenUtils.getToken();
    if (!token || !isAuthenticated) {
      console.error('❌ 웹소켓 재연결 실패: 인증 토큰이 없습니다.');
      return;
    }

    dispatch(disconnectWebSocket());
    dispatch(connectWebSocket());
    dispatch(subscribeToDriving());
    dispatch(subscribeToIncident());
  }, [dispatch, isAuthenticated]);

  const sendCommand: UseWebSocketReturn['sendCommand'] = useCallback(
    (command, data) => {
      dispatch(sendCommandAction({ command, data }));
      return true;
    },
    [dispatch],
  );

  useEffect(() => {
    if (!autoConnect) return;
    void connect();
    // 필요 시 정리:
    // return () => disconnect();
  }, [autoConnect, connect /*, disconnect*/]);

  return { connectionStatus, isConnected, connect, disconnect, reconnect, sendCommand };
};
