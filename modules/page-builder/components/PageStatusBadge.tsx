/**
 * PageStatusBadge Component
 * Displays page status with appropriate styling
 */

import React from "react";
import type { PageStatus } from "../types";

const statusConfig: Record<PageStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
  in_review: {
    label: "In Review",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  published: {
    label: "Published",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  archived: {
    label: "Archived",
    className:
      "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-500",
  },
};

interface PageStatusBadgeProps {
  status: PageStatus;
  className?: string;
}

const PageStatusBadge: React.FC<PageStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default PageStatusBadge;
