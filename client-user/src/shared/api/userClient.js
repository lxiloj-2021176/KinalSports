// client-user/src/shared/api/userClient.js

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

const userClient = axios.create({
  baseURL: ENDPOINTS.USER,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[USER_CLIENT] Inicializado con baseURL:', ENDPOINTS.USER);

userClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ENDPOINTS.USER}${config.url}`;
    console.log('[USER_CLIENT] 🔵 Request:', config.method.toUpperCase(), fullUrl);
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[USER_CLIENT] ❌ Request Error:', error);
    return Promise.reject(error);
  }
);

userClient.interceptors.response.use(
  (response) => {
    console.log('[USER_CLIENT] ✅ Response:', response.config.method.toUpperCase(), response.config.url, response.status);
    return response;
  },
  async (error) => {
    const fullUrl = error.config ? `${error.config.baseURL || ENDPOINTS.USER}${error.config.url}` : 'URL desconocida';
    
    console.error('[USER_CLIENT] ❌ Response Error:', {
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
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return userClient(originalRequest);
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
        return userClient(originalRequest);
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

export default userClient;
