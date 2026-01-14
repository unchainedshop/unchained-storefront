/**
 * API Route: /api/media/folders/tree
 * Get the complete folder tree for navigation
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getFolderTree } from '../../../../modules/media/utils/mediaStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const tree = await getFolderTree();
    return res.status(200).json({ tree });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
