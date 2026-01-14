/**
 * Menu Builder Types
 * Core type definitions for the menu builder system
 */

import type { LocalizedString } from "../../page-builder/types";

// Re-export LocalizedString for convenience
export type { LocalizedString };

// =============================================================================
// MENU TYPES
// =============================================================================

/**
 * Menu placement/type
 */
export type MenuType = "header" | "sidebar" | "footer";

/**
 * Menu publication status
 */
export type MenuStatus = "draft" | "published";

/**
 * Type of link for a menu item
 */
export type MenuItemLinkType = "page" | "category" | "external" | "submenu";

/**
 * Available icons for menu items (Heroicons names)
 */
export type MenuItemIcon =
  | "home"
  | "shopping-bag"
  | "shopping-cart"
  | "user"
  | "heart"
  | "bookmark"
  | "tag"
  | "document"
  | "document-text"
  | "phone"
  | "envelope"
  | "globe-alt"
  | "information-circle"
  | "question-mark-circle"
  | "cog"
  | "squares-2x2"
  | "list-bullet"
  | "credit-card"
  | "truck"
  | "map-pin"
  | "building-storefront"
  | "none";

// =============================================================================
// MENU ITEM
// =============================================================================

/**
 * A single menu item
 */
export interface MenuItem {
  /** Unique identifier */
  id: string;
  /** Localized label for the menu item */
  label: LocalizedString;
  /** Type of link */
  linkType: MenuItemLinkType;
  /** For page links - the page slug */
  pageSlug?: string;
  /** For category links - the category/assortment ID */
  categoryId?: string;
  /** For category links - the category slug for URL */
  categorySlug?: string;
  /** For external links - full URL */
  externalUrl?: string;
  /** Optional icon identifier */
  icon?: MenuItemIcon;
  /** Whether to open in new tab (mainly for external links) */
  openInNewTab?: boolean;
  /** Whether item is visible */
  isVisible: boolean;
  /** Nested children (for submenu type or expandable items) */
  children?: MenuItem[];
  /** Sort order within parent */
  order: number;
  /** Optional CSS class for custom styling */
  cssClass?: string;
}

// =============================================================================
// MENU
// =============================================================================

/**
 * A complete menu
 */
export interface Menu {
  /** Unique identifier */
  id: string;
  /** URL-safe slug identifier */
  slug: string;
  /** Localized menu name (for admin display) */
  name: LocalizedString;
  /** Menu placement type */
  type: MenuType;
  /** Publication status */
  status: MenuStatus;
  /** Menu items */
  items: MenuItem[];
  /** Creation timestamp (ISO) */
  createdAt: string;
  /** Last update timestamp (ISO) */
  updatedAt: string;
  /** Publication timestamp (ISO) */
  publishedAt?: string;
  /** Who last modified */
  lastModifiedBy?: string;
}

// =============================================================================
// INPUT TYPES
// =============================================================================

/**
 * Input for creating a new menu
 */
export interface CreateMenuInput {
  slug: string;
  name: LocalizedString;
  type: MenuType;
}

/**
 * Input for updating a menu
 */
export interface UpdateMenuInput {
  name?: LocalizedString;
  slug?: string;
  type?: MenuType;
  status?: MenuStatus;
  items?: MenuItem[];
}

// =============================================================================
// RESOLVED TYPES (for frontend consumption)
// =============================================================================

/**
 * A menu item resolved to a single locale with computed href
 */
export interface ResolvedMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: MenuItemIcon;
  openInNewTab: boolean;
  children?: ResolvedMenuItem[];
}

/**
 * A menu resolved to a single locale
 */
export interface ResolvedMenu {
  id: string;
  slug: string;
  name: string;
  type: MenuType;
  items: ResolvedMenuItem[];
  locale: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Stats for dashboard display
 */
export interface MenuStats {
  total: number;
  published: number;
  draft: number;
  byType: Record<MenuType, number>;
}

/**
 * Menu item for drag-drop operations
 */
export interface DragMenuItem extends MenuItem {
  depth: number;
  parentId: string | null;
}
