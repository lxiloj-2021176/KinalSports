// client-user/src/features/teams/screens/CreateTeam.jsx

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTeams } from '../hooks/useTeams.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING } from '../../../shared/constants/theme.js';

const CreateTeam = ({ navigation }) => {
  const { createTeam, loading } = useTeams();
  const [imageUri, setImageUri] = useState(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm();

  const handlePickImage = () => {
    // TODO: Implementar expo-image-picker cuando esté disponible
    Alert.alert('Info', 'La selección de imagen estará disponible en la próxima versión');
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    
    if (imageUri) {
      formData.append('photo', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'team-photo.jpg',
      });
    }

    const result = await createTeam(formData);
    if (result.success) {
      Alert.alert(
        'Equipo Creado',
        'Tu equipo ha sido creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Error al crear equipo');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>
              {imageUri ? 'Imagen seleccionada' : 'Seleccionar foto del equipo'}
            </Text>
          </TouchableOpacity>
          
          <Input
            label="Nombre del Equipo"
            name="name"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ingresa el nombre del equipo"
          />

          <Input
            label="Descripción"
            name="description"
            control={control}
            placeholder="Descripción del equipo (opcional)"
            multiline
          />

          <Button
            title="Crear Equipo"
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
  imagePicker: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  imagePickerText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.lg,
  },
});

export default CreateTeam;
