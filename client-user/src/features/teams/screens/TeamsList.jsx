// client-user/src/features/teams/screens/TeamsList.jsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useTeams } from '../hooks/useTeams.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const TeamsList = ({ navigation }) => {
  const { teams, loading, error, refetch } = useTeams();

  const renderTeam = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description && <Text style={styles.description}>{item.description}</Text>}
          <Text style={styles.members}>{item.members?.length || 0} miembros</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && teams.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={teams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="groups" message="No hay equipos disponibles" />
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
  members: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
  },
});

export default TeamsList;
