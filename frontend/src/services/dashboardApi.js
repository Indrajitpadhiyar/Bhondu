import { baseApi } from './baseApi.js';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: '/admin/dashboard-stats',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),
    getAnalytics: builder.query({
      query: (params) => ({
        url: '/admin/analytics',
        method: 'GET',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
    getCoupons: builder.query({
      query: () => ({
        url: '/admin/coupons',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: '/admin/coupons',
        method: 'POST',
        data: couponData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `/admin/coupons/${couponId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dashboard'],
    }),
    getInventory: builder.query({
      query: (params) => ({
        url: '/admin/inventory',
        method: 'GET',
        params,
      }),
      providesTags: ['Dashboard', 'Products'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAnalyticsQuery,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetInventoryQuery,
} = dashboardApi;
