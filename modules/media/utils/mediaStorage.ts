/**
 * File-based Media Storage
 * Stores media metadata in content/media/index.json
 * Stores actual files in content/media/files/
 */

import fs from "fs/promises";
import path from "path";
import type {
  MediaAsset,
  MediaFolder,
  MediaIndex,
  MediaListParams,
  MediaListResponse,
  UsageLocation,
  BulkOperationResult,
  FolderTreeItem,
} from "../types";
import {
  generateMediaId,
  generateFolderId,
  sanitizeSlug,
  getMediaType,
} from "../types";

const MEDIA_DIR = path.join(process.cwd(), "content", "media");
const FILES_DIR = path.join(MEDIA_DIR, "files");
const THUMBNAILS_DIR = path.join(MEDIA_DIR, "thumbnails");
const INDEX_PATH = path.join(MEDIA_DIR, "index.json");

const DEFAULT_INDEX: MediaIndex = {
  version: 1,
  assets: {},
  folders: {},
  tags: [],
  lastUpdated: new Date().toISOString(),
};

/**
 * Ensure all media directories exist
 */
export async function ensureMediaDirs(): Promise<void> {
  await fs.mkdir(FILES_DIR, { recursive: true });
  await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
}

/**
 * Load the media index
 */
export async function loadIndex(): Promise<MediaIndex> {
  await ensureMediaDirs();

  try {
    const content = await fs.readFile(INDEX_PATH, "utf-8");
    return JSON.parse(content) as MediaIndex;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // Create default index
      await saveIndex(DEFAULT_INDEX);
      return DEFAULT_INDEX;
    }
    throw error;
  }
}

/**
 * Save the media index
 */
export async function saveIndex(index: MediaIndex): Promise<void> {
  await ensureMediaDirs();
  index.lastUpdated = new Date().toISOString();
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2), "utf-8");
}

// =============================================================================
// Asset Operations
// =============================================================================

/**
 * Get a single asset by ID
 */
export async function getAsset(id: string): Promise<MediaAsset | null> {
  const index = await loadIndex();
  const asset = index.assets[id];
  if (!asset) return null;

  // Add computed URLs
  return {
    ...asset,
    url: getPublicUrl(asset.filename),
    thumbnailUrl: getThumbnailUrl(asset.id),
  };
}

/**
 * List assets with filtering and pagination
 */
export async function listAssets(
  params: MediaListParams = {},
): Promise<MediaListResponse> {
  const {
    folderId,
    search,
    tags,
    mimeType,
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
    limit = 50,
  } = params;

  const index = await loadIndex();
  let assets = Object.values(index.assets);

  // Filter by folder
  if (folderId !== undefined) {
    assets = assets.filter((a) => a.folderId === folderId);
  }

  // Filter by search query
  if (search) {
    const query = search.toLowerCase();
    assets = assets.filter(
      (a) =>
        a.originalName.toLowerCase().includes(query) ||
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query)),
    );
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    assets = assets.filter((a) => tags.some((t) => a.tags.includes(t)));
  }

  // Filter by MIME type prefix
  if (mimeType) {
    assets = assets.filter((a) => a.mimeType.startsWith(mimeType));
  }

  // Sort
  assets.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.originalName.localeCompare(b.originalName);
        break;
      case "size":
        comparison = a.size - b.size;
        break;
      case "usage":
        comparison = a.usageCount - b.usageCount;
        break;
      case "date":
      default:
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }
    return sortOrder === "desc" ? -comparison : comparison;
  });

  const total = assets.length;
  const offset = (page - 1) * limit;
  const paginatedAssets = assets.slice(offset, offset + limit);

  // Add computed URLs
  const assetsWithUrls = paginatedAssets.map((asset) => ({
    ...asset,
    url: getPublicUrl(asset.filename),
    thumbnailUrl: getThumbnailUrl(asset.id),
  }));

  return {
    assets: assetsWithUrls,
    total,
    page,
    limit,
    hasMore: offset + limit < total,
  };
}

/**
 * Create a new asset (after file is saved)
 */
export async function createAsset(
  assetData: Omit<MediaAsset, "id" | "createdAt" | "updatedAt" | "usageCount">,
): Promise<MediaAsset> {
  const index = await loadIndex();
  const now = new Date().toISOString();

  const asset: MediaAsset = {
    ...assetData,
    id: generateMediaId(),
    createdAt: now,
    updatedAt: now,
    usageCount: assetData.usageLocations?.length || 0,
  };

  index.assets[asset.id] = asset;

  // Update tags list
  for (const tag of asset.tags) {
    if (!index.tags.includes(tag)) {
      index.tags.push(tag);
    }
  }

  await saveIndex(index);

  return {
    ...asset,
    url: getPublicUrl(asset.filename),
    thumbnailUrl: getThumbnailUrl(asset.id),
  };
}

/**
 * Update an asset's metadata
 */
export async function updateAsset(
  id: string,
  updates: Partial<MediaAsset>,
): Promise<MediaAsset | null> {
  const index = await loadIndex();
  const existing = index.assets[id];

  if (!existing) return null;

  const updatedAsset: MediaAsset = {
    ...existing,
    ...updates,
    id, // Prevent ID change
    createdAt: existing.createdAt, // Prevent createdAt change
    updatedAt: new Date().toISOString(),
    usageCount: updates.usageLocations?.length ?? existing.usageCount,
  };

  index.assets[id] = updatedAsset;

  // Update tags list if tags changed
  if (updates.tags) {
    for (const tag of updates.tags) {
      if (!index.tags.includes(tag)) {
        index.tags.push(tag);
      }
    }
  }

  await saveIndex(index);

  return {
    ...updatedAsset,
    url: getPublicUrl(updatedAsset.filename),
    thumbnailUrl: getThumbnailUrl(updatedAsset.id),
  };
}

/**
 * Delete an asset
 */
export async function deleteAsset(id: string): Promise<boolean> {
  const index = await loadIndex();
  const asset = index.assets[id];

  if (!asset) return false;

  // Delete the actual file
  try {
    const filePath = path.join(FILES_DIR, asset.filename);
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error(`Error deleting file for asset ${id}:`, error);
    }
  }

  // Delete thumbnail if exists
  try {
    const thumbPath = path.join(THUMBNAILS_DIR, `${id}_thumb.jpg`);
    await fs.unlink(thumbPath);
  } catch {
    // Thumbnail might not exist, ignore
  }

  delete index.assets[id];
  await saveIndex(index);

  return true;
}

/**
 * Move multiple assets to a folder
 */
export async function moveAssets(
  assetIds: string[],
  targetFolderId: string | null,
): Promise<BulkOperationResult> {
  const index = await loadIndex();
  let processed = 0;
  const errors: { id: string; error: string }[] = [];

  for (const id of assetIds) {
    const asset = index.assets[id];
    if (!asset) {
      errors.push({ id, error: "Asset not found" });
      continue;
    }

    asset.folderId = targetFolderId;
    asset.updatedAt = new Date().toISOString();
    processed++;
  }

  await saveIndex(index);

  return {
    success: errors.length === 0,
    processed,
    failed: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Bulk delete assets
 */
export async function bulkDeleteAssets(
  assetIds: string[],
): Promise<BulkOperationResult> {
  let processed = 0;
  const errors: { id: string; error: string }[] = [];

  for (const id of assetIds) {
    try {
      const deleted = await deleteAsset(id);
      if (deleted) {
        processed++;
      } else {
        errors.push({ id, error: "Asset not found" });
      }
    } catch (error) {
      errors.push({ id, error: String(error) });
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
 * Bulk add tags to assets
 */
export async function bulkAddTags(
  assetIds: string[],
  newTags: string[],
): Promise<BulkOperationResult> {
  const index = await loadIndex();
  let processed = 0;
  const errors: { id: string; error: string }[] = [];

  for (const id of assetIds) {
    const asset = index.assets[id];
    if (!asset) {
      errors.push({ id, error: "Asset not found" });
      continue;
    }

    const existingTags = new Set(asset.tags);
    for (const tag of newTags) {
      existingTags.add(tag);
      if (!index.tags.includes(tag)) {
        index.tags.push(tag);
      }
    }
    asset.tags = Array.from(existingTags);
    asset.updatedAt = new Date().toISOString();
    processed++;
  }

  await saveIndex(index);

  return {
    success: errors.length === 0,
    processed,
    failed: errors.length,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// =============================================================================
// Folder Operations
// =============================================================================

/**
 * Get a single folder by ID
 */
export async function getFolder(id: string): Promise<MediaFolder | null> {
  const index = await loadIndex();
  return index.folders[id] || null;
}

/**
 * List folders, optionally filtered by parent
 */
export async function listFolders(
  parentId?: string | null,
): Promise<MediaFolder[]> {
  const index = await loadIndex();
  let folders = Object.values(index.folders);

  if (parentId !== undefined) {
    folders = folders.filter((f) => f.parentId === parentId);
  }

  return folders.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Create a new folder
 */
export async function createFolder(
  data: Omit<MediaFolder, "id" | "createdAt" | "updatedAt">,
): Promise<MediaFolder> {
  const index = await loadIndex();
  const now = new Date().toISOString();

  const folder: MediaFolder = {
    ...data,
    id: generateFolderId(),
    slug: sanitizeSlug(data.name),
    createdAt: now,
    updatedAt: now,
  };

  index.folders[folder.id] = folder;
  await saveIndex(index);

  return folder;
}

/**
 * Update a folder
 */
export async function updateFolder(
  id: string,
  updates: Partial<MediaFolder>,
): Promise<MediaFolder | null> {
  const index = await loadIndex();
  const existing = index.folders[id];

  if (!existing) return null;

  const updatedFolder: MediaFolder = {
    ...existing,
    ...updates,
    id, // Prevent ID change
    slug: updates.name ? sanitizeSlug(updates.name) : existing.slug,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  index.folders[id] = updatedFolder;
  await saveIndex(index);

  return updatedFolder;
}

/**
 * Delete a folder and optionally its contents
 */
export async function deleteFolder(
  id: string,
  deleteContents = false,
): Promise<boolean> {
  const index = await loadIndex();
  const folder = index.folders[id];

  if (!folder) return false;

  // Handle contents
  const assetsInFolder = Object.values(index.assets).filter(
    (a) => a.folderId === id,
  );
  const subfolders = Object.values(index.folders).filter(
    (f) => f.parentId === id,
  );

  if (deleteContents) {
    // Delete all assets in folder
    for (const asset of assetsInFolder) {
      await deleteAsset(asset.id);
    }
    // Recursively delete subfolders
    for (const subfolder of subfolders) {
      await deleteFolder(subfolder.id, true);
    }
  } else {
    // Move contents to root
    for (const asset of assetsInFolder) {
      index.assets[asset.id].folderId = null;
    }
    for (const subfolder of subfolders) {
      index.folders[subfolder.id].parentId = null;
    }
  }

  // Reload index in case it changed
  const freshIndex = await loadIndex();
  delete freshIndex.folders[id];
  await saveIndex(freshIndex);

  return true;
}

/**
 * Get folder tree for navigation
 */
export async function getFolderTree(): Promise<FolderTreeItem[]> {
  const index = await loadIndex();
  const folders = Object.values(index.folders);
  const assets = Object.values(index.assets);

  // Count assets per folder
  const assetCounts: Record<string, number> = {};
  for (const asset of assets) {
    const folderId = asset.folderId || "root";
    assetCounts[folderId] = (assetCounts[folderId] || 0) + 1;
  }

  // Build tree recursively
  function buildTree(parentId: string | null): FolderTreeItem[] {
    return folders
      .filter((f) => f.parentId === parentId)
      .map((folder) => ({
        ...folder,
        children: buildTree(folder.id),
        assetCount: assetCounts[folder.id] || 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return buildTree(null);
}

// =============================================================================
// Search and Tags
// =============================================================================

/**
 * Search assets by query
 */
export async function searchAssets(
  query: string,
  options?: Omit<MediaListParams, "search">,
): Promise<MediaAsset[]> {
  const result = await listAssets({ ...options, search: query });
  return result.assets;
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const index = await loadIndex();
  return index.tags.sort();
}

/**
 * Get tag usage counts
 */
export async function getTagsWithCounts(): Promise<
  { tag: string; count: number }[]
> {
  const index = await loadIndex();
  const assets = Object.values(index.assets);
  const counts: Record<string, number> = {};

  for (const asset of assets) {
    for (const tag of asset.tags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

// =============================================================================
// Usage Tracking
// =============================================================================

/**
 * Add a usage location to an asset
 */
export async function addUsageLocation(
  assetId: string,
  location: UsageLocation,
): Promise<void> {
  const index = await loadIndex();
  const asset = index.assets[assetId];

  if (!asset) return;

  // Check if usage already exists
  const exists = asset.usageLocations.some(
    (u) => u.entityId === location.entityId && u.field === location.field,
  );

  if (!exists) {
    asset.usageLocations.push(location);
    asset.usageCount = asset.usageLocations.length;
    asset.updatedAt = new Date().toISOString();
    await saveIndex(index);
  }
}

/**
 * Remove a usage location from an asset
 */
export async function removeUsageLocation(
  assetId: string,
  entityId: string,
  field: string,
): Promise<void> {
  const index = await loadIndex();
  const asset = index.assets[assetId];

  if (!asset) return;

  asset.usageLocations = asset.usageLocations.filter(
    (u) => !(u.entityId === entityId && u.field === field),
  );
  asset.usageCount = asset.usageLocations.length;
  asset.updatedAt = new Date().toISOString();

  await saveIndex(index);
}

/**
 * Get all usage locations for an asset
 */
export async function getAssetUsage(assetId: string): Promise<UsageLocation[]> {
  const asset = await getAsset(assetId);
  return asset?.usageLocations || [];
}

/**
 * Find all unused assets
 */
export async function findUnusedAssets(): Promise<MediaAsset[]> {
  const index = await loadIndex();
  return Object.values(index.assets).filter((a) => a.usageCount === 0);
}

// =============================================================================
// File Helpers
// =============================================================================

/**
 * Get the storage path for a new file
 */
export function getStoragePath(originalName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ext = path.extname(originalName);
  const id = generateMediaId();

  return `${year}/${month}/${id}${ext}`;
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(filename: string): string {
  return `/api/media/files/${filename}`;
}

/**
 * Get the thumbnail URL for an asset
 */
export function getThumbnailUrl(assetId: string): string {
  return `/api/media/files/thumbnails/${assetId}_thumb.jpg`;
}

/**
 * Get the absolute file path
 */
export function getFilePath(filename: string): string {
  return path.join(FILES_DIR, filename);
}

/**
 * Get the absolute thumbnail path
 */
export function getThumbnailPath(assetId: string): string {
  return path.join(THUMBNAILS_DIR, `${assetId}_thumb.jpg`);
}

/**
 * Get the FILES_DIR path
 */
export function getFilesDir(): string {
  return FILES_DIR;
}

/**
 * Get the THUMBNAILS_DIR path
 */
export function getThumbnailsDir(): string {
  return THUMBNAILS_DIR;
}

/**
 * Find asset by URL
 */
export async function findAssetByUrl(url: string): Promise<MediaAsset | null> {
  const index = await loadIndex();

  // Try to extract filename from URL
  const match = url.match(/\/media\/files\/(.+)$/);
  if (!match) return null;

  const filename = match[1];
  const asset = Object.values(index.assets).find(
    (a) => a.filename === filename,
  );

  if (!asset) return null;

  return {
    ...asset,
    url: getPublicUrl(asset.filename),
    thumbnailUrl: getThumbnailUrl(asset.id),
  };
}
