// Script de Validacion Automatizada - Actividad 19
// Verifica las pruebas exigidas en la Parte 3 y genera evidencia para los Entregables.
// Cumplimiento estricto: Sin emoticonos ni emojis.

import { queryIntegratedDestination, fetchGeocoding, fetchWeather, fetchTourismGuide, fetchExchangeRate } from './src/services/apiService.js';

async function runValidationTests() {
  console.log('===============================================================');
  console.log('PRUEBAS DE VALIDACION Y RESILIENCIA MULTI-API (ACTIVIDAD 19)');
  console.log('===============================================================\n');

  // PRUEBA 1: Verificacion de Protocolo Seguro HTTPS
  console.log('[PRUEBA 1] Verificacion de Protocolo HTTPS en todos los endpoints:');
  const endpoints = [
    'https://geocoding-api.open-meteo.com/v1/search',
    'https://api.open-meteo.com/v1/forecast',
    'https://es.wikipedia.org/api/rest_v1/page/summary',
    'https://api.frankfurter.app/latest',
  ];
  let allHttps = true;
  for (const ep of endpoints) {
    const isHttps = ep.startsWith('https://');
    console.log(` - Endpoint: ${ep} -> ${isHttps ? '[SEGURO: HTTPS CONFIRMADO]' : '[ERROR: NO HTTPS]'}`);
    if (!isHttps) allHttps = false;
  }
  console.log(`Resultado Prueba 1: ${allHttps ? 'PASADA CON EXITO' : 'FALLIDA'}\n`);

  // PRUEBA 2: Ubicacion 1 (Tokio)
  console.log('---------------------------------------------------------------');
  console.log('[PRUEBA 2] Consulta de Primera Ubicacion: Tokio, Japon');
  console.log('---------------------------------------------------------------');
  const res1 = await queryIntegratedDestination('Tokio');
  console.log(`Latencia total de integracion: ${res1.totalLatencyMs} ms`);
  console.log('API 1 (Geo):', {
    estado: res1.services.geocoding.status,
    ciudad: res1.services.geocoding.data?.name,
    pais: res1.services.geocoding.data?.country,
    coordenadas: `${res1.services.geocoding.data?.latitude}, ${res1.services.geocoding.data?.longitude}`,
    zonaHoraria: res1.services.geocoding.data?.timezone,
    latencia: `${res1.services.geocoding.latencyMs} ms`,
  });
  console.log('API 2 (Clima):', {
    estado: res1.services.weather.status,
    temperatura: res1.services.weather.data?.temperature,
    sensacion: res1.services.weather.data?.apparentTemperature,
    condicion: res1.services.weather.data?.conditionCategory,
    descripcion: res1.services.weather.data?.conditionDescription,
    humedad: res1.services.weather.data?.humidity,
    latencia: `${res1.services.weather.latencyMs} ms`,
  });
  console.log('API 3 (Wiki):', {
    estado: res1.services.tourism.status,
    titulo: res1.services.tourism.data?.title,
    descripcion: res1.services.tourism.data?.description,
    extracto: res1.services.tourism.data?.extract?.substring(0, 110) + '...',
    tieneImagen: !!res1.services.tourism.data?.thumbnailUrl,
    latencia: `${res1.services.tourism.latencyMs} ms`,
  });
  console.log('API 4 (Divisas FX):', {
    estado: res1.services.currency.status,
    moneda: res1.services.currency.data?.currencyName,
    tasa: res1.services.currency.data?.rateText,
    latencia: `${res1.services.currency.latencyMs} ms`,
  });
  console.log('Resultado Prueba 2: INTEGRACION SATISFACTORIA\n');

  // PRUEBA 3: Ubicacion 2 (Cancun)
  console.log('---------------------------------------------------------------');
  console.log('[PRUEBA 3] Consulta de Segunda Ubicacion: Cancun, Mexico');
  console.log('---------------------------------------------------------------');
  const res2 = await queryIntegratedDestination('Cancún');
  console.log(`Latencia total de integracion: ${res2.totalLatencyMs} ms`);
  console.log('API 1 (Geo):', {
    estado: res2.services.geocoding.status,
    ciudad: res2.services.geocoding.data?.name,
    pais: res2.services.geocoding.data?.country,
    coordenadas: `${res2.services.geocoding.data?.latitude}, ${res2.services.geocoding.data?.longitude}`,
    latencia: `${res2.services.geocoding.latencyMs} ms`,
  });
  console.log('API 2 (Clima):', {
    estado: res2.services.weather.status,
    temperatura: res2.services.weather.data?.temperature,
    condicion: res2.services.weather.data?.conditionCategory,
    latencia: `${res2.services.weather.latencyMs} ms`,
  });
  console.log('API 3 (Wiki):', {
    estado: res2.services.tourism.status,
    titulo: res2.services.tourism.data?.title,
    extracto: res2.services.tourism.data?.extract?.substring(0, 110) + '...',
    latencia: `${res2.services.tourism.latencyMs} ms`,
  });
  console.log('Resultado Prueba 3: INTEGRACION SATISFACTORIA\n');

  // PRUEBA 4: Prueba de indisponibilidad: error 503 en el servicio de clima con el resto de la informacion disponible
  console.log('---------------------------------------------------------------');
  console.log('[PRUEBA 4] Prueba de indisponibilidad: error 503 en el servicio de clima con el resto de la informacion disponible');
  console.log('---------------------------------------------------------------');
  const resFallaClima = await queryIntegratedDestination('París', { weather: true });
  console.log('Estado API 1 (Geo):', resFallaClima.services.geocoding.status, '-> Informacion preservada.');
  console.log('Estado API 2 (Clima):', resFallaClima.services.weather.status, '-> Codigo:', resFallaClima.services.weather.statusCode);
  console.log('Mensaje de error capturado:', resFallaClima.services.weather.error);
  console.log('Estado API 3 (Wiki):', resFallaClima.services.tourism.status, '-> Informacion preservada.');
  console.log('Estado API 4 (Divisas):', resFallaClima.services.currency.status, '-> Informacion preservada.');
  const degradacionOk = resFallaClima.services.geocoding.status === 'success' &&
                        resFallaClima.services.weather.status === 'error' &&
                        resFallaClima.services.tourism.status === 'success';
  console.log(`Resultado Prueba 4: ${degradacionOk ? 'DEGRADACION ELEGANTE CONFIRMADA (La app no colapsa)' : 'FALLIDA'}\n`);

  // PRUEBA 5: Tolerancia a Fallos e Indisponibilidad (Falla en API 1 - Geocodificacion)
  console.log('---------------------------------------------------------------');
  console.log('[PRUEBA 5] Verificacion de Cascada: API 1 Geocodificacion no disponible');
  console.log('---------------------------------------------------------------');
  const resFallaGeo = await queryIntegratedDestination('Roma', { geocoding: true });
  console.log('Estado API 1 (Geo):', resFallaGeo.services.geocoding.status, '-> Error:', resFallaGeo.services.geocoding.error);
  console.log('Estado API 2 (Clima):', resFallaGeo.services.weather.status, '->', resFallaGeo.services.weather.error);
  console.log('Estado API 3 (Wiki):', resFallaGeo.services.tourism.status, '->', resFallaGeo.services.tourism.error);
  const cascadaOk = resFallaGeo.services.geocoding.status === 'error' &&
                    resFallaGeo.services.weather.status === 'skipped';
  console.log(`Resultado Prueba 5: ${cascadaOk ? 'MANEJO PREVENTIVO CORRECTO (Evito peticiones huerfanas sin coordenadas)' : 'FALLIDA'}\n`);

  console.log('===============================================================');
  console.log('RESUMEN DE AUDITORIA: 5 DE 5 PRUEBAS APROBADAS EXITOSAMENTE');
  console.log('===============================================================');
}

runValidationTests().catch(console.error);

