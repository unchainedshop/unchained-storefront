/**
 * Redirects API
 * GET - List all redirects
 * POST - Create a new redirect
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

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

async function getRedirects(): Promise<RedirectsData> {
  try {
    const data = await fs.readFile(REDIRECTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { redirects: [] };
  }
}

async function saveRedirects(data: RedirectsData): Promise<void> {
  const contentDir = path.dirname(REDIRECTS_FILE);
  await fs.mkdir(contentDir, { recursive: true });
  await fs.writeFile(REDIRECTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const data = await getRedirects();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const { from, to, type = 301, enabled = true } = req.body;

      if (!from || !to) {
        return res.status(400).json({ error: "From and To paths are required" });
      }

      // Validate paths
      if (!from.startsWith("/")) {
        return res.status(400).json({ error: "From path must start with /" });
      }

      const data = await getRedirects();

      // Check for duplicate source path
      const existingRedirect = data.redirects.find((r) => r.from === from);
      if (existingRedirect) {
        return res.status(400).json({ error: "A redirect for this path already exists" });
      }

      const newRedirect: Redirect = {
        id: `redirect_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        from,
        to,
        type: type === 302 ? 302 : 301,
        enabled,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.redirects.push(newRedirect);
      await saveRedirects(data);

      return res.status(201).json({ redirect: newRedirect });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Redirects API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
