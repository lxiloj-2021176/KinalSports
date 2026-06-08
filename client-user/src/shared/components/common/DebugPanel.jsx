// client-user/src/shared/components/common/DebugPanel.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../../constants/theme.js';

/**
 * Panel de debugging para desarrollo
 * Solo se muestra en modo desarrollo
 */
const DebugPanel = ({ visible = __DEV__, logs = [] }) => {
  if (!visible || !__DEV__) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Debug Panel</Text>
      </View>
      <ScrollView style={styles.logsContainer}>
        {logs.length === 0 ? (
          <Text style={styles.emptyText}>Sin logs aún...</Text>
        ) : (
          logs.slice(-10).map((log, index) => (
            <View key={index} style={styles.logEntry}>
              <Text style={[styles.logText, { color: log.color || '#999' }]}>
                {log.timestamp} {log.module}
              </Text>
              <Text style={styles.logMessage}>{log.message}</Text>
              {log.data && (
                <Text style={styles.logData}>{JSON.stringify(log.data, null, 2)}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    zIndex: 9999,
  },
  header: {
    padding: SPACING.sm,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    color: '#fff',
  },
  logsContainer: {
    flex: 1,
    padding: SPACING.sm,
  },
  logEntry: {
    marginBottom: SPACING.sm,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
    paddingLeft: SPACING.sm,
  },
  logText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  logMessage: {
    fontSize: FONT_SIZE.xs,
    color: '#ccc',
    marginTop: 2,
  },
  logData: {
    fontSize: FONT_SIZE.xs,
    color: '#888',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  emptyText: {
    color: '#666',
    fontSize: FONT_SIZE.xs,
    fontStyle: 'italic',
  },
});

export default DebugPanel;
