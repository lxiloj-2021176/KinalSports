// client-user/src/features/reservations/hooks/useReservations.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';

export const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/reservations/me/history');
      const data = response.data.data || response.data;
      
      const mappedReservations = data.map((reservation) => ({
        id: reservation._id || reservation.id,
        field: {
          id: reservation.field?._id || reservation.field?.id,
          name: reservation.field?.name,
          image: reservation.field?.image,
        },
        date: reservation.date,
        time: reservation.time,
        status: reservation.status?.toUpperCase() || reservation.normalizedStatus,
        originalData: reservation,
      }));
      
      setReservations(mappedReservations);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = useCallback(async (reservationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post('/reservations', reservationData);
      const data = response.data.data || response.data;
      await fetchReservations();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear reserva';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchReservations]);

  const cancelReservation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.put(`/reservations/${id}/cancel`);
      await fetchReservations();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cancelar reserva';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refetch: fetchReservations,
    createReservation,
    cancelReservation,
  };
};
