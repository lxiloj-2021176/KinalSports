// client-user/src/features/auth/screens/LoginScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const LoginScreen = ({ navigation }) => {
  const { handleLogin, loading, error } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log('[LoginScreen] onSubmit iniciado');
    console.log('[LoginScreen] Datos form:', data);
    const result = await handleLogin(data);
    console.log('[LoginScreen] Resultado login:', result);
    if (result.success) {
      console.log('[LoginScreen] Login exitoso, navegando...');
      // Navigation will be handled by AppNavigator
    } else {
      console.log('[LoginScreen] Login fallido:', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>KinalSports</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

          <Input
            label="Email o usuario"
            name="emailOrUsername"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ingresa tu email o usuario"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Contraseña"
            name="password"
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            placeholder="Ingresa tu contraseña"
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Iniciar Sesión"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>
              ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
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
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  linkText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.lg,
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

export default LoginScreen;
