/**
 * Form Submissions API
 * GET - List submissions for a form
 * DELETE - Delete a submission
 */

import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import type { Form } from "../index";
import { readJSONFile, writeJSONFile } from "../../../../lib/jsonStorage";
import { withCMSAuth } from "../../../../lib/adminAuth";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Require CMS authentication
  const auth = await withCMSAuth(req, res);
  if (!auth.authorized) return;

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Form ID is required" });
  }

  try {
    // Verify form exists
    const formsData = await readJSONFile<FormsData>(FORMS_FILE, { forms: [] });
    const form = formsData.forms.find((f) => f.id === id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submissionsFile = path.join(SUBMISSIONS_DIR, `${id}.json`);

    if (req.method === "GET") {
      const data = await readJSONFile<SubmissionsData>(submissionsFile, {
        submissions: [],
      });

      // Parse query params for filtering/pagination
      const { status, page = "1", limit = "50" } = req.query;
      let filteredSubmissions = [...data.submissions];

      // Filter by status
      if (status && typeof status === "string") {
        filteredSubmissions = filteredSubmissions.filter(
          (s) => s.status === status,
        );
      }

      // Sort by submittedAt descending (newest first)
      filteredSubmissions.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      );

      // Pagination
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 50;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedSubmissions = filteredSubmissions.slice(
        startIndex,
        startIndex + limitNum,
      );

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
        return res
          .status(400)
          .json({ error: "Submission ID and status are required" });
      }

      const validStatuses = ["new", "read", "archived", "spam"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const data = await readJSONFile<SubmissionsData>(submissionsFile, {
        submissions: [],
      });
      const submissionIndex = data.submissions.findIndex(
        (s) => s.id === submissionId,
      );

      if (submissionIndex === -1) {
        return res.status(404).json({ error: "Submission not found" });
      }

      data.submissions[submissionIndex].status = status;
      await writeJSONFile(submissionsFile, data);

      return res
        .status(200)
        .json({ submission: data.submissions[submissionIndex] });
    }

    if (req.method === "DELETE") {
      const { submissionId } = req.body;

      if (!submissionId) {
        return res.status(400).json({ error: "Submission ID is required" });
      }

      const data = await readJSONFile<SubmissionsData>(submissionsFile, {
        submissions: [],
      });
      const submissionIndex = data.submissions.findIndex(
        (s) => s.id === submissionId,
      );

      if (submissionIndex === -1) {
        return res.status(404).json({ error: "Submission not found" });
      }

      data.submissions.splice(submissionIndex, 1);
      await writeJSONFile(submissionsFile, data);

      // Update form submission count
      const formsDataUpdate = await readJSONFile<FormsData>(FORMS_FILE, {
        forms: [],
      });
      const formIndex = formsDataUpdate.forms.findIndex((f) => f.id === id);
      if (formIndex !== -1) {
        formsDataUpdate.forms[formIndex].submissionCount =
          data.submissions.length;
        await writeJSONFile(FORMS_FILE, formsDataUpdate);
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
