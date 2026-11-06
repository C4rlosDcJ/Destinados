import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const PRESET_AMOUNTS = [25, 50, 100, 500];

export default function CurrencyConverterWidget({ currencyService }) {
  const [usdAmount, setUsdAmount] = useState('100');

  if (!currencyService) return null;

  const isError = currencyService.status === 'error';
  const data = currencyService.data;
  const rate = data?.rateValue || 1.0;
  const numUsd = parseFloat(usdAmount) || 0;
  const convertedValue = (numUsd * rate).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Feather name="credit-card" size={16} color="#18181B" style={{ marginRight: 6 }} />
            <Text style={styles.title}>Conversion y presupuesto</Text>
          </View>
          <Text style={styles.eyebrow}>TASA BANCARIA OFICIAL</Text>
        </View>

        {isError ? (
          <View style={styles.noticeBox}>
            <Feather name="alert-circle" size={14} color="#71717A" style={{ marginRight: 6 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Cotizacion no disponible</Text>
              <Text style={styles.noticeText}>{currencyService.error}</Text>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.rateSummary}>
              <View style={styles.currencyBadgeGroup}>
                <View style={styles.symbolCircle}>
                  <Text style={styles.symbolText}>{data.currencySymbol || '$'}</Text>
                </View>
                <View>
                  <Text style={styles.currencyName}>{data.currencyName}</Text>
                  <Text style={styles.currencySub}>{data.currencyCode}</Text>
                </View>
              </View>

              <View style={styles.ratePill}>
                <Feather name="trending-up" size={11} color="#18181B" style={{ marginRight: 4 }} />
                <Text style={styles.rateText}>1 USD = {data.rateText}</Text>
              </View>
            </View>

            {/* Input Interactivo */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CANTIDAD EN DOLARES (USD)</Text>
              <View style={styles.inputRow}>
                <Feather name="dollar-sign" size={16} color="#71717A" style={{ marginRight: 4 }} />
                <TextInput
                  style={styles.inputField}
                  keyboardType="numeric"
                  value={usdAmount}
                  onChangeText={setUsdAmount}
                  placeholder="100"
                  placeholderTextColor="#A1A1AA"
                />
              </View>

              <View style={styles.presetsRow}>
                {PRESET_AMOUNTS.map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.presetChip,
                      usdAmount === val.toString() && styles.presetChipActive,
                    ]}
                    onPress={() => setUsdAmount(val.toString())}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        usdAmount === val.toString() && styles.presetTextActive,
                      ]}
                    >
                      ${val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Total Convertido */}
            <View style={styles.resultBox}>
              <View style={styles.resultHeaderRow}>
                <Feather name="repeat" size={12} color="#71717A" style={{ marginRight: 4 }} />
                <Text style={styles.resultLabel}>TOTAL EN MONEDA LOCAL</Text>
              </View>
              <Text style={styles.resultNumber}>
                {convertedValue} {data.currencyCode}
              </Text>
              <Text style={styles.resultFootnote}>
                Calculado con cotizacion oficial del Banco Central Europeo ({data.date})
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
    marginBottom: 14,
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
  rateSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  currencyBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbolCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#18181B',
  },
  currencyName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27272A',
  },
  currencySub: {
    fontSize: 10,
    color: '#A1A1AA',
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#18181B',
  },
  inputContainer: {
    marginTop: 14,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  inputField: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#18181B',
    paddingVertical: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: '#18181B',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#52525B',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  resultBox: {
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 0.8,
  },
  resultNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: '#18181B',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  resultFootnote: {
    fontSize: 11,
    color: '#A1A1AA',
    marginTop: 4,
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
