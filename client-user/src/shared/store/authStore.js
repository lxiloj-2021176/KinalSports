// client-user/src/shared/store/authStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REFRESH_TOKEN_KEY = 'refreshToken';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        set({
          token: accessToken,
          user,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setAccessToken: (accessToken) => {
        set({ token: accessToken });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ _hasHydrated: true });
      },
    }
  )
);
