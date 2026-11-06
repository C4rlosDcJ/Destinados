import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function WeatherCard({ weatherService }) {
  if (!weatherService) return null;

  const isError = weatherService.status === 'error';
  const isSkipped = weatherService.status === 'skipped';
  const data = weatherService.data;

  const getForecastIcon = (conditionStr) => {
    const c = (conditionStr || '').toLowerCase();
    if (c.includes('despejado')) return 'sun';
    if (c.includes('nublado')) return 'cloud';
    if (c.includes('lluvia') || c.includes('chubascos') || c.includes('llovizna')) return 'cloud-rain';
    if (c.includes('nieve')) return 'cloud-snow';
    if (c.includes('tormenta')) return 'cloud-lightning';
    return 'cloud';
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Feather name="cloud" size={16} color="#18181B" style={{ marginRight: 6 }} />
            <Text style={styles.title}>Meteorologia y pronostico</Text>
          </View>
          <Text style={styles.eyebrow}>ACTUALIZADO EN TIEMPO REAL</Text>
        </View>

        {isError || isSkipped ? (
          <View style={styles.noticeBox}>
            <Feather name="alert-circle" size={14} color="#71717A" style={{ marginRight: 6 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>
                {isSkipped ? 'Pronostico no disponible' : 'Servicio meteorologico fuera de linea'}
              </Text>
              <Text style={styles.noticeText}>
                {weatherService.error || 'La aplicacion continua operativa con los demas servicios activos.'}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {/* Metricas Rapidas con Iconos SVG Feather */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Feather name="droplet" size={14} color="#71717A" />
                <Text style={styles.metricLabel}>HUMEDAD</Text>
                <Text style={styles.metricValue}>{data.humidity}</Text>
              </View>

              <View style={styles.metricCard}>
                <Feather name="wind" size={14} color="#71717A" />
                <Text style={styles.metricLabel}>VIENTO</Text>
                <Text style={styles.metricValue}>{data.windSpeed}</Text>
              </View>

              <View style={styles.metricCard}>
                <Feather name="thermometer" size={14} color="#71717A" />
                <Text style={styles.metricLabel}>SENSACION</Text>
                <Text style={styles.metricValue}>{data.apparentTemperature}</Text>
              </View>

              <View style={styles.metricCard}>
                <Feather name="cloud-rain" size={14} color="#71717A" />
                <Text style={styles.metricLabel}>LLUVIA</Text>
                <Text style={styles.metricValue}>{data.precipitation}</Text>
              </View>
            </View>

            {/* Pronostico a 7 dias con iconos vectoriales */}
            {data.dailyForecast && data.dailyForecast.length > 0 && (
              <View style={styles.forecastSection}>
                <View style={styles.forecastHeaderRow}>
                  <Feather name="calendar" size={13} color="#71717A" style={{ marginRight: 5 }} />
                  <Text style={styles.forecastSectionTitle}>Proximos 7 dias</Text>
                </View>

                <View style={styles.forecastList}>
                  {data.dailyForecast.map((item, idx) => (
                    <View key={idx} style={styles.dayRow}>
                      <Text style={styles.dayName}>{item.dayLabel}</Text>
                      <View style={styles.dayConditionGroup}>
                        <Feather
                          name={getForecastIcon(item.condition)}
                          size={13}
                          color="#71717A"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.dayCondition}>{item.condition}</Text>
                      </View>

                      <View style={styles.tempRangeWrapper}>
                        <Text style={styles.tempMin}>{item.tempMin}</Text>
                        <View style={styles.barTrack}>
                          <View style={styles.barFill} />
                        </View>
                        <Text style={styles.tempMax}>{item.tempMax}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.footnote}>
              <Text style={styles.footnoteText}>
                Open-Meteo Weather Forecast • Consulta segura HTTPS
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
    marginBottom: 16,
  },
  headerTitleRow: {
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
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
    marginTop: 2,
  },
  forecastSection: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  forecastHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  forecastSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  forecastList: {
    gap: 10,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  dayName: {
    width: 76,
    fontSize: 13,
    fontWeight: '600',
    color: '#27272A',
  },
  dayConditionGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  dayCondition: {
    fontSize: 12,
    color: '#71717A',
  },
  tempRangeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tempMin: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A1A1AA',
    width: 24,
    textAlign: 'right',
  },
  barTrack: {
    width: 50,
    height: 4,
    backgroundColor: '#E4E4E7',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#71717A',
    borderRadius: 2,
  },
  tempMax: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
    width: 24,
  },
  footnote: {
    marginTop: 16,
    paddingTop: 12,
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
