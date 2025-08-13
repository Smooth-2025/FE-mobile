import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 알림 타입 정의
export type AlertType = 'accident' | 'accident-nearby' | 'obstacle' | 'pothole' | 'start' | 'end';

export interface AlertMessageBase {
  type: AlertType;
}

// 일반 알림 (사고, 장애물 등)
export interface AlertTextMessage extends AlertMessageBase {
  title: string;
  content: string;
}

// 시간 알림 (start/end)
export interface AlertTimestampMessage extends AlertMessageBase {
  timestamp: string;
}

// 통합 알림 타입
export type AlertMessage = AlertTextMessage | AlertTimestampMessage;

interface AlertState {
  alerts: AlertMessage[];
  unreadCount: number;
}

const initialState: AlertState = {
  alerts: [],
  unreadCount: 0,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<AlertMessage>) => {
      state.alerts.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadCount = 0;
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { addAlert, clearAlerts, markAllAsRead } = alertSlice.actions;
export default alertSlice.reducer;
