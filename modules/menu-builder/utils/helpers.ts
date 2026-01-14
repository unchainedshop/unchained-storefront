/**
 * Menu Builder Helper Utilities (Client-safe)
 * These utilities can be used in both client and server environments
 */

/**
 * Generate a unique menu ID
 */
export function generateMenuId(): string {
  return `menu_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique menu item ID
 */
export function generateMenuItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
