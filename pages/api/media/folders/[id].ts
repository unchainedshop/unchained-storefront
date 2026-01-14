/**
 * API Route: /api/media/folders/[id]
 * Get (GET), update (PUT), or delete (DELETE) a single folder
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFolder,
  updateFolder,
  deleteFolder,
  listAssets,
} from '../../../../modules/media/utils/mediaStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid folder ID' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const folder = await getFolder(id);

        if (!folder) {
          return res.status(404).json({ error: 'Folder not found' });
        }

        // Also get assets in this folder
        const { assets, total } = await listAssets({ folderId: id, limit: 100 });

        return res.status(200).json({ folder, assets, assetCount: total });
      }

      case 'PUT': {
        const updates = req.body;

        // Prevent certain fields from being updated
        delete updates.id;
        delete updates.createdAt;

        const folder = await updateFolder(id, updates);

        if (!folder) {
          return res.status(404).json({ error: 'Folder not found' });
        }

        return res.status(200).json({ folder });
      }

      case 'DELETE': {
        const { deleteContents } = req.query;

        const deleted = await deleteFolder(id, deleteContents === 'true');

        if (!deleted) {
          return res.status(404).json({ error: 'Folder not found' });
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
