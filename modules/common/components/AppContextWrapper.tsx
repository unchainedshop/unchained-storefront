import getConfig from 'next/config';
import React, { useState, useContext, useMemo, useCallback } from 'react';

const {
  publicRuntimeConfig: { disableEmailSupport },
} = getConfig();

type AppContextType = {
  isCartOpen: boolean;
  emailSupportDisabled: boolean;
  toggleCart?: (p: any) => void;
  selectedCurrency: string;
  changeCurrency: (p: string) => void;
};

export const AppContext = React.createContext<AppContextType>({
  isCartOpen: false,
  emailSupportDisabled: !!disableEmailSupport,
  toggleCart: () => null,
  selectedCurrency: 'CHF',
  changeCurrency: (val) => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppContextWrapper = ({ children }) => {
  const [isCartOpen, toggleCart] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const changeCurrency = useCallback(
    (value) => {
      setSelectedCurrency(value);
    },
    [selectedCurrency],
  );

  const appContext = useMemo(
    () =>
      ({
        isCartOpen,
        emailSupportDisabled: !!disableEmailSupport,
        toggleCart,
        changeCurrency,
        selectedCurrency,
      }) as AppContextType,
    [isCartOpen, selectedCurrency],
  );

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};
