// client-user/src/features/tournaments/screens/TournamentsList.jsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useTournaments } from '../hooks/useTournaments.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const TournamentsList = ({ navigation }) => {
  const { tournaments, loading, error, refetch } = useTournaments();

  const renderTournament = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item.id })}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description && <Text style={styles.description}>{item.description}</Text>}
          <Text style={styles.dates}>
            {item.startDate} - {item.endDate}
          </Text>
          <Text style={styles.teams}>
            {item.teams?.length || 0}/{item.maxTeams || 0} equipos
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${COLORS.primary}20` }]}>
            <Text style={[styles.statusText, { color: COLORS.primary }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && tournaments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tournaments}
        renderItem={renderTournament}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="emoji-events" message="No hay torneos disponibles" />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  dates: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  teams: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});

export default TournamentsList;
