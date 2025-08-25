import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import alertReducer from './slices/alertSlice';
import websocketReducer from './slices/websocketSlice';
import websocketMiddleware from './websocket/websocketMiddleware';
import authReducer from './slices/authSlice';
import drivingReducer from './slices/drivingSlice'; 
import { vehicleApi } from './vehicle/vehicleApi';

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    websocket: websocketReducer,
    auth: authReducer,
    driving: drivingReducer, 
    [vehicleApi.reducerPath]: vehicleApi.reducer,
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
      .concat(vehicleApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
