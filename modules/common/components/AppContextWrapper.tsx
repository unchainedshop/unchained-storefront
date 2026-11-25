import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { COUNTRY_KEY, CURRENCY_KEY, readPreference, writePreference } from '../utils/shopPreferences';

const disableEmailSupport = process.env.NEXT_PUBLIC_DISABLE_EMAIL_PROCESSES === 'true';

type AppContextType = {
  isCartOpen: boolean;
  emailSupportDisabled: boolean;
  toggleCart?: (p: any) => void;
  selectedCurrency: string;
  changeCurrency: (p: string) => void;
  selectedCountry: string | null;
  changeCountry: (p: string) => void;
};

export const AppContext = React.createContext<AppContextType>({
  isCartOpen: false,
  emailSupportDisabled: !!disableEmailSupport,
  toggleCart: () => null,
  selectedCurrency: 'CHF',
  changeCurrency: (val) => {},
  selectedCountry: null,
  changeCountry: (val) => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppContextWrapper = ({ children }) => {
  const [isCartOpen, toggleCart] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Restored after mount so the first render matches the server HTML.
  useEffect(() => {
    setSelectedCurrency(readPreference(CURRENCY_KEY));
    setSelectedCountry(readPreference(COUNTRY_KEY));
  }, []);

  const changeCurrency = useCallback((value) => {
    writePreference(CURRENCY_KEY, value);
    setSelectedCurrency(value);
  }, []);

  const changeCountry = useCallback((value) => {
    writePreference(COUNTRY_KEY, value);
    setSelectedCountry(value);
  }, []);

  const appContext = useMemo(
    () =>
      ({
        isCartOpen,
        emailSupportDisabled: !!disableEmailSupport,
        toggleCart,
        changeCurrency,
        selectedCurrency,
        selectedCountry,
        changeCountry,
      }) as AppContextType,
    [isCartOpen, selectedCurrency, selectedCountry],
  );

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};
