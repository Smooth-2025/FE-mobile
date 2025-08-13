import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToAlerts,
  sendCommand as sendCommandAction,
} from '@/store/middleware/websocketActions';
import { ConnectionStatus } from '@/services/websocket/types';
import type { RootState, AppDispatch } from '@/store';
import type { UseWebSocketReturn, UseWebSocketProps } from '@/services/websocket/types';



export const useWebSocket = (props: UseWebSocketProps = {}): UseWebSocketReturn => {
  const { autoConnect = false } = props;
  const dispatch = useDispatch<AppDispatch>();

  const connectionStatus = useSelector((s: RootState) => s.websocket.connectionStatus);
  const isConnected = useMemo(
    () => connectionStatus === ConnectionStatus.CONNECTED,
    [connectionStatus],
  );

  const connect = useCallback(async () => {
    dispatch(connectWebSocket());
    // userId 없이 바로 알림 구독
    dispatch(subscribeToAlerts({}));
  }, [dispatch]);

  const disconnect = useCallback(() => {
    dispatch(disconnectWebSocket());
  }, [dispatch]);

  const reconnect = useCallback(async () => {
    dispatch(disconnectWebSocket());
    dispatch(connectWebSocket());
    // userId 없이 바로 알림 구독
    dispatch(subscribeToAlerts({}));
  }, [dispatch]);

  const sendCommand: UseWebSocketReturn['sendCommand'] = useCallback((command, data) => {
    dispatch(sendCommandAction({ command, data }));
    return true;
  }, [dispatch]);

  useEffect(() => {
    if (!autoConnect) return;
    void connect();
    // 필요 시 정리:
    // return () => disconnect();
  }, [autoConnect, connect /*, disconnect*/]);

  return { connectionStatus, isConnected, connect, disconnect, reconnect, sendCommand };
};
