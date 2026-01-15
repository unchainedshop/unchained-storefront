/**
 * Public Form Submission API
 * POST - Submit a form (public endpoint)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import type { Form, FormField } from "../index";
import type { FormSubmission } from "../[id]/submissions";

const FORMS_FILE = path.join(process.cwd(), "content", "forms.json");
const SUBMISSIONS_DIR = path.join(process.cwd(), "content", "form-submissions");

interface FormsData {
  forms: Form[];
}

interface SubmissionsData {
  submissions: FormSubmission[];
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

async function getSubmissions(formId: string): Promise<SubmissionsData> {
  try {
    const filePath = path.join(SUBMISSIONS_DIR, `${formId}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { submissions: [] };
  }
}

async function saveSubmissions(formId: string, data: SubmissionsData): Promise<void> {
  await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });
  const filePath = path.join(SUBMISSIONS_DIR, `${formId}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function generateId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Validate submission data against form fields
function validateSubmission(
  data: Record<string, unknown>,
  fields: FormField[]
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = data[field.id];
    const isEmpty = value === undefined || value === null || value === "";

    // Required validation
    if (field.required && isEmpty) {
      errors[field.id] = `${field.label} is required`;
      continue;
    }

    if (isEmpty) continue; // Skip other validations if empty and not required

    const strValue = String(value);

    // Type-specific validation
    switch (field.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(strValue)) {
          errors[field.id] = "Please enter a valid email address";
        }
        break;

      case "tel":
        const phoneRegex = /^[+]?[\d\s\-().]+$/;
        if (!phoneRegex.test(strValue)) {
          errors[field.id] = "Please enter a valid phone number";
        }
        break;

      case "number":
        const num = parseFloat(strValue);
        if (isNaN(num)) {
          errors[field.id] = "Please enter a valid number";
        } else {
          if (field.validation?.min !== undefined && num < field.validation.min) {
            errors[field.id] = `Minimum value is ${field.validation.min}`;
          }
          if (field.validation?.max !== undefined && num > field.validation.max) {
            errors[field.id] = `Maximum value is ${field.validation.max}`;
          }
        }
        break;

      case "select":
      case "radio":
        // Validate against options
        if (field.options && !field.options.some((opt) => opt.value === strValue)) {
          errors[field.id] = "Please select a valid option";
        }
        break;

      case "checkbox":
        // For checkbox, value can be boolean or array of values
        if (Array.isArray(value)) {
          if (field.options) {
            const invalidOptions = value.filter(
              (v) => !field.options!.some((opt) => opt.value === v)
            );
            if (invalidOptions.length > 0) {
              errors[field.id] = "Invalid option selected";
            }
          }
        }
        break;
    }

    // Custom validation rules
    if (field.validation && !errors[field.id]) {
      if (field.validation.minLength && strValue.length < field.validation.minLength) {
        errors[field.id] = `Minimum length is ${field.validation.minLength} characters`;
      }
      if (field.validation.maxLength && strValue.length > field.validation.maxLength) {
        errors[field.id] = `Maximum length is ${field.validation.maxLength} characters`;
      }
      if (field.validation.pattern) {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(strValue)) {
            errors[field.id] = "Invalid format";
          }
        } catch {
          // Invalid regex pattern, skip
        }
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Form slug is required" });
  }

  try {
    // Find form by slug
    const formsData = await getForms();
    const form = formsData.forms.find((f) => f.slug === slug);

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Check if form is published
    if (form.status !== "published") {
      return res.status(400).json({ error: "Form is not accepting submissions" });
    }

    // Check submission limits
    if (form.settings.limitSubmissions?.enabled) {
      const existingSubmissions = await getSubmissions(form.id);

      if (form.settings.limitSubmissions.maxTotal) {
        if (existingSubmissions.submissions.length >= form.settings.limitSubmissions.maxTotal) {
          return res.status(400).json({ error: "Form has reached maximum submissions" });
        }
      }
    }

    // Validate submission
    const submissionData = req.body.data || req.body;
    const { valid, errors } = validateSubmission(submissionData, form.fields);

    if (!valid) {
      return res.status(400).json({ error: "Validation failed", errors });
    }

    // Create submission
    const submission: FormSubmission = {
      id: generateId(),
      formId: form.id,
      data: submissionData,
      metadata: {
        userAgent: req.headers["user-agent"],
        ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress,
        referrer: req.headers.referer,
        locale: req.headers["accept-language"]?.split(",")[0],
      },
      status: "new",
      submittedAt: new Date().toISOString(),
    };

    // Save submission
    const submissionsData = await getSubmissions(form.id);
    submissionsData.submissions.push(submission);
    await saveSubmissions(form.id, submissionsData);

    // Update form submission count
    const formIndex = formsData.forms.findIndex((f) => f.id === form.id);
    if (formIndex !== -1) {
      formsData.forms[formIndex].submissionCount = submissionsData.submissions.length;
      await saveForms(formsData);
    }

    // TODO: Send email notification if enabled
    // This would typically use a service like SendGrid, Resend, etc.
    // if (form.settings.emailNotification.enabled) {
    //   await sendNotificationEmail(form, submission);
    // }

    return res.status(201).json({
      success: true,
      message: form.settings.successMessage,
      redirectUrl: form.settings.redirectUrl,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
