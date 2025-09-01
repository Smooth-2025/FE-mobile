import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/apis/axiosBaseQuery';
import type { DrivingProgress } from '@/store/report/type';

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api/driving-analysis' }),
  tagTypes: ['DrivingProgress'],
  endpoints: (build) => ({
    //주행 현황 조회(n/15)
    getDrivingProgress: build.query<DrivingProgress, void>({
      query: () => ({ url: '/reports/progress', method: 'GET' }),
      providesTags: ['DrivingProgress'],
    }),
  }),
});

export const { useGetDrivingProgressQuery } = reportApi;
