export type AlertType =
  | 'accident'
  | 'accident-nearby'
  | 'obstacle'
  | 'pothole'
  | 'start'
  | 'end'
  | 'unknown';

export interface AlertMessageBase {
  type: AlertType;
  raw?: unknown;
}

export interface AlertTextMessage extends AlertMessageBase {
  title?: string;
  content?: string;
}

export interface AlertTimestampMessage extends AlertMessageBase {
  timestamp?: string;
}

export interface AlertRawMessage extends AlertMessageBase {
  message?: string;
  payload?: unknown;
}

export type AlertMessage = AlertTextMessage | AlertTimestampMessage | AlertRawMessage;

export const ConnectionStatus = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECTING: 'RECONNECTING',
  ERROR: 'ERROR',
} as const;

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

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

export type DrivingAnimalType = 'lion' | 'dolphin' | 'meerkat' | 'cat';

export interface Pose {
  latitude: number;
  longitude: number;
  yaw: number;
}

export interface NeighborData {
  userId: string | number;
  character: DrivingAnimalType;
  pose: Pose;
}
export interface EgoData {
  userId: string | number;
  pose: Pose;
}

export interface DrivingTendencyData {
  type: 'driving';
  payload: {
    timestamp: string;
    ego: EgoData;
    neighbors: NeighborData[];
  };
}
