// client-user/src/features/profile/hooks/useProfile.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const updateUser = useAuthStore((state) => state.updateUser);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/users/profile');
      const data = response.data.data || response.data;
      
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar perfil');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.put('/users/profile', profileData);
      const data = response.data.data || response.data;
      
      setProfile(data);
      updateUser(data);
      
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};
