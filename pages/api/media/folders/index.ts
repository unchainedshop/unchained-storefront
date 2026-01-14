/**
 * API Route: /api/media/folders
 * List folders (GET) or create a new folder (POST)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  listFolders,
  createFolder,
} from '../../../../modules/media/utils/mediaStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        const { parentId } = req.query;

        let parent: string | null | undefined;
        if (parentId === 'null') {
          parent = null;
        } else if (typeof parentId === 'string') {
          parent = parentId;
        }

        const folders = await listFolders(parent);
        return res.status(200).json({ folders });
      }

      case 'POST': {
        const { name, parentId, description, color } = req.body;

        if (!name || typeof name !== 'string') {
          return res.status(400).json({ error: 'Folder name is required' });
        }

        const folder = await createFolder({
          name: name.trim(),
          slug: '',
          parentId: parentId === 'null' || !parentId ? null : parentId,
          description: description || undefined,
          color: color || undefined,
        });

        return res.status(201).json({ folder });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
