import { createSlice } from '@reduxjs/toolkit';
import { ConnectionStatus } from '../../services/websocket/types';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  error: string | null;
}

const initialState: WebSocketState = {
  connectionStatus: ConnectionStatus.DISCONNECTED,
  isConnected: false,
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
});

export const { setConnectionStatus, setError, clearError } = websocketSlice.actions;
export default websocketSlice.reducer;
