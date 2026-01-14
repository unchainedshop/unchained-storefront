/**
 * CMS Configuration
 * Configurable per Unchained installation
 */

export const cmsConfig = {
  // Supported locales - configurable per installation
  locales: (process.env.CMS_LOCALES || "de,fr,it,en").split(","),

  // Default locale for new content
  defaultLocale: process.env.CMS_DEFAULT_LOCALE || "de",

  // Fallback locale when translation is missing
  fallbackLocale: process.env.CMS_FALLBACK_LOCALE || "de",

  // Role-based permissions mapping
  // Maps Unchained roles to CMS permissions
  permissions: {
    admin: [
      "create",
      "edit",
      "delete",
      "publish",
      "unpublish",
      "approve",
      "reject",
      "schedule",
      "settings",
      "audit",
    ],
    editor: ["create", "edit", "submit_review"],
    reviewer: ["approve", "reject"],
    publisher: ["publish", "unpublish", "schedule"],
  } as Record<string, string[]>,

  // Roles that grant CMS access
  cmsRoles: ["admin", "editor", "reviewer", "publisher"],
};

export type CMSPermission =
  | "create"
  | "edit"
  | "delete"
  | "publish"
  | "unpublish"
  | "approve"
  | "reject"
  | "submit_review"
  | "schedule"
  | "settings"
  | "audit";

export function getPermissionsForRole(role: string): string[] {
  return cmsConfig.permissions[role] || [];
}

export function hasPermission(
  userRoles: string[],
  permission: CMSPermission,
): boolean {
  return userRoles.some((role) =>
    getPermissionsForRole(role).includes(permission),
  );
}

export function hasCMSAccess(userRoles: string[]): boolean {
  return userRoles.some((role) => cmsConfig.cmsRoles.includes(role));
}
