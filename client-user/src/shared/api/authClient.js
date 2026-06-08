// client-user/src/shared/api/authClient.js

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../constants/endpoints.js';
import { useAuthStore } from '../store/authStore.js';

const REFRESH_TOKEN_KEY = 'refreshToken';

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

const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[AUTH_CLIENT] Inicializado con baseURL:', ENDPOINTS.AUTH);

authClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ENDPOINTS.AUTH}${config.url}`;
    console.log('[AUTH_CLIENT] 🔵 Request:', config.method.toUpperCase(), fullUrl);
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[AUTH_CLIENT] ❌ Request Error:', error);
    return Promise.reject(error);
  }
);

const noRefreshEndpoints = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/resend-verification',
];

authClient.interceptors.response.use(
  (response) => {
    console.log('[AUTH_CLIENT] ✅ Response:', response.config.method.toUpperCase(), response.config.url, response.status);
    return response;
  },
  async (error) => {
    const fullUrl = error.config ? `${error.config.baseURL || ENDPOINTS.AUTH}${error.config.url}` : 'URL desconocida';
    
    console.error('[AUTH_CLIENT] ❌ Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: fullUrl,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
      }
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const shouldSkipRefresh = noRefreshEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      );

      if (shouldSkipRefresh) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${ENDPOINTS.AUTH}/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
        useAuthStore.getState().setAccessToken(accessToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default authClient;
