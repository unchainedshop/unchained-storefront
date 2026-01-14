/**
 * API Route: /api/collections/products
 * List product collections (GET) or create a new one (POST)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  listProductCollections,
  createProductCollection,
  isProductCollectionSlugAvailable,
} from "../../../../modules/collections/utils/productCollectionStorage";
import type { CreateProductCollectionInput } from "../../../../modules/collections/types";
import { withCMSAuth } from "../../../../lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS access for all operations
  const { authorized, user } = await withCMSAuth(req, res);
  if (!authorized) return;

  try {
    switch (req.method) {
      case "GET": {
        const { page, limit, search, status, sortBy, sortOrder, locale } =
          req.query;
        const result = await listProductCollections({
          page: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 50,
          search: search as string,
          status: status as "draft" | "published" | undefined,
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

        const input = req.body as CreateProductCollectionInput;

        if (!input.slug) {
          return res.status(400).json({ error: "Slug is required" });
        }

        if (!input.name) {
          return res.status(400).json({ error: "Name is required" });
        }

        if (!input.source) {
          return res.status(400).json({ error: "Source is required" });
        }

        // Validate source-specific requirements
        if (input.source === "manual" && !input.productIds?.length) {
          return res.status(400).json({
            error: "Product IDs are required for manual collections",
          });
        }

        if (input.source === "category" && !input.categoryId) {
          return res.status(400).json({
            error: "Category ID is required for category-based collections",
          });
        }

        const available = await isProductCollectionSlugAvailable(input.slug);
        if (!available) {
          return res.status(409).json({ error: "Slug already exists" });
        }

        const collection = await createProductCollection(input, user?._id);
        return res.status(201).json({ collection });
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
