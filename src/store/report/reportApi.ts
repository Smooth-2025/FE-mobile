import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/apis/axiosBaseQuery';
import type { DrivingProgress, DrivingSummary, DrivingSummaryArg } from '@/store/report/type';

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api/driving-analysis' }),
  tagTypes: ['DrivingProgress', 'DrivingSummary'],
  endpoints: (build) => ({
    //주행 현황 조회(n/15)
    getDrivingProgress: build.query<DrivingProgress, void>({
      query: () => ({ url: '/reports/stamp', method: 'GET' }),
      providesTags: ['DrivingProgress'],
    }),
    //리포트 상세1_주행 정보
    getDrivingSummary: build.query<DrivingSummary, DrivingSummaryArg>({
      query: ({ reportId }) => ({ url: `reports/${reportId}/basic-summary`, method: 'GET' }),
      providesTags: ['DrivingSummary'],
    }),
  }),
});

export const { useGetDrivingProgressQuery, useGetDrivingSummaryQuery } = reportApi;
