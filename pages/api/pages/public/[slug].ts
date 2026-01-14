/**
 * API Route: /api/pages/public/[slug]
 * Public endpoint to get a published page with resolved localized content
 * No authentication required - for frontend use
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getPage } from "../../../../modules/page-builder/utils/pageStorage";
import type {
  Page,
  PageBlock,
  LocalizedContent,
  LocalizedSEOSettings,
  SEOSettings,
  BlockContent,
} from "../../../../modules/page-builder/types";
import {
  getLocalizedContent,
  getLocalizedString,
} from "../../../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../../../lib/cms.config";

/**
 * Resolved page with content flattened to single locale
 */
interface ResolvedPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  blocks: ResolvedBlock[];
  seo: SEOSettings;
  locale: string;
  availableLocales: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface ResolvedBlock {
  id: string;
  type: string;
  content: BlockContent;
  style: PageBlock["style"];
  responsive: PageBlock["responsive"];
  children?: ResolvedBlock[];
  locked?: boolean;
  hidden?: boolean;
}

/**
 * Resolve blocks to single locale
 */
function resolveBlocks(
  blocks: PageBlock[],
  locale: string,
  fallbackLocale: string,
): ResolvedBlock[] {
  return blocks.map((block) => ({
    id: block.id,
    type: block.type,
    content: (getLocalizedContent(
      block.content as LocalizedContent,
      locale,
      fallbackLocale,
    ) || {}) as BlockContent,
    style: block.style,
    responsive: block.responsive,
    children: block.children
      ? resolveBlocks(block.children, locale, fallbackLocale)
      : undefined,
    locked: block.locked,
    hidden: block.hidden,
  }));
}

/**
 * Resolve SEO to single locale
 */
function resolveSEO(
  seo: LocalizedSEOSettings,
  locale: string,
  fallbackLocale: string,
): SEOSettings {
  return {
    title: getLocalizedString(seo.title, locale, fallbackLocale) || undefined,
    description:
      getLocalizedString(seo.description, locale, fallbackLocale) || undefined,
    keywords:
      getLocalizedString(seo.keywords, locale, fallbackLocale) || undefined,
    ogImage:
      getLocalizedString(seo.ogImage, locale, fallbackLocale) || undefined,
    noIndex: seo.noIndex,
  };
}

/**
 * Get available locales from page content
 */
function getAvailableLocales(page: Page): string[] {
  const locales = new Set<string>();

  // Check title
  Object.keys(page.title).forEach((locale) => locales.add(locale));

  // Check blocks (first level only for performance)
  page.blocks.forEach((block) => {
    Object.keys(block.content).forEach((locale) => locales.add(locale));
  });

  return Array.from(locales);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { slug, locale: requestedLocale } = req.query;

  if (typeof slug !== "string") {
    return res.status(400).json({ error: "Invalid slug" });
  }

  try {
    const page = await getPage(slug);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // Only return published pages via public API
    if (page.status !== "published") {
      return res.status(404).json({ error: "Page not found" });
    }

    // Determine locale (from query, Accept-Language header, or default)
    let locale = cmsConfig.defaultLocale;

    if (
      typeof requestedLocale === "string" &&
      cmsConfig.locales.includes(requestedLocale)
    ) {
      locale = requestedLocale;
    } else if (req.headers["accept-language"]) {
      // Parse Accept-Language header and find first matching locale
      const acceptLanguage = req.headers["accept-language"];
      const preferredLocales = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase());

      for (const preferred of preferredLocales) {
        if (cmsConfig.locales.includes(preferred)) {
          locale = preferred;
          break;
        }
      }
    }

    // Resolve page content to the requested locale
    const resolvedPage: ResolvedPage = {
      id: page.id,
      title: getLocalizedString(page.title, locale, cmsConfig.fallbackLocale),
      slug: page.slug,
      status: page.status,
      blocks: resolveBlocks(page.blocks, locale, cmsConfig.fallbackLocale),
      seo: resolveSEO(page.seo, locale, cmsConfig.fallbackLocale),
      locale,
      availableLocales: getAvailableLocales(page),
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      publishedAt: page.publishedAt,
    };

    // Set cache headers for better performance
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
    res.setHeader("Vary", "Accept-Language");

    return res.status(200).json({ page: resolvedPage });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
