import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header({ hasSimulatedFailures, onOpenDiagnostics }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandGroup}>
          <View style={styles.iconCircle}>
            <Feather name="compass" size={18} color="#18181B" />
          </View>
          <View>
            <Text style={styles.eyebrow}>GUIA GLOBAL DE VIAJES</Text>
            <Text style={styles.brandTitle}>Destinos</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.diagnosticButton,
            hasSimulatedFailures && styles.diagnosticButtonWarning,
          ]}
          onPress={onOpenDiagnostics}
          activeOpacity={0.7}
        >
          <Feather
            name={hasSimulatedFailures ? 'alert-triangle' : 'sliders'}
            size={13}
            color={hasSimulatedFailures ? '#B91C1C' : '#3F3F46'}
            style={{ marginRight: 5 }}
          />
          <Text
            style={[
              styles.diagnosticText,
              hasSimulatedFailures && styles.diagnosticTextWarning,
            ]}
          >
            {hasSimulatedFailures ? 'Simulacion activa' : 'Auditoria API'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.6,
  },
  diagnosticButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F4F4F5',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  diagnosticButtonWarning: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  diagnosticText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3F3F46',
    letterSpacing: 0.2,
  },
  diagnosticTextWarning: {
    color: '#B91C1C',
  },
});
