import { ConnectionStatus } from '@/services/websocket/types.ts';
import WebSocketService from '../../services/websocket/WebSocketService';
import {
  connectWebSocket,
  disconnectWebSocket,
  sendWebSocketMessage,
  sendTestAlert,
  setConnectionStatus,
  setError,
} from '../slices/websocketSlice';
import { addAlert } from '../slices/alertSlice';
import type { AlertMessage } from '@/services/websocket/types.ts';

export const websocketMiddleware =
  (store: { dispatch: (action: unknown) => void }) =>
  (next: (action: unknown) => unknown) =>
  (action: unknown) => {
    const result = next(action);

    // 웹소켓 서비스 콜백 설정 (한 번만 설정)
    const isCallbacksSet = WebSocketService.getClient() !== null;
    if (!isCallbacksSet) {
      WebSocketService.setCallbacks({
        onConnect: () => {
          store.dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
        },
        onDisconnect: () => {
          store.dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
        },
        onError: (error: Error) => {
          store.dispatch(setError(error.message));
          store.dispatch(setConnectionStatus(ConnectionStatus.ERROR));
        },
        onStatusChange: (status: ConnectionStatus) => {
          store.dispatch(setConnectionStatus(status));
        },
        onAlert: (message: AlertMessage) => {
          // 알림을 스토어에 추가
          store.dispatch(addAlert(message));
        },
      });
    }

    // 액션별 처리
    if (connectWebSocket.pending.match(action)) {
      const { userId } = action.meta.arg;
      WebSocketService.connect(userId).catch((error) => {
        store.dispatch(setError(error.message));
      });
    }

    if (disconnectWebSocket.pending.match(action)) {
      WebSocketService.disconnect();
    }

    if (sendWebSocketMessage.pending.match(action)) {
      const { type, payload } = action.meta.arg;
      WebSocketService.sendVehicleCommand(type, payload);
    }

    if (sendTestAlert.pending.match(action)) {
      const { type, payload } = action.meta.arg;
      WebSocketService.sendTestAlert(type, payload);
    }

    return result;
  };
