import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/apis/axiosBaseQuery';
import type {
  AccidentResponse,
  DrivingBehavior,
  DrivingProgress,
  DrivingSummary,
  ReportArg,
} from '@/store/report/type';

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api/driving-analysis' }),
  tagTypes: ['DrivingProgress', 'DrivingSummary', 'DrivingBehavior', 'AccidentResponse'],
  endpoints: (build) => ({
    //주행 현황 조회(n/15)
    getDrivingProgress: build.query<DrivingProgress, void>({
      query: () => ({ url: '/reports/stamp', method: 'GET' }),
      providesTags: ['DrivingProgress'],
    }),
    //리포트 상세1_주행 정보
    getDrivingSummary: build.query<DrivingSummary, ReportArg>({
      query: ({ reportId }) => ({ url: `reports/${reportId}/basic-summary`, method: 'GET' }),
      providesTags: ['DrivingSummary'],
    }),
    //리포트 상세2_주행 행동 요약
    getDrivingBehavior: build.query<DrivingBehavior, ReportArg>({
      query: ({ reportId }) => ({ url: `reports/${reportId}/behavior`, method: 'GET' }),
      providesTags: ['DrivingBehavior'],
    }),
    //리포트 상세3_사고 알림 반응 분석
    getAccidentResponse: build.query<AccidentResponse, ReportArg>({
      query: ({ reportId }) => ({ url: `reports/${reportId}/accident-response`, method: 'GET' }),
      providesTags: ['AccidentResponse'],
    }),
  }),
});

export const {
  useGetDrivingProgressQuery,
  useGetDrivingSummaryQuery,
  useGetDrivingBehaviorQuery,
  useGetAccidentResponseQuery,
} = reportApi;
