import { createSlice } from '@reduxjs/toolkit';
import { ConnectionStatus } from '../../services/websocket/types';
import type { PayloadAction } from '@reduxjs/toolkit';

// ==== 알림 타입 ====
export type AlertType =
  | 'accident'
  | 'accident-nearby'
  | 'obstacle'
  | 'pothole'
  | 'start'
  | 'end'
  | 'unknown';

// ==== 알림 엔티티 ====
// 백엔드 원문을 그대로 보여주기 위해 message/raw를 포함
export interface AlertMessage {
  id: string;
  type: AlertType;
  // ✅ 화면에 그대로 보여줄 텍스트(백엔드 원문 우선)
  message: string;

  // 옵션: 서버가 보낼 수도 있는 보조 필드
  title?: string;
  content?: string;

  timestamp: string; // ISO string 등
  isRead: boolean;

  // ✅ 원문 전체를 보관(디버깅/상세 보기)
  raw?: unknown;
}

interface AlertState {
  alerts: AlertMessage[];
  unreadCount: number;
  connectionStatus: ConnectionStatus;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
  connectionStatus: ConnectionStatus.DISCONNECTED,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<AlertMessage>) => {
      // 최신이 위로 오도록 앞에 추가
      state.alerts.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert && !alert.isRead) {
        alert.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.alerts.forEach((a) => {
        a.isRead = true;
      });
      state.unreadCount = 0;
    },
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadCount = 0;
    },
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
    },
  },
});

export const {
  addAlert,
  markAsRead,
  markAllAsRead,
  clearAlerts,
  setConnectionStatus,
} = alertSlice.actions;

export default alertSlice.reducer;

// 셀렉터들
export const selectAlerts = (state: { alert: AlertState }) => state.alert.alerts;
export const selectUnreadCount = (state: { alert: AlertState }) => state.alert.unreadCount;
export const selectAlertConnectionStatus = (state: { alert: AlertState }) => state.alert.connectionStatus;
