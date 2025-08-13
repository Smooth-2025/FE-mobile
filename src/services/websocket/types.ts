/* eslint-disable @typescript-eslint/ban-ts-comment */
// ===== 알림 관련 타입들 =====
export type AlertType = 'accident' | 'accident-nearby' | 'obstacle' | 'pothole' | 'start' | 'end';

export interface AlertMessageBase {
  type: AlertType;
}
export interface AlertTextMessage extends AlertMessageBase {
  title: string;
  content: string;
}
export interface AlertTimestampMessage extends AlertMessageBase {
  timestamp: string;
}
export type AlertMessage = AlertTextMessage | AlertTimestampMessage;

// ===== WebSocket 관련 타입들 =====
// @ts-expect-error
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
}

export interface WebSocketConfig {
  wsUrl: string;
  apiUrl: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatIncoming: number;
  heartbeatOutgoing: number;
}

export interface WebSocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onAlert?: (message: AlertMessage) => void;
}

export interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  sendCommand: (command: string, data: unknown) => boolean;
}

export interface UseWebSocketProps {
  autoConnect?: boolean;
  userId?: string;
}
