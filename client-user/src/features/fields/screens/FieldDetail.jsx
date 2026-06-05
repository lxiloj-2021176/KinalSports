// client-user/src/features/fields/screens/FieldDetail.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useFields } from '../hooks/useFields.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const FieldDetail = ({ navigation }) => {
  const route = useRoute();
  const { fieldId } = route.params;
  const { fields, loading, getFieldById } = useFields();

  const field = getFieldById(fieldId);

  if (loading && !field) {
    return <LoadingSpinner />;
  }

  if (!field) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Cancha no encontrada</Text>
      </View>
    );
  }

  const handleReserve = () => {
    navigation.navigate('CreateReservationField', { fieldId: field.id });
  };

  return (
    <ScrollView style={styles.container}>
      {field.image && (
        <Image source={{ uri: field.image }} style={styles.image} resizeMode="cover" />
      )}
      
      <View style={styles.content}>
        <Card>
          <Text style={styles.name}>{field.name}</Text>
          <Text style={styles.location}>{field.location}</Text>
          
          <View style={[styles.statusBadge, field.isAvailable ? styles.available : styles.unavailable]}>
            <Text style={[styles.statusText, field.isAvailable ? styles.availableText : styles.unavailableText]}>
              {field.isAvailable ? 'Disponible' : 'No disponible'}
            </Text>
          </View>

          {field.isAvailable && (
            <Button
              title="Reservar Cancha"
              onPress={handleReserve}
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
  location: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  available: {
    backgroundColor: `${COLORS.success}20`,
  },
  unavailable: {
    backgroundColor: `${COLORS.error}20`,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  availableText: {
    color: COLORS.success,
  },
  unavailableText: {
    color: COLORS.error,
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

export default FieldDetail;
