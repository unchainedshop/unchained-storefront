/**
 * Status Badge Component
 * Reusable status indicator for admin pages
 */

import React from "react";
import { STATUS_COLORS, type StatusType } from "../styles";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusLabels: Record<StatusType, string> = {
  published: "Published",
  active: "Active",
  draft: "Draft",
  scheduled: "Scheduled",
  archived: "Archived",
  inactive: "Inactive",
  new: "New",
  read: "Read",
  spam: "Spam",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = "",
}) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.inactive;
  const displayLabel = label || statusLabels[status] || status;

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text} ${className}`}
    >
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
