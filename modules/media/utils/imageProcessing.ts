/**
 * Image Processing Utilities
 * Handles image optimization, resizing, and thumbnail generation
 * Uses sharp if available, otherwise graceful degradation
 */

import fs from "fs/promises";
import path from "path";

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

const DEFAULT_THUMBNAIL_OPTIONS: Required<ThumbnailOptions> = {
  width: 300,
  height: 300,
  quality: 80,
  fit: "cover",
};

// Check if sharp is available
let sharp: typeof import("sharp") | null | undefined;

async function getSharp(): Promise<typeof import("sharp") | null> {
  if (sharp !== undefined) return sharp;

  try {
    sharp = (await import("sharp")).default;
    return sharp;
  } catch {
    console.warn("sharp not available, image processing will be limited");
    sharp = null;
    return null;
  }
}

/**
 * Get image metadata (dimensions and format)
 */
export async function getImageMetadata(
  filePath: string,
): Promise<ImageMetadata | null> {
  const sharpModule = await getSharp();

  if (sharpModule) {
    try {
      const metadata = await sharpModule(filePath).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || "unknown",
      };
    } catch (error) {
      console.error("Error getting image metadata:", error);
      return null;
    }
  }

  // Fallback: Try to read dimensions from common image headers
  try {
    const buffer = await fs.readFile(filePath);
    return getImageSizeFromBuffer(buffer);
  } catch {
    return null;
  }
}

/**
 * Basic image size detection from buffer
 * Supports PNG, JPEG, GIF, WebP
 */
function getImageSizeFromBuffer(buffer: Buffer): ImageMetadata | null {
  // PNG signature
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height, format: "png" };
  }

  // JPEG signature
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    // Parse JPEG segments to find SOF
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);

      // SOF markers (Start Of Frame)
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height, format: "jpeg" };
      }

      offset += 2 + length;
    }
    return { width: 0, height: 0, format: "jpeg" };
  }

  // GIF signature
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    const width = buffer.readUInt16LE(6);
    const height = buffer.readUInt16LE(8);
    return { width, height, format: "gif" };
  }

  // WebP signature
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    // VP8 chunk
    if (buffer[12] === 0x56 && buffer[13] === 0x50 && buffer[14] === 0x38) {
      // VP8 (lossy)
      if (buffer[15] === 0x20) {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        return { width, height, format: "webp" };
      }
      // VP8L (lossless)
      if (buffer[15] === 0x4c) {
        const bits = buffer.readUInt32LE(21);
        const width = (bits & 0x3fff) + 1;
        const height = ((bits >> 14) & 0x3fff) + 1;
        return { width, height, format: "webp" };
      }
    }
    return { width: 0, height: 0, format: "webp" };
  }

  return null;
}

/**
 * Generate a thumbnail for an image
 */
export async function generateThumbnail(
  sourcePath: string,
  destPath: string,
  options: ThumbnailOptions = {},
): Promise<boolean> {
  const opts = { ...DEFAULT_THUMBNAIL_OPTIONS, ...options };
  const sharpModule = await getSharp();

  if (!sharpModule) {
    console.warn("Cannot generate thumbnail: sharp not available");
    return false;
  }

  try {
    // Ensure destination directory exists
    await fs.mkdir(path.dirname(destPath), { recursive: true });

    await sharpModule(sourcePath)
      .resize(opts.width, opts.height, { fit: opts.fit })
      .jpeg({ quality: opts.quality })
      .toFile(destPath);

    return true;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return false;
  }
}

/**
 * Optimize an image (resize if too large, compress)
 */
export async function optimizeImage(
  sourcePath: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {},
): Promise<{ path: string; size: number } | null> {
  const { maxWidth = 2000, maxHeight = 2000, quality = 85 } = options;
  const sharpModule = await getSharp();

  if (!sharpModule) {
    // Return original file info
    const stats = await fs.stat(sourcePath);
    return { path: sourcePath, size: stats.size };
  }

  try {
    const metadata = await sharpModule(sourcePath).metadata();

    // Skip if already small enough
    if (
      metadata.width &&
      metadata.height &&
      metadata.width <= maxWidth &&
      metadata.height <= maxHeight
    ) {
      const stats = await fs.stat(sourcePath);
      return { path: sourcePath, size: stats.size };
    }

    // Create optimized version
    const optimizedPath = sourcePath.replace(/(\.[^.]+)$/, "_optimized$1");

    await sharpModule(sourcePath)
      .resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toFile(optimizedPath);

    const stats = await fs.stat(optimizedPath);

    // Replace original with optimized
    await fs.rename(optimizedPath, sourcePath);

    return { path: sourcePath, size: stats.size };
  } catch (error) {
    console.error("Error optimizing image:", error);
    return null;
  }
}

/**
 * Check if a MIME type is an image
 */
export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if a MIME type is a video
 */
export function isVideoMimeType(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

/**
 * Check if a MIME type is supported for thumbnail generation
 */
export function supportsThumbnail(mimeType: string): boolean {
  const supported = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/tiff",
  ];
  return supported.includes(mimeType);
}

/**
 * Get a human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "application/json": ".json",
  };

  return mimeMap[mimeType] || "";
}
