/**
 * API Route: /api/pages/[slug]/duplicate
 * Duplicate a page
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  duplicatePage,
  isSlugAvailable,
} from "../../../../modules/page-builder/utils/pageStorage";
import { withCMSAuth } from "../../../../lib/adminAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require 'create' permission to duplicate
  const { authorized } = await withCMSAuth(req, res, "create");
  if (!authorized) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { slug } = req.query;

  if (typeof slug !== "string") {
    return res.status(400).json({ error: "Invalid slug" });
  }

  try {
    const { newSlug } = req.body;

    if (!newSlug) {
      return res.status(400).json({ error: "New slug is required" });
    }

    // Check if new slug is available
    const available = await isSlugAvailable(newSlug);
    if (!available) {
      return res.status(409).json({ error: "Slug already exists" });
    }

    const duplicatedPage = await duplicatePage(slug, newSlug);

    if (!duplicatedPage) {
      return res.status(404).json({ error: "Original page not found" });
    }

    return res.status(201).json({ page: duplicatedPage });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
