import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../utils/axiosInstance.js';

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: axiosError.response?.data || { message: axiosError.message },
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User', 'Products', 'Categories', 'Cart', 'Orders', 'Reviews', 'Dashboard'],
  endpoints: () => ({}),
});
