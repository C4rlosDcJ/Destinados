// Codigos WMO (World Meteorological Organization) para interpretacion de clima
// Cumplimiento estricto: Texto limpio sin emoticonos ni emojis

export const WMO_WEATHER_CODES = {
  0: { description: 'Cielo completamente despejado', category: 'Despejado' },
  1: { description: 'Principalmente despejado', category: 'Despejado' },
  2: { description: 'Parcialmente nublado', category: 'Nublado' },
  3: { description: 'Nublado y cubierto', category: 'Nublado' },
  45: { description: 'Niebla persistente', category: 'Niebla' },
  48: { description: 'Niebla con escarcha', category: 'Niebla' },
  51: { description: 'Llovizna ligera continua', category: 'Lluvia' },
  53: { description: 'Llovizna moderada', category: 'Lluvia' },
  55: { description: 'Llovizna densa e intensa', category: 'Lluvia' },
  56: { description: 'Llovizna helada ligera', category: 'Lluvia' },
  57: { description: 'Llovizna helada densa', category: 'Lluvia' },
  61: { description: 'Lluvia leve intermitente', category: 'Lluvia' },
  63: { description: 'Lluvia moderada', category: 'Lluvia' },
  65: { description: 'Lluvia fuerte e intensa', category: 'Lluvia' },
  66: { description: 'Lluvia helada ligera', category: 'Lluvia' },
  67: { description: 'Lluvia helada fuerte', category: 'Lluvia' },
  71: { description: 'Nevada ligera', category: 'Nieve' },
  73: { description: 'Nevada moderada', category: 'Nieve' },
  75: { description: 'Nevada intensa', category: 'Nieve' },
  77: { description: 'Granos de nieve', category: 'Nieve' },
  80: { description: 'Chubascos de lluvia leves', category: 'Chubascos' },
  81: { description: 'Chubascos de lluvia moderados', category: 'Chubascos' },
  82: { description: 'Chubascos de lluvia violentos', category: 'Chubascos' },
  85: { description: 'Chubascos de nieve leves', category: 'Nieve' },
  86: { description: 'Chubascos de nieve fuertes', category: 'Nieve' },
  95: { description: 'Tormenta electrica moderada', category: 'Tormenta' },
  96: { description: 'Tormenta electrica con granizo leve', category: 'Tormenta' },
  99: { description: 'Tormenta electrica con granizo fuerte', category: 'Tormenta' },
};

export function getWeatherInfo(code) {
  if (code in WMO_WEATHER_CODES) {
    return WMO_WEATHER_CODES[code];
  }
  return {
    description: `Condicion no catalogada (Codigo ${code})`,
    category: 'Desconocido',
  };
}

