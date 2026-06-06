import { baseApi } from './baseApi.js';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: '/user/cart',
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),
    updateCart: builder.mutation({
      query: (cartData) => ({
        url: '/user/cart',
        method: 'PUT',
        data: cartData,
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/user/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    getWishlist: builder.query({
      query: () => ({
        url: '/user/wishlist',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/user/wishlist',
        method: 'POST',
        data: { productId },
      }),
      invalidatesTags: ['User'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: '/user/wishlist',
        method: 'DELETE',
        data: { productId },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useUpdateCartMutation,
  useClearCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = cartApi;
