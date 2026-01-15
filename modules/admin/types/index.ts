/**
 * Admin Types
 * Shared type definitions for admin features
 */

// Redirect types
export interface Redirect {
  id: string;
  from: string;
  to: string;
  type: 301 | 302;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// Role types
export type Permission =
  | "pages:read"
  | "pages:write"
  | "pages:delete"
  | "pages:publish"
  | "media:read"
  | "media:write"
  | "media:delete"
  | "menus:read"
  | "menus:write"
  | "menus:delete"
  | "collections:read"
  | "collections:write"
  | "collections:delete"
  | "settings:read"
  | "settings:write"
  | "roles:read"
  | "roles:write"
  | "redirects:read"
  | "redirects:write";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

// Color preset types
export interface ColorPreset {
  id: string;
  name: string;
  color: string; // hex color
}

// Settings types
export interface CMSSettings {
  siteName: Record<string, string>;
  defaultLocale: string;
  availableLocales: string[];
  logo: string;
  darkLogo: string;
  primaryColor: string;
  colorPresets: ColorPreset[];
  darkModeDefault: boolean;
  adminEmail: string;
  dateFormat: string;
  timeFormat: string;
}
