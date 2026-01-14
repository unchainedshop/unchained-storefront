/**
 * Audit Log Utilities (Server-side only)
 * Track who did what, when in the CMS
 */

import fs from "fs";
import path from "path";

// Re-export types from client-safe types file
export type { AuditAction, AuditEntityType, AuditEntry } from "../types/audit";
export { actionLabels, entityTypeLabels } from "../types/audit";

import type { AuditAction, AuditEntityType, AuditEntry } from "../types/audit";

const AUDIT_DIR = path.join(process.cwd(), "content", "audit");

/**
 * Get the path to the audit file for a given date
 */
function getAuditFilePath(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return path.join(AUDIT_DIR, `${year}-${month}.json`);
}

/**
 * Ensure the audit directory exists
 */
function ensureAuditDir(): void {
  if (!fs.existsSync(AUDIT_DIR)) {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
  }
}

/**
 * Read audit entries from a file
 */
function readAuditFile(filePath: string): AuditEntry[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading audit file:", error);
  }
  return [];
}

/**
 * Write audit entries to a file
 */
function writeAuditFile(filePath: string, entries: AuditEntry[]): void {
  ensureAuditDir();
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), "utf-8");
}

/**
 * Generate a unique ID for an audit entry
 */
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Log an audit entry
 */
export async function logAudit(
  entry: Omit<AuditEntry, "id" | "timestamp">,
): Promise<AuditEntry> {
  const fullEntry: AuditEntry = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    ...entry,
  };

  const filePath = getAuditFilePath();
  const entries = readAuditFile(filePath);
  entries.push(fullEntry);
  writeAuditFile(filePath, entries);

  return fullEntry;
}

/**
 * Log a page action
 */
export async function logPageAction(
  action: AuditAction,
  pageId: string,
  pageTitle: string,
  user: { id: string; name: string },
  details?: Record<string, unknown>,
  locale?: string,
): Promise<AuditEntry> {
  return logAudit({
    userId: user.id,
    userName: user.name,
    action,
    entityType: "page",
    entityId: pageId,
    entityTitle: pageTitle,
    details,
    locale,
  });
}

/**
 * Log a media action
 */
export async function logMediaAction(
  action: AuditAction,
  mediaId: string,
  mediaName: string,
  user: { id: string; name: string },
  details?: Record<string, unknown>,
): Promise<AuditEntry> {
  return logAudit({
    userId: user.id,
    userName: user.name,
    action,
    entityType: "media",
    entityId: mediaId,
    entityTitle: mediaName,
    details,
  });
}

/**
 * Log a menu action
 */
export async function logMenuAction(
  action: AuditAction,
  menuId: string,
  menuName: string,
  user: { id: string; name: string },
  details?: Record<string, unknown>,
): Promise<AuditEntry> {
  return logAudit({
    userId: user.id,
    userName: user.name,
    action,
    entityType: "menu",
    entityId: menuId,
    entityTitle: menuName,
    details,
  });
}

/**
 * Query audit entries with filters
 */
export interface AuditQueryOptions {
  startDate?: Date;
  endDate?: Date;
  action?: AuditAction;
  entityType?: AuditEntityType;
  entityId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export async function queryAuditLog(
  options: AuditQueryOptions = {},
): Promise<{ entries: AuditEntry[]; total: number }> {
  const {
    startDate,
    endDate = new Date(),
    action,
    entityType,
    entityId,
    userId,
    limit = 50,
    offset = 0,
  } = options;

  // Default to last 30 days if no start date
  const effectiveStartDate =
    startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Get all months between start and end date
  const months: Date[] = [];
  const current = new Date(
    effectiveStartDate.getFullYear(),
    effectiveStartDate.getMonth(),
    1,
  );
  while (current <= endDate) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  // Read entries from all relevant files
  let allEntries: AuditEntry[] = [];
  for (const month of months) {
    const filePath = getAuditFilePath(month);
    const entries = readAuditFile(filePath);
    allEntries = allEntries.concat(entries);
  }

  // Filter entries
  let filtered = allEntries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);

    // Date range filter
    if (entryDate < effectiveStartDate || entryDate > endDate) {
      return false;
    }

    // Action filter
    if (action && entry.action !== action) {
      return false;
    }

    // Entity type filter
    if (entityType && entry.entityType !== entityType) {
      return false;
    }

    // Entity ID filter
    if (entityId && entry.entityId !== entityId) {
      return false;
    }

    // User ID filter
    if (userId && entry.userId !== userId) {
      return false;
    }

    return true;
  });

  // Sort by timestamp descending (most recent first)
  filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const total = filtered.length;

  // Apply pagination
  filtered = filtered.slice(offset, offset + limit);

  return { entries: filtered, total };
}

/**
 * Get recent activity for a specific entity
 */
export async function getEntityHistory(
  entityType: AuditEntityType,
  entityId: string,
  limit = 20,
): Promise<AuditEntry[]> {
  const { entries } = await queryAuditLog({
    entityType,
    entityId,
    limit,
  });
  return entries;
}

/**
 * Get recent activity by a user
 */
export async function getUserActivity(
  userId: string,
  limit = 20,
): Promise<AuditEntry[]> {
  const { entries } = await queryAuditLog({
    userId,
    limit,
  });
  return entries;
}
