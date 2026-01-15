/**
 * Locale Context
 * Provides active locale state for localization
 */

import { createContext, useContext } from "react";

export interface LocaleContextValue {
  activeLocale: string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export const usePageBuilderLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error(
      "usePageBuilderLocale must be used within a PageBuilderProvider",
    );
  }
  return context;
};
