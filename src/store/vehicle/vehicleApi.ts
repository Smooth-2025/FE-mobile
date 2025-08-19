import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/apis/axiosBaseQuery';
import type { LinkStatus, LinkVehicleReq } from './type';

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['VehicleLink'],
  endpoints: (builder) => ({
    //-- 차량 연동정보 조회 --
    getLinkStatus: builder.query<LinkStatus, void>({
      query: () => ({ url: '/vehicle', method: 'GET' }),
      providesTags: ['VehicleLink'],
    }),

    //-- 차량 연동 요청  --
    linkVehicle: builder.mutation<LinkStatus, LinkVehicleReq>({
      query: (data) => ({ url: '/vehicle', method: 'POST', data }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: nextStatus } = await queryFulfilled;
          dispatch(
            vehicleApi.util.updateQueryData('getLinkStatus', undefined, (draft) => {
              draft.linked = nextStatus.linked;
              draft.vehicle = nextStatus.vehicle;
            }),
          );
        } catch (err) {
          console.error('[linkVehicle] failed unknown:', err);
        }
      },
    }),

    //-- 차량 연동 해제 요청  --
    unlinkVehicle: builder.mutation<{ linked: false }, void>({
      query: () => ({ url: '/vehicle', method: 'DELETE' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          vehicleApi.util.updateQueryData('getLinkStatus', undefined, (draft) => {
            draft.linked = false;
            draft.vehicle = null;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useGetLinkStatusQuery, useLinkVehicleMutation, useUnlinkVehicleMutation } =
  vehicleApi;
