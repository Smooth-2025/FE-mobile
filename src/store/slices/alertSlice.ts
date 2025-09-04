import { createSlice } from '@reduxjs/toolkit';
import { ConnectionStatus, type AlertType } from '../websocket/types';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;

  title?: string;
  content?: string;

  timestamp: string;
  isRead: boolean;

  raw?: unknown;
}

interface AlertState {
  alerts: AlertMessage | null;
  unreadCount: number;
  connectionStatus: ConnectionStatus;
}

const initialState: AlertState = {
  alerts: null,
  unreadCount: 0,
  connectionStatus: ConnectionStatus.DISCONNECTED,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<AlertMessage>) => {
      state.alerts = action.payload;
      if (!action.payload.isRead) {
        state.unreadCount = 1;
      } else {
        state.unreadCount = 0;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      if (state.alerts && state.alerts.id === action.payload && !state.alerts.isRead) {
        state.alerts.isRead = true;
        state.unreadCount = 0;
      }
    },
    markAllAsRead: (state) => {
      if (state.alerts) {
        state.alerts.isRead = true;
      }
      state.unreadCount = 0;
    },
    clearAlerts: (state) => {
      state.alerts = null;
      state.unreadCount = 0;
    },
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
    },
  },
});

export const { addAlert, markAsRead, markAllAsRead, clearAlerts, setConnectionStatus } =
  alertSlice.actions;

export default alertSlice.reducer;

export const selectAlerts = (state: { alert: AlertState }) => state.alert.alerts;
export const selectUnreadCount = (state: { alert: AlertState }) => state.alert.unreadCount;
export const selectAlertConnectionStatus = (state: { alert: AlertState }) =>
  state.alert.connectionStatus;
