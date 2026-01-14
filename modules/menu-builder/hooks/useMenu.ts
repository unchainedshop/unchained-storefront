/**
 * useMenu Hook
 * Fetches a published menu for frontend use
 */

import { useState, useEffect, useCallback } from "react";
import { useIntl } from "react-intl";
import type { ResolvedMenu, ResolvedMenuItem } from "../types";

interface UseMenuOptions {
  /** Whether to fetch automatically on mount */
  autoFetch?: boolean;
  /** Fallback menu items if API fails or menu not found */
  fallback?: ResolvedMenuItem[];
}

interface UseMenuReturn {
  /** The full resolved menu object */
  menu: ResolvedMenu | null;
  /** Menu items (with fallback) */
  items: ResolvedMenuItem[];
  /** Whether the menu is currently loading */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Manually refetch the menu */
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a published menu for frontend consumption
 *
 * @param slug - The menu slug to fetch
 * @param options - Configuration options
 * @returns Menu data, loading state, and error state
 *
 * @example
 * ```tsx
 * const { items, isLoading } = useMenu("sidebar-main", {
 *   fallback: [{ id: "1", label: "Home", href: "/", openInNewTab: false }],
 * });
 * ```
 */
export function useMenu(
  slug: string,
  options: UseMenuOptions = {}
): UseMenuReturn {
  const { autoFetch = true, fallback = [] } = options;
  const { locale } = useIntl();

  const [menu, setMenu] = useState<ResolvedMenu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/menus/public/${slug}?locale=${locale}`);

      if (!res.ok) {
        if (res.status === 404) {
          // Menu not found - use fallback silently
          setMenu(null);
          return;
        }
        throw new Error("Failed to fetch menu");
      }

      const data = await res.json();
      setMenu(data.menu);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
      setMenu(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug, locale]);

  useEffect(() => {
    if (autoFetch) {
      fetchMenu();
    }
  }, [autoFetch, fetchMenu]);

  return {
    menu,
    items: menu?.items || fallback,
    isLoading,
    error,
    refetch: fetchMenu,
  };
}

export default useMenu;
