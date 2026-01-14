/**
 * Media Asset Types
 * Core type definitions for the Digital Asset Management system
 */

export type MediaType = 'image' | 'video' | 'document' | 'audio' | 'other';

export interface MediaDimensions {
  width: number;
  height: number;
}

export interface UsageLocation {
  type: 'page' | 'product' | 'block' | 'seo';
  entityId: string;
  entityName: string;
  field: string;
  usedAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  dimensions?: MediaDimensions;

  // Metadata
  altText: string;
  title: string;
  description: string;
  tags: string[];
  folderId: string | null;

  // Usage tracking
  usageLocations: UsageLocation[];
  usageCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  uploadedBy: string;

  // Runtime computed
  url?: string;
  thumbnailUrl?: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaIndex {
  version: number;
  assets: Record<string, MediaAsset>;
  folders: Record<string, MediaFolder>;
  tags: string[];
  lastUpdated: string;
}

// API types
export type SortField = 'name' | 'date' | 'size' | 'usage';
export type SortOrder = 'asc' | 'desc';

export interface MediaListParams {
  folderId?: string | null;
  search?: string;
  tags?: string[];
  mimeType?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface MediaListResponse {
  assets: MediaAsset[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface UploadResult {
  success: boolean;
  asset?: MediaAsset;
  error?: string;
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: { id: string; error: string }[];
}

export interface FolderTreeItem extends MediaFolder {
  children: FolderTreeItem[];
  assetCount: number;
}

// Helper to determine media type from MIME
export function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text/')
  )
    return 'document';
  return 'other';
}

// Generate unique ID
export function generateMediaId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `media_${timestamp}_${random}`;
}

export function generateFolderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `folder_${timestamp}_${random}`;
}

// Sanitize filename for storage
export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Sanitize slug
export function sanitizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
