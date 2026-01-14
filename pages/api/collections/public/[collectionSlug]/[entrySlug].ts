/**
 * API Route: /api/collections/public/[collectionSlug]/[entrySlug]
 * Public endpoint to get a published entry (no auth required)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getPublishedEntry } from "../../../../../modules/collections/utils/entryStorage";
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

  const { collectionSlug, entrySlug, locale: requestedLocale } = req.query;

  if (typeof collectionSlug !== "string" || typeof entrySlug !== "string") {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  try {
    // Verify collection exists
    const schema = await getSchema(collectionSlug);
    if (!schema) {
      return res.status(404).json({ error: "Collection not found" });
    }

    // Get published entry only
    const entry = await getPublishedEntry(collectionSlug, entrySlug);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Determine locale
    let locale = cmsConfig.defaultLocale;
    if (
      typeof requestedLocale === "string" &&
      cmsConfig.locales.includes(requestedLocale)
    ) {
      locale = requestedLocale;
    }

    // Resolve localized content based on schema fields
    const resolvedContent: Record<string, unknown> = {};

    for (const field of schema.fields) {
      const value = entry.content[field.name];

      if (field.localized && value && typeof value === "object") {
        // Get localized value with fallback
        resolvedContent[field.name] = getLocalizedValue(
          value as LocalizedString,
          locale,
          cmsConfig.fallbackLocale,
        );
      } else {
        // Non-localized field, use as-is
        resolvedContent[field.name] = value;
      }
    }

    // Set cache headers for CDN/browser caching
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    res.setHeader("Vary", "Accept-Language");

    return res.status(200).json({
      entry: {
        id: entry.id,
        slug: entry.slug,
        content: resolvedContent,
        locale,
        publishedAt: entry.publishedAt,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
