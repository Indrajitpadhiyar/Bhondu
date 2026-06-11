import { baseApi } from './baseApi.js';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        method: 'GET',
        params,
      }),
      transformResponse: (response) => 
        response.data.products.map(p => ({
          ...p,
          id: p._id
        })),
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'GET',
      }),
      transformResponse: (response) => ({
        ...response.data.product,
        id: response.data.product._id
      }),
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    getCategories: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['Categories'],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/products/${productId}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        'Products',
        { type: 'Products', id: productId },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
    addReview: builder.mutation({
      query: ({ productId, reviewData }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        data: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: productId },
        'Reviews',
      ],
    }),
    getProductReviews: builder.query({
      query: ({ productId, page = 1, limit = 10 }) => ({
        url: `/products/${productId}/reviews`,
        method: 'GET',
        params: { page, limit },
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, { productId }) => [
        { type: 'Reviews', id: productId },
      ],
    }),
    deleteReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `/products/${productId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: productId },
        { type: 'Reviews', id: productId },
      ],
    }),
    uploadReviewImages: builder.mutation({
      query: (formData) => ({
        url: '/upload/review-images',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      transformResponse: (response) => response.data.urls,
    }),
    uploadProductImages: builder.mutation({
      query: (formData) => ({
        url: '/upload/multiple',
        method: 'POST',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      transformResponse: (response) => response.data.urls,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddReviewMutation,
  useGetProductReviewsQuery,
  useDeleteReviewMutation,
  useUploadReviewImagesMutation,
  useUploadProductImagesMutation,
} = productApi;

