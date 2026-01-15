/**
 * Form Submissions API
 * GET - List submissions for a form
 * DELETE - Delete a submission
 */

import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import type { Form } from "../index";

const FORMS_FILE = path.join(process.cwd(), "content", "forms.json");
const SUBMISSIONS_DIR = path.join(process.cwd(), "content", "form-submissions");

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  metadata: {
    userAgent?: string;
    ip?: string;
    referrer?: string;
    locale?: string;
  };
  status: "new" | "read" | "archived" | "spam";
  submittedAt: string;
}

interface SubmissionsData {
  submissions: FormSubmission[];
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Form ID is required" });
  }

  try {
    // Verify form exists
    const formsData = await getForms();
    const form = formsData.forms.find((f) => f.id === id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (req.method === "GET") {
      const data = await getSubmissions(id);

      // Parse query params for filtering/pagination
      const { status, page = "1", limit = "50" } = req.query;
      let filteredSubmissions = [...data.submissions];

      // Filter by status
      if (status && typeof status === "string") {
        filteredSubmissions = filteredSubmissions.filter((s) => s.status === status);
      }

      // Sort by submittedAt descending (newest first)
      filteredSubmissions.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      // Pagination
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 50;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + limitNum);

      return res.status(200).json({
        submissions: paginatedSubmissions,
        total: filteredSubmissions.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredSubmissions.length / limitNum),
      });
    }

    if (req.method === "PATCH") {
      // Update submission status
      const { submissionId, status } = req.body;

      if (!submissionId || !status) {
        return res.status(400).json({ error: "Submission ID and status are required" });
      }

      const validStatuses = ["new", "read", "archived", "spam"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const data = await getSubmissions(id);
      const submissionIndex = data.submissions.findIndex((s) => s.id === submissionId);

      if (submissionIndex === -1) {
        return res.status(404).json({ error: "Submission not found" });
      }

      data.submissions[submissionIndex].status = status;
      await saveSubmissions(id, data);

      return res.status(200).json({ submission: data.submissions[submissionIndex] });
    }

    if (req.method === "DELETE") {
      const { submissionId } = req.body;

      if (!submissionId) {
        return res.status(400).json({ error: "Submission ID is required" });
      }

      const data = await getSubmissions(id);
      const submissionIndex = data.submissions.findIndex((s) => s.id === submissionId);

      if (submissionIndex === -1) {
        return res.status(404).json({ error: "Submission not found" });
      }

      data.submissions.splice(submissionIndex, 1);
      await saveSubmissions(id, data);

      // Update form submission count
      const formsDataUpdate = await getForms();
      const formIndex = formsDataUpdate.forms.findIndex((f) => f.id === id);
      if (formIndex !== -1) {
        formsDataUpdate.forms[formIndex].submissionCount = data.submissions.length;
        const contentDir = path.dirname(FORMS_FILE);
        await fs.mkdir(contentDir, { recursive: true });
        await fs.writeFile(FORMS_FILE, JSON.stringify(formsDataUpdate, null, 2), "utf-8");
      }

      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Submissions API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
