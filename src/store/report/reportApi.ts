import { baseApi } from '../baseApi';
import type {
  AccidentResponse,
  DrivingBehavior,
  DrivingDNA,
  DrivingProgress,
  DrivingSummary,
  ReportArg,
} from '@/store/report/type';

export const reportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //주행 현황 조회(n/15)
    getDrivingProgress: build.query<DrivingProgress, void>({
      query: () => ({ url: '/driving-analysis/reports/stamp', method: 'GET' }),
      providesTags: ['DrivingProgress'],
    }),
    //리포트 상세1_주행 정보
    getDrivingSummary: build.query<DrivingSummary, ReportArg>({
      query: ({ reportId }) => ({
        url: `/driving-analysis/reports/${reportId}/basic-summary`,
        method: 'GET',
      }),
      providesTags: ['DrivingSummary'],
    }),
    //리포트 상세2_주행 행동 요약
    getDrivingBehavior: build.query<DrivingBehavior, ReportArg>({
      query: ({ reportId }) => ({
        url: `/driving-analysis/reports/${reportId}/behavior`,
        method: 'GET',
      }),
      providesTags: ['DrivingBehavior'],
    }),
    //리포트 상세3_사고 알림 반응 분석
    getAccidentResponse: build.query<AccidentResponse, ReportArg>({
      query: ({ reportId }) => ({
        url: `/driving-analysis/reports/${reportId}/accident-response`,
        method: 'GET',
      }),
      providesTags: ['AccidentResponse'],
    }),
    //리포트 상세4_DNA 성향 분석
    getDrivingDNA: build.query<DrivingDNA, ReportArg>({
      query: ({ reportId }) => ({
        url: `/driving-analysis/reports/${reportId}/dna`,
        method: 'GET',
      }),
      providesTags: ['DrivingDNA'],
    }),
  }),
});

export const {
  useGetDrivingProgressQuery,
  useGetDrivingSummaryQuery,
  useGetDrivingBehaviorQuery,
  useGetAccidentResponseQuery,
  useGetDrivingDNAQuery,
} = reportApi;
