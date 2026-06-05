// client-user/src/features/tournaments/screens/TournamentDetail.jsx

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTournaments } from '../hooks/useTournaments.js';
import { useTeams } from '../../teams/hooks/useTeams.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const TournamentDetail = ({ navigation }) => {
  const route = useRoute();
  const { tournamentId } = route.params;
  const { tournaments, loading, registerTeam } = useTournaments();
  const { myTeams } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const tournament = tournaments.find((t) => t.id === tournamentId);

  const handleRegister = async () => {
    if (!selectedTeamId) {
      Alert.alert('Error', 'Debes seleccionar un equipo');
      return;
    }

    const result = await registerTeam(tournamentId, selectedTeamId);
    if (result.success) {
      Alert.alert('Éxito', 'Tu equipo ha sido inscrito en el torneo');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (loading && !tournament) {
    return <LoadingSpinner />;
  }

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Torneo no encontrado</Text>
      </View>
    );
  }

  const isFull = tournament.teams?.length >= tournament.maxTeams;

  return (
    <ScrollView style={styles.container}>
      {tournament.image && (
        <Image source={{ uri: tournament.image }} style={styles.image} resizeMode="cover" />
      )}
      
      <View style={styles.content}>
        <Card>
          <Text style={styles.name}>{tournament.name}</Text>
          {tournament.description && <Text style={styles.description}>{tournament.description}</Text>}
          
          <Text style={styles.label}>Fechas:</Text>
          <Text style={styles.dates}>{tournament.startDate} - {tournament.endDate}</Text>
          
          <Text style={styles.label}>Equipos:</Text>
          <Text style={styles.teams}>
            {tournament.teams?.length || 0}/{tournament.maxTeams || 0}
          </Text>
          
          <View style={[styles.statusBadge, { backgroundColor: `${COLORS.primary}20` }]}>
            <Text style={[styles.statusText, { color: COLORS.primary }]}>
              {tournament.status}
            </Text>
          </View>

          {!isFull && myTeams.length > 0 && (
            <>
              <Input
                label="Seleccionar Equipo"
                value={myTeams.find((t) => t.id === selectedTeamId)?.name || ''}
                placeholder="Selecciona un equipo"
                editable={false}
                style={styles.readOnlyInput}
              />
              
              {myTeams.map((team) => (
                <Button
                  key={team.id}
                  title={team.name}
                  variant={selectedTeamId === team.id ? 'primary' : 'secondary'}
                  onPress={() => setSelectedTeamId(team.id)}
                  style={styles.teamButton}
                />
              ))}

              <Button
                title="Inscribir Equipo"
                onPress={handleRegister}
                loading={loading}
                style={styles.button}
              />
            </>
          )}

          {isFull && (
            <Text style={styles.fullText}>El torneo está completo</Text>
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  dates: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  teams: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  readOnlyInput: {
    backgroundColor: `${COLORS.background}80`,
    marginBottom: SPACING.sm,
  },
  teamButton: {
    marginBottom: SPACING.sm,
  },
  button: {
    marginTop: SPACING.md,
  },
  fullText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default TournamentDetail;
