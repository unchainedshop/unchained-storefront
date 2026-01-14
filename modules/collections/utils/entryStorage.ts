/**
 * File-based Entry Storage
 * Stores collection entries as JSON files in content/collections/entries/{collectionSlug}/
 */

import fs from "fs/promises";
import path from "path";
import type {
  CollectionEntry,
  CreateEntryInput,
  UpdateEntryInput,
  EntryStatus,
  ListParams,
  ListResponse,
  BulkOperationResult,
  LocalizedString,
} from "../types";
import {
  generateEntryId,
  sanitizeSlug,
  generateSlugFromTitle,
  getLocalizedValue,
  getTimestamp,
  sortByOrder,
} from "./helpers";
import { getSchema } from "./schemaStorage";
import { cmsConfig } from "../../../lib/cms.config";

const ENTRIES_BASE_DIR = path.join(
  process.cwd(),
  "content",
  "collections",
  "entries",
);

/**
 * Ensure the entries directory for a collection exists
 */
export async function ensureEntriesDir(
  collectionSlug: string,
): Promise<string> {
  const dir = path.join(ENTRIES_BASE_DIR, collectionSlug);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
}

/**
 * Get the file path for an entry
 */
function getEntryPath(collectionSlug: string, entrySlug: string): string {
  const safeSlug = entrySlug.replace(/[^a-zA-Z0-9-_]/g, "-");
  return path.join(ENTRIES_BASE_DIR, collectionSlug, `${safeSlug}.json`);
}

/**
 * List entries for a collection with filtering and pagination
 */
export async function listEntries(
  collectionSlug: string,
  params: ListParams = {},
): Promise<ListResponse<CollectionEntry>> {
  const dir = await ensureEntriesDir(collectionSlug);

  const {
    page = 1,
    limit = 50,
    search,
    status,
    sortBy = "updatedAt",
    sortOrder = "desc",
    locale = cmsConfig.defaultLocale,
  } = params;

  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    files = [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  let entries: CollectionEntry[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(path.join(dir, file), "utf-8");
      entries.push(JSON.parse(content));
    } catch (error) {
      console.error(`Error reading entry ${file}:`, error);
    }
  }

  // Status filter
  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    entries = entries.filter((e) => statuses.includes(e.status));
  }

  // Search filter (searches in content values)
  if (search) {
    const query = search.toLowerCase();
    entries = entries.filter((e) => {
      // Search in slug
      if (e.slug.toLowerCase().includes(query)) return true;

      // Search in content values
      for (const value of Object.values(e.content)) {
        if (typeof value === "string" && value.toLowerCase().includes(query)) {
          return true;
        }
        // Search in localized values
        if (typeof value === "object" && value !== null) {
          const localizedVal = getLocalizedValue(
            value as LocalizedString,
            locale,
          );
          if (localizedVal.toLowerCase().includes(query)) {
            return true;
          }
        }
      }
      return false;
    });
  }

  // Sort
  if (sortBy === "order") {
    entries = sortByOrder(entries, sortOrder);
  } else {
    entries.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortBy] as string;
      const bVal = (b as unknown as Record<string, unknown>)[sortBy] as string;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }

  const total = entries.length;
  const offset = (page - 1) * limit;
  const items = entries.slice(offset, offset + limit);

  return {
    items,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  };
}

/**
 * Get a single entry by slug
 */
export async function getEntry(
  collectionSlug: string,
  entrySlug: string,
): Promise<CollectionEntry | null> {
  await ensureEntriesDir(collectionSlug);

  const filePath = getEntryPath(collectionSlug, entrySlug);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get an entry by ID
 */
export async function getEntryById(
  collectionSlug: string,
  id: string,
): Promise<CollectionEntry | null> {
  const { items } = await listEntries(collectionSlug, { limit: 10000 });
  return items.find((e) => e.id === id) || null;
}

/**
 * Create a new entry
 */
export async function createEntry(
  collectionSlug: string,
  input: CreateEntryInput,
  userId?: string,
): Promise<CollectionEntry> {
  await ensureEntriesDir(collectionSlug);

  const schema = await getSchema(collectionSlug);
  const now = getTimestamp();

  // Generate slug from title field or provided slug
  let slug = input.slug;
  if (!slug && schema?.slugField) {
    const titleValue = input.content[schema.slugField];
    if (titleValue) {
      slug = generateSlugFromTitle(
        titleValue as string | LocalizedString,
        cmsConfig.defaultLocale,
      );
    }
  }
  if (!slug) {
    slug = `entry-${Date.now()}`;
  }

  // Ensure unique slug
  let uniqueSlug = sanitizeSlug(slug);
  let counter = 1;
  while (await getEntry(collectionSlug, uniqueSlug)) {
    uniqueSlug = `${sanitizeSlug(slug)}-${counter}`;
    counter++;
  }

  const entry: CollectionEntry = {
    id: generateEntryId(),
    collectionSlug,
    slug: uniqueSlug,
    status: input.status || "draft",
    content: input.content,
    order: input.order,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  };

  const filePath = getEntryPath(collectionSlug, entry.slug);
  await fs.writeFile(filePath, JSON.stringify(entry, null, 2), "utf-8");

  return entry;
}

/**
 * Update an entry
 */
export async function updateEntry(
  collectionSlug: string,
  entrySlug: string,
  updates: UpdateEntryInput,
  userId?: string,
): Promise<CollectionEntry | null> {
  const existing = await getEntry(collectionSlug, entrySlug);
  if (!existing) return null;

  const now = getTimestamp();
  const newSlug = updates.slug ? sanitizeSlug(updates.slug) : entrySlug;

  // Check if new slug already exists (and is different from current)
  if (newSlug !== entrySlug) {
    const conflicting = await getEntry(collectionSlug, newSlug);
    if (conflicting) {
      throw new Error(`Entry with slug "${newSlug}" already exists`);
    }
  }

  // Merge content if provided
  const mergedContent = updates.content
    ? { ...existing.content, ...updates.content }
    : existing.content;

  const updated: CollectionEntry = {
    ...existing,
    ...updates,
    content: mergedContent,
    slug: newSlug,
    id: existing.id,
    collectionSlug: existing.collectionSlug,
    createdAt: existing.createdAt,
    createdBy: existing.createdBy,
    updatedAt: now,
    updatedBy: userId,
  };

  // If status changed to published, set publishedAt
  if (updates.status === "published" && !existing.publishedAt) {
    updated.publishedAt = now;
  }

  // Handle slug change - delete old file first
  if (newSlug !== entrySlug) {
    await deleteEntry(collectionSlug, entrySlug);
  }

  const filePath = getEntryPath(collectionSlug, newSlug);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  return updated;
}

/**
 * Delete an entry
 */
export async function deleteEntry(
  collectionSlug: string,
  entrySlug: string,
): Promise<boolean> {
  await ensureEntriesDir(collectionSlug);

  const filePath = getEntryPath(collectionSlug, entrySlug);

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

/**
 * Check if an entry slug is available
 */
export async function isEntrySlugAvailable(
  collectionSlug: string,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const entry = await getEntry(collectionSlug, slug);
  if (!entry) return true;
  if (excludeId && entry.id === excludeId) return true;
  return false;
}

/**
 * Duplicate an entry
 */
export async function duplicateEntry(
  collectionSlug: string,
  entrySlug: string,
  newSlug?: string,
  userId?: string,
): Promise<CollectionEntry | null> {
  const entry = await getEntry(collectionSlug, entrySlug);
  if (!entry) return null;

  const now = getTimestamp();
  const targetSlug = newSlug || `${entrySlug}-copy`;

  // Ensure unique slug
  let uniqueSlug = sanitizeSlug(targetSlug);
  let counter = 1;
  while (await getEntry(collectionSlug, uniqueSlug)) {
    uniqueSlug = `${sanitizeSlug(targetSlug)}-${counter}`;
    counter++;
  }

  const duplicated: CollectionEntry = {
    ...entry,
    id: generateEntryId(),
    slug: uniqueSlug,
    status: "draft",
    workflow: undefined,
    publishedAt: undefined,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: undefined,
  };

  const filePath = getEntryPath(collectionSlug, duplicated.slug);
  await fs.writeFile(filePath, JSON.stringify(duplicated, null, 2), "utf-8");

  return duplicated;
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Bulk delete entries
 */
export async function bulkDeleteEntries(
  collectionSlug: string,
  entrySlugs: string[],
): Promise<BulkOperationResult> {
  let processed = 0;
  const errors: { id: string; error: string }[] = [];

  for (const slug of entrySlugs) {
    try {
      const deleted = await deleteEntry(collectionSlug, slug);
      if (deleted) {
        processed++;
      } else {
        errors.push({ id: slug, error: "Entry not found" });
      }
    } catch (error) {
      errors.push({ id: slug, error: String(error) });
    }
  }

  return {
    success: errors.length === 0,
    processed,
    failed: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Bulk update entry status
 */
export async function bulkUpdateStatus(
  collectionSlug: string,
  entrySlugs: string[],
  status: EntryStatus,
  userId?: string,
): Promise<BulkOperationResult> {
  let processed = 0;
  const errors: { id: string; error: string }[] = [];
  const now = getTimestamp();

  for (const slug of entrySlugs) {
    try {
      const entry = await getEntry(collectionSlug, slug);
      if (!entry) {
        errors.push({ id: slug, error: "Entry not found" });
        continue;
      }

      await updateEntry(
        collectionSlug,
        slug,
        {
          status,
          publishedAt:
            status === "published" && !entry.publishedAt
              ? now
              : entry.publishedAt,
        },
        userId,
      );
      processed++;
    } catch (error) {
      errors.push({ id: slug, error: String(error) });
    }
  }

  return {
    success: errors.length === 0,
    processed,
    failed: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Update entry order (for sortable collections)
 */
export async function updateEntryOrder(
  collectionSlug: string,
  orderedSlugs: string[],
  userId?: string,
): Promise<boolean> {
  for (let i = 0; i < orderedSlugs.length; i++) {
    const entry = await getEntry(collectionSlug, orderedSlugs[i]);
    if (entry && entry.order !== i) {
      await updateEntry(collectionSlug, orderedSlugs[i], { order: i }, userId);
    }
  }
  return true;
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get entry count for a collection
 */
export async function getEntryCount(collectionSlug: string): Promise<number> {
  const { total } = await listEntries(collectionSlug, { limit: 0 });
  return total;
}

/**
 * Get published entry by slug (for public API)
 */
export async function getPublishedEntry(
  collectionSlug: string,
  entrySlug: string,
): Promise<CollectionEntry | null> {
  const entry = await getEntry(collectionSlug, entrySlug);
  if (!entry || entry.status !== "published") return null;
  return entry;
}

/**
 * List published entries (for public API)
 */
export async function listPublishedEntries(
  collectionSlug: string,
  params: Omit<ListParams, "status"> = {},
): Promise<ListResponse<CollectionEntry>> {
  return listEntries(collectionSlug, {
    ...params,
    status: "published",
  });
}

/**
 * Get all entries for a collection (without pagination)
 */
export async function getAllEntries(
  collectionSlug: string,
  status?: EntryStatus,
): Promise<CollectionEntry[]> {
  const { items } = await listEntries(collectionSlug, {
    limit: 10000,
    status,
  });
  return items;
}

/**
 * Search entries across multiple collections
 */
export async function searchEntriesGlobal(
  search: string,
  collectionSlugs?: string[],
  limit: number = 20,
): Promise<{ collectionSlug: string; entry: CollectionEntry }[]> {
  const results: { collectionSlug: string; entry: CollectionEntry }[] = [];

  // Get all collections if not specified
  let slugsToSearch = collectionSlugs;
  if (!slugsToSearch) {
    try {
      const dirs = await fs.readdir(ENTRIES_BASE_DIR);
      slugsToSearch = dirs.filter(
        (d) => !d.startsWith(".") && !d.startsWith("_"),
      );
    } catch {
      return [];
    }
  }

  for (const slug of slugsToSearch) {
    const { items } = await listEntries(slug, {
      search,
      limit: Math.ceil(limit / slugsToSearch.length),
    });

    for (const entry of items) {
      results.push({ collectionSlug: slug, entry });
      if (results.length >= limit) break;
    }

    if (results.length >= limit) break;
  }

  return results;
}
