// client-user/src/features/teams/screens/CreateTeam.jsx

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, Text, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useTeams } from '../hooks/useTeams.js';
import Input from '../../../shared/components/common/Input.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING } from '../../../shared/constants/theme.js';

const CreateTeam = ({ navigation }) => {
  const { createTeam, loading } = useTeams();
  const [imageUri, setImageUri] = useState(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm();

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso Denegado', 'Se requiere permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('[CreateTeam] Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Error al seleccionar imagen');
    }
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
            {imageUri ? (
              <Image 
                source={{ uri: imageUri }} 
                style={styles.selectedImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.imagePickerText}>📸 Seleccionar foto del equipo</Text>
            )}
          </TouchableOpacity>
          
          {imageUri && (
            <TouchableOpacity 
              onPress={() => setImageUri(null)} 
              style={styles.removeImageButton}
            >
              <Text style={styles.removeImageText}>Cambiar imagen</Text>
            </TouchableOpacity>
          )}
          
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
            numberOfLines={4}
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
    justifyContent: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    minHeight: 200,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imagePickerText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  removeImageButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeImageText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: '500',
  },
  button: {
    marginTop: SPACING.lg,
  },
});

export default CreateTeam;
