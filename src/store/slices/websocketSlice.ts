import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ConnectionStatus } from '@/services/websocket/types.ts';
import type { PayloadAction } from '@reduxjs/toolkit';

// 웹소켓 관련 액션 타입들
export interface WebSocketConnectPayload {
  userId: string;
}

export interface WebSocketSendMessagePayload {
  type: string;
  payload: Record<string, unknown>;
}

// 비동기 액션들
export const connectWebSocket = createAsyncThunk(
  'websocket/connect',
  async (payload: WebSocketConnectPayload) => {
    return payload;
  }
);

export const disconnectWebSocket = createAsyncThunk(
  'websocket/disconnect',
  async () => {
    return {};
  }
);

export const sendWebSocketMessage = createAsyncThunk(
  'websocket/sendMessage',
  async (payload: WebSocketSendMessagePayload) => {
    return payload;
  }
);

export const sendTestAlert = createAsyncThunk(
  'websocket/sendTestAlert',
  async (payload: WebSocketSendMessagePayload) => {
    return payload;
  }
);

interface WebSocketState {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  userId: string | null;
  error: string | null;
}

const initialState: WebSocketState = {
  connectionStatus: ConnectionStatus.DISCONNECTED,
  isConnected: false,
  userId: null,
  error: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload;
      state.isConnected = action.payload === ConnectionStatus.CONNECTED;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWebSocket.pending, (state, action) => {
        state.connectionStatus = ConnectionStatus.CONNECTING;
        state.isConnected = false;
        state.userId = action.meta.arg.userId;
        state.error = null;
      })
      .addCase(connectWebSocket.fulfilled, () => {
        // 실제 연결 상태는 미들웨어에서 setConnectionStatus로 업데이트
      })
      .addCase(connectWebSocket.rejected, (state, action) => {
        state.connectionStatus = ConnectionStatus.ERROR;
        state.isConnected = false;
        state.error = action.error.message || '연결 실패';
      })
      .addCase(disconnectWebSocket.fulfilled, (state) => {
        state.connectionStatus = ConnectionStatus.DISCONNECTED;
        state.isConnected = false;
        state.userId = null;
        state.error = null;
      });
  },
});

export const { setConnectionStatus, setError, clearError } = websocketSlice.actions;
export default websocketSlice.reducer;