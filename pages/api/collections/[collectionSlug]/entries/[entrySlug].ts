/**
 * API Route: /api/collections/[collectionSlug]/entries/[entrySlug]
 * Get (GET), update (PUT), or delete (DELETE) a specific entry
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getEntry,
  updateEntry,
  deleteEntry,
  duplicateEntry,
  isEntrySlugAvailable,
} from "../../../../../modules/collections/utils/entryStorage";
import { getSchema } from "../../../../../modules/collections/utils/schemaStorage";
import type { UpdateEntryInput } from "../../../../../modules/collections/types";
import { withCMSAuth } from "../../../../../lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS access for all operations
  const { authorized } = await withCMSAuth(req, res);
  if (!authorized) return;

  const { collectionSlug, entrySlug, action } = req.query;

  if (typeof collectionSlug !== "string") {
    return res.status(400).json({ error: "Invalid collection slug" });
  }

  if (typeof entrySlug !== "string") {
    return res.status(400).json({ error: "Invalid entry slug" });
  }

  // Verify collection exists
  const schema = await getSchema(collectionSlug);
  if (!schema) {
    return res.status(404).json({ error: "Collection not found" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const entry = await getEntry(collectionSlug, entrySlug);
        if (!entry) {
          return res.status(404).json({ error: "Entry not found" });
        }
        return res.status(200).json({ entry, schema });
      }

      case "PUT": {
        const { authorized: canEdit, user } = await withCMSAuth(
          req,
          res,
          "edit",
        );
        if (!canEdit) return;

        const existing = await getEntry(collectionSlug, entrySlug);
        if (!existing) {
          return res.status(404).json({ error: "Entry not found" });
        }

        const updates = req.body as UpdateEntryInput;

        // Check slug availability if changing
        if (updates.slug && updates.slug !== entrySlug) {
          const available = await isEntrySlugAvailable(
            collectionSlug,
            updates.slug,
            existing.id,
          );
          if (!available) {
            return res.status(409).json({ error: "Slug already exists" });
          }
        }

        // Check permission for status change
        if (updates.status === "published" && existing.status !== "published") {
          const { authorized: canPublish } = await withCMSAuth(
            req,
            res,
            "publish",
          );
          if (!canPublish) return;
        }

        const updated = await updateEntry(
          collectionSlug,
          entrySlug,
          updates,
          user?._id,
        );
        return res.status(200).json({ entry: updated });
      }

      case "DELETE": {
        const { authorized: canDelete } = await withCMSAuth(
          req,
          res,
          "delete",
        );
        if (!canDelete) return;

        const entryToDelete = await getEntry(collectionSlug, entrySlug);
        if (!entryToDelete) {
          return res.status(404).json({ error: "Entry not found" });
        }

        const deleted = await deleteEntry(collectionSlug, entrySlug);
        if (!deleted) {
          return res.status(404).json({ error: "Entry not found" });
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

          const existing = await getEntry(collectionSlug, entrySlug);
          if (!existing) {
            return res.status(404).json({ error: "Entry not found" });
          }

          const { newSlug } = req.body;

          if (newSlug) {
            const available = await isEntrySlugAvailable(
              collectionSlug,
              newSlug,
            );
            if (!available) {
              return res.status(409).json({ error: "Slug already exists" });
            }
          }

          const duplicated = await duplicateEntry(
            collectionSlug,
            entrySlug,
            newSlug,
            user?._id,
          );
          return res.status(201).json({ entry: duplicated });
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
