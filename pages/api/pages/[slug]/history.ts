/**
 * API Route: /api/pages/[slug]/history
 * Get Git history for a page
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getPageHistory,
  getPageAtCommit,
  restorePageVersion,
  commitPageChange,
} from '../../../../modules/page-builder/utils/gitHistory';
import { getPage } from '../../../../modules/page-builder/utils/pageStorage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        // Get version history
        const { commit } = req.query;

        if (commit && typeof commit === 'string') {
          // Get page at specific commit
          const content = await getPageAtCommit(slug, commit);
          if (!content) {
            return res.status(404).json({ error: 'Version not found' });
          }
          return res.status(200).json({ page: JSON.parse(content) });
        }

        // Get history list
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
        const history = await getPageHistory(slug, limit);
        return res.status(200).json({ history });
      }

      case 'POST': {
        // Restore to a specific version OR commit current changes
        const { action, commit, message } = req.body;

        if (action === 'restore' && commit) {
          const success = await restorePageVersion(slug, commit);
          if (!success) {
            return res.status(500).json({ error: 'Failed to restore version' });
          }

          // Get the restored page
          const page = await getPage(slug);
          return res.status(200).json({ page, restored: true });
        }

        if (action === 'commit' && message) {
          const commitHash = await commitPageChange(slug, message);
          return res.status(200).json({ committed: true, hash: commitHash });
        }

        return res.status(400).json({ error: 'Invalid action' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
