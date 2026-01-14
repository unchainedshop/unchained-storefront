/**
 * API Route: /api/audit
 * Query audit log entries
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { withCMSAuth } from "../../../lib/adminAuth";
import {
  queryAuditLog,
  type AuditAction,
  type AuditEntityType,
} from "../../../modules/cms/utils/auditLog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only accept GET requests
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Require audit permission
    const { authorized } = await withCMSAuth(req, res, "audit");
    if (!authorized) {
      return; // Response already sent by withCMSAuth
    }

    // Parse query parameters
    const {
      startDate,
      endDate,
      action,
      entityType,
      entityId,
      userId,
      limit = "50",
      offset = "0",
    } = req.query;

    // Build query options
    const options = {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      action: action as AuditAction | undefined,
      entityType: entityType as AuditEntityType | undefined,
      entityId: entityId as string | undefined,
      userId: userId as string | undefined,
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
    };

    const result = await queryAuditLog(options);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Audit API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
