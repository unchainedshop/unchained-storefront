/**
 * Settings API
 * GET - Retrieve current settings
 * POST - Update settings
 */

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { readJSONFile, writeJSONFile } from "../../../lib/jsonStorage";
import { withCMSAuth } from "../../../lib/adminAuth";

const SETTINGS_FILE = path.join(process.cwd(), "content", "settings.json");

interface Settings {
  siteName: Record<string, string>;
  defaultLocale: string;
  availableLocales: string[];
  logo: string;
  darkLogo: string;
  primaryColor: string;
  darkModeDefault: boolean;
  adminEmail: string;
  dateFormat: string;
  timeFormat: string;
}

const defaultSettings: Settings = {
  siteName: { en: "Unchained Store", de: "Unchained Shop" },
  defaultLocale: "en",
  availableLocales: ["en", "de"],
  logo: "",
  darkLogo: "",
  primaryColor: "#0f172a",
  darkModeDefault: false,
  adminEmail: "",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "24h",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS authentication
  const auth = await withCMSAuth(req, res);
  if (!auth.authorized) return;

  try {
    if (req.method === "GET") {
      const storedSettings = await readJSONFile<Partial<Settings>>(
        SETTINGS_FILE,
        {},
      );
      const settings = { ...defaultSettings, ...storedSettings };
      return res.status(200).json({ settings });
    }

    if (req.method === "POST") {
      const { settings } = req.body;

      if (!settings) {
        return res.status(400).json({ error: "Settings data is required" });
      }

      // Validate required fields
      if (!settings.defaultLocale) {
        return res.status(400).json({ error: "Default locale is required" });
      }

      if (
        !settings.availableLocales ||
        settings.availableLocales.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "At least one locale must be available" });
      }

      // Ensure default locale is in available locales
      if (!settings.availableLocales.includes(settings.defaultLocale)) {
        return res
          .status(400)
          .json({ error: "Default locale must be in available locales" });
      }

      await writeJSONFile(SETTINGS_FILE, settings);
      return res.status(200).json({ success: true, settings });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Settings API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
