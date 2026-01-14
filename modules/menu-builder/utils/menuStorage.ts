/**
 * File-based Menu Storage
 * Stores menus as JSON files in content/menus/
 */

import fs from "fs/promises";
import path from "path";
import type {
  Menu,
  MenuItem,
  CreateMenuInput,
  LocalizedString,
} from "../types";
import { getLocalizedString } from "../../page-builder/utils/localization";
import { cmsConfig } from "../../../lib/cms.config";
import { generateMenuId, generateMenuItemId } from "./helpers";

// Re-export for convenience (but prefer importing from helpers.ts directly on client)
export { generateMenuItemId };

const MENUS_DIR = path.join(process.cwd(), "content", "menus");

/**
 * Ensure the menus directory exists
 */
export async function ensureMenusDir(): Promise<void> {
  try {
    await fs.access(MENUS_DIR);
  } catch {
    await fs.mkdir(MENUS_DIR, { recursive: true });
  }
}

/**
 * Get the file path for a menu
 */
function getMenuPath(slug: string): string {
  // Sanitize slug to prevent directory traversal
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "-");
  return path.join(MENUS_DIR, `${safeSlug}.json`);
}

/**
 * List all menus
 */
export async function listMenus(): Promise<Menu[]> {
  await ensureMenusDir();

  const files = await fs.readdir(MENUS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const menus: Menu[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(path.join(MENUS_DIR, file), "utf-8");
      const menu = JSON.parse(content) as Menu;
      menus.push(menu);
    } catch (error) {
      console.error(`Error reading menu ${file}:`, error);
    }
  }

  // Sort by updatedAt descending
  return menus.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

/**
 * Get a single menu by slug
 */
export async function getMenu(slug: string): Promise<Menu | null> {
  await ensureMenusDir();

  const filePath = getMenuPath(slug);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as Menu;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get a menu by ID
 */
export async function getMenuById(id: string): Promise<Menu | null> {
  const menus = await listMenus();
  return menus.find((m) => m.id === id) || null;
}

/**
 * Get menus by type
 */
export async function getMenusByType(type: Menu["type"]): Promise<Menu[]> {
  const menus = await listMenus();
  return menus.filter((m) => m.type === type);
}

/**
 * Get published menu by slug
 */
export async function getPublishedMenu(slug: string): Promise<Menu | null> {
  const menu = await getMenu(slug);
  if (!menu || menu.status !== "published") return null;
  return menu;
}

/**
 * Create a new menu
 */
export async function createMenu(input: CreateMenuInput): Promise<Menu> {
  await ensureMenusDir();

  const now = new Date().toISOString();

  const menu: Menu = {
    id: generateMenuId(),
    slug: input.slug,
    name: input.name,
    type: input.type,
    status: "draft",
    items: [],
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getMenuPath(input.slug);
  await fs.writeFile(filePath, JSON.stringify(menu, null, 2), "utf-8");

  return menu;
}

/**
 * Save a menu (create or update)
 */
export async function saveMenu(menu: Menu): Promise<Menu> {
  await ensureMenusDir();

  const now = new Date().toISOString();

  // Check if menu exists (for update vs create)
  const existing = await getMenu(menu.slug);

  const updatedMenu: Menu = {
    ...menu,
    createdAt: existing?.createdAt || menu.createdAt || now,
    updatedAt: now,
  };

  const filePath = getMenuPath(menu.slug);
  await fs.writeFile(filePath, JSON.stringify(updatedMenu, null, 2), "utf-8");

  return updatedMenu;
}

/**
 * Delete a menu
 */
export async function deleteMenu(slug: string): Promise<boolean> {
  await ensureMenusDir();

  const filePath = getMenuPath(slug);

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

/**
 * Rename a menu (change slug)
 */
export async function renameMenu(
  oldSlug: string,
  newSlug: string,
): Promise<Menu | null> {
  const menu = await getMenu(oldSlug);
  if (!menu) return null;

  // Delete old file
  await deleteMenu(oldSlug);

  // Save with new slug
  const updatedMenu = { ...menu, slug: newSlug };
  return saveMenu(updatedMenu);
}

/**
 * Duplicate a menu
 */
export async function duplicateMenu(
  slug: string,
  newSlug: string,
): Promise<Menu | null> {
  const menu = await getMenu(slug);
  if (!menu) return null;

  const now = new Date().toISOString();

  // Create localized name with "(Copy)" suffix for each locale
  const duplicatedName: LocalizedString = {};
  for (const locale of Object.keys(menu.name)) {
    const originalName = menu.name[locale];
    duplicatedName[locale] = originalName ? `${originalName} (Copy)` : "";
  }

  // Ensure at least the default locale has a name
  if (!duplicatedName[cmsConfig.defaultLocale]) {
    const fallbackName = getLocalizedString(menu.name, cmsConfig.defaultLocale);
    duplicatedName[cmsConfig.defaultLocale] = fallbackName
      ? `${fallbackName} (Copy)`
      : "Untitled (Copy)";
  }

  // Deep clone items with new IDs
  const cloneItems = (items: MenuItem[]): MenuItem[] => {
    return items.map((item) => ({
      ...item,
      id: generateMenuItemId(),
      children: item.children ? cloneItems(item.children) : undefined,
    }));
  };

  const duplicatedMenu: Menu = {
    ...menu,
    id: generateMenuId(),
    slug: newSlug,
    name: duplicatedName,
    status: "draft",
    items: cloneItems(menu.items),
    createdAt: now,
    updatedAt: now,
    publishedAt: undefined,
  };

  return saveMenu(duplicatedMenu);
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const menu = await getMenu(slug);
  if (!menu) return true;
  if (excludeId && menu.id === excludeId) return true;
  return false;
}

/**
 * Get menu stats
 */
export async function getMenuStats(): Promise<{
  total: number;
  published: number;
  draft: number;
  byType: Record<string, number>;
}> {
  const menus = await listMenus();

  const stats = {
    total: menus.length,
    published: menus.filter((m) => m.status === "published").length,
    draft: menus.filter((m) => m.status === "draft").length,
    byType: {
      header: menus.filter((m) => m.type === "header").length,
      sidebar: menus.filter((m) => m.type === "sidebar").length,
      footer: menus.filter((m) => m.type === "footer").length,
    },
  };

  return stats;
}
