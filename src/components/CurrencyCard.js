import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CurrencyCard({ currencyService }) {
  if (!currencyService) return null;

  const isError = currencyService.status === 'error';
  const isSkipped = currencyService.status === 'skipped';
  const data = currencyService.data;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.serviceTag}>SERVICIO COMPLEMENTARIO / 4</Text>
          <Text style={styles.title}>FINANZAS Y MONEDA DE DESTINO</Text>
        </View>
        <Text
          style={[
            styles.statusBadge,
            isError
              ? styles.statusError
              : isSkipped
              ? styles.statusSkipped
              : styles.statusSuccess,
          ]}
        >
          {isError ? '[FALLO]' : isSkipped ? '[OMITIDO]' : '[CONECTADO]'}
        </Text>
      </View>

      <Text style={styles.endpointText}>
        Endpoint: {currencyService.url || 'https://api.frankfurter.app/latest?from=USD'}
      </Text>

      {isError || isSkipped ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            {isSkipped ? 'SERVICIO NO EJECUTADO:' : 'ERROR DE CONSULTA FINANCIERA:'}
          </Text>
          <Text style={styles.errorMessage}>{currencyService.error}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Moneda Oficial:</Text>
            <Text style={styles.value}>{data.currencyName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Codigo ISO y Simbolo:</Text>
            <Text style={styles.value}>
              {data.currencyCode} ({data.currencySymbol})
            </Text>
          </View>

          <View style={styles.conversionBox}>
            <Text style={styles.conversionLabel}>TASA DE CAMBIO DE REFERENCIA:</Text>
            <Text style={styles.conversionRate}>
              1.00 USD = {data.rateText}
            </Text>
            {data.rateValue && (
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Text style={styles.exampleTitle}>20 USD equivalen a:</Text>
                  <Text style={styles.exampleVal}>
                    {(data.rateValue * 20).toFixed(2)} {data.currencyCode}
                  </Text>
                </View>
                <View style={styles.exampleItem}>
                  <Text style={styles.exampleTitle}>100 USD equivalen a:</Text>
                  <Text style={styles.exampleVal}>
                    {(data.rateValue * 100).toFixed(2)} {data.currencyCode}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              Cotizacion actualizada provista por el servicio publico de Frankfurter BCE para planeacion de presupuesto turistico.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  serviceTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusSuccess: {
    color: '#10B981',
    backgroundColor: '#064E3B',
  },
  statusError: {
    color: '#EF4444',
    backgroundColor: '#450A0A',
  },
  statusSkipped: {
    color: '#F59E0B',
    backgroundColor: '#331B00',
  },
  endpointText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  content: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  label: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  value: {
    fontSize: 12,
    color: '#F1F5F9',
    fontWeight: '700',
  },
  conversionBox: {
    marginTop: 10,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  conversionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  conversionRate: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 4,
  },
  examplesGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  exampleItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 6,
  },
  exampleTitle: {
    fontSize: 9,
    color: '#94A3B8',
  },
  exampleVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
  },
  footerNote: {
    marginTop: 10,
  },
  footerNoteText: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic',
  },
  errorBox: {
    backgroundColor: '#450A0A',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FCA5A5',
  },
  errorMessage: {
    fontSize: 11,
    color: '#FECACA',
    marginTop: 4,
  },
});

