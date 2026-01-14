/**
 * Localization Utilities
 * Helpers for working with multi-language content
 */

import { cmsConfig } from "../../../lib/cms.config";
import type {
  BlockContent,
  LocalizedContent,
  LocalizedString,
  LocalizedSEOSettings,
  Page,
  PageBlock,
  LegacyPage,
  LegacyPageBlock,
  PageTranslations,
  TranslationStatus,
  SEOSettings,
} from "../types";

/**
 * Check if content is in legacy (non-localized) format
 * Legacy content has block content keys directly (heading, text, etc.)
 * Localized content has locale keys (de, fr, en, etc.)
 */
function isLegacyContent(content: unknown): boolean {
  if (!content || typeof content !== "object") return false;
  const keys = Object.keys(content);
  if (keys.length === 0) return false;
  // If none of the keys are locales, it's legacy content
  return !cmsConfig.locales.some((locale) => locale in (content as object));
}

/**
 * Get content for a specific locale, with fallback
 * Also handles legacy (non-localized) content for backwards compatibility
 */
export function getLocalizedContent<T extends BlockContent>(
  content: LocalizedContent<T>,
  locale: string,
  fallbackLocale?: string,
): T | undefined {
  // Handle legacy content that wasn't migrated
  if (isLegacyContent(content)) {
    return content as unknown as T;
  }

  const fallback = fallbackLocale || cmsConfig.fallbackLocale;

  // Try requested locale first
  if (content[locale]) {
    return content[locale] as T;
  }

  // Fall back to fallback locale
  if (content[fallback]) {
    return content[fallback] as T;
  }

  // Fall back to first available locale
  const firstLocale = Object.keys(content)[0];
  if (firstLocale) {
    return content[firstLocale] as T;
  }

  return undefined;
}

/**
 * Get a localized string value, with fallback
 */
export function getLocalizedString(
  str: LocalizedString | string | undefined,
  locale: string,
  fallbackLocale?: string,
): string {
  if (!str) return "";

  // Handle legacy non-localized strings
  if (typeof str === "string") {
    return str;
  }

  const fallback = fallbackLocale || cmsConfig.fallbackLocale;

  return str[locale] || str[fallback] || str[Object.keys(str)[0]] || "";
}

/**
 * Set content for a specific locale
 */
export function setLocalizedContent<T extends BlockContent>(
  content: LocalizedContent<T>,
  locale: string,
  value: T,
): LocalizedContent<T> {
  return {
    ...content,
    [locale]: value,
  };
}

/**
 * Set a localized string value
 */
export function setLocalizedString(
  str: LocalizedString | undefined,
  locale: string,
  value: string,
): LocalizedString {
  return {
    ...(str || {}),
    [locale]: value,
  };
}

/**
 * Check if content exists for a specific locale
 */
export function hasLocale(
  content: LocalizedContent | LocalizedString,
  locale: string,
): boolean {
  return locale in content && content[locale] !== undefined;
}

/**
 * Get all locales that have content
 */
export function getAvailableLocales(
  content: LocalizedContent | LocalizedString,
): string[] {
  return Object.keys(content).filter(
    (key) => content[key] !== undefined && content[key] !== null,
  );
}

/**
 * Calculate translation completeness for a block
 * Returns percentage (0-100) of fields that have content
 */
export function calculateBlockCompleteness(
  content: LocalizedContent,
  locale: string,
  sourceLocale: string,
): number {
  const sourceContent = content[sourceLocale];
  const targetContent = content[locale];

  if (!sourceContent) return 0;
  if (!targetContent) return 0;

  const sourceRecord = sourceContent as unknown as Record<string, unknown>;
  const targetRecord = targetContent as unknown as Record<string, unknown>;

  const sourceFields = Object.keys(sourceContent).filter(
    (key) => typeof sourceRecord[key] === "string" && sourceRecord[key] !== "",
  );

  if (sourceFields.length === 0) return 100;

  const translatedFields = sourceFields.filter((key) => {
    const value = targetRecord[key];
    return typeof value === "string" && value !== "";
  });

  return Math.round((translatedFields.length / sourceFields.length) * 100);
}

/**
 * Calculate overall translation completeness for a page
 */
export function calculatePageCompleteness(page: Page, locale: string): number {
  if (locale === page.translations.sourceLocale) return 100;

  const blockCompletenessValues: number[] = [];

  function processBlock(block: PageBlock) {
    const completeness = calculateBlockCompleteness(
      block.content,
      locale,
      page.translations.sourceLocale,
    );
    blockCompletenessValues.push(completeness);

    if (block.children) {
      block.children.forEach(processBlock);
    }
  }

  page.blocks.forEach(processBlock);

  // Also check title
  const hasTitle = !!page.title[locale];
  blockCompletenessValues.push(hasTitle ? 100 : 0);

  if (blockCompletenessValues.length === 0) return 0;

  return Math.round(
    blockCompletenessValues.reduce((a, b) => a + b, 0) /
      blockCompletenessValues.length,
  );
}

/**
 * Create initial translation status for a new page
 */
export function createInitialTranslations(
  sourceLocale: string,
): PageTranslations {
  const status: Record<string, TranslationStatus> = {};

  cmsConfig.locales.forEach((locale) => {
    status[locale] = {
      locale,
      status: locale === sourceLocale ? "completed" : "not_started",
      completeness: locale === sourceLocale ? 100 : 0,
    };
  });

  return {
    sourceLocale,
    status,
  };
}

/**
 * Copy content from one locale to another for a block
 */
export function copyBlockContentToLocale(
  content: LocalizedContent,
  fromLocale: string,
  toLocale: string,
): LocalizedContent {
  const sourceContent = content[fromLocale];
  if (!sourceContent) return content;

  return {
    ...content,
    [toLocale]: { ...sourceContent },
  };
}

/**
 * Copy all block content from one locale to another
 */
export function copyPageContentToLocale(
  blocks: PageBlock[],
  fromLocale: string,
  toLocale: string,
): PageBlock[] {
  return blocks.map((block) => ({
    ...block,
    content: copyBlockContentToLocale(block.content, fromLocale, toLocale),
    children: block.children
      ? copyPageContentToLocale(block.children, fromLocale, toLocale)
      : undefined,
  }));
}

// =============================================================================
// MIGRATION UTILITIES
// =============================================================================

/**
 * Check if a page is in legacy (non-localized) format
 */
export function isLegacyPage(page: unknown): page is LegacyPage {
  const p = page as Record<string, unknown>;
  // Legacy pages have string title instead of object
  return typeof p.title === "string";
}

/**
 * Check if a block is in legacy (non-localized) format
 */
export function isLegacyBlock(block: unknown): block is LegacyPageBlock {
  const b = block as Record<string, unknown>;
  const content = b.content as Record<string, unknown>;
  // Legacy blocks have content directly, not nested by locale
  // Check if content has known block content keys directly (like 'heading', 'text', etc.)
  return (
    content &&
    typeof content === "object" &&
    !cmsConfig.locales.some((locale) => locale in content)
  );
}

/**
 * Migrate a legacy block to localized format
 */
export function migrateLegacyBlock(
  block: LegacyPageBlock,
  defaultLocale: string,
): PageBlock {
  return {
    ...block,
    content: {
      [defaultLocale]: block.content,
    },
    children: block.children
      ? block.children.map((child) => migrateLegacyBlock(child, defaultLocale))
      : undefined,
  };
}

/**
 * Migrate a legacy SEO settings to localized format
 */
export function migrateLegacySEO(
  seo: SEOSettings,
  defaultLocale: string,
): LocalizedSEOSettings {
  return {
    title: seo.title ? { [defaultLocale]: seo.title } : undefined,
    description: seo.description
      ? { [defaultLocale]: seo.description }
      : undefined,
    keywords: seo.keywords ? { [defaultLocale]: seo.keywords } : undefined,
    ogImage: seo.ogImage ? { [defaultLocale]: seo.ogImage } : undefined,
    noIndex: seo.noIndex,
  };
}

/**
 * Migrate a legacy page to localized format
 */
export function migrateLegacyPage(
  page: LegacyPage,
  defaultLocale?: string,
): Page {
  const locale = defaultLocale || cmsConfig.defaultLocale;

  return {
    ...page,
    title: { [locale]: page.title },
    blocks: page.blocks.map((block) => migrateLegacyBlock(block, locale)),
    seo: migrateLegacySEO(page.seo, locale),
    translations: createInitialTranslations(locale),
  };
}

/**
 * Ensure a page is in localized format (migrate if needed)
 */
export function ensureLocalizedPage(page: unknown): Page {
  if (isLegacyPage(page)) {
    return migrateLegacyPage(page);
  }
  return page as Page;
}
