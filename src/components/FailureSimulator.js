import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FailureSimulator({
  failures,
  setFailures,
  onApplyChange,
}) {
  const toggleFailure = (key) => {
    const updated = { ...failures, [key]: !failures[key] };
    setFailures(updated);
    if (onApplyChange) {
      onApplyChange(updated);
    }
  };

  const resetFailures = () => {
    const cleared = {
      geocoding: false,
      weather: false,
      tourism: false,
      currency: false,
    };
    setFailures(cleared);
    if (onApplyChange) {
      onApplyChange(cleared);
    }
  };

  const hasAnyFailure = Object.values(failures).some((v) => v);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>SIMULADOR DE RESILIENCIA Y FALLAS</Text>
          <Text style={styles.desc}>
            Prueba de indisponibilidad segun especificacion (Parte 3)
          </Text>
        </View>
        {hasAnyFailure && (
          <TouchableOpacity style={styles.resetBtn} onPress={resetFailures}>
            <Text style={styles.resetBtnText}>RESTABLECER</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.togglesGrid}>
        <TouchableOpacity
          style={[styles.toggleBtn, failures.geocoding && styles.toggleBtnActive]}
          onPress={() => toggleFailure('geocoding')}
        >
          <Text style={[styles.toggleText, failures.geocoding && styles.toggleTextActive]}>
            {failures.geocoding ? '[FALLA ACTIVA]' : '[ESTADO OK]'}
          </Text>
          <Text style={styles.toggleLabel}>API 1: Geocodificacion</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, failures.weather && styles.toggleBtnActive]}
          onPress={() => toggleFailure('weather')}
        >
          <Text style={[styles.toggleText, failures.weather && styles.toggleTextActive]}>
            {failures.weather ? '[FALLA ACTIVA]' : '[ESTADO OK]'}
          </Text>
          <Text style={styles.toggleLabel}>API 2: Meteorologia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, failures.tourism && styles.toggleBtnActive]}
          onPress={() => toggleFailure('tourism')}
        >
          <Text style={[styles.toggleText, failures.tourism && styles.toggleTextActive]}>
            {failures.tourism ? '[FALLA ACTIVA]' : '[ESTADO OK]'}
          </Text>
          <Text style={styles.toggleLabel}>API 3: Wikipedia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, failures.currency && styles.toggleBtnActive]}
          onPress={() => toggleFailure('currency')}
        >
          <Text style={[styles.toggleText, failures.currency && styles.toggleTextActive]}>
            {failures.currency ? '[FALLA ACTIVA]' : '[ESTADO OK]'}
          </Text>
          <Text style={styles.toggleLabel}>API 4: Divisas FX</Text>
        </TouchableOpacity>
      </View>

      {hasAnyFailure && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Atencion: Las APIs marcadas simularan un error 503 (Servicio No Disponible) en la siguiente consulta para verificar la degradacion elegante.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.8,
  },
  desc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  resetBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetBtnText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  togglesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleBtnActive: {
    borderColor: '#EF4444',
    backgroundColor: '#450A0A',
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  toggleTextActive: {
    color: '#F87171',
  },
  toggleLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 3,
  },
  warningBox: {
    marginTop: 10,
    backgroundColor: '#331B00',
    borderColor: '#B45309',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },
  warningText: {
    fontSize: 10,
    color: '#FDE68A',
    lineHeight: 14,
  },
});

