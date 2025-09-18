// Multi-currency support for African countries
export const CURRENCIES = {
  NGN: { name: 'Nigerian Naira', symbol: '₦', code: 'NGN' },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', code: 'KES' },
  GHS: { name: 'Ghanaian Cedi', symbol: '₵', code: 'GHS' },
  ZAR: { name: 'South African Rand', symbol: 'R', code: 'ZAR' },
  EGP: { name: 'Egyptian Pound', symbol: '£', code: 'EGP' },
  MAD: { name: 'Moroccan Dirham', symbol: 'د.م.', code: 'MAD' },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', code: 'TZS' },
  UGX: { name: 'Ugandan Shilling', symbol: 'USh', code: 'UGX' },
  ETB: { name: 'Ethiopian Birr', symbol: 'Br', code: 'ETB' },
  XOF: { name: 'West African CFA Franc', symbol: 'CFA', code: 'XOF' },
  XAF: { name: 'Central African CFA Franc', symbol: 'FCFA', code: 'XAF' },
  USD: { name: 'US Dollar', symbol: '$', code: 'USD' },
};

// Exchange rates (these would typically come from an API in production)
export const EXCHANGE_RATES = {
  USD: 1.0,
  NGN: 780.0,    // 1 USD = 780 NGN
  KES: 150.0,    // 1 USD = 150 KES
  GHS: 12.0,     // 1 USD = 12 GHS
  ZAR: 18.5,     // 1 USD = 18.5 ZAR
  EGP: 30.8,     // 1 USD = 30.8 EGP
  MAD: 10.0,     // 1 USD = 10 MAD
  TZS: 2500.0,   // 1 USD = 2500 TZS
  UGX: 3700.0,   // 1 USD = 3700 UGX
  ETB: 55.0,     // 1 USD = 55 ETB
  XOF: 600.0,    // 1 USD = 600 XOF
  XAF: 600.0,    // 1 USD = 600 XAF
};

// Get user's currency based on location (simplified for demo)
export const getUserCurrency = () => {
  // In production, this would use geolocation or user preferences
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Map timezones to currencies
  const timezoneToCurrency = {
    'Africa/Lagos': 'NGN',
    'Africa/Nairobi': 'KES',
    'Africa/Accra': 'GHS',
    'Africa/Johannesburg': 'ZAR',
    'Africa/Cairo': 'EGP',
    'Africa/Casablanca': 'MAD',
    'Africa/Dar_es_Salaam': 'TZS',
    'Africa/Kampala': 'UGX',
    'Africa/Addis_Ababa': 'ETB',
    'Africa/Dakar': 'XOF',
    'Africa/Douala': 'XAF',
  };
  
  return timezoneToCurrency[timezone] || 'USD';
};

// Convert USD to local currency
export const convertToLocalCurrency = (usdAmount, currencyCode) => {
  const rate = EXCHANGE_RATES[currencyCode] || 1;
  const localAmount = usdAmount * rate;
  
  // Round to appropriate decimal places
  const decimalPlaces = currencyCode === 'NGN' || currencyCode === 'KES' || 
                       currencyCode === 'TZS' || currencyCode === 'UGX' ? 0 : 2;
  
  return {
    amount: Number(localAmount.toFixed(decimalPlaces)),
    currency: CURRENCIES[currencyCode],
    formatted: formatCurrency(localAmount, currencyCode)
  };
};

// Format currency for display
export const formatCurrency = (amount, currencyCode) => {
  const currency = CURRENCIES[currencyCode];
  if (!currency) return `$${amount.toFixed(2)}`;
  
  const decimalPlaces = currencyCode === 'NGN' || currencyCode === 'KES' || 
                       currencyCode === 'TZS' || currencyCode === 'UGX' ? 0 : 2;
  
  const formattedAmount = amount.toFixed(decimalPlaces);
  
  // Format with thousand separators
  const parts = formattedAmount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${currency.symbol}${parts.join('.')}`;
};

// Get all African currencies
export const getAfricanCurrencies = () => {
  return Object.entries(CURRENCIES)
    .filter(([code]) => code !== 'USD')
    .map(([code, currency]) => ({ code, ...currency }));
};

// Calculate token price in local currency
export const calculateTokenPrice = (usdPrice, currencyCode) => {
  return convertToLocalCurrency(usdPrice, currencyCode);
};

// Get currency info for display
export const getCurrencyInfo = (currencyCode) => {
  return CURRENCIES[currencyCode] || CURRENCIES.USD;
};
