/**
 * API Route: /api/collections/products/[slug]
 * Get (GET), update (PUT), or delete (DELETE) a specific product collection
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getProductCollection,
  updateProductCollection,
  deleteProductCollection,
  duplicateProductCollection,
  isProductCollectionSlugAvailable,
  addProductsToCollection,
  removeProductsFromCollection,
  reorderProductsInCollection,
} from "../../../../modules/collections/utils/productCollectionStorage";
import type { UpdateProductCollectionInput } from "../../../../modules/collections/types";
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
        const collection = await getProductCollection(slug);
        if (!collection) {
          return res.status(404).json({ error: "Product collection not found" });
        }
        return res.status(200).json({ collection });
      }

      case "PUT": {
        const { authorized: canEdit, user } = await withCMSAuth(
          req,
          res,
          "edit",
        );
        if (!canEdit) return;

        const existing = await getProductCollection(slug);
        if (!existing) {
          return res.status(404).json({ error: "Product collection not found" });
        }

        const updates = req.body as UpdateProductCollectionInput;

        // Check slug availability if changing
        if (updates.slug && updates.slug !== slug) {
          const available = await isProductCollectionSlugAvailable(
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

        const updated = await updateProductCollection(slug, updates, user?._id);
        return res.status(200).json({ collection: updated });
      }

      case "DELETE": {
        const { authorized: canDelete } = await withCMSAuth(
          req,
          res,
          "delete",
        );
        if (!canDelete) return;

        const collectionToDelete = await getProductCollection(slug);
        if (!collectionToDelete) {
          return res.status(404).json({ error: "Product collection not found" });
        }

        const deleted = await deleteProductCollection(slug);
        if (!deleted) {
          return res.status(404).json({ error: "Product collection not found" });
        }

        return res.status(200).json({ success: true });
      }

      case "POST": {
        // Handle various actions
        const { authorized: canEdit, user } = await withCMSAuth(
          req,
          res,
          "edit",
        );
        if (!canEdit) return;

        switch (action) {
          case "duplicate": {
            const { authorized: canCreate, user: createUser } = await withCMSAuth(
              req,
              res,
              "create",
            );
            if (!canCreate) return;

            const existing = await getProductCollection(slug);
            if (!existing) {
              return res.status(404).json({ error: "Product collection not found" });
            }

            const { newSlug } = req.body;
            if (!newSlug) {
              return res.status(400).json({ error: "New slug is required" });
            }

            const available = await isProductCollectionSlugAvailable(newSlug);
            if (!available) {
              return res.status(409).json({ error: "Slug already exists" });
            }

            const duplicated = await duplicateProductCollection(
              slug,
              newSlug,
              createUser?._id,
            );
            return res.status(201).json({ collection: duplicated });
          }

          case "add-products": {
            const { productIds } = req.body;
            if (!productIds?.length) {
              return res.status(400).json({ error: "Product IDs are required" });
            }

            const updated = await addProductsToCollection(
              slug,
              productIds,
              user?._id,
            );
            if (!updated) {
              return res.status(404).json({ error: "Product collection not found" });
            }
            return res.status(200).json({ collection: updated });
          }

          case "remove-products": {
            const { productIds } = req.body;
            if (!productIds?.length) {
              return res.status(400).json({ error: "Product IDs are required" });
            }

            const updated = await removeProductsFromCollection(
              slug,
              productIds,
              user?._id,
            );
            if (!updated) {
              return res.status(404).json({ error: "Product collection not found" });
            }
            return res.status(200).json({ collection: updated });
          }

          case "reorder-products": {
            const { orderedProductIds } = req.body;
            if (!orderedProductIds?.length) {
              return res.status(400).json({
                error: "Ordered product IDs are required",
              });
            }

            const updated = await reorderProductsInCollection(
              slug,
              orderedProductIds,
              user?._id,
            );
            if (!updated) {
              return res.status(404).json({ error: "Product collection not found" });
            }
            return res.status(200).json({ collection: updated });
          }

          default:
            return res.status(400).json({ error: "Invalid action" });
        }
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
