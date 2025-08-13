// WebSocket 액션 타입 정의
export interface ConnectAction {
  type: 'websocket/connect';
  [key: string]: unknown;
}

export interface DisconnectAction {
  type: 'websocket/disconnect';
  [key: string]: unknown;
}

export interface SubscribeAction {
  type: 'websocket/subscribe';
  payload: {
    userId: string;
  };
  [key: string]: unknown;
}

export interface UnsubscribeAction {
  type: 'websocket/unsubscribe';
  payload: {
    destination: string;
  };
  [key: string]: unknown;
}

export interface SendTestAlertAction {
  type: 'websocket/sendTestAlert';
  payload: {
    type: string;
    payload: Record<string, unknown>;
  };
  [key: string]: unknown;
}

export interface PingAction {
  type: 'websocket/ping';
  [key: string]: unknown;
}

export type WebSocketAction =
  | ConnectAction
  | DisconnectAction
  | SubscribeAction
  | UnsubscribeAction
  | SendTestAlertAction
  | PingAction;

// 액션 생성자 함수들
export const connectWebSocket = (): ConnectAction => ({
  type: 'websocket/connect',
});

export const disconnectWebSocket = (): DisconnectAction => ({
  type: 'websocket/disconnect',
});

export const subscribeToAlerts = (userId: string): SubscribeAction => ({
  type: 'websocket/subscribe',
  payload: { userId },
});

export const unsubscribeFromAlerts = (destination: string): UnsubscribeAction => ({
  type: 'websocket/unsubscribe',
  payload: { destination },
});

export const sendTestAlert = (type: string, payload: Record<string, unknown>): SendTestAlertAction => ({
  type: 'websocket/sendTestAlert',
  payload: { type, payload },
});

export const pingWebSocket = (): PingAction => ({
  type: 'websocket/ping',
});
