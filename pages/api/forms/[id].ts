/**
 * Single Form API
 * GET - Get a form by ID
 * PUT - Update a form
 * DELETE - Delete a form
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import type { Form, FormSettings } from "./index";

const FORMS_FILE = path.join(process.cwd(), "content", "forms.json");
const SUBMISSIONS_DIR = path.join(process.cwd(), "content", "form-submissions");

interface FormsData {
  forms: Form[];
}

async function getForms(): Promise<FormsData> {
  try {
    const data = await fs.readFile(FORMS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { forms: [] };
  }
}

async function saveForms(data: FormsData): Promise<void> {
  const contentDir = path.dirname(FORMS_FILE);
  await fs.mkdir(contentDir, { recursive: true });
  await fs.writeFile(FORMS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Form ID is required" });
  }

  try {
    const data = await getForms();
    const formIndex = data.forms.findIndex((f) => f.id === id);

    if (req.method === "GET") {
      if (formIndex === -1) {
        return res.status(404).json({ error: "Form not found" });
      }
      return res.status(200).json({ form: data.forms[formIndex] });
    }

    if (req.method === "PUT") {
      if (formIndex === -1) {
        return res.status(404).json({ error: "Form not found" });
      }

      const existing = data.forms[formIndex];
      const { name, description, fields, settings, status } = req.body;

      // Check for duplicate slug if name changed
      let newSlug = existing.slug;
      if (name && name !== existing.name) {
        let baseSlug = generateSlug(name);
        newSlug = baseSlug;
        let counter = 1;
        while (data.forms.some((f) => f.slug === newSlug && f.id !== id)) {
          newSlug = `${baseSlug}-${counter}`;
          counter++;
        }
      }

      const updatedForm: Form = {
        ...existing,
        name: name ?? existing.name,
        slug: newSlug,
        description: description !== undefined ? description : existing.description,
        fields: fields ?? existing.fields,
        settings: settings ? { ...existing.settings, ...settings } : existing.settings,
        status: status ?? existing.status,
        updatedAt: new Date().toISOString(),
      };

      data.forms[formIndex] = updatedForm;
      await saveForms(data);

      return res.status(200).json({ form: updatedForm });
    }

    if (req.method === "DELETE") {
      if (formIndex === -1) {
        return res.status(404).json({ error: "Form not found" });
      }

      const form = data.forms[formIndex];

      // Delete associated submissions file
      try {
        const submissionsFile = path.join(SUBMISSIONS_DIR, `${form.id}.json`);
        await fs.unlink(submissionsFile);
      } catch {
        // File may not exist, ignore
      }

      data.forms.splice(formIndex, 1);
      await saveForms(data);

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Form API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
