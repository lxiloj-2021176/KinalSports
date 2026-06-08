// client-user/src/shared/components/common/Input.jsx

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme.js';

const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false, 
  error, 
  keyboardType = 'default', 
  autoCapitalize = 'none', 
  style,
  name,
  control,
  rules,
  editable = true,
  multiline = false,
  numberOfLines = 1
}) => {
  // Si tiene control (react-hook-form), usar Controller
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value: fieldValue }, fieldState: { error: fieldError } }) => (
          <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
              value={fieldValue}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              editable={editable}
              multiline={multiline}
              numberOfLines={numberOfLines}
              style={[
                styles.input, 
                (fieldError || error) && styles.inputError,
                multiline && styles.inputMultiline
              ]}
            />
            {(fieldError || error) && <Text style={styles.errorText}>{fieldError?.message || error}</Text>}
          </View>
        )}
      />
    );
  }

  // Fallback para uso manual (sin react-hook-form)
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          styles.input, 
          error && styles.inputError,
          multiline && styles.inputMultiline
        ]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input;
