/**
 * API Route: /api/media
 * List assets (GET) or upload new asset (POST)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { listAssets } from '../../../modules/media/utils/mediaStorage';
import type { MediaListParams } from '../../../modules/media/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        const {
          folderId,
          search,
          tags,
          mimeType,
          sortBy,
          sortOrder,
          page,
          limit,
        } = req.query;

        const params: MediaListParams = {};

        if (folderId === 'null') {
          params.folderId = null;
        } else if (typeof folderId === 'string') {
          params.folderId = folderId;
        }

        if (typeof search === 'string') {
          params.search = search;
        }

        if (typeof tags === 'string') {
          params.tags = tags.split(',').filter(Boolean);
        } else if (Array.isArray(tags)) {
          params.tags = tags.filter((t): t is string => typeof t === 'string');
        }

        if (typeof mimeType === 'string') {
          params.mimeType = mimeType;
        }

        if (
          typeof sortBy === 'string' &&
          ['name', 'date', 'size', 'usage'].includes(sortBy)
        ) {
          params.sortBy = sortBy as MediaListParams['sortBy'];
        }

        if (
          typeof sortOrder === 'string' &&
          ['asc', 'desc'].includes(sortOrder)
        ) {
          params.sortOrder = sortOrder as MediaListParams['sortOrder'];
        }

        if (typeof page === 'string') {
          params.page = parseInt(page, 10) || 1;
        }

        if (typeof limit === 'string') {
          params.limit = Math.min(parseInt(limit, 10) || 50, 100);
        }

        const result = await listAssets(params);
        return res.status(200).json(result);
      }

      default:
        res.setHeader('Allow', ['GET']);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
