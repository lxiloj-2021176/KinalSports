// client-user/src/features/reservations/screens/ReservationsList.jsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useReservations } from '../hooks/useReservations.js';
import { Card, LoadingSpinner, EmptyState } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const ReservationsList = () => {
  const { reservations, loading, error, refetch, cancelReservation } = useReservations();

  const handleCancel = async (reservationId) => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que deseas cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelReservation(reservationId);
            if (result.success) {
              Alert.alert('Éxito', 'Reserva cancelada correctamente');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'CONFIRMADA':
        return COLORS.success;
      case 'PENDING':
      case 'PENDIENTE':
        return COLORS.warning;
      case 'CANCELLED':
      case 'CANCELADA':
        return COLORS.error;
      default:
        return COLORS.textLight;
    }
  };

  const renderReservation = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.fieldName}>{item.field?.name || 'Cancha'}</Text>
      <Text style={styles.date}>Fecha: {item.date}</Text>
      <Text style={styles.time}>Hora: {item.time}</Text>
      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      {(item.status === 'PENDING' || item.status === 'PENDIENTE') && (
        <Button
          title="Cancelar"
          variant="secondary"
          onPress={() => handleCancel(item.id)}
          style={styles.cancelButton}
        />
      )}
    </Card>
  );

  if (loading && reservations.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="event" message="No hay reservas" />
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
  },
  fieldName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  time: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: SPACING.sm,
  },
});

export default ReservationsList;
