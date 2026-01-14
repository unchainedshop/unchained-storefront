/**
 * API Route: /api/media/[id]
 * Get (GET), update (PUT), or delete (DELETE) a single asset
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getAsset,
  updateAsset,
  deleteAsset,
} from '../../../modules/media/utils/mediaStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid asset ID' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const asset = await getAsset(id);

        if (!asset) {
          return res.status(404).json({ error: 'Asset not found' });
        }

        return res.status(200).json({ asset });
      }

      case 'PUT': {
        const updates = req.body;

        // Prevent certain fields from being updated directly
        delete updates.id;
        delete updates.createdAt;
        delete updates.filename; // Can't change filename via API

        const asset = await updateAsset(id, updates);

        if (!asset) {
          return res.status(404).json({ error: 'Asset not found' });
        }

        return res.status(200).json({ asset });
      }

      case 'DELETE': {
        const deleted = await deleteAsset(id);

        if (!deleted) {
          return res.status(404).json({ error: 'Asset not found' });
        }

        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
