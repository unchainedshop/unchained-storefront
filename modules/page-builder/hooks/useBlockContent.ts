/**
 * Block Content Hook
 * Provides localized content for block components
 */

import { useMemo } from "react";
import { usePageBuilder } from "../context/PageBuilderContext";
import type { PageBlock, BlockContent, LocalizedContent } from "../types";
import { getLocalizedContent } from "../utils/localization";
import { cmsConfig } from "../../../lib/cms.config";

/**
 * Get localized content for a block
 * Falls back to fallback locale if content not available for active locale
 */
export function useBlockContent<T extends BlockContent>(
  block: PageBlock,
): T {
  const { activeLocale } = usePageBuilder();

  const content = useMemo(() => {
    const localizedContent = block.content as LocalizedContent<T>;
    return (
      getLocalizedContent(localizedContent, activeLocale, cmsConfig.fallbackLocale) ||
      ({} as T)
    );
  }, [block.content, activeLocale]);

  return content;
}

/**
 * Check if the current block content is using fallback (not the active locale)
 */
export function useIsUsingFallback(block: PageBlock): boolean {
  const { activeLocale } = usePageBuilder();

  return useMemo(() => {
    const content = block.content as LocalizedContent;
    return (
      !(activeLocale in content) ||
      content[activeLocale] === undefined ||
      content[activeLocale] === null
    );
  }, [block.content, activeLocale]);
}

export default useBlockContent;
