import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // slice 추가
  },
});

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
