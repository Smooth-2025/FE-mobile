import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DrivingTendencyData } from '../websocket/types';

interface DrivingState {
  currentDrivingData: DrivingTendencyData | null;
  isActive: boolean;
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
    updateDrivingTendency: (state, action: PayloadAction<DrivingTendencyData>) => {
      state.currentDrivingData = action.payload;
      state.lastUpdated = action.payload.payload.timestamp;
    },

    startDrivingSession: (state) => {
      state.isActive = true;
      state.currentDrivingData = null; 
    },

    endDrivingSession: (state) => {
      state.isActive = false;
      state.currentDrivingData = null; 
    },

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
