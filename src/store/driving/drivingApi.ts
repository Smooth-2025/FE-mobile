import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/apis/axiosBaseQuery';
import type { TodaySummary, CharacterTraits, WeeklySummary } from '@/store/driving/type';

export const drivingApi = createApi({
  reducerPath: 'drivingApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api/driving-analysis' }),
  tagTypes: ['TodaySummary', 'CharacterTraits', 'WeeklySummary'],
  endpoints: (build) => ({
    //오늘 주행 요약
    getTodaySummary: build.query<TodaySummary, void>({
      query: () => ({ url: '/summary/today', method: 'GET' }),
      providesTags: ['TodaySummary'],
    }),
    // 유저 성향 조회
    getCharacterTraits: build.query<CharacterTraits, void>({
      query: () => ({ url: '/my/character', method: 'GET' }),
      providesTags: ['CharacterTraits'],
    }),
    //최근 7일 주행 요약
    getWeeklySummary: build.query<WeeklySummary, void>({
      query: () => ({ url: '/summary/weekly', method: 'GET' }),
      providesTags: ['WeeklySummary'],
    }),
  }),
});

export const { useGetTodaySummaryQuery, useGetCharacterTraitsQuery, useGetWeeklySummaryQuery } =
  drivingApi;
