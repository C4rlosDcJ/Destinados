import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function DiagnosticModal({
  visible,
  onClose,
  apiData,
  failures,
  setFailures,
  onApplyFailures,
  onTestCity,
}) {
  const [selectedJsonTab, setSelectedJsonTab] = useState('geo');

  if (!apiData) return null;

  const { services, query, resolvedName, totalLatencyMs } = apiData;

  const toggleFailure = (key) => {
    const updated = { ...failures, [key]: !failures[key] };
    setFailures(updated);
    if (onApplyFailures) {
      onApplyFailures(updated);
    }
  };

  const resetAllFailures = () => {
    const cleared = {
      geocoding: false,
      weather: false,
      tourism: false,
      currency: false,
    };
    setFailures(cleared);
    if (onApplyFailures) {
      onApplyFailures(cleared);
    }
  };

  const getActiveJsonPayload = () => {
    if (selectedJsonTab === 'geo') return services?.geocoding?.rawJson || services?.geocoding;
    if (selectedJsonTab === 'weather') return services?.weather?.rawJson || services?.weather;
    if (selectedJsonTab === 'tourism') return services?.tourism?.rawJson || services?.tourism;
    if (selectedJsonTab === 'fx') return services?.currency?.rawJson || services?.currency;
    return {};
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Cabecera del modal */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <Feather name="shield" size={11} color="#059669" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>HTTPS VALIDADO</Text>
            </View>
            <Text style={styles.title}>Diagnostico de integracion</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Feather name="x" size={14} color="#3F3F46" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {/* Resumen de Conectividad */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Feather name="activity" size={13} color="#71717A" style={{ marginRight: 6 }} />
              <Text style={styles.cardEyebrow}>TELEMETRIA Y LATENCIA</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Destino: {resolvedName || query}</Text>
              <Text style={styles.metaLatency}>Total: {totalLatencyMs} ms</Text>
            </View>

            <View style={styles.serviceList}>
              <View style={styles.serviceItem}>
                <View style={styles.serviceNameRow}>
                  <Feather
                    name={services?.geocoding?.status === 'success' ? 'check-circle' : 'alert-circle'}
                    size={12}
                    color={services?.geocoding?.status === 'success' ? '#059669' : '#DC2626'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.serviceName}>API 1: Geocodificacion</Text>
                </View>
                <Text style={styles.serviceStatus}>
                  {services?.geocoding?.status === 'success'
                    ? `200 OK (${services?.geocoding?.latencyMs} ms)`
                    : 'Falla 503'}
                </Text>
              </View>

              <View style={styles.serviceItem}>
                <View style={styles.serviceNameRow}>
                  <Feather
                    name={services?.weather?.status === 'success' ? 'check-circle' : 'alert-circle'}
                    size={12}
                    color={services?.weather?.status === 'success' ? '#059669' : '#DC2626'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.serviceName}>API 2: Meteorologia</Text>
                </View>
                <Text style={styles.serviceStatus}>
                  {services?.weather?.status === 'success'
                    ? `200 OK (${services?.weather?.latencyMs} ms)`
                    : services?.weather?.status === 'skipped'
                    ? 'Omitida'
                    : 'Falla 503'}
                </Text>
              </View>

              <View style={styles.serviceItem}>
                <View style={styles.serviceNameRow}>
                  <Feather
                    name={services?.tourism?.status === 'success' ? 'check-circle' : 'alert-circle'}
                    size={12}
                    color={services?.tourism?.status === 'success' ? '#059669' : '#DC2626'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.serviceName}>API 3: Wikipedia REST</Text>
                </View>
                <Text style={styles.serviceStatus}>
                  {services?.tourism?.status === 'success'
                    ? `200 OK (${services?.tourism?.latencyMs} ms)`
                    : services?.tourism?.status === 'skipped'
                    ? 'Omitida'
                    : 'Falla 503'}
                </Text>
              </View>

              <View style={[styles.serviceItem, { borderBottomWidth: 0 }]}>
                <View style={styles.serviceNameRow}>
                  <Feather
                    name={services?.currency?.status === 'success' ? 'check-circle' : 'alert-circle'}
                    size={12}
                    color={services?.currency?.status === 'success' ? '#059669' : '#DC2626'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.serviceName}>API 4: Divisas FX</Text>
                </View>
                <Text style={styles.serviceStatus}>
                  {services?.currency?.status === 'success'
                    ? `200 OK (${services?.currency?.latencyMs} ms)`
                    : services?.currency?.status === 'skipped'
                    ? 'Omitida'
                    : 'Falla 503'}
                </Text>
              </View>
            </View>
          </View>

          {/* Simulador de Indisponibilidad para Evaluacion */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithAction}>
              <View style={styles.cardHeaderRow}>
                <Feather name="sliders" size={13} color="#71717A" style={{ marginRight: 6 }} />
                <Text style={styles.cardEyebrow}>RESILIENCIA Y TOLERANCIA A FALLOS</Text>
              </View>
              <TouchableOpacity onPress={resetAllFailures}>
                <Text style={styles.resetAction}>Restablecer</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.cardDescription}>
              Active una falla simulada para verificar que la aplicacion continua funcionando con los demas servicios activos (Parte 3).
            </Text>

            <View style={styles.togglesGrid}>
              <TouchableOpacity
                style={[styles.togglePill, failures.geocoding && styles.togglePillActive]}
                onPress={() => toggleFailure('geocoding')}
                activeOpacity={0.8}
              >
                <View style={styles.toggleTopRow}>
                  <Text style={[styles.toggleText, failures.geocoding && styles.toggleTextActive]}>
                    {failures.geocoding ? 'Falla activa' : 'Normal'}
                  </Text>
                  <Feather
                    name={failures.geocoding ? 'alert-triangle' : 'check'}
                    size={12}
                    color={failures.geocoding ? '#B91C1C' : '#059669'}
                  />
                </View>
                <Text style={styles.toggleSub}>API 1: Geocodificacion</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.togglePill, failures.weather && styles.togglePillActive]}
                onPress={() => toggleFailure('weather')}
                activeOpacity={0.8}
              >
                <View style={styles.toggleTopRow}>
                  <Text style={[styles.toggleText, failures.weather && styles.toggleTextActive]}>
                    {failures.weather ? 'Falla activa' : 'Normal'}
                  </Text>
                  <Feather
                    name={failures.weather ? 'alert-triangle' : 'check'}
                    size={12}
                    color={failures.weather ? '#B91C1C' : '#059669'}
                  />
                </View>
                <Text style={styles.toggleSub}>API 2: Clima</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.togglePill, failures.tourism && styles.togglePillActive]}
                onPress={() => toggleFailure('tourism')}
                activeOpacity={0.8}
              >
                <View style={styles.toggleTopRow}>
                  <Text style={[styles.toggleText, failures.tourism && styles.toggleTextActive]}>
                    {failures.tourism ? 'Falla activa' : 'Normal'}
                  </Text>
                  <Feather
                    name={failures.tourism ? 'alert-triangle' : 'check'}
                    size={12}
                    color={failures.tourism ? '#B91C1C' : '#059669'}
                  />
                </View>
                <Text style={styles.toggleSub}>API 3: Wikipedia</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.togglePill, failures.currency && styles.togglePillActive]}
                onPress={() => toggleFailure('currency')}
                activeOpacity={0.8}
              >
                <View style={styles.toggleTopRow}>
                  <Text style={[styles.toggleText, failures.currency && styles.toggleTextActive]}>
                    {failures.currency ? 'Falla activa' : 'Normal'}
                  </Text>
                  <Feather
                    name={failures.currency ? 'alert-triangle' : 'check'}
                    size={12}
                    color={failures.currency ? '#B91C1C' : '#059669'}
                  />
                </View>
                <Text style={styles.toggleSub}>API 4: Divisas FX</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pruebas Rapidas en 2 Ubicaciones */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Feather name="map-pin" size={13} color="#71717A" style={{ marginRight: 6 }} />
              <Text style={styles.cardEyebrow}>EVALUACION EN DOS DESTINOS</Text>
            </View>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.testLocationBtn}
                onPress={() => {
                  onTestCity('Tokio');
                  onClose();
                }}
              >
                <Text style={styles.testLocationTitle}>Tokio, Japon</Text>
                <Text style={styles.testLocationSub}>Yenes (JPY) • 35.68° N, 139.69° E</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testLocationBtn}
                onPress={() => {
                  onTestCity('Cancún');
                  onClose();
                }}
              >
                <Text style={styles.testLocationTitle}>Cancun, Mexico</Text>
                <Text style={styles.testLocationSub}>Pesos (MXN) • 21.17° N, -86.84° E</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Visor de Respuestas JSON Crudas */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Feather name="code" size={13} color="#71717A" style={{ marginRight: 6 }} />
              <Text style={styles.cardEyebrow}>AUDITORIA DE PAYLOADS JSON</Text>
            </View>

            <View style={styles.jsonTabs}>
              <TouchableOpacity
                style={[styles.jsonTab, selectedJsonTab === 'geo' && styles.jsonTabActive]}
                onPress={() => setSelectedJsonTab('geo')}
              >
                <Text style={[styles.jsonTabText, selectedJsonTab === 'geo' && styles.jsonTabTextActive]}>
                  API 1 (Geo)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.jsonTab, selectedJsonTab === 'weather' && styles.jsonTabActive]}
                onPress={() => setSelectedJsonTab('weather')}
              >
                <Text style={[styles.jsonTabText, selectedJsonTab === 'weather' && styles.jsonTabTextActive]}>
                  API 2 (Clima)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.jsonTab, selectedJsonTab === 'tourism' && styles.jsonTabActive]}
                onPress={() => setSelectedJsonTab('tourism')}
              >
                <Text style={[styles.jsonTabText, selectedJsonTab === 'tourism' && styles.jsonTabTextActive]}>
                  API 3 (Wiki)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.jsonTab, selectedJsonTab === 'fx' && styles.jsonTabActive]}
                onPress={() => setSelectedJsonTab('fx')}
              >
                <Text style={[styles.jsonTabText, selectedJsonTab === 'fx' && styles.jsonTabTextActive]}>
                  API 4 (FX)
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal style={styles.codeBlock}>
              <Text style={styles.codeText}>
                {JSON.stringify(getActiveJsonPayload(), null, 2)}
              </Text>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardEyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardDescription: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 17,
  },
  resetAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#18181B',
    textDecorationLine: 'underline',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#27272A',
  },
  metaLatency: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  serviceList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  serviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3F3F46',
  },
  serviceStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  togglesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  togglePill: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  togglePillActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  toggleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#27272A',
  },
  toggleTextActive: {
    color: '#B91C1C',
  },
  toggleSub: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 3,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  testLocationBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  testLocationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  testLocationSub: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
  jsonTabs: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    marginBottom: 8,
  },
  jsonTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F4F4F5',
  },
  jsonTabActive: {
    backgroundColor: '#18181B',
  },
  jsonTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
  },
  jsonTabTextActive: {
    color: '#FFFFFF',
  },
  codeBlock: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 12,
    maxHeight: 240,
  },
  codeText: {
    color: '#E4E4E7',
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 15,
  },
});
