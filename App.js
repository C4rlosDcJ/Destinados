import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import Header from './src/components/Header';
import SearchBar from './src/components/SearchBar';
import DestinationHero from './src/components/DestinationHero';
import WeatherCard from './src/components/WeatherCard';
import TourismCard from './src/components/TourismCard';
import GeographicCard from './src/components/GeographicCard';
import CurrencyConverterWidget from './src/components/CurrencyConverterWidget';
import DiagnosticModal from './src/components/DiagnosticModal';

import { queryIntegratedDestination } from './src/services/apiService.js';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('Tokio');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [generalError, setGeneralError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'weather' | 'tourism' | 'currency' | 'geo'
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Simulador de indisponibilidad (Parte 3)
  const [simulatedFailures, setSimulatedFailures] = useState({
    geocoding: false,
    weather: false,
    tourism: false,
    currency: false,
  });

  const executeSearch = async (cityToSearch, currentFailures = simulatedFailures) => {
    const target = (cityToSearch || searchQuery || '').trim();
    if (!target) {
      Alert.alert('Aviso', 'Ingrese una ciudad para consultar.');
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    try {
      const result = await queryIntegratedDestination(target, currentFailures);
      setApiResult(result);

      if (result.services.geocoding.status === 'error') {
        setGeneralError(result.services.geocoding.error);
      }
    } catch (err) {
      setGeneralError(`Error al procesar la informacion: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeSearch('Tokio', simulatedFailures);
  }, []);

  const hasAnyFailure = Object.values(simulatedFailures).some((v) => v);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera Superior */}
        <Header
          hasSimulatedFailures={hasAnyFailure}
          onOpenDiagnostics={() => setShowDiagnostics(true)}
        />

        {/* Buscador y Destinos Populares */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={(query) => executeSearch(query)}
          isLoading={isLoading}
        />

        {/* Segmentos de Navegacion Minimalistas */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            <TouchableOpacity
              style={[styles.tabChip, activeTab === 'all' && styles.tabChipActive]}
              onPress={() => setActiveTab('all')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                Todo el viaje
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabChip, activeTab === 'weather' && styles.tabChipActive]}
              onPress={() => setActiveTab('weather')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'weather' && styles.tabTextActive]}>
                Tiempo y clima
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabChip, activeTab === 'tourism' && styles.tabChipActive]}
              onPress={() => setActiveTab('tourism')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'tourism' && styles.tabTextActive]}>
                Cultura e historia
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabChip, activeTab === 'currency' && styles.tabChipActive]}
              onPress={() => setActiveTab('currency')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'currency' && styles.tabTextActive]}>
                Divisas y gastos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabChip, activeTab === 'geo' && styles.tabChipActive]}
              onPress={() => setActiveTab('geo')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'geo' && styles.tabTextActive]}>
                Ficha territorial
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Estado de Carga */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#18181B" />
            <Text style={styles.loadingText}>Sincronizando servicios de viaje...</Text>
          </View>
        )}

        {/* Aviso de Error en Resolucion */}
        {generalError && !isLoading && (
          <View style={styles.errorNotice}>
            <Text style={styles.errorNoticeTitle}>Destino no localizado</Text>
            <Text style={styles.errorNoticeDesc}>{generalError}</Text>
            <TouchableOpacity
              style={styles.retryAction}
              onPress={() => executeSearch(searchQuery)}
            >
              <Text style={styles.retryActionText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contenido Principal */}
        {!isLoading && apiResult && apiResult.services.geocoding.data && (
          <View>
            {(activeTab === 'all' || activeTab === 'weather') && (
              <DestinationHero
                destination={apiResult.services.geocoding.data}
                weather={apiResult.services.weather}
                tourism={apiResult.services.tourism}
                currency={apiResult.services.currency}
              />
            )}

            {(activeTab === 'all' || activeTab === 'currency') && (
              <CurrencyConverterWidget
                currencyService={apiResult.services.currency}
              />
            )}

            {(activeTab === 'all' || activeTab === 'weather') && (
              <WeatherCard weatherService={apiResult.services.weather} />
            )}

            {(activeTab === 'all' || activeTab === 'tourism') && (
              <TourismCard
                tourismService={apiResult.services.tourism}
                destinationName={apiResult.services.geocoding.data?.name}
              />
            )}

            {(activeTab === 'all' || activeTab === 'geo') && (
              <GeographicCard geoService={apiResult.services.geocoding} />
            )}
          </View>
        )}

        {/* Pie de Pagina Editorial */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setShowDiagnostics(true)}>
            <Text style={styles.footerAction}>Ver diagnostico de red y APIs</Text>
          </TouchableOpacity>
          <Text style={styles.footerCopyright}>
            Actividad 19 • R. Vinicio Camacho • Integracion de servicios en la nube
          </Text>
        </View>
      </ScrollView>

      {/* Modal Auditor Tecnico */}
      <DiagnosticModal
        visible={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
        apiData={apiResult}
        failures={simulatedFailures}
        setFailures={setSimulatedFailures}
        onApplyFailures={(updated) => executeSearch(searchQuery, updated)}
        onTestCity={(city) => {
          setSearchQuery(city);
          executeSearch(city);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FBFBFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabsWrapper: {
    paddingVertical: 10,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  tabChipActive: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
    marginTop: 8,
  },
  errorNotice: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
  },
  errorNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  errorNoticeDesc: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
    lineHeight: 17,
  },
  retryAction: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  retryActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
  },
  footerAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#18181B',
    textDecorationLine: 'underline',
  },
  footerCopyright: {
    fontSize: 11,
    color: '#A1A1AA',
    textAlign: 'center',
  },
});
