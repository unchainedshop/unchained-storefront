/**
 * Redirects API
 * GET - List all redirects
 * POST - Create a new redirect
 */

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { readJSONFile, writeJSONFile } from "../../../lib/jsonStorage";
import { generateId, nowISO } from "../../../lib/apiUtils";
import { withCMSAuth } from "../../../lib/adminAuth";

const REDIRECTS_FILE = path.join(process.cwd(), "content", "redirects.json");

export interface Redirect {
  id: string;
  from: string;
  to: string;
  type: 301 | 302;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RedirectsData {
  redirects: Redirect[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS authentication
  const auth = await withCMSAuth(req, res);
  if (!auth.authorized) return;

  try {
    if (req.method === "GET") {
      const data = await readJSONFile<RedirectsData>(REDIRECTS_FILE, {
        redirects: [],
      });
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { from, to, type = 301, enabled = true } = req.body;

      if (!from || !to) {
        return res
          .status(400)
          .json({ error: "From and To paths are required" });
      }

      // Validate paths
      if (!from.startsWith("/")) {
        return res.status(400).json({ error: "From path must start with /" });
      }

      const data = await readJSONFile<RedirectsData>(REDIRECTS_FILE, {
        redirects: [],
      });

      // Check for duplicate source path
      const existingRedirect = data.redirects.find((r) => r.from === from);
      if (existingRedirect) {
        return res
          .status(400)
          .json({ error: "A redirect for this path already exists" });
      }

      const newRedirect: Redirect = {
        id: generateId("redirect"),
        from,
        to,
        type: type === 302 ? 302 : 301,
        enabled,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };

      data.redirects.push(newRedirect);
      await writeJSONFile(REDIRECTS_FILE, data);

      return res.status(201).json({ redirect: newRedirect });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Redirects API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
