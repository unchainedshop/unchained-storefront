/**
 * Collection Helpers
 * ID generators and utility functions for the collections system
 */

import type { LocalizedString } from "../types";

/**
 * Generate unique schema ID
 */
export function generateSchemaId(): string {
  return `schema_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Generate unique field ID
 */
export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Generate unique entry ID
 */
export function generateEntryId(): string {
  return `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Generate unique product collection ID
 */
export function generateProductCollectionId(): string {
  return `prodcol_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Generate unique version ID
 */
export function generateVersionId(): string {
  return `ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Sanitize slug (same pattern as pageStorage)
 * Removes special characters and normalizes dashes
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate slug from title
 * Takes either a plain string or a LocalizedString and extracts text for slug
 */
export function generateSlugFromTitle(
  title: string | LocalizedString,
  defaultLocale: string = "de",
): string {
  let text: string;

  if (typeof title === "string") {
    text = title;
  } else {
    // Try to get value for default locale, fallback to first available value
    text =
      title[defaultLocale] ||
      Object.values(title).find((v) => v && v.trim()) ||
      "";
  }

  return sanitizeSlug(text);
}

/**
 * Get localized string value for a specific locale
 * Falls back to default locale or first available value
 */
export function getLocalizedValue(
  value: LocalizedString | undefined,
  locale: string,
  fallbackLocale: string = "de",
): string {
  if (!value) return "";

  return (
    value[locale] ||
    value[fallbackLocale] ||
    Object.values(value).find((v) => v && v.trim()) ||
    ""
  );
}

/**
 * Check if a value is a valid LocalizedString
 */
export function isLocalizedString(value: unknown): value is LocalizedString {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(
    (v) => typeof v === "string" || v === undefined,
  );
}

/**
 * Create a new LocalizedString with initial value
 */
export function createLocalizedString(
  value: string,
  locale: string,
): LocalizedString {
  return { [locale]: value };
}

/**
 * Merge two LocalizedStrings
 */
export function mergeLocalizedStrings(
  base: LocalizedString | undefined,
  updates: LocalizedString,
): LocalizedString {
  return { ...base, ...updates };
}

/**
 * Validate field name format (snake_case)
 */
export function isValidFieldName(name: string): boolean {
  return /^[a-z][a-z0-9_]*$/.test(name);
}

/**
 * Convert string to snake_case for field names
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Compare two objects for equality (deep)
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Generate a unique slug by appending a number if needed
 */
export function makeUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
): string {
  const sanitized = sanitizeSlug(baseSlug);
  let slug = sanitized;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${sanitized}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Sort items by order field, with fallback to createdAt
 */
export function sortByOrder<T extends { order?: number; createdAt?: string }>(
  items: T[],
  direction: "asc" | "desc" = "asc",
): T[] {
  return [...items].sort((a, b) => {
    // Items with explicit order come first
    const aOrder = a.order ?? Infinity;
    const bOrder = b.order ?? Infinity;

    if (aOrder !== bOrder) {
      return direction === "asc" ? aOrder - bOrder : bOrder - aOrder;
    }

    // Fall back to createdAt
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return direction === "asc" ? aTime - bTime : bTime - aTime;
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Get timestamp in ISO format
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Parse date string safely
 */
export function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Format date for display
 */
export function formatDate(
  dateStr: string | undefined,
  locale: string = "de-CH",
): string {
  const date = parseDate(dateStr);
  if (!date) return "";

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format datetime for display
 */
export function formatDateTime(
  dateStr: string | undefined,
  locale: string = "de-CH",
): string {
  const date = parseDate(dateStr);
  if (!date) return "";

  return date.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
