// client-user/src/features/tournaments/hooks/useTournaments.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';

export const useTournaments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments');
      const data = response.data.data || response.data;
      
      const mappedTournaments = data.map((tournament) => ({
        id: tournament._id || tournament.id,
        name: tournament.name,
        description: tournament.description,
        image: tournament.photo || tournament.image,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        status: tournament.status,
        teams: tournament.teams || [],
        maxTeams: tournament.maxTeams,
        originalData: tournament,
      }));
      
      setTournaments(mappedTournaments);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments/my-tournaments');
      const data = response.data.data || response.data;
      
      const mappedTournaments = data.map((tournament) => ({
        id: tournament._id || tournament.id,
        name: tournament.name,
        description: tournament.description,
        image: tournament.photo || tournament.image,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        status: tournament.status,
        teams: tournament.teams || [],
        maxTeams: tournament.maxTeams,
        originalData: tournament,
      }));
      
      setMyTournaments(mappedTournaments);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar mis torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const registerTeam = useCallback(async (tournamentId, teamId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post(`/tournaments/register/${tournamentId}`, {
        teamId,
      });
      await fetchMyTournaments();
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al inscribir equipo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchMyTournaments]);

  return {
    tournaments,
    myTournaments,
    loading,
    error,
    refetch: fetchTournaments,
    refetchMyTournaments: fetchMyTournaments,
    registerTeam,
  };
};
