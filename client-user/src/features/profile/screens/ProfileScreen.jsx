// client-user/src/features/profile/screens/ProfileScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { useProfile } from '../hooks/useProfile.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import Button from '../../../shared/components/common/Button.jsx';
import Input from '../../../shared/components/common/Input.jsx';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme.js';

const ProfileScreen = ({ navigation }) => {
  const { profile, loading, updateProfile, refetch } = useProfile();
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      displayName: '',
      phone: '',
      favoriteSports: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName || user?.name || '',
        phone: profile.phone || user?.phone || '',
        favoriteSports: Array.isArray(profile.favoriteSports) 
          ? profile.favoriteSports.join(', ') 
          : (profile.favoriteSports || ''),
      });
    }
  }, [profile, user, reset]);

  const getAvatarUri = () => {
    if (profile?.avatar && profile.avatar.startsWith('http')) {
      return profile.avatar;
    }
    return null;
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data) => {
    const favoriteSportsArray = data.favoriteSports
      ? data.favoriteSports.split(',').map(s => s.trim()).filter(s => s)
      : [];

    const profileData = {
      displayName: data.displayName,
      phone: data.phone,
      favoriteSports: favoriteSportsArray,
    };

    const result = await updateProfile(profileData);
    if (result.success) {
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setIsEditing(false);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (loading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card>
          {getAvatarUri() && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: getAvatarUri() }} style={styles.avatar} />
            </View>
          )}
          
          <Text style={styles.title}>Perfil de Usuario</Text>
          
          {isEditing ? (
            <>
              <Input
                label="Nombre de Visualización"
                name="displayName"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                placeholder="Tu nombre"
              />

              <Input
                label="Teléfono"
                name="phone"
                control={control}
                placeholder="Tu teléfono"
                keyboardType="phone-pad"
              />

              <Input
                label="Deportes Favoritos"
                name="favoriteSports"
                control={control}
                placeholder="Fútbol, Baloncesto, etc. (separados por comas)"
              />

              <Button
                title="Guardar Cambios"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={styles.button}
              />

              <Button
                title="Cancelar"
                variant="secondary"
                onPress={handleEditToggle}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{profile?.displayName || user?.name || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>Usuario:</Text>
                <Text style={styles.value}>{user?.username || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user?.email || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{profile?.phone || user?.phone || 'N/A'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Deportes Favoritos:</Text>
                <Text style={styles.value}>
                  {Array.isArray(profile?.favoriteSports) 
                    ? profile.favoriteSports.join(', ') 
                    : (profile?.favoriteSports || 'N/A')}
                </Text>
              </View>

              <Button
                title="Editar Perfil"
                onPress={handleEditToggle}
                style={styles.button}
              />
            </>
          )}

          <Button
            title="Cerrar Sesión"
            variant="secondary"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
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
  content: {
    padding: SPACING.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  infoRow: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  button: {
    marginTop: SPACING.md,
  },
  logoutButton: {
    marginTop: SPACING.xl,
  },
});

export default ProfileScreen;
