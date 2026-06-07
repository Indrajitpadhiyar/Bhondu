import { baseApi } from './baseApi.js';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        method: 'GET',
        params,
      }),
      transformResponse: (response) => response.data.orders,
      providesTags: ['Orders'],
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        data: orderData,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        'Orders',
        { type: 'Orders', id: orderId },
        'Dashboard',
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
