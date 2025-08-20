import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DrivingTendencyData } from '../websocket/types';

interface DrivingState {
  userDrivingData: { [userId: string]: DrivingTendencyData };
  // 내 사용자 ID
  myUserId: string | null;
  // 주행 세션 활성화 여부
  isActive: boolean;
  // 마지막 업데이트 시간
  lastUpdated: string | null;
}

const initialState: DrivingState = {
  userDrivingData: {},
  myUserId: null,
  isActive: false,
  lastUpdated: null,
};

const drivingSlice = createSlice({
  name: 'driving',
  initialState,
  reducers: {
    // 주행 성향 데이터 업데이트 (덮어쓰기 방식)
    updateDrivingTendency: (state, action: PayloadAction<DrivingTendencyData>) => {
      const data = action.payload;
      // 사용자별로 최신 데이터만 유지 (덮어쓰기)
      state.userDrivingData[data.userId] = {
        ...data,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      state.lastUpdated = new Date().toISOString();
    },
    
    // 내 사용자 ID 설정
    setMyUserId: (state, action: PayloadAction<string>) => {
      state.myUserId = action.payload;
    },
    
    // 주행 세션 시작
    startDrivingSession: (state) => {
      state.isActive = true;
      state.userDrivingData = {}; // 기존 데이터 초기화
    },
    
    // 주행 세션 종료
    endDrivingSession: (state) => {
      state.isActive = false;
      state.userDrivingData = {}; // 데이터 초기화
    },
    
    // 특정 사용자 데이터 제거 (연결 끊어진 사용자)
    removeUserDrivingData: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      delete state.userDrivingData[userId];
    },
    
    // 모든 주행 데이터 초기화
    clearAllDrivingData: (state) => {
      state.userDrivingData = {};
      state.lastUpdated = null;
    },
  },
});

export const {
  updateDrivingTendency,
  setMyUserId,
  startDrivingSession,
  endDrivingSession,
  removeUserDrivingData,
  clearAllDrivingData,
} = drivingSlice.actions;

export default drivingSlice.reducer;

export const selectUserDrivingData = (state: { driving: DrivingState }) => 
  state.driving.userDrivingData;

export const selectMyDrivingData = (state: { driving: DrivingState }) => {
  const myUserId = state.driving.myUserId;
  return myUserId ? state.driving.userDrivingData[myUserId] : null;
};

export const selectNearbyUsers = (state: { driving: DrivingState }) => 
  Object.values(state.driving.userDrivingData);

export const selectIsDrivingActive = (state: { driving: DrivingState }) => 
  state.driving.isActive;

export const selectMyUserId = (state: { driving: DrivingState }) => 
  state.driving.myUserId;