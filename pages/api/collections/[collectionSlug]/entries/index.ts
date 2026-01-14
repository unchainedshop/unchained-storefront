/**
 * API Route: /api/collections/[collectionSlug]/entries
 * List entries (GET) or create a new entry (POST)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  listEntries,
  createEntry,
  isEntrySlugAvailable,
} from "../../../../../modules/collections/utils/entryStorage";
import { getSchema } from "../../../../../modules/collections/utils/schemaStorage";
import type {
  CreateEntryInput,
  EntryStatus,
} from "../../../../../modules/collections/types";
import { withCMSAuth } from "../../../../../lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS access for all operations
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
    switch (req.method) {
      case "GET": {
        const { page, limit, search, status, sortBy, sortOrder, locale } =
          req.query;
        const result = await listEntries(collectionSlug, {
          page: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 50,
          search: search as string,
          status: status as EntryStatus | EntryStatus[],
          sortBy: sortBy as string,
          sortOrder: sortOrder as "asc" | "desc",
          locale: locale as string,
        });
        return res.status(200).json(result);
      }

      case "POST": {
        // Require 'create' permission for POST
        const { authorized: canCreate } = await withCMSAuth(req, res, "create");
        if (!canCreate) return;

        const input = req.body as CreateEntryInput;

        // Check singleton constraint
        if (schema.singleton) {
          const { total } = await listEntries(collectionSlug, { limit: 1 });
          if (total > 0) {
            return res.status(409).json({
              error: "Singleton collection already has an entry",
            });
          }
        }

        // Check slug availability if provided
        if (input.slug) {
          const available = await isEntrySlugAvailable(
            collectionSlug,
            input.slug,
          );
          if (!available) {
            return res.status(409).json({ error: "Entry slug already exists" });
          }
        }

        const entry = await createEntry(collectionSlug, input, user?._id);
        return res.status(201).json({ entry });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
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
