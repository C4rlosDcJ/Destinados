import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import {
  getDestinationImageUrl,
  getDestinationGallery,
} from '../constants/destinationImages.js';

export default function DestinationHero({
  destination,
  weather,
  tourism,
  currency,
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [imageUri, setImageUri] = useState('');
  const [gallery, setGallery] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (destination?.name) {
      const photos = getDestinationGallery(destination.name);
      setGallery(photos);
      setActivePhotoIdx(0);

      const mainUrl = getDestinationImageUrl(
        destination.name,
        tourism?.data?.thumbnailUrl,
        tourism?.data?.originalImageUrl
      );
      setImageUri(mainUrl);
    }
  }, [destination?.name, tourism?.data?.thumbnailUrl, tourism?.data?.originalImageUrl]);

  if (!destination) return null;

  const currentPhoto = gallery[activePhotoIdx] || { url: imageUri, label: destination.name };
  const currentImageUrl = currentPhoto.url || imageUri;

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;
    Linking.openURL(url).catch(() => {});
  };

  const getWeatherIconName = (code) => {
    if (code === undefined || code === null) return 'cloud';
    if (code === 0 || code === 1) return 'sun';
    if (code === 2 || code === 3) return 'cloud';
    if (code >= 51 && code <= 67) return 'cloud-rain';
    if (code >= 71 && code <= 86) return 'cloud-snow';
    if (code >= 95) return 'cloud-lightning';
    return 'cloud';
  };

  return (
    <View style={styles.container}>
      {/* Portada Fotografica de Borde a Borde sin Margenes Residuales */}
      <View style={styles.imageCardContainer}>
        {/* Capa 1: Fotografia cubriendo 100% de la tarjeta */}
        <Image
          source={{ uri: currentImageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
          onLoadStart={() => setIsImageLoading(true)}
          onLoadEnd={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false);
            const fallback = getDestinationImageUrl(destination.name);
            if (imageUri !== fallback) {
              setImageUri(fallback);
            }
          }}
        />

        {/* Capa 2: Filtro de contraste oscuro gradual */}
        <View style={styles.heroOverlay} />

        {/* Indicador de carga si la imagen tarda */}
        {isImageLoading && (
          <View style={styles.heroLoadingOverlay}>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </View>
        )}

        {/* Capa 3: Contenido con padding independiente */}
        <View style={styles.heroContent}>
          {/* Barra superior de acciones */}
          <View style={styles.topActionsRow}>
            <View style={styles.countryTag}>
              <Feather name="globe" size={10} color="#18181B" style={{ marginRight: 4 }} />
              <Text style={styles.countryTagText}>
                {destination.countryCode} • {destination.country.toUpperCase()}
              </Text>
            </View>

            <View style={styles.topRightActions}>
              {/* Indicador de foto activa */}
              <View style={styles.photoCountBadge}>
                <Feather name="camera" size={10} color="#18181B" style={{ marginRight: 4 }} />
                <Text style={styles.photoCountText}>
                  {activePhotoIdx + 1}/{gallery.length || 1}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.bookmarkBtn, isBookmarked && styles.bookmarkBtnActive]}
                onPress={() => setIsBookmarked(!isBookmarked)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={15}
                  color={isBookmarked ? '#FFFFFF' : '#18181B'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Informacion inferior y selector de fotos */}
          <View style={styles.bottomInfo}>
            <Text style={styles.cityTitle}>{destination.name}</Text>
            {destination.admin1 ? (
              <View style={styles.adminRow}>
                <Feather name="map-pin" size={11} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.adminSubtitle}>{destination.admin1}</Text>
              </View>
            ) : null}

            {/* Selector de fotografia interactivo con alto contraste */}
            {gallery.length > 1 && (
              <View style={styles.gallerySelectorRow}>
                {gallery.map((photo, idx) => (
                  <TouchableOpacity
                    key={photo.label + idx}
                    style={[
                      styles.photoDotPill,
                      activePhotoIdx === idx && styles.photoDotPillActive,
                    ]}
                    onPress={() => setActivePhotoIdx(idx)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.photoDotLabel,
                        activePhotoIdx === idx && styles.photoDotLabelActive,
                      ]}
                    >
                      {photo.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Tarjeta de Resumen Climatico y Boton a Mapas */}
      <View style={styles.summaryCard}>
        {weather?.status === 'success' && weather?.data ? (
          <View style={styles.weatherRow}>
            <View style={styles.weatherLeft}>
              <View style={styles.weatherBadgeRow}>
                <Feather
                  name={getWeatherIconName(weather.data.weatherCode)}
                  size={16}
                  color="#18181B"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.conditionText}>
                  {weather.data.conditionDescription}
                </Text>
              </View>

              <Text style={styles.weatherRange}>
                Sensacion {weather.data.apparentTemperature} • Min {weather.data.todayMin} / Max {weather.data.todayMax}
              </Text>
            </View>

            <Text style={styles.temperatureNumber}>{weather.data.temperature}</Text>
          </View>
        ) : (
          <View style={styles.noticeBox}>
            <Feather name="info" size={14} color="#71717A" style={{ marginRight: 6 }} />
            <Text style={styles.noticeText}>
              {weather?.error || 'Servicio meteorologico en mantenimiento.'}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        {/* Cifras de Geodatos con Iconos */}
        <View style={styles.factsGrid}>
          <View style={styles.factItem}>
            <View style={styles.factHeader}>
              <Feather name="compass" size={11} color="#A1A1AA" />
              <Text style={styles.factLabel}>UBICACION</Text>
            </View>
            <Text style={styles.factValue}>
              {destination.latitude.toFixed(2)}°, {destination.longitude.toFixed(2)}°
            </Text>
          </View>

          <View style={styles.factItem}>
            <View style={styles.factHeader}>
              <Feather name="layers" size={11} color="#A1A1AA" />
              <Text style={styles.factLabel}>ALTITUD</Text>
            </View>
            <Text style={styles.factValue}>{destination.elevation}</Text>
          </View>

          <View style={styles.factItem}>
            <View style={styles.factHeader}>
              <Feather name="clock" size={11} color="#A1A1AA" />
              <Text style={styles.factLabel}>ZONA HORARIA</Text>
            </View>
            <Text style={styles.factValue}>{destination.timezone}</Text>
          </View>

          <View style={styles.factItem}>
            <View style={styles.factHeader}>
              <Feather name="dollar-sign" size={11} color="#A1A1AA" />
              <Text style={styles.factLabel}>MONEDA LOCAL</Text>
            </View>
            <Text style={styles.factValueBold}>
              {currency?.data ? currency.data.rateText : 'N/D'}
            </Text>
          </View>
        </View>

        {/* Accion interactiva: Abrir en Google Maps */}
        <TouchableOpacity
          style={styles.mapsButton}
          onPress={handleOpenMaps}
          activeOpacity={0.8}
        >
          <Feather name="map" size={13} color="#18181B" style={{ marginRight: 6 }} />
          <Text style={styles.mapsButtonText}>Explorar ubicacion en Google Maps</Text>
          <Feather name="external-link" size={11} color="#71717A" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  imageCardContainer: {
    height: 285,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  heroLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 14,
  },
  countryTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: 0.8,
  },
  photoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  photoCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#18181B',
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtnActive: {
    backgroundColor: '#18181B',
  },
  bottomInfo: {
    zIndex: 2,
  },
  cityTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginBottom: 6,
  },
  adminSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.92)',
    fontWeight: '500',
  },
  gallerySelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  photoDotPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  photoDotPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  photoDotLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoDotLabelActive: {
    color: '#18181B',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: 18,
    marginTop: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flex: 1,
  },
  weatherBadgeRow: {
    flexDirection: 'row',
  },
  conditionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
  },
  weatherRange: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 3,
  },
  temperatureNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: -1,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    padding: 12,
    borderRadius: 12,
  },
  noticeText: {
    fontSize: 11,
    color: '#71717A',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F4F4F5',
    marginVertical: 14,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  factItem: {
    flex: 1,
    minWidth: '47%',
    paddingVertical: 2,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  factLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 0.6,
  },
  factValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#27272A',
    marginTop: 2,
  },
  factValueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
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
});
