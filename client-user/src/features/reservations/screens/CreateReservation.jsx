// client-user/src/features/reservations/screens/CreateReservation.jsx

import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useReservations } from '../hooks/useReservations.js';
import { useFields } from '../../fields/hooks/useFields.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING } from '../../../shared/constants/theme.js';

const CreateReservation = ({ navigation }) => {
  const route = useRoute();
  const { fieldId } = route.params || {};
  const { createReservation, loading } = useReservations();
  const { getFieldById } = useFields();
  
  const field = fieldId ? getFieldById(fieldId) : null;
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fieldId: fieldId || '',
      date: '',
      time: '',
    },
  });

  const onSubmit = async (data) => {
    const result = await createReservation(data);
    if (result.success) {
      Alert.alert(
        'Reserva Exitosa',
        'Tu reserva ha sido creada correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Error al crear reserva');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          {field && (
            <View style={styles.fieldInfo}>
              <Input
                label="Cancha"
                value={field.name}
                editable={false}
                style={styles.readOnlyInput}
              />
            </View>
          )}
          
          <Input
            label="Fecha"
            name="date"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="YYYY-MM-DD"
            keyboardType="default"
          />

          <Input
            label="Hora"
            name="time"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="HH:MM"
            keyboardType="default"
          />

          <Button
            title="Crear Reserva"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  fieldInfo: {
    marginBottom: SPACING.md,
  },
  readOnlyInput: {
    backgroundColor: `${COLORS.background}80`,
  },
  button: {
    marginTop: SPACING.lg,
  },
});

export default CreateReservation;
