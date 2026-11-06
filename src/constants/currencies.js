// Mapeo de codigo de pais ISO alfa-2 a moneda principal
export const COUNTRY_CURRENCY_MAP = {
  JP: { code: 'JPY', name: 'Yen Japones', symbol: '¥' },
  FR: { code: 'EUR', name: 'Euro', symbol: 'EUR' },
  ES: { code: 'EUR', name: 'Euro', symbol: 'EUR' },
  IT: { code: 'EUR', name: 'Euro', symbol: 'EUR' },
  DE: { code: 'EUR', name: 'Euro', symbol: 'EUR' },
  GB: { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
  UK: { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
  US: { code: 'USD', name: 'Dolar Estadounidense', symbol: '$' },
  MX: { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
  CA: { code: 'CAD', name: 'Dolar Canadiense', symbol: 'C$' },
  AU: { code: 'AUD', name: 'Dolar Australiano', symbol: 'A$' },
  BR: { code: 'BRL', name: 'Real Brasileno', symbol: 'R$' },
  CN: { code: 'CNY', name: 'Yuan Chino', symbol: '¥' },
  CH: { code: 'CHF', name: 'Franco Suizo', symbol: 'CHF' },
  EG: { code: 'EGP', name: 'Libra Egipcia', symbol: 'E£' },
  AR: { code: 'ARS', name: 'Peso Argentino', symbol: '$' },
  CO: { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  CL: { code: 'CLP', name: 'Peso Chileno', symbol: '$' },
  PE: { code: 'PEN', name: 'Sol Peruano', symbol: 'S/.' },
  KR: { code: 'KRW', name: 'Won Surcoreano', symbol: '₩' },
  IN: { code: 'INR', name: 'Rupia India', symbol: '₹' },
};

export function getCurrencyForCountry(countryCode) {
  const code = (countryCode || '').toUpperCase();
  if (code in COUNTRY_CURRENCY_MAP) {
    return COUNTRY_CURRENCY_MAP[code];
  }
  return { code: 'USD', name: 'Dolar Estadounidense (Referencia)', symbol: '$' };
}

