import { createAction } from '@reduxjs/toolkit';

export type UnsubscribePayload = { destination: string };
export type SendTestAlertPayload = { type: string; payload: Record<string, unknown> };
export type SendCommandPayload = { command: string; data: unknown };

export const connectWebSocket = createAction('websocket/connect');
export const disconnectWebSocket = createAction('websocket/disconnect');

export const subscribeToDriving = createAction('websocket/subscribeDriving');
export const unsubscribeFromDriving = createAction<UnsubscribePayload>(
  'websocket/unsubscribeDriving',
);

export const subscribeToIncident = createAction('websocket/subscribeIncident');
export const unsubscribeFromIncident = createAction<UnsubscribePayload>(
  'websocket/unsubscribeIncident',
);

export const sendTestAlert = createAction<SendTestAlertPayload>('websocket/sendTestAlert');
export const pingWebSocket = createAction('websocket/ping');

export const sendCommand = createAction<SendCommandPayload>('websocket/sendCommand');

export type WebSocketAction =
  | ReturnType<typeof connectWebSocket>
  | ReturnType<typeof disconnectWebSocket>
  | ReturnType<typeof subscribeToDriving>
  | ReturnType<typeof unsubscribeFromDriving>
  | ReturnType<typeof subscribeToIncident>
  | ReturnType<typeof unsubscribeFromIncident>
  | ReturnType<typeof sendTestAlert>
  | ReturnType<typeof pingWebSocket>
  | ReturnType<typeof sendCommand>;
