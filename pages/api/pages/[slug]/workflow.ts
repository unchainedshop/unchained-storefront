/**
 * API Route: /api/pages/[slug]/workflow
 * Handles page workflow transitions (submit for review, approve, reject, publish)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getPage,
  savePage,
} from "../../../../modules/page-builder/utils/pageStorage";
import { withCMSAuth } from "../../../../lib/adminAuth";
import type { CMSPermission } from "../../../../lib/cms.config";
import { cmsConfig } from "../../../../lib/cms.config";
import type {
  PageStatus,
  PageWorkflow,
} from "../../../../modules/page-builder/types";
import {
  getTransitionAction,
  canTransition,
} from "../../../../modules/cms/utils/permissions";
import {
  logPageAction,
  type AuditAction,
} from "../../../../modules/cms/utils/auditLog";
import { getLocalizedString } from "../../../../modules/page-builder/utils/localization";

interface WorkflowRequest {
  action: "transition";
  targetStatus: PageStatus;
  note?: string; // Review note for approval/rejection
  scheduledFor?: string; // For scheduled publishing
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only accept POST requests for workflow actions
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ error: "Invalid slug" });
    }

    // Get the current page
    const page = await getPage(slug);
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // Parse request body
    const { action, targetStatus, note, scheduledFor } =
      req.body as WorkflowRequest;

    if (action !== "transition") {
      return res.status(400).json({ error: "Invalid action" });
    }

    if (!targetStatus) {
      return res.status(400).json({ error: "Target status is required" });
    }

    // Validate the transition is allowed
    if (!canTransition(page.status, targetStatus)) {
      return res.status(400).json({
        error: `Cannot transition from ${page.status} to ${targetStatus}`,
      });
    }

    // Get the required action for this transition
    const requiredAction = getTransitionAction(page.status, targetStatus);
    if (!requiredAction) {
      return res.status(400).json({ error: "Invalid workflow transition" });
    }

    // Check auth and permissions for the required action
    const { authorized, user } = await withCMSAuth(
      req,
      res,
      requiredAction as CMSPermission,
    );
    if (!authorized || !user) {
      return; // Response already sent by withCMSAuth
    }

    // Build the updated workflow metadata
    const now = new Date().toISOString();
    const workflow: PageWorkflow = {
      ...page.workflow,
    };

    // Update workflow based on the transition
    switch (targetStatus) {
      case "in_review":
        workflow.submittedBy = user._id;
        workflow.submittedAt = now;
        break;

      case "approved":
        workflow.reviewedBy = user._id;
        workflow.reviewedAt = now;
        workflow.reviewNote = note;
        break;

      case "draft":
        // If rejected from in_review, add review note
        if (page.status === "in_review") {
          workflow.reviewedBy = user._id;
          workflow.reviewedAt = now;
          workflow.reviewNote = note;
        }
        break;

      case "published":
        workflow.publishedBy = user._id;
        // Handle scheduled publishing
        if (scheduledFor) {
          const scheduledDate = new Date(scheduledFor);
          if (scheduledDate > new Date()) {
            workflow.scheduledFor = scheduledFor;
            // Don't actually publish yet - set to approved and let scheduler handle it
            return res.status(200).json({
              success: true,
              page: {
                ...page,
                status: "approved",
                workflow: {
                  ...workflow,
                  scheduledFor,
                },
                updatedAt: now,
              },
              message: `Page scheduled for publication on ${scheduledDate.toLocaleDateString()}`,
            });
          }
        }
        break;

      case "archived":
        // Clear scheduled publishing when archiving
        workflow.scheduledFor = undefined;
        break;
    }

    // Update the page
    const updatedPage = {
      ...page,
      status: targetStatus,
      workflow,
      updatedAt: now,
      // Set publishedAt when publishing
      ...(targetStatus === "published" && !page.publishedAt
        ? { publishedAt: now }
        : {}),
    };

    await savePage(updatedPage);

    // Log the workflow action
    if (user) {
      const pageTitle = getLocalizedString(page.title, cmsConfig.defaultLocale);
      const auditAction = getAuditActionForTransition(
        page.status,
        targetStatus,
      );
      if (auditAction) {
        await logPageAction(
          auditAction,
          page.id,
          pageTitle,
          { id: user._id, name: user.name || user.username },
          note ? { note } : undefined,
        );
      }
    }

    return res.status(200).json({
      success: true,
      page: updatedPage,
      message: getTransitionMessage(page.status, targetStatus),
    });
  } catch (error) {
    console.error("Workflow API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get a user-friendly message for a status transition
 */
function getTransitionMessage(from: PageStatus, to: PageStatus): string {
  if (from === "draft" && to === "in_review") {
    return "Page submitted for review";
  }
  if (from === "in_review" && to === "approved") {
    return "Page approved";
  }
  if (from === "in_review" && to === "draft") {
    return "Page returned for revision";
  }
  if (to === "published") {
    return "Page published successfully";
  }
  if (from === "published" && to === "draft") {
    return "Page unpublished";
  }
  if (to === "archived") {
    return "Page archived";
  }
  return "Status updated";
}

/**
 * Map a status transition to an audit action
 */
function getAuditActionForTransition(
  from: PageStatus,
  to: PageStatus,
): AuditAction | null {
  if (from === "draft" && to === "in_review") {
    return "submit_review";
  }
  if (from === "in_review" && to === "approved") {
    return "approve";
  }
  if (from === "in_review" && to === "draft") {
    return "reject";
  }
  if (to === "published") {
    return "publish";
  }
  if (from === "published" && to === "draft") {
    return "unpublish";
  }
  if (to === "archived") {
    return "unpublish";
  }
  return null;
}
