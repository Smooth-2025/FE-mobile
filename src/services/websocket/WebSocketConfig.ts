import type { WebSocketConfig } from './types';

export const getWebSocketConfig = (): WebSocketConfig => ({
  wsUrl: '/ws', // 프록시 사용
  apiUrl: '', // 프록시 사용
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
});
