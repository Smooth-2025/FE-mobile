import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import alertReducer from './slices/alertSlice';
import userReducer from './slices/userSlice';
import websocketReducer from './slices/websocketSlice';
import { websocketMiddleware } from './middleware/websocketMiddleware';
import type { TypedUseSelectorHook } from 'react-redux';

const store = configureStore({
  reducer: {
    alert: alertReducer,
    user: userReducer,
    websocket: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['websocket/connect/pending', 'websocket/disconnect/pending'],
      },
    }).concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
