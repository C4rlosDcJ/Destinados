import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function ApiInspectorModal({ visible, onClose, apiData }) {
  const [selectedTab, setSelectedTab] = useState('summary');

  if (!apiData) return null;

  const { services, query, resolvedName, totalLatencyMs, timestamp } = apiData;

  const renderJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.modalTag}>AUDITORIA TECNICA MULTI-API</Text>
            <Text style={styles.modalTitle}>Inspector de Peticiones y JSON</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>CERRAR [X]</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaStrip}>
          <Text style={styles.metaItem}>Destino: {resolvedName || query}</Text>
          <Text style={styles.metaItem}>Latencia: {totalLatencyMs} ms</Text>
          <Text style={styles.metaItem}>Protocolo: HTTPS 100%</Text>
        </View>

        {/* Pestanas de navegacion tecnica */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'summary' && styles.tabBtnActive]}
            onPress={() => setSelectedTab('summary')}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === 'summary' && styles.tabBtnTextActive,
              ]}
            >
              Arquitectura
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'geo' && styles.tabBtnActive]}
            onPress={() => setSelectedTab('geo')}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === 'geo' && styles.tabBtnTextActive,
              ]}
            >
              API 1 (Geo)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'weather' && styles.tabBtnActive]}
            onPress={() => setSelectedTab('weather')}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === 'weather' && styles.tabBtnTextActive,
              ]}
            >
              API 2 (Clima)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'wiki' && styles.tabBtnActive]}
            onPress={() => setSelectedTab('wiki')}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === 'wiki' && styles.tabBtnTextActive,
              ]}
            >
              API 3 (Wiki)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedTab === 'fx' && styles.tabBtnActive]}
            onPress={() => setSelectedTab('fx')}
          >
            <Text
              style={[
                styles.tabBtnText,
                selectedTab === 'fx' && styles.tabBtnTextActive,
              ]}
            >
              API 4 (Divisas)
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea}>
          {selectedTab === 'summary' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>
                FLUJO DE DATOS ENTRE SERVICIOS INDEPENDIENTES:
              </Text>
              <Text style={styles.paragraph}>
                1. Entrada del usuario: Se envia el termino de busqueda ("{query}") al Servicio 1 (Geocodificacion Open-Meteo).
              </Text>
              <Text style={styles.paragraph}>
                2. Procesamiento JSON 1: Se extraen coordenadas (latitud: {services?.geocoding?.data?.latitude}, longitud: {services?.geocoding?.data?.longitude}) y el codigo de pais ({services?.geocoding?.data?.countryCode}).
              </Text>
              <Text style={styles.paragraph}>
                3. Peticiones dependientes simultaneas:
                {'\n'}• Con lat/lon se consulta Servicio 2 (Pronostico Meteorologico Open-Meteo).
                {'\n'}• Con el nombre normalizado se consulta Servicio 3 (Wikipedia REST API).
                {'\n'}• Con el codigo de pais se consulta Servicio 4 (Frankfurter FX).
              </Text>
              <Text style={styles.paragraph}>
                4. Composicion: Las respuestas JSON asincronas se combinan en una unica estructura de estado para renderizar en pantalla sin bloqueo de interfaz.
              </Text>

              <View style={styles.specsBox}>
                <Text style={styles.specsTitle}>Resumen de Endpoints Implementados:</Text>
                <Text style={styles.specsLine}>• API 1: https://geocoding-api.open-meteo.com/v1/search</Text>
                <Text style={styles.specsLine}>• API 2: https://api.open-meteo.com/v1/forecast</Text>
                <Text style={styles.specsLine}>• API 3: https://es.wikipedia.org/api/rest_v1/page/summary</Text>
                <Text style={styles.specsLine}>• API 4: https://api.frankfurter.app/latest</Text>
              </View>
            </View>
          )}

          {selectedTab === 'geo' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>SERVICIO 1: GEOCODIFICACION</Text>
              <Text style={styles.endpointBadge}>GET {services?.geocoding?.url}</Text>
              <Text style={styles.statusLine}>
                Estado: {services?.geocoding?.statusCode || 'N/A'} | Latencia: {services?.geocoding?.latencyMs} ms
              </Text>
              <Text style={styles.codeTitle}>Respuesta JSON Procesada / Cruda:</Text>
              <ScrollView horizontal style={styles.codeScroll}>
                <Text style={styles.codeBlock}>
                  {renderJson(services?.geocoding?.rawJson || services?.geocoding)}
                </Text>
              </ScrollView>
            </View>
          )}

          {selectedTab === 'weather' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>SERVICIO 2: METEOROLOGIA</Text>
              <Text style={styles.endpointBadge}>GET {services?.weather?.url}</Text>
              <Text style={styles.statusLine}>
                Estado: {services?.weather?.statusCode || 'N/A'} | Latencia: {services?.weather?.latencyMs} ms
              </Text>
              <Text style={styles.codeTitle}>Respuesta JSON Procesada / Cruda:</Text>
              <ScrollView horizontal style={styles.codeScroll}>
                <Text style={styles.codeBlock}>
                  {renderJson(services?.weather?.rawJson || services?.weather)}
                </Text>
              </ScrollView>
            </View>
          )}

          {selectedTab === 'wiki' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>SERVICIO 3: WIKIPEDIA REST</Text>
              <Text style={styles.endpointBadge}>GET {services?.tourism?.url}</Text>
              <Text style={styles.statusLine}>
                Estado: {services?.tourism?.statusCode || 'N/A'} | Latencia: {services?.tourism?.latencyMs} ms
              </Text>
              <Text style={styles.codeTitle}>Respuesta JSON Procesada / Cruda:</Text>
              <ScrollView horizontal style={styles.codeScroll}>
                <Text style={styles.codeBlock}>
                  {renderJson(services?.tourism?.rawJson || services?.tourism)}
                </Text>
              </ScrollView>
            </View>
          )}

          {selectedTab === 'fx' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>SERVICIO 4: FINANZAS Y DIVISAS</Text>
              <Text style={styles.endpointBadge}>GET {services?.currency?.url}</Text>
              <Text style={styles.statusLine}>
                Estado: {services?.currency?.statusCode || 'N/A'} | Latencia: {services?.currency?.latencyMs} ms
              </Text>
              <Text style={styles.codeTitle}>Respuesta JSON Procesada / Cruda:</Text>
              <ScrollView horizontal style={styles.codeScroll}>
                <Text style={styles.codeBlock}>
                  {renderJson(services?.currency?.rawJson || services?.currency)}
                </Text>
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  modalTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeBtnText: {
    color: '#F1F5F9',
    fontWeight: '800',
    fontSize: 11,
  },
  metaStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  metaItem: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingHorizontal: 8,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#38BDF8',
  },
  tabBtnText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#38BDF8',
  },
  scrollArea: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 10,
  },
  specsBox: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 10,
  },
  specsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 6,
  },
  specsLine: {
    fontSize: 11,
    color: '#E2E8F0',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  endpointBadge: {
    backgroundColor: '#1E293B',
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 11,
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusLine: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
    marginBottom: 12,
  },
  codeTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  codeScroll: {
    backgroundColor: '#050811',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 12,
  },
  codeBlock: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
});

