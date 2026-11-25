// The shopper's country and currency choices, kept in localStorage so they
// survive reloads. The Apollo client sends the country as x-shop-country,
// which the engine uses for prices, taxes and delivery options.
export const COUNTRY_KEY = 'shopCountry';
export const CURRENCY_KEY = 'shopCurrency';

export const readPreference = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writePreference = (key: string, value: string | null) => {
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    // storage unavailable (private mode): the choice lasts for this page only
  }
};
