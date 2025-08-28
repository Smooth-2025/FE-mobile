import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DrivingTendencyData } from '../websocket/types';

interface DrivingState {
  // 현재 주행 상황 전체 데이터
  currentDrivingData: DrivingTendencyData | null;
  // 주행 세션 활성화 여부
  isActive: boolean;
  // 마지막 업데이트 시간
  lastUpdated: string | null;
}

const initialState: DrivingState = {
  currentDrivingData: null,
  isActive: false,
  lastUpdated: null,
};

const drivingSlice = createSlice({
  name: 'driving',
  initialState,
  reducers: {
    // 주행 성향 데이터 업데이트 (전체 상황 덮어쓰기)
    updateDrivingTendency: (state, action: PayloadAction<DrivingTendencyData>) => {
      state.currentDrivingData = action.payload;
      state.lastUpdated = action.payload.payload.timestamp;
    },

    // 주행 세션 시작
    startDrivingSession: (state) => {
      state.isActive = true;
      state.currentDrivingData = null; // 기존 데이터 초기화
    },

    // 주행 세션 종료
    endDrivingSession: (state) => {
      state.isActive = false;
      state.currentDrivingData = null; // 데이터 초기화
    },

    // 모든 주행 데이터 초기화
    clearAllDrivingData: (state) => {
      state.currentDrivingData = null;
      state.lastUpdated = null;
    },
  },
});

export const {
  updateDrivingTendency,
  startDrivingSession,
  endDrivingSession,
  clearAllDrivingData,
} = drivingSlice.actions;

export default drivingSlice.reducer;

export const selectCurrentDrivingData = (state: { driving: DrivingState }) =>
  state.driving.currentDrivingData;

export const selectMyEgoData = (state: { driving: DrivingState }) =>
  state.driving.currentDrivingData?.payload.ego || null;

export const selectNeighborsData = (state: { driving: DrivingState }) =>
  state.driving.currentDrivingData?.payload.neighbors || [];

export const selectIsDrivingActive = (state: { driving: DrivingState }) => state.driving.isActive;

export const selectLastUpdated = (state: { driving: DrivingState }) => state.driving.lastUpdated;
