import getConfig from 'next/config';
import React, { useState, useContext, useMemo } from 'react';

const {
  publicRuntimeConfig: { disableEmailSupport },
} = getConfig();

type AppContextType = {
  isCartOpen: boolean;
  emailSupportDisabled: boolean;
  toggleCart?: (p: any) => void;
};

export const AppContext = React.createContext<AppContextType>({
  isCartOpen: false,
  emailSupportDisabled: !!disableEmailSupport,
  toggleCart: () => null,
});

export const useAppContext = () => useContext(AppContext);

export const AppContextWrapper = ({ children }) => {
  const [isCartOpen, toggleCart] = useState(false);

  const appContext = useMemo(
    () =>
      ({
        isCartOpen,
        emailSupportDisabled: !!disableEmailSupport,
        toggleCart,
      }) as AppContextType,
    [isCartOpen],
  );

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};
