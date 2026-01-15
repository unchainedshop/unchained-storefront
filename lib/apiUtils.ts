/**
 * API Utilities
 * Common utilities for API routes
 */

/**
 * Generate a unique ID with a prefix
 * Format: {prefix}_{timestamp}_{random}
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Generate a URL-safe slug from text
 * Converts to lowercase, replaces non-alphanumeric with hyphens
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Ensure a slug is unique among existing items
 * Appends a counter suffix if needed
 */
export function ensureUniqueSlug<T extends { slug: string; id?: string }>(
  baseSlug: string,
  items: T[],
  excludeId?: string,
): string {
  let slug = baseSlug;
  let counter = 1;

  // Filter out the item being edited
  const otherItems = excludeId
    ? items.filter((item) => item.id !== excludeId)
    : items;

  while (otherItems.some((item) => item.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Get current timestamp in ISO format
 */
export function nowISO(): string {
  return new Date().toISOString();
}
