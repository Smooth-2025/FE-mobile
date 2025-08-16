import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import alertReducer from './slices/alertSlice';
import websocketReducer from './slices/websocketSlice';
import websocketMiddleware from './middleware/websocketMiddleware';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    websocket: websocketReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'websocket/connect',
          'websocket/disconnect',
          'websocket/subscribe',
          'websocket/sendTestAlert',
          'websocket/ping',
        ],
      },
    }).concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
