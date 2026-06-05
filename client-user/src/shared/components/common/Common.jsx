// client-user/src/shared/components/common/Common.jsx

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme.js';

export const LoadingSpinner = ({ size = 'large', color = COLORS.primary }) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export const EmptyState = ({ icon = 'inbox', message = 'No hay datos disponibles' }) => {
  return (
    <View style={styles.centerContainer}>
      <MaterialIcons name={icon} size={64} color={COLORS.textLight} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
};

export const Card = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
});
