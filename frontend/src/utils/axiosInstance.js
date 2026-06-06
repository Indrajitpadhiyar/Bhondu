import axios from 'axios';

let storeRef = null;

// Inject store dependency dynamically to avoid circular dependencies
export const injectStore = (store) => {
  storeRef = store;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true, // Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token from Redux State
axiosInstance.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const token = storeRef.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Token Refresh on 401 Unauthorized
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: Prevent infinite loops or non-401 errors
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Guard: If it failed on the refresh-token endpoint itself, do not retry
    if (originalRequest.url.includes('/auth/refresh-token')) {
      if (storeRef) {
        const { logoutUser } = await import('../features/auth/authSlice.js');
        storeRef.dispatch(logoutUser());
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Trigger token refresh endpoint (sends HTTP-only cookies automatically)
      const refreshRes = await axios.post(
        `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      
      const { accessToken } = refreshRes.data;

      if (!accessToken) {
        throw new Error('Refresh token is invalid or missing.');
      }

      if (storeRef) {
        const { setCredentials } = await import('../features/auth/authSlice.js');
        storeRef.dispatch(setCredentials({ token: accessToken }));
      }

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      isRefreshing = false;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;

      // Invalidate auth state in store and force redirect
      if (storeRef) {
        const { logoutUser } = await import('../features/auth/authSlice.js');
        storeRef.dispatch(logoutUser());
      }

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
