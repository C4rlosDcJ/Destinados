import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function GeographicCard({ geoService }) {
  if (!geoService) return null;

  const isError = geoService.status === 'error';
  const data = geoService.data;

  const handleOpenMaps = () => {
    if (data?.latitude && data?.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Feather name="globe" size={16} color="#18181B" style={{ marginRight: 6 }} />
            <Text style={styles.title}>Ficha del territorio</Text>
          </View>
          <Text style={styles.eyebrow}>GEOCODIFICACION</Text>
        </View>

        {isError ? (
          <View style={styles.noticeBox}>
            <Feather name="alert-circle" size={14} color="#71717A" style={{ marginRight: 6 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Ubicacion no encontrada</Text>
              <Text style={styles.noticeText}>{geoService.error}</Text>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.factsList}>
              <View style={styles.factRow}>
                <View style={styles.labelCol}>
                  <Feather name="map-pin" size={12} color="#71717A" style={{ marginRight: 6 }} />
                  <Text style={styles.factLabel}>Nombre oficial</Text>
                </View>
                <Text style={styles.factValue}>{data.name}</Text>
              </View>

              <View style={styles.factRow}>
                <View style={styles.labelCol}>
                  <Feather name="flag" size={12} color="#71717A" style={{ marginRight: 6 }} />
                  <Text style={styles.factLabel}>Pais</Text>
                </View>
                <Text style={styles.factValue}>{data.country} ({data.countryCode})</Text>
              </View>

              <View style={styles.factRow}>
                <View style={styles.labelCol}>
                  <Feather name="compass" size={12} color="#71717A" style={{ marginRight: 6 }} />
                  <Text style={styles.factLabel}>Coordenadas</Text>
                </View>
                <Text style={styles.factValue}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</Text>
              </View>

              <View style={styles.factRow}>
                <View style={styles.labelCol}>
                  <Feather name="layers" size={12} color="#71717A" style={{ marginRight: 6 }} />
                  <Text style={styles.factLabel}>Altitud</Text>
                </View>
                <Text style={styles.factValue}>{data.elevation}</Text>
              </View>

              <View style={styles.factRow}>
                <View style={styles.labelCol}>
                  <Feather name="clock" size={12} color="#71717A" style={{ marginRight: 6 }} />
                  <Text style={styles.factLabel}>Zona horaria</Text>
                </View>
                <Text style={styles.factValue}>{data.timezone}</Text>
              </View>

              <View style={[styles.factRow, { borderBottomWidth: 0 }]}>
                <View style={styles.labelCol}>
                  <Feather name="users" size={12} color="#71717A" style={{ marginRight: 6 }} />
                  <Text style={styles.factLabel}>Poblacion censada</Text>
                </View>
                <Text style={styles.factValue}>{data.population} hab.</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.mapsButton}
              onPress={handleOpenMaps}
              activeOpacity={0.8}
            >
              <Feather name="map" size={13} color="#18181B" style={{ marginRight: 6 }} />
              <Text style={styles.mapsButtonText}>Ver coordenadas en Google Maps</Text>
              <Feather name="external-link" size={11} color="#71717A" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <View style={styles.footnote}>
              <Text style={styles.footnoteText}>
                Open-Meteo Geocoding API • Base satelital para alimentacion meteorologica
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.3,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 0.6,
  },
  factsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factLabel: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '500',
  },
  factValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F5',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  mapsButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  footnote: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  footnoteText: {
    fontSize: 10,
    color: '#A1A1AA',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    padding: 14,
    borderRadius: 12,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3F3F46',
  },
  noticeText: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
  },
});
