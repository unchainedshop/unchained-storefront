/**
 * API Route: /api/media/search
 * Search assets by query, tags, or type
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { searchAssets } from '../../../modules/media/utils/mediaStorage';
import type { MediaListParams } from '../../../modules/media/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { q, tags, type, folderId, limit } = req.query;

    if (typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const options: Omit<MediaListParams, 'search'> = {};

    if (typeof tags === 'string' && tags) {
      options.tags = tags.split(',').filter(Boolean);
    }

    if (typeof type === 'string' && type) {
      options.mimeType = type;
    }

    if (folderId === 'null') {
      options.folderId = null;
    } else if (typeof folderId === 'string') {
      options.folderId = folderId;
    }

    if (typeof limit === 'string') {
      options.limit = Math.min(parseInt(limit, 10) || 50, 100);
    }

    const assets = await searchAssets(q.trim(), options);

    return res.status(200).json({ assets, total: assets.length });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
