/**
 * useMenus Hook
 * Manages menus list operations for admin - fetching, creating, deleting
 */

import { useState, useCallback, useEffect } from "react";
import type { Menu, CreateMenuInput, MenuType } from "../types";

interface UseMenusOptions {
  /** Whether to fetch automatically on mount */
  autoFetch?: boolean;
  /** Filter by menu type */
  type?: MenuType;
}

interface UseMenusReturn {
  /** List of menus */
  menus: Menu[];
  /** Whether menus are currently loading */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Fetch/refresh the menus list */
  fetchMenus: () => Promise<void>;
  /** Create a new menu */
  createMenu: (input: CreateMenuInput) => Promise<Menu | null>;
  /** Delete a menu */
  deleteMenu: (menu: Menu) => Promise<boolean>;
  /** Duplicate a menu */
  duplicateMenu: (menu: Menu, newSlug: string) => Promise<Menu | null>;
}

/**
 * Hook for admin menu list operations
 *
 * @param options - Configuration options
 * @returns Menu list, operations, and state
 *
 * @example
 * ```tsx
 * const { menus, isLoading, createMenu, deleteMenu } = useMenus();
 * ```
 */
export function useMenus(options: UseMenusOptions = {}): UseMenusReturn {
  const { autoFetch = true, type } = options;

  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/menus");
      if (!res.ok) throw new Error("Failed to fetch menus");
      const data = await res.json();
      let fetchedMenus = data.menus as Menu[];

      // Filter by type if specified
      if (type) {
        fetchedMenus = fetchedMenus.filter((m) => m.type === type);
      }

      setMenus(fetchedMenus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menus");
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  const createMenu = useCallback(
    async (input: CreateMenuInput): Promise<Menu | null> => {
      try {
        const res = await fetch("/api/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create menu");
        }

        const data = await res.json();
        await fetchMenus();
        return data.menu;
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to create menu");
        return null;
      }
    },
    [fetchMenus]
  );

  const deleteMenu = useCallback(
    async (menu: Menu): Promise<boolean> => {
      const menuName = Object.values(menu.name)[0] || menu.slug;
      if (!window.confirm(`Are you sure you want to delete "${menuName}"?`)) {
        return false;
      }

      try {
        const res = await fetch(`/api/menus/${menu.slug}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete menu");
        await fetchMenus();
        return true;
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete menu");
        return false;
      }
    },
    [fetchMenus]
  );

  const duplicateMenu = useCallback(
    async (menu: Menu, newSlug: string): Promise<Menu | null> => {
      try {
        // For now, we'll create a new menu and copy the items
        // A proper duplicate endpoint could be added later
        const duplicatedName: Record<string, string> = {};
        for (const [locale, name] of Object.entries(menu.name)) {
          duplicatedName[locale] = `${name} (Copy)`;
        }

        const input: CreateMenuInput = {
          slug: newSlug,
          name: duplicatedName,
          type: menu.type,
        };

        const res = await fetch("/api/menus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to duplicate menu");
        }

        const data = await res.json();
        const newMenu = data.menu as Menu;

        // Copy items to the new menu
        const updateRes = await fetch(`/api/menus/${newMenu.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newMenu,
            items: menu.items,
          }),
        });

        if (!updateRes.ok) {
          throw new Error("Failed to copy menu items");
        }

        const updateData = await updateRes.json();
        await fetchMenus();
        return updateData.menu;
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to duplicate menu");
        return null;
      }
    },
    [fetchMenus]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchMenus();
    }
  }, [autoFetch, fetchMenus]);

  return {
    menus,
    isLoading,
    error,
    fetchMenus,
    createMenu,
    deleteMenu,
    duplicateMenu,
  };
}

export default useMenus;
