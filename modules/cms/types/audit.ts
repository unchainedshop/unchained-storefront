/**
 * Audit Log Types (Client-safe)
 * Types and labels that can be used on both client and server
 */

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "submit_review"
  | "approve"
  | "reject"
  | "restore"
  | "upload"
  | "duplicate"
  | "schedule";

export type AuditEntityType = "page" | "media" | "folder";

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityTitle: string;
  details?: Record<string, unknown>;
  locale?: string;
}

/**
 * Get action labels for display
 */
export const actionLabels: Record<AuditAction, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  publish: "Published",
  unpublish: "Unpublished",
  submit_review: "Submitted for Review",
  approve: "Approved",
  reject: "Rejected",
  restore: "Restored",
  upload: "Uploaded",
  duplicate: "Duplicated",
  schedule: "Scheduled",
};

/**
 * Get entity type labels for display
 */
export const entityTypeLabels: Record<AuditEntityType, string> = {
  page: "Page",
  media: "Media",
  folder: "Folder",
};
