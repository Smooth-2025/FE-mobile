import { createAction } from '@reduxjs/toolkit';

export type SubscribePayload = { userId: string };
export type UnsubscribePayload = { destination: string }; // `/user/{userId}/alert`
export type SendTestAlertPayload = { type: string; payload: Record<string, unknown> };
export type SendCommandPayload = { command: string; data: unknown };
export type SubscribeDrivingPayload = { userId: string };
export type UnsubscribeDrivingPayload = { destination: string };

export const connectWebSocket = createAction('websocket/connect');
export const disconnectWebSocket = createAction('websocket/disconnect');

export const subscribeToAlerts = createAction<SubscribePayload>('websocket/subscribe');
export const unsubscribeFromAlerts = createAction<UnsubscribePayload>('websocket/unsubscribe');

export const subscribeToDriving = createAction<SubscribeDrivingPayload>('websocket/subscribeDriving');
export const unsubscribeFromDriving = createAction<UnsubscribeDrivingPayload>('websocket/unsubscribeDriving');

export const sendTestAlert = createAction<SendTestAlertPayload>('websocket/sendTestAlert');
export const pingWebSocket = createAction('websocket/ping');

export const sendCommand = createAction<SendCommandPayload>('websocket/sendCommand');

export type WebSocketAction =
  | ReturnType<typeof connectWebSocket>
  | ReturnType<typeof disconnectWebSocket>
  | ReturnType<typeof subscribeToAlerts>
  | ReturnType<typeof unsubscribeFromAlerts>
  | ReturnType<typeof subscribeToDriving>
  | ReturnType<typeof unsubscribeFromDriving>
  | ReturnType<typeof sendTestAlert>
  | ReturnType<typeof pingWebSocket>
  | ReturnType<typeof sendCommand>;
