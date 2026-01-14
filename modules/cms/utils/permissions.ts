/**
 * CMS Permissions
 * Role-based permission system for the CMS
 */

import type { PageStatus } from "../../page-builder/types";

/**
 * CMS Permission actions
 */
export type CMSAction =
  | "create" // Create new pages
  | "edit" // Edit page content
  | "delete" // Delete pages
  | "submit_review" // Submit a page for review
  | "approve" // Approve pages (move from in_review to approved)
  | "reject" // Reject pages (move from in_review back to draft)
  | "publish" // Publish pages directly
  | "unpublish" // Unpublish pages
  | "schedule" // Schedule pages for future publishing
  | "settings"; // Modify CMS settings

/**
 * CMS Roles with their allowed actions
 */
export const rolePermissions: Record<string, CMSAction[]> = {
  admin: [
    "create",
    "edit",
    "delete",
    "submit_review",
    "approve",
    "reject",
    "publish",
    "unpublish",
    "schedule",
    "settings",
  ],
  editor: ["create", "edit", "submit_review"],
  reviewer: ["approve", "reject"],
  publisher: ["publish", "unpublish", "schedule"],
};

/**
 * Check if a user with given roles can perform an action
 */
export function canPerformAction(
  userRoles: string[],
  action: CMSAction,
): boolean {
  // Admin can do everything
  if (userRoles.includes("admin")) {
    return true;
  }

  // Check each role's permissions
  for (const role of userRoles) {
    const permissions = rolePermissions[role];
    if (permissions && permissions.includes(action)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all actions a user can perform based on their roles
 */
export function getUserActions(userRoles: string[]): CMSAction[] {
  const actions = new Set<CMSAction>();

  for (const role of userRoles) {
    const permissions = rolePermissions[role];
    if (permissions) {
      permissions.forEach((action) => actions.add(action));
    }
  }

  return Array.from(actions);
}

/**
 * Valid status transitions for workflow
 */
export const validTransitions: Record<PageStatus, PageStatus[]> = {
  draft: ["in_review", "published"], // Editor submits for review, or publisher publishes directly
  in_review: ["approved", "draft"], // Reviewer approves or rejects (back to draft)
  approved: ["published", "scheduled", "draft"], // Publisher publishes, schedules, or can be sent back to draft
  scheduled: ["published", "draft"], // Scheduled pages can be published early or cancelled
  published: ["draft", "archived"], // Can unpublish to draft or archive
  archived: ["draft"], // Can restore to draft
};

/**
 * Check if a status transition is valid
 */
export function canTransition(from: PageStatus, to: PageStatus): boolean {
  return validTransitions[from]?.includes(to) || false;
}

/**
 * Get the required action for a status transition
 */
export function getTransitionAction(
  from: PageStatus,
  to: PageStatus,
): CMSAction | null {
  // Draft → In Review: submit_review
  if (from === "draft" && to === "in_review") {
    return "submit_review";
  }

  // Draft → Published: publish (direct publish, requires publisher role)
  if (from === "draft" && to === "published") {
    return "publish";
  }

  // In Review → Approved: approve
  if (from === "in_review" && to === "approved") {
    return "approve";
  }

  // In Review → Draft: reject
  if (from === "in_review" && to === "draft") {
    return "reject";
  }

  // Approved → Published: publish
  if (from === "approved" && to === "published") {
    return "publish";
  }

  // Approved → Scheduled: schedule
  if (from === "approved" && to === "scheduled") {
    return "schedule";
  }

  // Approved → Draft: reject (sent back for changes)
  if (from === "approved" && to === "draft") {
    return "reject";
  }

  // Scheduled → Published: publish (publish early)
  if (from === "scheduled" && to === "published") {
    return "publish";
  }

  // Scheduled → Draft: unpublish (cancel scheduled)
  if (from === "scheduled" && to === "draft") {
    return "unpublish";
  }

  // Published → Draft: unpublish
  if (from === "published" && to === "draft") {
    return "unpublish";
  }

  // Published → Archived: unpublish
  if (from === "published" && to === "archived") {
    return "unpublish";
  }

  // Archived → Draft: edit (restore)
  if (from === "archived" && to === "draft") {
    return "edit";
  }

  return null;
}

/**
 * Check if a user can perform a status transition
 */
export function canUserTransition(
  userRoles: string[],
  from: PageStatus,
  to: PageStatus,
): boolean {
  // Check if the transition itself is valid
  if (!canTransition(from, to)) {
    return false;
  }

  // Get the required action for this transition
  const requiredAction = getTransitionAction(from, to);
  if (!requiredAction) {
    return false;
  }

  // Check if the user has permission for this action
  return canPerformAction(userRoles, requiredAction);
}

/**
 * Get status display configuration
 */
export const statusConfig: Record<
  PageStatus,
  { label: string; color: string; bgColor: string }
> = {
  draft: {
    label: "Draft",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800",
  },
  in_review: {
    label: "In Review",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  approved: {
    label: "Approved",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  scheduled: {
    label: "Scheduled",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  published: {
    label: "Published",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  archived: {
    label: "Archived",
    color: "text-slate-500 dark:text-slate-500",
    bgColor: "bg-slate-200 dark:bg-slate-700",
  },
};
