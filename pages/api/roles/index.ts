/**
 * User Roles API
 * GET - List all roles
 * POST - Create a new role
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const ROLES_FILE = path.join(process.cwd(), "content", "roles.json");

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

export const ALL_PERMISSIONS: { id: Permission; label: string; group: string }[] = [
  // Pages
  { id: "pages:read", label: "View Pages", group: "Pages" },
  { id: "pages:write", label: "Create/Edit Pages", group: "Pages" },
  { id: "pages:delete", label: "Delete Pages", group: "Pages" },
  { id: "pages:publish", label: "Publish Pages", group: "Pages" },
  // Media
  { id: "media:read", label: "View Media", group: "Media" },
  { id: "media:write", label: "Upload Media", group: "Media" },
  { id: "media:delete", label: "Delete Media", group: "Media" },
  // Menus
  { id: "menus:read", label: "View Menus", group: "Menus" },
  { id: "menus:write", label: "Create/Edit Menus", group: "Menus" },
  { id: "menus:delete", label: "Delete Menus", group: "Menus" },
  // Collections
  { id: "collections:read", label: "View Collections", group: "Collections" },
  { id: "collections:write", label: "Create/Edit Collections", group: "Collections" },
  { id: "collections:delete", label: "Delete Collections", group: "Collections" },
  // Settings
  { id: "settings:read", label: "View Settings", group: "Settings" },
  { id: "settings:write", label: "Modify Settings", group: "Settings" },
  // Roles
  { id: "roles:read", label: "View Roles", group: "User Management" },
  { id: "roles:write", label: "Manage Roles", group: "User Management" },
  // Redirects
  { id: "redirects:read", label: "View Redirects", group: "Redirects" },
  { id: "redirects:write", label: "Manage Redirects", group: "Redirects" },
];

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RolesData {
  roles: Role[];
}

// Default system roles
const defaultRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all features",
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can create and edit content, but cannot publish or manage settings",
    permissions: [
      "pages:read",
      "pages:write",
      "media:read",
      "media:write",
      "menus:read",
      "collections:read",
    ],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to content",
    permissions: [
      "pages:read",
      "media:read",
      "menus:read",
      "collections:read",
    ],
    isSystem: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function getRoles(): Promise<RolesData> {
  try {
    const data = await fs.readFile(ROLES_FILE, "utf-8");
    const parsed = JSON.parse(data);
    // Ensure system roles are always present
    const existingIds = parsed.roles.map((r: Role) => r.id);
    const missingSystemRoles = defaultRoles.filter(
      (r) => r.isSystem && !existingIds.includes(r.id)
    );
    return {
      roles: [...missingSystemRoles, ...parsed.roles],
    };
  } catch {
    return { roles: defaultRoles };
  }
}

async function saveRoles(data: RolesData): Promise<void> {
  const contentDir = path.dirname(ROLES_FILE);
  await fs.mkdir(contentDir, { recursive: true });
  await fs.writeFile(ROLES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const data = await getRoles();
      return res.status(200).json({
        roles: data.roles,
        permissions: ALL_PERMISSIONS,
      });
    }

    if (req.method === "POST") {
      const { name, description, permissions } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Role name is required" });
      }

      const data = await getRoles();

      // Check for duplicate name
      const existingRole = data.roles.find(
        (r) => r.name.toLowerCase() === name.toLowerCase()
      );
      if (existingRole) {
        return res.status(400).json({ error: "A role with this name already exists" });
      }

      const newRole: Role = {
        id: `role_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name,
        description: description || "",
        permissions: permissions || [],
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.roles.push(newRole);
      await saveRoles(data);

      return res.status(201).json({ role: newRole });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Roles API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
