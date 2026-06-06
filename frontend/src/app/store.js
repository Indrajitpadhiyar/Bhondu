import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import { baseApi } from '../services/baseApi.js';
import { injectStore } from '../utils/axiosInstance.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

// Inject store to Axios to avoid circular dependency
injectStore(store);
