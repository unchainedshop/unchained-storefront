/**
 * File-based Product Collection Storage
 * Stores product groupings as JSON files in content/collections/product-collections/
 */

import fs from "fs/promises";
import path from "path";
import type {
  ProductCollection,
  CreateProductCollectionInput,
  UpdateProductCollectionInput,
  ListParams,
  ListResponse,
} from "../types";
import {
  generateProductCollectionId,
  sanitizeSlug,
  getLocalizedValue,
  getTimestamp,
} from "./helpers";

const PRODUCT_COLLECTIONS_DIR = path.join(
  process.cwd(),
  "content",
  "collections",
  "product-collections",
);

/**
 * Ensure the product collections directory exists
 */
export async function ensureProductCollectionsDir(): Promise<void> {
  try {
    await fs.access(PRODUCT_COLLECTIONS_DIR);
  } catch {
    await fs.mkdir(PRODUCT_COLLECTIONS_DIR, { recursive: true });
  }
}

/**
 * Get the file path for a product collection
 */
function getProductCollectionPath(slug: string): string {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "-");
  return path.join(PRODUCT_COLLECTIONS_DIR, `${safeSlug}.json`);
}

/**
 * List all product collections with optional filtering and pagination
 */
export async function listProductCollections(
  params: ListParams = {},
): Promise<ListResponse<ProductCollection>> {
  await ensureProductCollectionsDir();

  const {
    page = 1,
    limit = 50,
    search,
    status,
    sortBy = "updatedAt",
    sortOrder = "desc",
    locale = "de",
  } = params;

  let files: string[];
  try {
    files = await fs.readdir(PRODUCT_COLLECTIONS_DIR);
  } catch {
    files = [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  let collections: ProductCollection[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(
        path.join(PRODUCT_COLLECTIONS_DIR, file),
        "utf-8",
      );
      collections.push(JSON.parse(content));
    } catch (error) {
      console.error(`Error reading product collection ${file}:`, error);
    }
  }

  // Status filter
  if (status) {
    const statuses = Array.isArray(status) ? status : [status];
    collections = collections.filter((c) =>
      statuses.includes(c.status as unknown as (typeof statuses)[number]),
    );
  }

  // Search filter
  if (search) {
    const query = search.toLowerCase();
    collections = collections.filter(
      (c) =>
        c.slug.toLowerCase().includes(query) ||
        getLocalizedValue(c.name, locale).toLowerCase().includes(query) ||
        getLocalizedValue(c.description, locale).toLowerCase().includes(query),
    );
  }

  // Sort
  collections.sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    if (sortBy === "name") {
      aVal = getLocalizedValue(a.name, locale).toLowerCase();
      bVal = getLocalizedValue(b.name, locale).toLowerCase();
    } else {
      aVal = (a as unknown as Record<string, unknown>)[sortBy] as string;
      bVal = (b as unknown as Record<string, unknown>)[sortBy] as string;
    }

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === "desc" ? -comparison : comparison;
  });

  const total = collections.length;
  const offset = (page - 1) * limit;
  const items = collections.slice(offset, offset + limit);

  return {
    items,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  };
}

/**
 * Get a single product collection by slug
 */
export async function getProductCollection(
  slug: string,
): Promise<ProductCollection | null> {
  await ensureProductCollectionsDir();

  const filePath = getProductCollectionPath(slug);

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
 * Get a product collection by ID
 */
export async function getProductCollectionById(
  id: string,
): Promise<ProductCollection | null> {
  const { items } = await listProductCollections({ limit: 1000 });
  return items.find((c) => c.id === id) || null;
}

/**
 * Create a new product collection
 */
export async function createProductCollection(
  input: CreateProductCollectionInput,
  userId?: string,
): Promise<ProductCollection> {
  await ensureProductCollectionsDir();

  const now = getTimestamp();
  const slug = sanitizeSlug(input.slug);

  // Check if slug already exists
  const existing = await getProductCollection(slug);
  if (existing) {
    throw new Error(`Product collection with slug "${slug}" already exists`);
  }

  const collection: ProductCollection = {
    id: generateProductCollectionId(),
    slug,
    name: input.name,
    description: input.description,
    image: input.image,
    status: "draft",
    source: input.source,
    productIds: input.productIds,
    categoryId: input.categoryId,
    includeSub: input.includeSub,
    filters: input.filters,
    filterMatch: input.filterMatch,
    sort: input.sort,
    limit: input.limit,
    excludeOutOfStock: input.excludeOutOfStock,
    display: input.display,
    seo: input.seo,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  };

  const filePath = getProductCollectionPath(collection.slug);
  await fs.writeFile(filePath, JSON.stringify(collection, null, 2), "utf-8");

  return collection;
}

/**
 * Update a product collection
 */
export async function updateProductCollection(
  slug: string,
  updates: UpdateProductCollectionInput,
  userId?: string,
): Promise<ProductCollection | null> {
  const existing = await getProductCollection(slug);
  if (!existing) return null;

  const now = getTimestamp();
  const newSlug = updates.slug ? sanitizeSlug(updates.slug) : slug;

  // Check if new slug already exists (and is different from current)
  if (newSlug !== slug) {
    const conflicting = await getProductCollection(newSlug);
    if (conflicting) {
      throw new Error(
        `Product collection with slug "${newSlug}" already exists`,
      );
    }
  }

  const updated: ProductCollection = {
    ...existing,
    ...updates,
    slug: newSlug,
    id: existing.id,
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
  if (newSlug !== slug) {
    await deleteProductCollection(slug);
  }

  const filePath = getProductCollectionPath(newSlug);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  return updated;
}

/**
 * Delete a product collection
 */
export async function deleteProductCollection(slug: string): Promise<boolean> {
  await ensureProductCollectionsDir();

  const filePath = getProductCollectionPath(slug);

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
 * Check if a slug is available
 */
export async function isProductCollectionSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const collection = await getProductCollection(slug);
  if (!collection) return true;
  if (excludeId && collection.id === excludeId) return true;
  return false;
}

/**
 * Duplicate a product collection
 */
export async function duplicateProductCollection(
  slug: string,
  newSlug: string,
  userId?: string,
): Promise<ProductCollection | null> {
  const collection = await getProductCollection(slug);
  if (!collection) return null;

  const now = getTimestamp();
  const sanitizedNewSlug = sanitizeSlug(newSlug);

  // Check if new slug already exists
  const existing = await getProductCollection(sanitizedNewSlug);
  if (existing) {
    throw new Error(
      `Product collection with slug "${sanitizedNewSlug}" already exists`,
    );
  }

  // Create new name with "(Copy)" suffix
  const duplicatedName: Record<string, string> = {};
  for (const [locale, name] of Object.entries(collection.name)) {
    duplicatedName[locale] = `${name} (Copy)`;
  }

  const duplicated: ProductCollection = {
    ...collection,
    id: generateProductCollectionId(),
    slug: sanitizedNewSlug,
    name: duplicatedName,
    status: "draft",
    publishedAt: undefined,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: undefined,
  };

  const filePath = getProductCollectionPath(duplicated.slug);
  await fs.writeFile(filePath, JSON.stringify(duplicated, null, 2), "utf-8");

  return duplicated;
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get published product collection by slug (for public API / blocks)
 */
export async function getPublishedProductCollection(
  slug: string,
): Promise<ProductCollection | null> {
  const collection = await getProductCollection(slug);
  if (!collection || collection.status !== "published") return null;
  return collection;
}

/**
 * List published product collections
 */
export async function listPublishedProductCollections(
  params: Omit<ListParams, "status"> = {},
): Promise<ListResponse<ProductCollection>> {
  return listProductCollections({
    ...params,
    status: "published" as unknown as undefined,
  });
}

/**
 * Get all product collections (without pagination)
 */
export async function getAllProductCollections(): Promise<ProductCollection[]> {
  const { items } = await listProductCollections({ limit: 1000 });
  return items;
}

// =============================================================================
// PRODUCT RESOLUTION
// =============================================================================

/**
 * Get product IDs from a collection based on its source type
 * This is a placeholder - actual product fetching would integrate with Unchained Engine
 */
export async function resolveProductIds(
  collection: ProductCollection,
): Promise<string[]> {
  switch (collection.source) {
    case "manual":
      // For manual collections, just return the stored product IDs
      return collection.productIds || [];

    case "category":
      // TODO: Integrate with Unchained Engine to fetch products by category
      console.warn(
        `Category-based product resolution not yet implemented for collection: ${collection.slug}`,
      );
      return [];

    case "query":
      // TODO: Integrate with Unchained Engine to filter products
      console.warn(
        `Query-based product resolution not yet implemented for collection: ${collection.slug}`,
      );
      return [];

    case "bestselling":
      // TODO: Integrate with Unchained Engine to get bestselling products
      console.warn(
        `Bestselling product resolution not yet implemented for collection: ${collection.slug}`,
      );
      return [];

    case "newest":
      // TODO: Integrate with Unchained Engine to get newest products
      console.warn(
        `Newest product resolution not yet implemented for collection: ${collection.slug}`,
      );
      return [];

    default:
      return [];
  }
}

/**
 * Add products to a manual collection
 */
export async function addProductsToCollection(
  slug: string,
  productIds: string[],
  userId?: string,
): Promise<ProductCollection | null> {
  const collection = await getProductCollection(slug);
  if (!collection) return null;

  if (collection.source !== "manual") {
    throw new Error("Can only add products to manual collections");
  }

  const existingIds = collection.productIds || [];
  const newIds = productIds.filter((id) => !existingIds.includes(id));
  const mergedIds = [...existingIds, ...newIds];

  return updateProductCollection(slug, { productIds: mergedIds }, userId);
}

/**
 * Remove products from a manual collection
 */
export async function removeProductsFromCollection(
  slug: string,
  productIds: string[],
  userId?: string,
): Promise<ProductCollection | null> {
  const collection = await getProductCollection(slug);
  if (!collection) return null;

  if (collection.source !== "manual") {
    throw new Error("Can only remove products from manual collections");
  }

  const existingIds = collection.productIds || [];
  const filteredIds = existingIds.filter((id) => !productIds.includes(id));

  return updateProductCollection(slug, { productIds: filteredIds }, userId);
}

/**
 * Reorder products in a manual collection
 */
export async function reorderProductsInCollection(
  slug: string,
  orderedProductIds: string[],
  userId?: string,
): Promise<ProductCollection | null> {
  const collection = await getProductCollection(slug);
  if (!collection) return null;

  if (collection.source !== "manual") {
    throw new Error("Can only reorder products in manual collections");
  }

  return updateProductCollection(
    slug,
    { productIds: orderedProductIds },
    userId,
  );
}
