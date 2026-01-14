/**
 * API Route: /api/collections/schemas
 * List all schemas (GET) or create a new schema (POST)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  listSchemas,
  createSchema,
  isSchemaSlugAvailable,
  listTemplates,
  createSchemaFromTemplate,
} from "../../../../modules/collections/utils/schemaStorage";
import { getSchemaEntryCount } from "../../../../modules/collections/utils/schemaStorage";
import type { CreateSchemaInput } from "../../../../modules/collections/types";
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
        const { templates: getTemplates } = req.query;

        // If templates=true, return templates instead of schemas
        if (getTemplates === "true") {
          const templates = await listTemplates();
          return res.status(200).json({ templates });
        }

        const { page, limit, search, sortBy, sortOrder, locale } = req.query;
        const result = await listSchemas({
          page: page ? parseInt(page as string) : 1,
          limit: limit ? parseInt(limit as string) : 50,
          search: search as string,
          sortBy: sortBy as string,
          sortOrder: sortOrder as "asc" | "desc",
          locale: locale as string,
        });

        // Add entry counts
        const schemasWithCounts = await Promise.all(
          result.items.map(async (schema) => ({
            ...schema,
            entryCount: await getSchemaEntryCount(schema.slug),
          })),
        );

        return res.status(200).json({
          ...result,
          items: schemasWithCounts,
        });
      }

      case "POST": {
        // Require 'create' permission for POST
        const { authorized: canCreate } = await withCMSAuth(req, res, "create");
        if (!canCreate) return;

        const body = req.body;

        // Check if creating from template
        if (body.templateSlug) {
          const { templateSlug, slug, name, description, icon } = body;

          if (!slug) {
            return res.status(400).json({ error: "Slug is required" });
          }

          const available = await isSchemaSlugAvailable(slug);
          if (!available) {
            return res.status(409).json({ error: "Slug already exists" });
          }

          const schema = await createSchemaFromTemplate(
            templateSlug,
            slug,
            { name, description, icon },
            user?._id,
          );

          return res.status(201).json({ schema });
        }

        // Creating a new schema from scratch
        const input = body as CreateSchemaInput;

        if (!input.slug) {
          return res.status(400).json({ error: "Slug is required" });
        }

        if (!input.name) {
          return res.status(400).json({ error: "Name is required" });
        }

        if (!input.fields || input.fields.length === 0) {
          return res.status(400).json({ error: "At least one field is required" });
        }

        if (!input.titleField) {
          return res.status(400).json({ error: "Title field is required" });
        }

        const available = await isSchemaSlugAvailable(input.slug);
        if (!available) {
          return res.status(409).json({ error: "Slug already exists" });
        }

        const schema = await createSchema(input, user?._id);
        return res.status(201).json({ schema });
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
