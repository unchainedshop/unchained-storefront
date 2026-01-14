/**
 * API Route: /api/collections/[collectionSlug]/entries/bulk
 * Bulk operations on entries (delete, status change, reorder)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  bulkDeleteEntries,
  bulkUpdateStatus,
  updateEntryOrder,
} from "../../../../../modules/collections/utils/entryStorage";
import { getSchema } from "../../../../../modules/collections/utils/schemaStorage";
import type { EntryStatus } from "../../../../../modules/collections/types";
import { withCMSAuth } from "../../../../../lib/adminAuth";

type BulkOperation = "delete" | "status" | "reorder";

interface BulkRequestBody {
  operation: BulkOperation;
  entrySlugs?: string[];
  status?: EntryStatus;
  orderedSlugs?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // Require CMS access
  const { authorized, user } = await withCMSAuth(req, res);
  if (!authorized) return;

  const { collectionSlug } = req.query;
  if (typeof collectionSlug !== "string") {
    return res.status(400).json({ error: "Invalid collection slug" });
  }

  // Verify collection exists
  const schema = await getSchema(collectionSlug);
  if (!schema) {
    return res.status(404).json({ error: "Collection not found" });
  }

  try {
    const body = req.body as BulkRequestBody;

    if (!body.operation) {
      return res.status(400).json({ error: "Operation is required" });
    }

    switch (body.operation) {
      case "delete": {
        const { authorized: canDelete } = await withCMSAuth(
          req,
          res,
          "delete",
        );
        if (!canDelete) return;

        if (!body.entrySlugs?.length) {
          return res
            .status(400)
            .json({ error: "entrySlugs array is required" });
        }

        const result = await bulkDeleteEntries(collectionSlug, body.entrySlugs);
        return res.status(200).json(result);
      }

      case "status": {
        if (!body.entrySlugs?.length) {
          return res
            .status(400)
            .json({ error: "entrySlugs array is required" });
        }
        if (!body.status) {
          return res.status(400).json({ error: "status is required" });
        }

        // Check permission based on target status
        const permission = body.status === "published" ? "publish" : "edit";
        const { authorized: canUpdate } = await withCMSAuth(
          req,
          res,
          permission,
        );
        if (!canUpdate) return;

        const result = await bulkUpdateStatus(
          collectionSlug,
          body.entrySlugs,
          body.status,
          user?._id,
        );
        return res.status(200).json(result);
      }

      case "reorder": {
        if (!schema.sortable) {
          return res
            .status(400)
            .json({ error: "Collection is not sortable" });
        }
        if (!body.orderedSlugs?.length) {
          return res
            .status(400)
            .json({ error: "orderedSlugs array is required" });
        }

        const { authorized: canEdit } = await withCMSAuth(req, res, "edit");
        if (!canEdit) return;

        await updateEntryOrder(collectionSlug, body.orderedSlugs, user?._id);
        return res.status(200).json({ success: true });
      }

      default:
        return res
          .status(400)
          .json({ error: `Invalid operation: ${body.operation}` });
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
