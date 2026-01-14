/**
 * API Route: /api/collections/schemas/[slug]
 * Get (GET), update (PUT), or delete (DELETE) a specific schema
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getSchema,
  updateSchema,
  deleteSchema,
  duplicateSchema,
  isSchemaSlugAvailable,
} from "../../../../modules/collections/utils/schemaStorage";
import type { UpdateSchemaInput } from "../../../../modules/collections/types";
import { withCMSAuth } from "../../../../lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS access for all operations
  const { authorized } = await withCMSAuth(req, res);
  if (!authorized) return;

  const { slug, action } = req.query;
  if (typeof slug !== "string") {
    return res.status(400).json({ error: "Invalid slug" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const schema = await getSchema(slug);
        if (!schema) {
          return res.status(404).json({ error: "Schema not found" });
        }
        return res.status(200).json({ schema });
      }

      case "PUT": {
        const { authorized: canEdit, user } = await withCMSAuth(req, res, "edit");
        if (!canEdit) return;

        const existing = await getSchema(slug);
        if (!existing) {
          return res.status(404).json({ error: "Schema not found" });
        }

        const updates = req.body as UpdateSchemaInput;

        // Check slug availability if changing
        if (updates.slug && updates.slug !== slug) {
          const available = await isSchemaSlugAvailable(
            updates.slug,
            existing.id,
          );
          if (!available) {
            return res.status(409).json({ error: "Slug already exists" });
          }
        }

        const updated = await updateSchema(slug, updates, user?._id);
        return res.status(200).json({ schema: updated });
      }

      case "DELETE": {
        const { authorized: canDelete, user } = await withCMSAuth(
          req,
          res,
          "delete",
        );
        if (!canDelete) return;

        const schemaToDelete = await getSchema(slug);
        if (!schemaToDelete) {
          return res.status(404).json({ error: "Schema not found" });
        }

        // TODO: Check if collection has entries and optionally prevent deletion
        const deleted = await deleteSchema(slug);
        if (!deleted) {
          return res.status(404).json({ error: "Schema not found" });
        }

        return res.status(200).json({ success: true });
      }

      case "POST": {
        // Handle duplicate action
        if (action === "duplicate") {
          const { authorized: canCreate, user } = await withCMSAuth(
            req,
            res,
            "create",
          );
          if (!canCreate) return;

          const existing = await getSchema(slug);
          if (!existing) {
            return res.status(404).json({ error: "Schema not found" });
          }

          const { newSlug } = req.body;
          if (!newSlug) {
            return res.status(400).json({ error: "New slug is required" });
          }

          const available = await isSchemaSlugAvailable(newSlug);
          if (!available) {
            return res.status(409).json({ error: "Slug already exists" });
          }

          const duplicated = await duplicateSchema(slug, newSlug, user?._id);
          return res.status(201).json({ schema: duplicated });
        }

        return res.status(400).json({ error: "Invalid action" });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE", "POST"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
