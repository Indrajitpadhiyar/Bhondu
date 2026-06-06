import { baseApi } from './baseApi.js';
import { setCredentials, clearCredentials } from '../features/auth/authSlice.js';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        data: userData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (payload) => ({
        url: `/auth/verify-email`,
        method: 'POST',
        data: payload,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.data.user,
              token: data.accessToken,
            })
          );
        } catch (err) {}
      },
    }),
    logout: builder.mutation({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        data: body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
        } catch (err) {}
      },
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        data: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/reset-password',
        method: 'POST',
        data: payload,
      }),
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/change-password',
        method: 'POST',
        data: payload,
      }),
    }),
    googleLogin: builder.mutation({
      query: (tokenPayload) => ({
        url: '/auth/google-login',
        method: 'POST',
        data: tokenPayload,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.data.user,
              token: data.accessToken,
            })
          );
        } catch (err) {}
      },
    }),
    refreshTokenSilent: builder.mutation({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGoogleLoginMutation,
  useRefreshTokenSilentMutation,
} = authApi;
