/**
 * Forms API
 * GET - List all forms
 * POST - Create a new form
 */

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { readJSONFile, writeJSONFile } from "../../../lib/jsonStorage";
import {
  generateId,
  generateSlug,
  ensureUniqueSlug,
  nowISO,
} from "../../../lib/apiUtils";
import { withCMSAuth } from "../../../lib/adminAuth";

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
  // Require CMS authentication
  const auth = await withCMSAuth(req, res);
  if (!auth.authorized) return;

  try {
    if (req.method === "GET") {
      const data = await readJSONFile<FormsData>(FORMS_FILE, { forms: [] });

      // Sort by updatedAt descending
      const sortedForms = [...data.forms].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      return res.status(200).json({ forms: sortedForms });
    }

    if (req.method === "POST") {
      const { name, description, fields, settings } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Form name is required" });
      }

      const data = await readJSONFile<FormsData>(FORMS_FILE, { forms: [] });

      // Generate unique slug
      const baseSlug = generateSlug(name);
      const slug = ensureUniqueSlug(baseSlug, data.forms);

      const newForm: Form = {
        id: generateId("form"),
        name,
        slug,
        description: description || "",
        fields: fields || [],
        settings: { ...defaultSettings, ...settings },
        status: "draft",
        submissionCount: 0,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };

      data.forms.push(newForm);
      await writeJSONFile(FORMS_FILE, data);

      return res.status(201).json({ form: newForm });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Forms API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
