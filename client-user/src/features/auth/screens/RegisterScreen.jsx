// client-user/src/features/auth/screens/RegisterScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const RegisterScreen = ({ navigation }) => {
  const { handleRegister, loading, error } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
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
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('[RegisterScreen] Error al seleccionar imagen:', error);
      Alert.alert('Error', 'Error al seleccionar imagen');
    }
  };

  const onSubmit = async (data) => {
    // Agregar imagen si existe
    if (profileImage) {
      data.profilePicture = profileImage;
    }
    
    const result = await handleRegister(data);
    if (result.success) {
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para comenzar</Text>

          <TouchableOpacity onPress={handlePickImage} style={styles.profileImagePicker}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.profileImageText}>📷 Agregar foto de perfil (opcional)</Text>
            )}
          </TouchableOpacity>

          {profileImage && (
            <TouchableOpacity 
              onPress={() => setProfileImage(null)} 
              style={styles.removeImageButton}
            >
              <Text style={styles.removeImageText}>Cambiar foto</Text>
            </TouchableOpacity>
          )}

          <Input
            label="Nombre"
            name="name"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ingresa tu nombre"
          />

          <Input
            label="Apellido"
            name="surname"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ingresa tu apellido"
          />

          <Input
            label="Usuario"
            name="username"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ingresa tu nombre de usuario"
            autoCapitalize="none"
          />

          <Input
            label="Email"
            name="email"
            control={control}
            rules={{
              required: 'Este campo es requerido',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email inválido',
              },
            }}
            placeholder="Ingresa tu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Contraseña"
            name="password"
            control={control}
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            }}
            placeholder="Ingresa tu contraseña"
            secureTextEntry
          />

          <Input
            label="Teléfono"
            name="phone"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ingresa tu teléfono"
            keyboardType="phone-pad"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Registrarse"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    padding: SPACING.xl,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  profileImagePicker: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    minHeight: 140,
    overflow: 'hidden',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.background,
  },
  profileImageText: {
    fontSize: FONT_SIZE.sm,
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
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  linkText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  linkBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

export default RegisterScreen;
