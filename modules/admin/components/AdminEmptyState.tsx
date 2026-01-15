/**
 * Admin Empty State Component
 * Reusable empty state for admin list pages
 */

import React from "react";
import Link from "next/link";
import { PILL_STYLES, PRIMARY_BUTTON_STYLES, SECONDARY_BUTTON_STYLES } from "../styles";

interface AdminEmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  actionVariant?: "primary" | "secondary";
  className?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  actionVariant = "secondary",
  className = "",
}) => {
  const buttonStyles =
    actionVariant === "primary" ? PRIMARY_BUTTON_STYLES : SECONDARY_BUTTON_STYLES;

  const actionButton = actionLabel ? (
    actionHref ? (
      <Link href={actionHref} className={`text-sm ${buttonStyles}`}>
        {actionLabel}
      </Link>
    ) : onAction ? (
      <button onClick={onAction} className={`text-sm ${buttonStyles}`}>
        {actionLabel}
      </button>
    ) : null
  ) : null;

  return (
    <div className={`rounded-2xl py-16 text-center ${PILL_STYLES} ${className}`}>
      <Icon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {actionButton}
    </div>
  );
};

export default AdminEmptyState;
