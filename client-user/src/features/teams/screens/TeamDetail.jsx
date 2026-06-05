// client-user/src/features/teams/screens/TeamDetail.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTeams } from '../hooks/useTeams.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const TeamDetail = ({ navigation }) => {
  const route = useRoute();
  const { teamId } = route.params;
  const { teams, loading, joinTeam, leaveTeam } = useTeams();
  const user = useAuthStore((state) => state.user);

  const team = teams.find((t) => t.id === teamId);

  const isMember = team?.members?.some((member) => member._id === user?._id || member.id === user?.id);

  const handleJoin = async () => {
    const result = await joinTeam(teamId);
    if (result.success) {
      Alert.alert('Éxito', 'Te has unido al equipo');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLeave = async () => {
    Alert.alert(
      'Salir del Equipo',
      '¿Estás seguro de que deseas salir del equipo?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            const result = await leaveTeam(teamId);
            if (result.success) {
              Alert.alert('Éxito', 'Has salido del equipo');
              navigation.goBack();
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  if (loading && !team) {
    return <LoadingSpinner />;
  }

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Equipo no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {team.image && (
        <Image source={{ uri: team.image }} style={styles.image} resizeMode="cover" />
      )}
      
      <View style={styles.content}>
        <Card>
          <Text style={styles.name}>{team.name}</Text>
          {team.description && <Text style={styles.description}>{team.description}</Text>}
          <Text style={styles.members}>{team.members?.length || 0} miembros</Text>
          
          {!isMember ? (
            <Button
              title="Unirse al Equipo"
              onPress={handleJoin}
              style={styles.button}
            />
          ) : (
            <Button
              title="Salir del Equipo"
              variant="secondary"
              onPress={handleLeave}
              style={styles.button}
            />
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
    marginBottom: SPACING.sm,
  },
  members: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.secondary,
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default TeamDetail;
