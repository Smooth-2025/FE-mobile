import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/apis/axiosBaseQuery';
import { TIMELINE_DEFAULT_ARG } from '@/constants/driving';
import type {
  TodaySummary,
  CharacterTraits,
  WeeklySummary,
  Timeline,
  TimelineArg,
  Cursor,
} from '@/store/driving/type';

export const drivingApi = createApi({
  reducerPath: 'drivingApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api/driving-analysis' }),
  tagTypes: ['TodaySummary', 'CharacterTraits', 'WeeklySummary', 'Timeline'],
  endpoints: (build) => ({
    //오늘 주행 요약
    getTodaySummary: build.query<TodaySummary, void>({
      query: () => ({ url: '/summary/today', method: 'GET' }),
      providesTags: ['TodaySummary'],
    }),
    // 유저 성향 조회
    getCharacterTraits: build.query<CharacterTraits, void>({
      query: () => ({ url: '/character', method: 'GET' }),
      providesTags: ['CharacterTraits'],
    }),
    //최근 7일 주행 요약
    getWeeklySummary: build.query<WeeklySummary, void>({
      query: () => ({ url: '/summary/weekly', method: 'GET' }),
      providesTags: ['WeeklySummary'],
    }),

    //주행 기록 (전체)
    getTimeline: build.infiniteQuery<Timeline, TimelineArg, Cursor>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (!lastPage?.hasMore || !lastPage.nextCursor) return undefined;
          return lastPage.nextCursor;
        },
      },
      query: ({ queryArg, pageParam }) => {
        const params: Record<string, string> = { limit: String(queryArg.limit) };
        if (pageParam) params.cursor = pageParam;

        return {
          url: '/timeline',
          method: 'GET',
          params,
        };
      },
      providesTags: ['Timeline'],
    }),
    // 주행 기록 (주행)
    getTimelineDriving: build.infiniteQuery<Timeline, TimelineArg, Cursor>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (!lastPage?.hasMore || !lastPage.nextCursor) return undefined;
          return lastPage.nextCursor;
        },
      },

      query: ({ queryArg, pageParam }) => {
        const params: Record<string, string> = { limit: String(queryArg.limit) };
        if (pageParam) params.cursor = pageParam;

        return {
          url: '/timeline/driving',
          method: 'GET',
          params,
        };
      },

      providesTags: ['Timeline'],
    }),
    // 주행 기록 (리포트)
    getTimelineReports: build.infiniteQuery<Timeline, TimelineArg, Cursor>({
      infiniteQueryOptions: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
          if (!lastPage?.hasMore || !lastPage.nextCursor) return undefined;
          return lastPage.nextCursor;
        },
      },

      query: ({ queryArg, pageParam }) => {
        const params: Record<string, string> = { limit: String(queryArg.limit) };
        if (pageParam) params.cursor = pageParam;

        return {
          url: '/timeline/reports',
          method: 'GET',
          params,
        };
      },
      providesTags: ['Timeline'],
    }),
    //리포트 읽음 업데이트
    markReportAsRead: build.mutation<void, number>({
      query: (reportId) => ({
        url: `/reports/${reportId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Timeline'],

      async onQueryStarted(reportId, { dispatch, queryFulfilled }) {
        // 공통 업데이터
        const applyPatch = (page: Timeline) => {
          page?.items?.forEach?.((item) => {
            if (item.type === 'REPORT' && item.data?.id === reportId) {
              if (item.data) item.data.isRead = true;
            }
          });
        };
        //리포트 탭 캐시 패치
        const patchReports = dispatch(
          drivingApi.util.updateQueryData('getTimelineReports', TIMELINE_DEFAULT_ARG, (draft) => {
            draft.pages.forEach((page) => applyPatch(page));
          }),
        );
        //전체 탭 캐시 패치
        const patchAll = dispatch(
          drivingApi.util.updateQueryData('getTimeline', TIMELINE_DEFAULT_ARG, (draft) => {
            draft.pages.forEach((page) => applyPatch(page));
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchReports.undo();
          patchAll.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTodaySummaryQuery,
  useGetCharacterTraitsQuery,
  useGetWeeklySummaryQuery,
  useGetTimelineInfiniteQuery,
  useGetTimelineDrivingInfiniteQuery,
  useGetTimelineReportsInfiniteQuery,
  useMarkReportAsReadMutation,
} = drivingApi;
