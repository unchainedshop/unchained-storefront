/**
 * API Route: /api/pages/[slug]
 * Get (GET), update (PUT), or delete (DELETE) a specific page
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getPage,
  savePage,
  deletePage,
  isSlugAvailable,
} from '../../../modules/page-builder/utils/pageStorage';
import type { Page } from '../../../modules/page-builder/types';

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
        const page = await getPage(slug);
        if (!page) {
          return res.status(404).json({ error: 'Page not found' });
        }
        return res.status(200).json({ page });
      }

      case 'PUT': {
        const existingPage = await getPage(slug);
        if (!existingPage) {
          return res.status(404).json({ error: 'Page not found' });
        }

        const updatedData = req.body as Partial<Page>;

        // If slug is changing, check availability
        if (updatedData.slug && updatedData.slug !== slug) {
          const available = await isSlugAvailable(updatedData.slug, existingPage.id);
          if (!available) {
            return res.status(409).json({ error: 'Slug already exists' });
          }

          // Delete old file if slug changed
          await deletePage(slug);
        }

        const updatedPage: Page = {
          ...existingPage,
          ...updatedData,
          slug: updatedData.slug || slug,
        };

        const savedPage = await savePage(updatedPage);
        return res.status(200).json({ page: savedPage });
      }

      case 'DELETE': {
        const deleted = await deletePage(slug);
        if (!deleted) {
          return res.status(404).json({ error: 'Page not found' });
        }
        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
