import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const POPULAR_DESTINATIONS = [
  {
    name: 'Tokio',
    country: 'Japon',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
    tag: 'Metropoli',
  },
  {
    name: 'París',
    country: 'Francia',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
    tag: 'Cultura',
  },
  {
    name: 'Cancún',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=400&q=80',
    tag: 'Caribe',
  },
  {
    name: 'Roma',
    country: 'Italia',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80',
    tag: 'Historia',
  },
  {
    name: 'Nueva York',
    country: 'EE.UU.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80',
    tag: 'Iconico',
  },
  {
    name: 'Madrid',
    country: 'Espana',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=400&q=80',
    tag: 'Arte',
  },
  {
    name: 'Londres',
    country: 'Reino Unido',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80',
    tag: 'Capital',
  },
  {
    name: 'Kioto',
    country: 'Japon',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
    tag: 'Tradicion',
  },
  {
    name: 'El Cairo',
    country: 'Egipto',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=400&q=80',
    tag: 'Piramides',
  },
  {
    name: 'Oaxaca',
    country: 'Mexico',
    image: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?auto=format&fit=crop&w=400&q=80',
    tag: 'Gastronomia',
  },
];

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
  isLoading,
}) {
  return (
    <View style={styles.container}>
      {/* Barra de busqueda estilo Airbnb */}
      <View style={styles.searchBar}>
        <Feather name="search" size={17} color="#71717A" style={styles.searchIcon} />

        <TextInput
          style={styles.input}
          placeholder="Buscar ciudad o destino turistico..."
          placeholderTextColor="#A1A1AA"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => onSearch(searchQuery)}
          returnKeyType="search"
          editable={!isLoading}
          autoCapitalize="words"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setSearchQuery('')}
            disabled={isLoading}
          >
            <Feather name="x" size={14} color="#71717A" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.searchActionBtn, isLoading && styles.searchActionBtnDisabled]}
          onPress={() => onSearch(searchQuery)}
          disabled={isLoading || !searchQuery.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.searchActionText}>
            {isLoading ? 'Buscando' : 'Buscar'}
          </Text>
          <Feather name="arrow-right" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Titulo del carrusel con imagenes */}
      <View style={styles.carouselHeader}>
        <Text style={styles.carouselTitle}>Destinos destacados</Text>
        <Text style={styles.carouselSub}>Toca para explorar</Text>
      </View>

      {/* Carrusel de destinos con fotografia real ajustada de borde a borde */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselScroll}
      >
        {POPULAR_DESTINATIONS.map((dest) => {
          const isSelected =
            searchQuery.toLowerCase().trim() === dest.name.toLowerCase().trim();
          return (
            <TouchableOpacity
              key={dest.name}
              style={[styles.destCard, isSelected && styles.destCardSelected]}
              onPress={() => {
                setSearchQuery(dest.name);
                onSearch(dest.name);
              }}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {/* Capa 1: Fotografia cubriendo 100% de la tarjeta sin bordes grises */}
              <Image
                source={{ uri: dest.image }}
                style={styles.destImage}
                resizeMode="cover"
              />

              {/* Capa 2: Filtro de contraste oscuro para legibilidad */}
              <View style={styles.destOverlay} />

              {/* Capa 3: Contenido con padding independiente */}
              <View style={styles.destContent}>
                <View style={styles.destTagPill}>
                  <Text style={styles.destTagText}>{dest.tag}</Text>
                </View>

                <View style={styles.destInfo}>
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destCountry}>{dest.country}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
    backgroundColor: '#FBFBFC',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#18181B',
    fontWeight: '500',
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 6,
    marginRight: 4,
  },
  searchActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#18181B',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
  },
  searchActionBtnDisabled: {
    backgroundColor: '#A1A1AA',
  },
  searchActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.2,
  },
  carouselSub: {
    fontSize: 11,
    color: '#71717A',
    fontWeight: '500',
  },
  carouselScroll: {
    gap: 12,
    paddingBottom: 6,
  },
  destCard: {
    width: 128,
    height: 154,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E4E4E7',
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  destCardSelected: {
    borderColor: '#18181B',
    transform: [{ scale: 1.02 }],
  },
  destImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  destOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
  destContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    padding: 10,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  destTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  destTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#18181B',
  },
  destInfo: {
    paddingBottom: 2,
  },
  destName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  destCountry: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.88)',
    fontWeight: '500',
    marginTop: 1,
  },
});
