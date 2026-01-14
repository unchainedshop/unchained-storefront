/**
 * API Route: /api/collections/public/[collectionSlug]
 * Public endpoint to list published entries (no auth required)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { listPublishedEntries } from "../../../../../modules/collections/utils/entryStorage";
import { getSchema } from "../../../../../modules/collections/utils/schemaStorage";
import { getLocalizedValue } from "../../../../../modules/collections/utils/helpers";
import { cmsConfig } from "../../../../../lib/cms.config";
import type { LocalizedString } from "../../../../../modules/collections/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const {
    collectionSlug,
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    locale: requestedLocale,
  } = req.query;

  if (typeof collectionSlug !== "string") {
    return res.status(400).json({ error: "Invalid collection slug" });
  }

  try {
    // Verify collection exists and is active
    const schema = await getSchema(collectionSlug);
    if (!schema || schema.status !== "active") {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Determine locale
    let locale = cmsConfig.defaultLocale;
    if (
      typeof requestedLocale === "string" &&
      cmsConfig.locales.includes(requestedLocale)
    ) {
      locale = requestedLocale;
    }

    // Get published entries only
    const result = await listPublishedEntries(collectionSlug, {
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      locale,
    });

    // Resolve localized content for each entry
    const resolvedItems = result.items.map((entry) => {
      const resolvedContent: Record<string, unknown> = {};

      for (const field of schema.fields) {
        const value = entry.content[field.name];

        if (field.localized && value && typeof value === "object") {
          resolvedContent[field.name] = getLocalizedValue(
            value as LocalizedString,
            locale,
            cmsConfig.fallbackLocale,
          );
        } else {
          resolvedContent[field.name] = value;
        }
      }

      return {
        id: entry.id,
        slug: entry.slug,
        content: resolvedContent,
        publishedAt: entry.publishedAt,
      };
    });

    // Set cache headers for CDN/browser caching
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    res.setHeader("Vary", "Accept-Language");

    return res.status(200).json({
      items: resolvedItems,
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasMore: result.hasMore,
      locale,
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
