/**
 * Client-safe Media Utilities
 * Helper functions that can run in both browser and server
 */

/**
 * Get a human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'application/json': '.json',
  };

  return mimeMap[mimeType] || '';
}

/**
 * Check if a MIME type is an image
 */
export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if a MIME type is a video
 */
export function isVideoMimeType(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Check if a MIME type is supported for thumbnail generation
 */
export function supportsThumbnail(mimeType: string): boolean {
  const supported = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/tiff',
  ];
  return supported.includes(mimeType);
}
