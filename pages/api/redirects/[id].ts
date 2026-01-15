/**
 * Single Redirect API
 * GET - Get a redirect by ID
 * PUT - Update a redirect
 * DELETE - Delete a redirect
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import type { Redirect } from "./index";

const REDIRECTS_FILE = path.join(process.cwd(), "content", "redirects.json");

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
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Redirect ID is required" });
  }

  try {
    const data = await getRedirects();
    const redirectIndex = data.redirects.findIndex((r) => r.id === id);

    if (req.method === "GET") {
      if (redirectIndex === -1) {
        return res.status(404).json({ error: "Redirect not found" });
      }
      return res.status(200).json({ redirect: data.redirects[redirectIndex] });
    }

    if (req.method === "PUT") {
      if (redirectIndex === -1) {
        return res.status(404).json({ error: "Redirect not found" });
      }

      const { from, to, type, enabled } = req.body;
      const existing = data.redirects[redirectIndex];

      // Check for duplicate source path (excluding current redirect)
      if (from && from !== existing.from) {
        const duplicateRedirect = data.redirects.find(
          (r) => r.from === from && r.id !== id
        );
        if (duplicateRedirect) {
          return res.status(400).json({ error: "A redirect for this path already exists" });
        }
      }

      // Validate from path
      if (from && !from.startsWith("/")) {
        return res.status(400).json({ error: "From path must start with /" });
      }

      const updatedRedirect: Redirect = {
        ...existing,
        from: from ?? existing.from,
        to: to ?? existing.to,
        type: type !== undefined ? (type === 302 ? 302 : 301) : existing.type,
        enabled: enabled !== undefined ? enabled : existing.enabled,
        updatedAt: new Date().toISOString(),
      };

      data.redirects[redirectIndex] = updatedRedirect;
      await saveRedirects(data);

      return res.status(200).json({ redirect: updatedRedirect });
    }

    if (req.method === "DELETE") {
      if (redirectIndex === -1) {
        return res.status(404).json({ error: "Redirect not found" });
      }

      data.redirects.splice(redirectIndex, 1);
      await saveRedirects(data);

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Redirect API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
