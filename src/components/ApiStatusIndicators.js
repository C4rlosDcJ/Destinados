import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ApiStatusIndicators({ services, totalLatencyMs }) {
  if (!services) return null;

  const getStatusBadge = (svc) => {
    if (!svc) return { text: '[SIN CONSULTA]', color: '#64748B', bg: '#1E293B' };
    if (svc.status === 'success') {
      return {
        text: `[200 OK | ${svc.latencyMs}ms]`,
        color: '#10B981',
        bg: '#064E3B',
      };
    }
    if (svc.status === 'error') {
      return {
        text: `[ERROR ${svc.statusCode || 'FAIL'} | ${svc.latencyMs || 0}ms]`,
        color: '#EF4444',
        bg: '#450A0A',
      };
    }
    if (svc.status === 'skipped') {
      return {
        text: '[OMITIDA]',
        color: '#F59E0B',
        bg: '#331B00',
      };
    }
    return { text: '[PROCESANDO]', color: '#38BDF8', bg: '#082F49' };
  };

  const geoBadge = getStatusBadge(services.geocoding);
  const weatherBadge = getStatusBadge(services.weather);
  const tourismBadge = getStatusBadge(services.tourism);
  const currencyBadge = getStatusBadge(services.currency);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>ESTADO DE INTEGRACION DE SERVICIOS:</Text>
        {totalLatencyMs !== undefined && (
          <Text style={styles.totalLatency}>
            Latencia Total: {totalLatencyMs} ms
          </Text>
        )}
      </View>

      <View style={styles.badgesRow}>
        <View style={[styles.badge, { backgroundColor: geoBadge.bg }]}>
          <Text style={styles.badgeName}>API 1 (Geocod.)</Text>
          <Text style={[styles.badgeStatus, { color: geoBadge.color }]}>
            {geoBadge.text}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: weatherBadge.bg }]}>
          <Text style={styles.badgeName}>API 2 (Clima)</Text>
          <Text style={[styles.badgeStatus, { color: weatherBadge.color }]}>
            {weatherBadge.text}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: tourismBadge.bg }]}>
          <Text style={styles.badgeName}>API 3 (Wiki)</Text>
          <Text style={[styles.badgeStatus, { color: tourismBadge.color }]}>
            {tourismBadge.text}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: currencyBadge.bg }]}>
          <Text style={styles.badgeName}>API 4 (Divisas)</Text>
          <Text style={[styles.badgeStatus, { color: currencyBadge.color }]}>
            {currencyBadge.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  totalLatency: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 2,
  },
  badgeStatus: {
    fontSize: 8,
    fontWeight: '800',
  },
});

