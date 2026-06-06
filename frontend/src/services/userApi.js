import { baseApi } from './baseApi.js';
import { setCredentials } from '../features/auth/authSlice.js';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: '/user/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (err) {}
      },
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: '/user/profile',
        method: 'PATCH',
        data: formData, // FormData handles profile update text and avatar files
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch (err) {}
      },
    }),
    addAddress: builder.mutation({
      query: (addressData) => ({
        url: '/user/address',
        method: 'POST',
        data: addressData,
      }),
      invalidatesTags: ['User'],
    }),
    updateAddress: builder.mutation({
      query: ({ addressId, data }) => ({
        url: `/user/address/${addressId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/user/address/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    setDefaultAddress: builder.mutation({
      query: (addressId) => ({
        url: `/user/address/${addressId}/default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    // Admin customer access
    getCustomers: builder.query({
      query: (params) => ({
        url: '/admin/customers',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  useGetCustomersQuery,
} = userApi;
