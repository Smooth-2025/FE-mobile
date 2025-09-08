import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/apis/axiosBaseQuery';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
  tagTypes: [
    'TodaySummary',
    'CharacterTraits',
    'WeeklySummary',
    'Timeline',
    'DrivingProgress',
    'DrivingSummary',
    'DrivingBehavior',
    'AccidentResponse',
    'DrivingDNA',
    'VehicleLink',
  ],
  endpoints: () => ({}),
});
