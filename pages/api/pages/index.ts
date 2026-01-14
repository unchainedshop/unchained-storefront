/**
 * API Route: /api/pages
 * List all pages (GET) or create a new page (POST)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  listPages,
  savePage,
  isSlugAvailable,
} from "../../../modules/page-builder/utils/pageStorage";
import type { Page } from "../../../modules/page-builder/types";
import { withCMSAuth } from "../../../lib/adminAuth";

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
        const pages = await listPages();
        return res.status(200).json({ pages });
      }

      case "POST": {
        // Require 'create' permission for POST
        const { authorized: canCreate } = await withCMSAuth(req, res, "create");
        if (!canCreate) return;

        const page = req.body as Page;

        if (!page.slug) {
          return res.status(400).json({ error: "Slug is required" });
        }

        // Check if slug is available
        const available = await isSlugAvailable(page.slug);
        if (!available) {
          return res.status(409).json({ error: "Slug already exists" });
        }

        const savedPage = await savePage(page);
        return res.status(201).json({ page: savedPage, user: user?.name });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
