/**
 * API Route: /api/cms/stats
 * Get CMS dashboard statistics
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { withCMSAuth } from "../../../lib/adminAuth";
import { listPages } from "../../../modules/page-builder/utils/pageStorage";
import { listAssets } from "../../../modules/media/utils/mediaStorage";
import { listSchemas } from "../../../modules/collections/utils/schemaStorage";
import { listEntries } from "../../../modules/collections/utils/entryStorage";
import type { Page, PageStatus } from "../../../modules/page-builder/types";
import { cmsConfig } from "../../../lib/cms.config";
import { getLocalizedString } from "../../../modules/page-builder/utils/localization";

interface PageStat {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  updatedAt: string;
  workflow?: {
    submittedAt?: string;
    submittedBy?: string;
    scheduledFor?: string;
  };
  translationCompleteness: number;
}

interface DashboardStats {
  pages: {
    total: number;
    draft: number;
    in_review: number;
    approved: number;
    published: number;
    archived: number;
  };
  media: {
    total: number;
    totalSizeBytes: number;
  };
  collections: {
    total: number;
    totalEntries: number;
  };
  pendingReviews: PageStat[];
  recentEdits: PageStat[];
  incompleteTranslations: PageStat[];
  scheduledPublishes: PageStat[];
}

/**
 * Calculate translation completeness for a page
 */
function calculateTranslationCompleteness(page: Page): number {
  const locales = cmsConfig.locales;
  const sourceLocale =
    page.translations?.sourceLocale || cmsConfig.defaultLocale;

  if (locales.length <= 1) return 100;

  let totalFields = 0;
  let translatedFields = 0;

  // Check title translations
  if (page.title) {
    for (const locale of locales) {
      totalFields++;
      if (page.title[locale] && page.title[locale].trim()) {
        translatedFields++;
      }
    }
  }

  // Check blocks content translations
  const checkBlocks = (blocks: Page["blocks"]) => {
    for (const block of blocks) {
      // For each locale, check if content exists
      for (const locale of locales) {
        if (block.content && typeof block.content === "object") {
          totalFields++;
          const localeContent = block.content[locale];
          if (localeContent && Object.keys(localeContent).length > 0) {
            translatedFields++;
          }
        }
      }

      // Recursively check children
      if (block.children?.length) {
        checkBlocks(block.children);
      }
    }
  };

  if (page.blocks?.length) {
    checkBlocks(page.blocks);
  }

  if (totalFields === 0) return 100;
  return Math.round((translatedFields / totalFields) * 100);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { authorized } = await withCMSAuth(req, res);
    if (!authorized) return;

    // Get all pages
    const pages = await listPages();

    // Calculate page stats
    const statusCounts = {
      draft: 0,
      in_review: 0,
      approved: 0,
      published: 0,
      archived: 0,
    };

    for (const page of pages) {
      const status = page.status || "draft";
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++;
      }
    }

    // Get media stats
    let mediaTotal = 0;
    let mediaTotalSize = 0;
    try {
      const mediaResult = await listAssets({});
      mediaTotal = mediaResult.total;
      mediaTotalSize = mediaResult.assets.reduce(
        (sum, m) => sum + (m.size || 0),
        0,
      );
    } catch {
      // Media might not be set up yet
    }

    // Get collections stats
    let collectionsTotal = 0;
    let collectionsTotalEntries = 0;
    try {
      const schemasResult = await listSchemas({});
      collectionsTotal = schemasResult.total;
      // Count entries for each collection
      for (const schema of schemasResult.items) {
        try {
          const entriesResult = await listEntries(schema.slug, { limit: 1 });
          collectionsTotalEntries += entriesResult.total;
        } catch {
          // Skip if entries can't be loaded
        }
      }
    } catch {
      // Collections might not be set up yet
    }

    // Get pending reviews (pages in_review status)
    const pendingReviews = pages
      .filter((p) => p.status === "in_review")
      .sort(
        (a, b) =>
          new Date(b.workflow?.submittedAt || b.updatedAt).getTime() -
          new Date(a.workflow?.submittedAt || a.updatedAt).getTime(),
      )
      .slice(0, 10)
      .map((page) => ({
        id: page.id,
        slug: page.slug,
        title: getLocalizedString(page.title, cmsConfig.defaultLocale),
        status: page.status,
        updatedAt: page.updatedAt,
        workflow: page.workflow
          ? {
              submittedAt: page.workflow.submittedAt,
              submittedBy: page.workflow.submittedBy,
            }
          : undefined,
        translationCompleteness: calculateTranslationCompleteness(page),
      }));

    // Get recent edits (most recently updated pages)
    const recentEdits = pages
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 10)
      .map((page) => ({
        id: page.id,
        slug: page.slug,
        title: getLocalizedString(page.title, cmsConfig.defaultLocale),
        status: page.status,
        updatedAt: page.updatedAt,
        translationCompleteness: calculateTranslationCompleteness(page),
      }));

    // Get pages with incomplete translations
    const incompleteTranslations = pages
      .map((page) => ({
        page,
        completeness: calculateTranslationCompleteness(page),
      }))
      .filter(({ completeness }) => completeness < 100)
      .sort((a, b) => a.completeness - b.completeness)
      .slice(0, 10)
      .map(({ page, completeness }) => ({
        id: page.id,
        slug: page.slug,
        title: getLocalizedString(page.title, cmsConfig.defaultLocale),
        status: page.status,
        updatedAt: page.updatedAt,
        translationCompleteness: completeness,
      }));

    // Get scheduled publishes
    const now = new Date();
    const scheduledPublishes = pages
      .filter(
        (p) =>
          p.workflow?.scheduledFor && new Date(p.workflow.scheduledFor) > now,
      )
      .sort(
        (a, b) =>
          new Date(a.workflow!.scheduledFor!).getTime() -
          new Date(b.workflow!.scheduledFor!).getTime(),
      )
      .slice(0, 10)
      .map((page) => ({
        id: page.id,
        slug: page.slug,
        title: getLocalizedString(page.title, cmsConfig.defaultLocale),
        status: page.status,
        updatedAt: page.updatedAt,
        workflow: {
          scheduledFor: page.workflow?.scheduledFor,
        },
        translationCompleteness: calculateTranslationCompleteness(page),
      }));

    const stats: DashboardStats = {
      pages: {
        total: pages.length,
        ...statusCounts,
      },
      media: {
        total: mediaTotal,
        totalSizeBytes: mediaTotalSize,
      },
      collections: {
        total: collectionsTotal,
        totalEntries: collectionsTotalEntries,
      },
      pendingReviews,
      recentEdits,
      incompleteTranslations,
      scheduledPublishes,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error("CMS Stats API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
