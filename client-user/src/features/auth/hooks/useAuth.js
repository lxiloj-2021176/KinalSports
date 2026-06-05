// client-user/src/features/auth/hooks/useAuth.js

import { useState } from 'react';
import authClient from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.post('/login', credentials);
      const data = response.data.data || response.data;
      const { accessToken, refreshToken, userDetails, user, token } = data;
      
      await login(
        accessToken || token,
        userDetails || user,
        refreshToken
      );
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.post('/register', userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.data?.message || 'Error al registrar usuario';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    loading,
    error,
  };
};
