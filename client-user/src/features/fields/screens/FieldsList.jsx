// client-user/src/features/fields/screens/FieldsList.jsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useFields } from '../hooks/useFields.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const FieldsList = ({ navigation }) => {
  const { fields, loading, error, refetch } = useFields();

  const renderField = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FieldDetail', { fieldId: item.id })}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <View style={[styles.statusBadge, item.isAvailable ? styles.available : styles.unavailable]}>
            <Text style={[styles.statusText, item.isAvailable ? styles.availableText : styles.unavailableText]}>
              {item.isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading && fields.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        renderItem={renderField}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="sports-soccer" message="No hay canchas disponibles" />
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
  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  available: {
    backgroundColor: `${COLORS.success}20`,
  },
  unavailable: {
    backgroundColor: `${COLORS.error}20`,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
  },
  availableText: {
    color: COLORS.success,
  },
  unavailableText: {
    color: COLORS.error,
  },
});

export default FieldsList;
