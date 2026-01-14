/**
 * API Route: /api/media/files/[...path]
 * Serve media files with proper headers and caching
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { getFilesDir, getThumbnailsDir } from '../../../../modules/media/utils/mediaStorage';

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.json': 'application/json',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { path: pathSegments } = req.query;

    if (!pathSegments || !Array.isArray(pathSegments)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    // Reconstruct the file path
    const relativePath = pathSegments.join('/');

    // Prevent directory traversal
    if (relativePath.includes('..')) {
      return res.status(403).json({ error: 'Invalid path' });
    }

    // Determine if it's a thumbnail or regular file
    let filePath: string;
    if (relativePath.startsWith('thumbnails/')) {
      // Thumbnail path: thumbnails/{id}_thumb.jpg
      const thumbFilename = relativePath.replace('thumbnails/', '');
      filePath = path.join(getThumbnailsDir(), thumbFilename);
    } else {
      // Regular file path: YYYY/MM/filename
      filePath = path.join(getFilesDir(), relativePath);
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get file stats for content-length
    const stats = await fs.stat(filePath);

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Set cache headers (1 year for immutable assets)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);

    // Read and send file
    const fileBuffer = await fs.readFile(filePath);
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('File serving error:', error);
    return res.status(500).json({ error: 'Error serving file' });
  }
}
