/**
 * API Route: /api/menus/[slug]
 * Get (GET), update (PUT), or delete (DELETE) a specific menu
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getMenu,
  saveMenu,
  deleteMenu,
  isSlugAvailable,
} from "../../../modules/menu-builder/utils/menuStorage";
import type { Menu } from "../../../modules/menu-builder/types";
import { withCMSAuth } from "../../../lib/adminAuth";
import { logMenuAction } from "../../../modules/cms/utils/auditLog";
import { getLocalizedString } from "../../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../../lib/cms.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Require CMS access for all operations
  const { authorized } = await withCMSAuth(req, res);
  if (!authorized) return;

  const { slug } = req.query;

  if (typeof slug !== "string") {
    return res.status(400).json({ error: "Invalid slug" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const menu = await getMenu(slug);
        if (!menu) {
          return res.status(404).json({ error: "Menu not found" });
        }
        return res.status(200).json({ menu });
      }

      case "PUT": {
        // Require 'edit' permission for PUT
        const { authorized: canEdit, user: editUser } = await withCMSAuth(
          req,
          res,
          "edit"
        );
        if (!canEdit) return;

        const existingMenu = await getMenu(slug);
        if (!existingMenu) {
          return res.status(404).json({ error: "Menu not found" });
        }

        const updatedData = req.body as Partial<Menu>;

        // If slug is changing, check availability
        if (updatedData.slug && updatedData.slug !== slug) {
          const available = await isSlugAvailable(
            updatedData.slug,
            existingMenu.id
          );
          if (!available) {
            return res.status(409).json({ error: "Slug already exists" });
          }

          // Delete old file if slug changed
          await deleteMenu(slug);
        }

        // Handle publishing
        const isPublishing =
          updatedData.status === "published" &&
          existingMenu.status !== "published";

        const updatedMenu: Menu = {
          ...existingMenu,
          ...updatedData,
          slug: updatedData.slug || slug,
          lastModifiedBy: editUser?.name || editUser?.username,
          publishedAt: isPublishing
            ? new Date().toISOString()
            : existingMenu.publishedAt,
        };

        const savedMenu = await saveMenu(updatedMenu);

        // Log the action
        if (editUser) {
          const menuName = getLocalizedString(
            savedMenu.name,
            cmsConfig.defaultLocale
          );
          const action = isPublishing ? "publish" : "update";
          await logMenuAction(action, savedMenu.id, menuName, {
            id: editUser._id,
            name: editUser.name || editUser.username,
          });
        }

        return res.status(200).json({ menu: savedMenu });
      }

      case "DELETE": {
        // Require 'delete' permission for DELETE
        const { authorized: canDelete, user: deleteUser } = await withCMSAuth(
          req,
          res,
          "delete"
        );
        if (!canDelete) return;

        // Get menu info before deleting for audit log
        const menuToDelete = await getMenu(slug);
        if (!menuToDelete) {
          return res.status(404).json({ error: "Menu not found" });
        }

        const deleted = await deleteMenu(slug);
        if (!deleted) {
          return res.status(404).json({ error: "Menu not found" });
        }

        // Log the delete action
        if (deleteUser) {
          const menuName = getLocalizedString(
            menuToDelete.name,
            cmsConfig.defaultLocale
          );
          await logMenuAction("delete", menuToDelete.id, menuName, {
            id: deleteUser._id,
            name: deleteUser.name || deleteUser.username,
          });
        }

        return res.status(200).json({ success: true });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
