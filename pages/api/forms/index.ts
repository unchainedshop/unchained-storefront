/**
 * Forms API
 * GET - List all forms
 * POST - Create a new form
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const FORMS_FILE = path.join(process.cwd(), "content", "forms.json");

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file";

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FormFieldOption[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  width?: "full" | "half"; // Grid layout
  order: number;
}

export interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  emailNotification: {
    enabled: boolean;
    to: string[];
    subject: string;
    includeSubmissionData: boolean;
  };
  captcha: {
    enabled: boolean;
    provider?: "recaptcha" | "hcaptcha";
  };
  limitSubmissions?: {
    enabled: boolean;
    maxPerUser?: number;
    maxTotal?: number;
  };
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  status: "draft" | "published" | "archived";
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

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

function generateId(): string {
  return `form_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const defaultSettings: FormSettings = {
  submitButtonText: "Submit",
  successMessage: "Thank you for your submission!",
  emailNotification: {
    enabled: false,
    to: [],
    subject: "New Form Submission",
    includeSubmissionData: true,
  },
  captcha: {
    enabled: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const data = await getForms();

      // Sort by updatedAt descending
      const sortedForms = [...data.forms].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return res.status(200).json({ forms: sortedForms });
    }

    if (req.method === "POST") {
      const { name, description, fields, settings } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Form name is required" });
      }

      const data = await getForms();

      // Generate unique slug
      let baseSlug = generateSlug(name);
      let slug = baseSlug;
      let counter = 1;
      while (data.forms.some((f) => f.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const newForm: Form = {
        id: generateId(),
        name,
        slug,
        description: description || "",
        fields: fields || [],
        settings: { ...defaultSettings, ...settings },
        status: "draft",
        submissionCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      data.forms.push(newForm);
      await saveForms(data);

      return res.status(201).json({ form: newForm });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Forms API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
