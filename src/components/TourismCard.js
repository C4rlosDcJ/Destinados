import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getDestinationGallery } from '../constants/destinationImages.js';

export default function TourismCard({ tourismService, destinationName }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!tourismService) return null;

  const isError = tourismService.status === 'error';
  const isSkipped = tourismService.status === 'skipped';
  const data = tourismService.data;

  const handleOpenLink = () => {
    if (data?.pageUrl) {
      Linking.openURL(data.pageUrl).catch(() => {});
    }
  };

  const fullExtract = data?.extract || '';
  const displayExtract = isExpanded || fullExtract.length < 240
    ? fullExtract
    : fullExtract.substring(0, 240) + '...';

  const photos = getDestinationGallery(destinationName || data?.title);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Feather name="book-open" size={16} color="#18181B" style={{ marginRight: 6 }} />
            <Text style={styles.title}>Historia y cultura</Text>
          </View>
          <View style={styles.readingTimePill}>
            <Feather name="clock" size={10} color="#71717A" style={{ marginRight: 4 }} />
            <Text style={styles.readingTime}>{data?.readingMinutes || 2} min</Text>
          </View>
        </View>

        {isError || isSkipped ? (
          <View style={styles.noticeBox}>
            <Feather name="alert-circle" size={14} color="#71717A" style={{ marginRight: 6 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Reseña cultural no disponible</Text>
              <Text style={styles.noticeText}>
                {tourismService.error || 'El servicio enciclopedico no responde temporalmente.'}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.descriptionText}>{data.description}</Text>

            {/* Galeria de Fotos y Lugares Iconicos de Referencia */}
            {photos && photos.length > 0 && (
              <View style={styles.gallerySection}>
                <View style={styles.galleryHeader}>
                  <Feather name="camera" size={12} color="#71717A" style={{ marginRight: 5 }} />
                  <Text style={styles.galleryTitle}>Postales de referencia turistica</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryScroll}
                >
                  {photos.map((item, idx) => (
                    <View key={item.label + idx} style={styles.photoItemCard}>
                      <Image
                        source={{ uri: item.url }}
                        style={styles.photoItemImage}
                        resizeMode="cover"
                      />
                      <View style={styles.photoItemOverlay} />
                      <View style={styles.photoItemContent}>
                        <Text style={styles.photoItemLabel}>{item.label}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.extractParagraph}>{displayExtract}</Text>

            {fullExtract.length >= 240 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
              >
                <Text style={styles.expandText}>
                  {isExpanded ? 'Mostrar menos' : 'Leer reseña completa'}
                </Text>
                <Feather
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={13}
                  color="#18181B"
                  style={{ marginLeft: 3 }}
                />
              </TouchableOpacity>
            )}

            {data.pageUrl && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleOpenLink}
                activeOpacity={0.8}
              >
                <Text style={styles.linkText}>Consultar articulo en Wikipedia</Text>
                <Feather name="external-link" size={12} color="#18181B" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}

            <View style={styles.footnote}>
              <Text style={styles.footnoteText}>
                Wikimedia REST API • Contenido enciclopedico de libre acceso
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
  readingTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  readingTime: {
    fontSize: 11,
    color: '#71717A',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#52525B',
    textTransform: 'capitalize',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  gallerySection: {
    marginTop: 14,
    marginBottom: 10,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  galleryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 0.2,
  },
  galleryScroll: {
    gap: 10,
    paddingBottom: 4,
  },
  photoItemCard: {
    width: 140,
    height: 95,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E4E4E7',
  },
  photoItemImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  photoItemOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  photoItemContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 8,
    zIndex: 2,
  },
  photoItemLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  extractParagraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#3F3F46',
    marginTop: 10,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
  },
  expandText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F5',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F4F4F5',
    padding: 14,
    borderRadius: 14,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
  },
  noticeText: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 2,
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
    textAlign: 'center',
  },
});
