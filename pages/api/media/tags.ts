/**
 * API Route: /api/media/tags
 * Get all tags with usage counts
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getTagsWithCounts } from '../../../modules/media/utils/mediaStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const tags = await getTagsWithCounts();
    return res.status(200).json({ tags });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
