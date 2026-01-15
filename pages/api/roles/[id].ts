/**
 * Single Role API
 * GET - Get a role by ID
 * PUT - Update a role
 * DELETE - Delete a role
 */

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import type { Role } from "./index";
import { readJSONFile, writeJSONFile } from "../../../lib/jsonStorage";
import { nowISO } from "../../../lib/apiUtils";
import { withCMSAuth } from "../../../lib/adminAuth";

const ROLES_FILE = path.join(process.cwd(), "content", "roles.json");

interface RolesData {
  roles: Role[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS authentication
  const auth = await withCMSAuth(req, res);
  if (!auth.authorized) return;

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Role ID is required" });
  }

  try {
    const data = await readJSONFile<RolesData>(ROLES_FILE, { roles: [] });
    const roleIndex = data.roles.findIndex((r) => r.id === id);

    if (req.method === "GET") {
      if (roleIndex === -1) {
        return res.status(404).json({ error: "Role not found" });
      }
      return res.status(200).json({ role: data.roles[roleIndex] });
    }

    if (req.method === "PUT") {
      if (roleIndex === -1) {
        return res.status(404).json({ error: "Role not found" });
      }

      const existing = data.roles[roleIndex];
      const { name, description, permissions } = req.body;

      // Check for duplicate name (excluding current role)
      if (name && name !== existing.name) {
        const duplicateRole = data.roles.find(
          (r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== id,
        );
        if (duplicateRole) {
          return res
            .status(400)
            .json({ error: "A role with this name already exists" });
        }
      }

      // System roles can only have permissions updated, not name/description
      const updatedRole: Role = {
        ...existing,
        name: existing.isSystem ? existing.name : (name ?? existing.name),
        description: existing.isSystem
          ? existing.description
          : (description ?? existing.description),
        permissions: permissions ?? existing.permissions,
        updatedAt: nowISO(),
      };

      data.roles[roleIndex] = updatedRole;
      await writeJSONFile(ROLES_FILE, data);

      return res.status(200).json({ role: updatedRole });
    }

    if (req.method === "DELETE") {
      if (roleIndex === -1) {
        return res.status(404).json({ error: "Role not found" });
      }

      const role = data.roles[roleIndex];

      // Cannot delete system roles
      if (role.isSystem) {
        return res.status(400).json({ error: "Cannot delete system roles" });
      }

      data.roles.splice(roleIndex, 1);
      await writeJSONFile(ROLES_FILE, data);

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Role API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
