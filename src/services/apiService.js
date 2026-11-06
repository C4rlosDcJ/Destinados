// Servicio de Integracion Multi-API para Destinos Turisticos
// Cumplimiento estricto: Protocolo seguro HTTPS en todos los endpoints, sin emoticonos ni emojis.

import { getWeatherInfo } from '../constants/wmoWeatherCodes.js';
import { getCurrencyForCountry } from '../constants/currencies.js';

const USER_AGENT_HEADER = 'ViajeroSmart-Client/2.0 (academic-testing@university.edu)';

/**
 * API 1: Open-Meteo Geocoding API
 * Obtiene coordenadas geograficas, pais, codigo ISO, elevacion y zona horaria.
 */
export async function fetchGeocoding(cityName, simulateFailure = false) {
  const startTime = Date.now();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=es&format=json`;

  if (simulateFailure) {
    await new Promise((res) => setTimeout(res, 400));
    return {
      service: 'Geocodificacion (Open-Meteo Geocoding)',
      status: 'error',
      statusCode: 503,
      latencyMs: Date.now() - startTime,
      url,
      error: 'Servicio de geocodificacion no disponible (Falla simulada: Error 503 Service Unavailable)',
      data: null,
    };
  }

  try {
    const response = await fetch(url);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (!json.results || json.results.length === 0) {
      return {
        service: 'Geocodificacion (Open-Meteo Geocoding)',
        status: 'error',
        statusCode: 404,
        latencyMs,
        url,
        error: `No se encontraron resultados para el destino: "${cityName}". Verifique la ortografia.`,
        data: null,
      };
    }

    const primary = json.results[0];
    const normalizedData = {
      id: primary.id,
      name: primary.name,
      country: primary.country || 'Desconocido',
      countryCode: (primary.country_code || '').toUpperCase(),
      latitude: primary.latitude,
      longitude: primary.longitude,
      elevation: primary.elevation !== undefined ? `${primary.elevation} m` : 'N/D',
      elevationValue: primary.elevation || 0,
      timezone: primary.timezone || 'UTC',
      admin1: primary.admin1 || '',
      population: primary.population ? primary.population.toLocaleString('es-MX') : 'No registrado',
      populationNumber: primary.population || 0,
      allCandidates: json.results.map((r) => ({
        name: r.name,
        admin1: r.admin1,
        country: r.country,
        lat: r.latitude,
        lon: r.longitude,
      })),
    };

    return {
      service: 'Geocodificacion (Open-Meteo Geocoding)',
      status: 'success',
      statusCode: 200,
      latencyMs,
      url,
      data: normalizedData,
      rawJson: json,
    };
  } catch (err) {
    return {
      service: 'Geocodificacion (Open-Meteo Geocoding)',
      status: 'error',
      statusCode: 500,
      latencyMs: Date.now() - startTime,
      url,
      error: `Fallo de conexion en Geocodificacion: ${err.message}`,
      data: null,
    };
  }
}

/**
 * API 2: Open-Meteo Weather Forecast API
 * Obtiene condiciones meteorologicas actuales y pronostico extendido a 7 dias usando latitud y longitud.
 */
export async function fetchWeather(latitude, longitude, simulateFailure = false) {
  const startTime = Date.now();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

  if (simulateFailure) {
    await new Promise((res) => setTimeout(res, 400));
    return {
      service: 'Meteorologia (Open-Meteo Forecast)',
      status: 'error',
      statusCode: 503,
      latencyMs: Date.now() - startTime,
      url,
      error: 'Servicio meteorologico fuera de linea (Falla simulada: Error 503 Service Unavailable)',
      data: null,
    };
  }

  try {
    const response = await fetch(url);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    const current = json.current || {};
    const daily = json.daily || {};
    const weatherInfo = getWeatherInfo(current.weather_code);

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

    const normalizedData = {
      temperature: current.temperature_2m !== undefined ? `${Math.round(current.temperature_2m)}°C` : 'N/D',
      temperatureRaw: current.temperature_2m,
      apparentTemperature: current.apparent_temperature !== undefined ? `${Math.round(current.apparent_temperature)}°C` : 'N/D',
      humidity: current.relative_humidity_2m !== undefined ? `${current.relative_humidity_2m}%` : 'N/D',
      windSpeed: current.wind_speed_10m !== undefined ? `${current.wind_speed_10m} km/h` : 'N/D',
      precipitation: current.precipitation !== undefined ? `${current.precipitation} mm` : '0 mm',
      isDay: current.is_day === 1 ? 'Dia' : 'Noche',
      weatherCode: current.weather_code,
      conditionDescription: weatherInfo.description,
      conditionCategory: weatherInfo.category,
      todayMax: daily.temperature_2m_max ? `${Math.round(daily.temperature_2m_max[0])}°` : '--',
      todayMin: daily.temperature_2m_min ? `${Math.round(daily.temperature_2m_min[0])}°` : '--',
      dailyForecast: (daily.time || []).map((dateStr, idx) => {
        const d = new Date(dateStr + 'T12:00:00');
        const dayLabel = idx === 0 ? 'Hoy' : dayNames[d.getDay()];
        const code = daily.weather_code ? daily.weather_code[idx] : 0;
        return {
          date: dateStr,
          dayLabel,
          tempMax: daily.temperature_2m_max ? `${Math.round(daily.temperature_2m_max[idx])}°` : '--',
          tempMin: daily.temperature_2m_min ? `${Math.round(daily.temperature_2m_min[idx])}°` : '--',
          precipSum: daily.precipitation_sum ? `${daily.precipitation_sum[idx]} mm` : '0 mm',
          condition: getWeatherInfo(code).category,
          conditionDesc: getWeatherInfo(code).description,
        };
      }),
    };

    return {
      service: 'Meteorologia (Open-Meteo Forecast)',
      status: 'success',
      statusCode: 200,
      latencyMs,
      url,
      data: normalizedData,
      rawJson: json,
    };
  } catch (err) {
    return {
      service: 'Meteorologia (Open-Meteo Forecast)',
      status: 'error',
      statusCode: 500,
      latencyMs: Date.now() - startTime,
      url,
      error: `Error al consultar servicio meteorologico: ${err.message}`,
      data: null,
    };
  }
}

/**
 * API 3: Wikipedia REST API
 * Obtiene informacion cultural, reseña historica/turistica e imagen del destino.
 */
export async function fetchTourismGuide(cityName, simulateFailure = false) {
  const startTime = Date.now();
  const urlEs = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;

  if (simulateFailure) {
    await new Promise((res) => setTimeout(res, 400));
    return {
      service: 'Guia Cultural y Turistica (Wikipedia REST)',
      status: 'error',
      statusCode: 503,
      latencyMs: Date.now() - startTime,
      url: urlEs,
      error: 'Servicio enciclopedico fuera de linea (Falla simulada: Error 503 Service Unavailable)',
      data: null,
    };
  }

  try {
    let response = await fetch(urlEs, {
      headers: { 'User-Agent': USER_AGENT_HEADER },
    });

    let currentUrl = urlEs;
    if (response.status === 404) {
      currentUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
      response = await fetch(currentUrl, {
        headers: { 'User-Agent': USER_AGENT_HEADER },
      });
    }

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: Destino no encontrado en la enciclopedia`);
    }

    const json = await response.json();

    const normalizedData = {
      title: json.title || cityName,
      description: json.description || 'Destino turistico internacional',
      extract: json.extract || 'Informacion turistica y cultural en proceso de expansion.',
      thumbnailUrl: json.thumbnail ? json.thumbnail.source : null,
      originalImageUrl: json.originalimage ? json.originalimage.source : null,
      pageUrl: json.content_urls && json.content_urls.desktop ? json.content_urls.desktop.page : null,
      readingMinutes: Math.max(1, Math.round((json.extract || '').split(' ').length / 150)),
    };

    return {
      service: 'Guia Cultural y Turistica (Wikipedia REST)',
      status: 'success',
      statusCode: 200,
      latencyMs,
      url: currentUrl,
      data: normalizedData,
      rawJson: json,
    };
  } catch (err) {
    return {
      service: 'Guia Cultural y Turistica (Wikipedia REST)',
      status: 'error',
      statusCode: 500,
      latencyMs: Date.now() - startTime,
      url: urlEs,
      error: `Error al consultar informacion turistica: ${err.message}`,
      data: null,
    };
  }
}

/**
 * API 4: Frankfurter Currency Exchange API (Servicio complementario financiero para turistas)
 * Obtiene el tipo de cambio oficial de la moneda local respecto al Dolar Estadounidense.
 */
export async function fetchExchangeRate(countryCode, simulateFailure = false) {
  const startTime = Date.now();
  const currencyInfo = getCurrencyForCountry(countryCode);
  const url = 'https://api.frankfurter.app/latest?from=USD';

  if (simulateFailure) {
    await new Promise((res) => setTimeout(res, 400));
    return {
      service: 'Finanzas Turisticas (Frankfurter FX)',
      status: 'error',
      statusCode: 503,
      latencyMs: Date.now() - startTime,
      url,
      error: 'Servicio de divisas fuera de linea (Falla simulada: Error 503 Service Unavailable)',
      data: null,
    };
  }

  try {
    const response = await fetch(url);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const json = await response.json();
    const rate = json.rates ? json.rates[currencyInfo.code] : null;

    const normalizedData = {
      currencyName: currencyInfo.name,
      currencyCode: currencyInfo.code,
      currencySymbol: currencyInfo.symbol,
      usdBase: '1.00 USD',
      rateText: rate ? `${rate.toFixed(2)} ${currencyInfo.code}` : (currencyInfo.code === 'USD' ? '1.00 USD (Moneda base)' : 'Cotizacion referencial'),
      rateValue: rate || (currencyInfo.code === 'USD' ? 1.0 : null),
      date: json.date || 'Reciente',
      ratesAll: json.rates || {},
    };

    return {
      service: 'Finanzas Turisticas (Frankfurter FX)',
      status: 'success',
      statusCode: 200,
      latencyMs,
      url,
      data: normalizedData,
      rawJson: json,
    };
  } catch (err) {
    return {
      service: 'Finanzas Turisticas (Frankfurter FX)',
      status: 'error',
      statusCode: 500,
      latencyMs: Date.now() - startTime,
      url,
      error: `Error al consultar conversion monetaria: ${err.message}`,
      data: null,
    };
  }
}

/**
 * Orquestador principal de peticiones en cadena y concurrentes
 */
export async function queryIntegratedDestination(cityName, simulatedFailures = {}) {
  const overallStart = Date.now();

  // Paso 1: Peticion a API 1 (Geocodificacion)
  const geoResult = await fetchGeocoding(cityName, simulatedFailures.geocoding);

  // Manejo preventivo si la API 1 falla
  if (geoResult.status !== 'success' || !geoResult.data) {
    return {
      query: cityName,
      totalLatencyMs: Date.now() - overallStart,
      timestamp: new Date().toISOString(),
      services: {
        geocoding: geoResult,
        weather: {
          service: 'Meteorologia (Open-Meteo Forecast)',
          status: 'skipped',
          error: 'Peticion omitida porque la geocodificacion no devolvio coordenadas.',
          data: null,
        },
        tourism: {
          service: 'Guia Cultural y Turistica (Wikipedia REST)',
          status: 'skipped',
          error: 'Peticion omitida por fallo previo en geocodificacion.',
          data: null,
        },
        currency: {
          service: 'Finanzas Turisticas (Frankfurter FX)',
          status: 'skipped',
          error: 'Peticion omitida por fallo previo en geocodificacion.',
          data: null,
        },
      },
    };
  }

  const { latitude, longitude, countryCode, name: normalizedCityName } = geoResult.data;

  // Paso 2: Peticiones concurrentes a API 2, 3 y 4 con los datos derivados
  const [weatherResult, tourismResult, currencyResult] = await Promise.all([
    fetchWeather(latitude, longitude, simulatedFailures.weather),
    fetchTourismGuide(normalizedCityName, simulatedFailures.tourism),
    fetchExchangeRate(countryCode, simulatedFailures.currency),
  ]);

  return {
    query: cityName,
    resolvedName: normalizedCityName,
    totalLatencyMs: Date.now() - overallStart,
    timestamp: new Date().toISOString(),
    services: {
      geocoding: geoResult,
      weather: weatherResult,
      tourism: tourismResult,
      currency: currencyResult,
    },
  };
}
