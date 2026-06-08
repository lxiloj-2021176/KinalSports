// client-user/src/features/auth/hooks/useAuth.js

import { useState } from 'react';
import authClient from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { getNetworkErrorMessage } from '../../../shared/utils/logger.js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const handleLogin = async (credentials) => {
    console.log('[useAuth] handleLogin iniciado con:', credentials.emailOrUsername);
    setLoading(true);
    setError(null);
    try {
      console.log('[useAuth] Enviando request al servidor...');
      const response = await authClient.post('/login', credentials);
      console.log('[useAuth] Response recibida:', response.data);
      
      const data = response.data.data || response.data;
      console.log('[useAuth] Data procesada:', data);
      
      const { accessToken, refreshToken, userDetails, user, token } = data;
      console.log('[useAuth] Tokens extraídos - accessToken:', !!accessToken, 'refreshToken:', !!refreshToken);
      
      console.log('[useAuth] Guardando en authStore...');
      await login(
        accessToken || token,
        userDetails || user,
        refreshToken
      );
      
      console.log('[useAuth] Login exitoso');
      return { success: true };
    } catch (err) {
      console.error('[useAuth] Error en handleLogin:', err);
      console.error('[useAuth] Error type:', err.name);
      console.error('[useAuth] Error message:', err.message);
      console.error('[useAuth] Response data:', err.response?.data);
      console.error('[useAuth] Response status:', err.response?.status);
      
      const errorMessage = getNetworkErrorMessage(err);
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      console.log('[useAuth] handleLogin finalizado');
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    console.log('[useAuth] handleRegister iniciado');
    setLoading(true);
    setError(null);
    try {
      console.log('[useAuth] Enviando registro...');
      const response = await authClient.post('/register', userData);
      console.log('[useAuth] Registro exitoso:', response.data);
      return { success: true };
    } catch (err) {
      console.error('[useAuth] Error en handleRegister:', err);
      console.error('[useAuth] Error details:', err.response?.data);
      
      const errorMessage = getNetworkErrorMessage(err);
        
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      console.log('[useAuth] handleRegister finalizado');
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
