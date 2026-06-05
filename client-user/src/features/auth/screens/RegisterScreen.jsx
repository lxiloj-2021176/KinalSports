// client-user/src/features/auth/screens/RegisterScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const RegisterScreen = ({ navigation }) => {
  const { handleRegister, loading, error } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
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
