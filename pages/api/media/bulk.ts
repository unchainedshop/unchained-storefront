/**
 * API Route: /api/media/bulk
 * Bulk operations on assets (move, delete, tag)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  moveAssets,
  bulkDeleteAssets,
  bulkAddTags,
} from '../../../modules/media/utils/mediaStorage';

type BulkOperation = 'move' | 'delete' | 'tag';

interface BulkRequestBody {
  operation: BulkOperation;
  assetIds: string[];
  targetFolderId?: string | null;
  tags?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const body = req.body as BulkRequestBody;

    if (!body.operation) {
      return res.status(400).json({ error: 'Operation is required' });
    }

    if (!body.assetIds || !Array.isArray(body.assetIds) || body.assetIds.length === 0) {
      return res.status(400).json({ error: 'assetIds array is required' });
    }

    switch (body.operation) {
      case 'move': {
        if (body.targetFolderId === undefined) {
          return res.status(400).json({ error: 'targetFolderId is required for move operation' });
        }

        const result = await moveAssets(
          body.assetIds,
          body.targetFolderId === 'null' ? null : body.targetFolderId
        );

        return res.status(200).json(result);
      }

      case 'delete': {
        const result = await bulkDeleteAssets(body.assetIds);
        return res.status(200).json(result);
      }

      case 'tag': {
        if (!body.tags || !Array.isArray(body.tags) || body.tags.length === 0) {
          return res.status(400).json({ error: 'tags array is required for tag operation' });
        }

        const result = await bulkAddTags(body.assetIds, body.tags);
        return res.status(200).json(result);
      }

      default:
        return res.status(400).json({
          error: `Invalid operation: ${body.operation}. Supported: move, delete, tag`,
        });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
