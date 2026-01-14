/**
 * API Route: /api/menus/public/[slug]
 * Public endpoint to get a published menu with resolved localized content
 * No authentication required - for frontend use
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getMenu } from "../../../../modules/menu-builder/utils/menuStorage";
import type {
  MenuItem,
  ResolvedMenu,
  ResolvedMenuItem,
} from "../../../../modules/menu-builder/types";
import { getLocalizedString } from "../../../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../../../lib/cms.config";

/**
 * Resolve menu items to single locale with computed hrefs
 */
function resolveMenuItems(
  items: MenuItem[],
  locale: string,
  fallbackLocale: string
): ResolvedMenuItem[] {
  return items
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      let href = "#";

      switch (item.linkType) {
        case "page":
          href = item.pageSlug ? `/p/${item.pageSlug}` : "#";
          break;
        case "category":
          href = item.categorySlug
            ? `/shop/${item.categorySlug}`
            : item.categoryId
              ? `/shop/${item.categoryId}`
              : "#";
          break;
        case "external":
          href = item.externalUrl || "#";
          break;
        case "submenu":
          href = "#";
          break;
      }

      return {
        id: item.id,
        label: getLocalizedString(item.label, locale, fallbackLocale),
        href,
        icon: item.icon,
        openInNewTab: item.openInNewTab || false,
        children: item.children
          ? resolveMenuItems(item.children, locale, fallbackLocale)
          : undefined,
      };
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    const menu = await getMenu(slug);

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Only return published menus
    if (menu.status !== "published") {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Determine locale
    let locale = cmsConfig.defaultLocale;
    if (
      typeof requestedLocale === "string" &&
      cmsConfig.locales.includes(requestedLocale)
    ) {
      locale = requestedLocale;
    }

    const resolvedMenu: ResolvedMenu = {
      id: menu.id,
      slug: menu.slug,
      name: getLocalizedString(menu.name, locale, cmsConfig.fallbackLocale),
      type: menu.type,
      items: resolveMenuItems(menu.items, locale, cmsConfig.fallbackLocale),
      locale,
    };

    // Cache headers - cache for 1 minute, stale-while-revalidate for 5 minutes
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    res.setHeader("Vary", "Accept-Language");

    return res.status(200).json({ menu: resolvedMenu });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
