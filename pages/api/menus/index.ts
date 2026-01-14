/**
 * API Route: /api/menus
 * List all menus (GET) or create a new menu (POST)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  listMenus,
  createMenu,
  isSlugAvailable,
} from "../../../modules/menu-builder/utils/menuStorage";
import type { CreateMenuInput } from "../../../modules/menu-builder/types";
import { withCMSAuth } from "../../../lib/adminAuth";
import { logMenuAction } from "../../../modules/cms/utils/auditLog";
import { getLocalizedString } from "../../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../../lib/cms.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Require CMS access for all operations
  const { authorized, user } = await withCMSAuth(req, res);
  if (!authorized) return;

  try {
    switch (req.method) {
      case "GET": {
        const menus = await listMenus();
        return res.status(200).json({ menus });
      }

      case "POST": {
        // Require 'create' permission for POST
        const { authorized: canCreate, user: createUser } = await withCMSAuth(
          req,
          res,
          "create"
        );
        if (!canCreate) return;

        const input = req.body as CreateMenuInput;

        if (!input.slug) {
          return res.status(400).json({ error: "Slug is required" });
        }

        if (!input.name || Object.keys(input.name).length === 0) {
          return res.status(400).json({ error: "Name is required" });
        }

        if (!input.type) {
          return res.status(400).json({ error: "Type is required" });
        }

        // Check if slug is available
        const available = await isSlugAvailable(input.slug);
        if (!available) {
          return res.status(409).json({ error: "Slug already exists" });
        }

        const menu = await createMenu(input);

        // Log the create action
        if (createUser) {
          const menuName = getLocalizedString(menu.name, cmsConfig.defaultLocale);
          await logMenuAction("create", menu.id, menuName, {
            id: createUser._id,
            name: createUser.name || createUser.username,
          });
        }

        return res.status(201).json({ menu });
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
