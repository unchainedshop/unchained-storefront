/**
 * PageStatusBadge Component
 * Displays page status with appropriate styling
 */

import React from 'react';
import type { PageStatus } from '../types';

const statusConfig: Record<PageStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  published: {
    label: 'Published',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  archived: {
    label: 'Archived',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  },
};

interface PageStatusBadgeProps {
  status: PageStatus;
  className?: string;
}

const PageStatusBadge: React.FC<PageStatusBadgeProps> = ({
  status,
  className = '',
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
