import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import alertReducer from './slices/alertSlice';
import websocketReducer from './slices/websocketSlice';
import websocketMiddleware from './websocket/websocketMiddleware';
import authReducer from './slices/authSlice';
import drivingReducer from './slices/drivingSlice';
import { baseApi } from './baseApi';

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    websocket: websocketReducer,
    auth: authReducer,
    driving: drivingReducer,
    [baseApi.reducerPath]: baseApi.reducer,
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
    })
      .concat(websocketMiddleware)
      .concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
