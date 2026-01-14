/**
 * Translation Hook
 * Provides localization utilities for page builder components
 */

import { useCallback, useMemo } from "react";
import { usePageBuilder } from "../context/PageBuilderContext";
import type { LocalizedContent, LocalizedString, BlockContent } from "../types";
import {
  getLocalizedContent,
  getLocalizedString,
  setLocalizedContent,
  calculateBlockCompleteness,
  getAvailableLocales,
} from "../utils/localization";
import { cmsConfig } from "../../../lib/cms.config";

/**
 * Hook for working with localized content in the page builder
 */
export function useTranslation() {
  const { state, activeLocale, updateTranslationStatus } = usePageBuilder();

  /**
   * Get content for the current active locale
   */
  const getContent = useCallback(
    <T extends BlockContent>(content: LocalizedContent<T>): T | undefined => {
      return getLocalizedContent(
        content,
        activeLocale,
        cmsConfig.fallbackLocale,
      );
    },
    [activeLocale],
  );

  /**
   * Get a localized string for the current active locale
   */
  const getString = useCallback(
    (str: LocalizedString | string | undefined): string => {
      return getLocalizedString(str, activeLocale, cmsConfig.fallbackLocale);
    },
    [activeLocale],
  );

  /**
   * Check if content exists for the current locale (not using fallback)
   */
  const hasContentForLocale = useCallback(
    (content: LocalizedContent | LocalizedString): boolean => {
      return activeLocale in content && content[activeLocale] !== undefined;
    },
    [activeLocale],
  );

  /**
   * Check if a string is using fallback content
   */
  const isUsingFallback = useCallback(
    (content: LocalizedContent | LocalizedString): boolean => {
      if (activeLocale in content && content[activeLocale] !== undefined) {
        return false;
      }
      // Check if fallback content exists
      return (
        cmsConfig.fallbackLocale in content &&
        content[cmsConfig.fallbackLocale] !== undefined
      );
    },
    [activeLocale],
  );

  /**
   * Create updated content with new value for current locale
   */
  const setContent = useCallback(
    <T extends BlockContent>(
      content: LocalizedContent<T>,
      value: T,
    ): LocalizedContent<T> => {
      return setLocalizedContent(content, activeLocale, value);
    },
    [activeLocale],
  );

  /**
   * Get all locales that have content
   */
  const getLocalesWithContent = useCallback(
    (content: LocalizedContent | LocalizedString): string[] => {
      return getAvailableLocales(content);
    },
    [],
  );

  /**
   * Calculate translation completeness for content
   */
  const getCompleteness = useCallback(
    (content: LocalizedContent): number => {
      const sourceLocale =
        state.page?.translations.sourceLocale || cmsConfig.defaultLocale;
      return calculateBlockCompleteness(content, activeLocale, sourceLocale);
    },
    [activeLocale, state.page?.translations.sourceLocale],
  );

  /**
   * All configured locales
   */
  const allLocales = useMemo(() => cmsConfig.locales, []);

  /**
   * Current page's source locale
   */
  const sourceLocale = useMemo(
    () => state.page?.translations.sourceLocale || cmsConfig.defaultLocale,
    [state.page?.translations.sourceLocale],
  );

  /**
   * Whether the active locale is the source locale
   */
  const isSourceLocale = useMemo(
    () => activeLocale === sourceLocale,
    [activeLocale, sourceLocale],
  );

  /**
   * Translation status for the current locale
   */
  const currentLocaleStatus = useMemo(
    () => state.page?.translations.status[activeLocale],
    [activeLocale, state.page?.translations.status],
  );

  /**
   * All translation statuses
   */
  const allTranslationStatuses = useMemo(
    () => state.page?.translations.status || {},
    [state.page?.translations.status],
  );

  return {
    // Current state
    activeLocale,
    sourceLocale,
    isSourceLocale,
    allLocales,
    currentLocaleStatus,
    allTranslationStatuses,

    // Getters
    getContent,
    getString,
    hasContentForLocale,
    isUsingFallback,
    getLocalesWithContent,
    getCompleteness,

    // Setters
    setContent,
    updateTranslationStatus,

    // Config
    fallbackLocale: cmsConfig.fallbackLocale,
    defaultLocale: cmsConfig.defaultLocale,
  };
}

// Locale display name mapping
const LOCALE_NAMES: Record<string, string> = {
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  en: "English",
  es: "Español",
  pt: "Português",
  nl: "Nederlands",
  pl: "Polski",
  ru: "Русский",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
};

// Locale flag emoji mapping
const LOCALE_FLAGS: Record<string, string> = {
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
  en: "🇬🇧",
  es: "🇪🇸",
  pt: "🇵🇹",
  nl: "🇳🇱",
  pl: "🇵🇱",
  ru: "🇷🇺",
  ja: "🇯🇵",
  zh: "🇨🇳",
  ko: "🇰🇷",
};

/**
 * Hook for getting locale display information
 */
export function useLocaleInfo() {
  const getLocaleName = useCallback(
    (locale: string): string => LOCALE_NAMES[locale] || locale.toUpperCase(),
    [],
  );

  const getLocaleFlag = useCallback(
    (locale: string): string => LOCALE_FLAGS[locale] || "🌐",
    [],
  );

  const getLocaleDisplay = useCallback(
    (locale: string): string =>
      `${getLocaleFlag(locale)} ${getLocaleName(locale)}`,
    [getLocaleFlag, getLocaleName],
  );

  return {
    getLocaleName,
    getLocaleFlag,
    getLocaleDisplay,
    localeNames: LOCALE_NAMES,
    localeFlags: LOCALE_FLAGS,
  };
}

export default useTranslation;
