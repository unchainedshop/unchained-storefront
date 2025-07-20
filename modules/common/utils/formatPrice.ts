import { formatCurrency } from '@coingecko/cryptoformat';

export const roundUp = (amount, decimals) => {
  if (decimals <= 2) return amount;
  return Math.ceil(amount * 100000) / 100000;
};

// Currency configuration
const CURRENCY_CONFIG = {
  CHF: {
    locale: 'de-CH',
    decimals: 2,
    isStandardCurrency: true,
  },
  EUR: {
    locale: 'de-DE',
    decimals: 2,
    isStandardCurrency: true,
  },
  USD: {
    locale: 'en-US',
    decimals: 2,
    isStandardCurrency: true,
  },
};

// Known cryptocurrency patterns (these use cryptoformat)
const CRYPTO_PATTERNS = ['BTC', 'ETH', 'LTC', 'XRP', 'ADA', 'DOT', 'SOL'];

const isCryptocurrency = (currencyCode) => {
  if (!currencyCode) return false;
  return CRYPTO_PATTERNS.some((pattern) =>
    currencyCode.toUpperCase().includes(pattern),
  );
};

const formatPrice = (rawPrice) => {
  const {
    amount,
    currencyCode,
    decimals = 2,
    hack = true,
    locale,
  } = rawPrice || {};

  // Handle null/undefined cases
  if (amount === undefined || amount === null || !currencyCode) {
    return 'N/A';
  }

  // FORCE CHF FORMATTING - Override everything for CHF to ensure it works
  if (currencyCode === 'CHF') {
    let chfAmount = amount;

    // Always convert from rappen to CHF (divide by 100)
    if (hack) {
      chfAmount = amount / 100;
    }

    // Round to 2 decimal places
    chfAmount = Math.round(chfAmount * 100) / 100;

    // Force Swiss formatting
    try {
      const chfFormatter = new Intl.NumberFormat('de-CH', {
        style: 'currency',
        currency: 'CHF',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const result = chfFormatter.format(chfAmount);
      return result;
    } catch (error) {
      console.error('CHF formatting failed, using fallback:', error);
      return `CHF ${chfAmount.toFixed(2)}`;
    }
  }

  // Get currency configuration for non-CHF currencies
  const currencyConfig = CURRENCY_CONFIG[currencyCode] || {
    locale: locale || 'en-US',
    decimals: decimals,
    isStandardCurrency: !isCryptocurrency(currencyCode),
  };

  let fixedAmount = amount;

  // Convert from smallest unit to main unit (e.g., cents to USD)
  if (hack && currencyConfig.isStandardCurrency) {
    // Standard currencies: divide by 100 (cents to main unit)
    fixedAmount = amount / 100;
  } else if (hack && decimals > 0) {
    // Cryptocurrencies: use the specified decimals
    const divisor = Math.pow(10, Math.min(decimals, 18)); // Cap at 18 for safety
    fixedAmount = amount / divisor;
  }

  // Round amount appropriately
  const roundedAmount = currencyConfig.isStandardCurrency
    ? Math.round(fixedAmount * 100) / 100 // Standard 2 decimal precision
    : roundUp(fixedAmount, Math.min(decimals, 8)); // Crypto precision

  // Use Intl.NumberFormat for standard currencies
  if (currencyConfig.isStandardCurrency && typeof Intl !== 'undefined') {
    try {
      const formatter = new Intl.NumberFormat(currencyConfig.locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currencyConfig.decimals,
        maximumFractionDigits: currencyConfig.decimals,
      });

      return formatter.format(roundedAmount);
    } catch (error) {
      console.error(
        `Failed to format ${currencyCode} with Intl.NumberFormat:`,
        error,
      );
      // Fallback to simple formatting
      return `${currencyCode} ${roundedAmount.toFixed(currencyConfig.decimals)}`;
    }
  }

  // Use cryptoformat for cryptocurrencies
  try {
    return formatCurrency(roundedAmount, currencyCode);
  } catch (error) {
    console.error(`Failed to format ${currencyCode} with cryptoformat:`, error);
    // Final fallback
    return `${roundedAmount.toFixed(Math.min(decimals, 8))} ${currencyCode}`;
  }
};

export default formatPrice;
