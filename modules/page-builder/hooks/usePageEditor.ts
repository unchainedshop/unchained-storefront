/**
 * usePageEditor Hook
 * Handles save and publish operations for page editor
 */

import { useCallback } from "react";
import { useRouter } from "next/router";
import type { Page } from "../types";

interface UsePageEditorOptions {
  /** Current slug - undefined for new pages */
  slug?: string;
  /** Called after successful save with slug change */
  onSlugChange?: (newSlug: string) => void;
}

interface UsePageEditorReturn {
  handleSave: (page: Page) => Promise<void>;
  handlePublish: (page: Page) => Promise<void>;
  handleBack: () => void;
}

export function usePageEditor(
  options: UsePageEditorOptions = {},
): UsePageEditorReturn {
  const { slug, onSlugChange } = options;
  const router = useRouter();
  const isNewPage = !slug;

  const handleSave = useCallback(
    async (page: Page): Promise<void> => {
      const url = isNewPage ? "/api/pages" : `/api/pages/${slug}`;
      const method = isNewPage ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || `Failed to ${isNewPage ? "create" : "save"} page`,
        );
      }

      const data = await res.json();

      // Handle slug change (new page or slug updated)
      if (isNewPage || (data.page.slug !== slug && onSlugChange)) {
        onSlugChange?.(data.page.slug);
      }
    },
    [slug, isNewPage, onSlugChange],
  );

  const handlePublish = useCallback(
    async (page: Page): Promise<void> => {
      const publishedPage = {
        ...page,
        status: "published" as const,
        publishedAt: new Date().toISOString(),
      };

      const url = isNewPage ? "/api/pages" : `/api/pages/${slug}`;
      const method = isNewPage ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publishedPage),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error || `Failed to ${isNewPage ? "create" : "publish"} page`,
        );
      }

      const data = await res.json();

      // Handle slug change (new page or slug updated)
      if (isNewPage || (data.page.slug !== slug && onSlugChange)) {
        onSlugChange?.(data.page.slug);
      }
    },
    [slug, isNewPage, onSlugChange],
  );

  const handleBack = useCallback(() => {
    router.push("/admin/pages");
  }, [router]);

  return {
    handleSave,
    handlePublish,
    handleBack,
  };
}

export default usePageEditor;
