/**
 * Recent Activity Component
 * Expandable activity feed for the CMS dashboard
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  PencilIcon,
  DocumentTextIcon,
  PhotoIcon,
  Bars3Icon,
  FolderIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type {
  AuditEntry,
  AuditAction,
  AuditEntityType,
} from "../../cms/types/audit";
import { actionLabels, entityTypeLabels } from "../../cms/types/audit";

interface RecentActivityProps {
  entries: AuditEntry[];
  totalCount: number;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

const actionIcons: Record<
  AuditAction,
  React.ComponentType<{ className?: string }>
> = {
  create: PlusCircleIcon,
  update: PencilIcon,
  delete: TrashIcon,
  publish: ArrowUpCircleIcon,
  unpublish: ArrowDownCircleIcon,
  submit_review: ClockIcon,
  approve: CheckCircleIcon,
  reject: XCircleIcon,
  restore: ArrowPathIcon,
  upload: ArrowUpCircleIcon,
  duplicate: DocumentDuplicateIcon,
  schedule: CalendarIcon,
};

const entityIcons: Record<
  AuditEntityType,
  React.ComponentType<{ className?: string }>
> = {
  page: DocumentTextIcon,
  media: PhotoIcon,
  folder: FolderIcon,
  menu: Bars3Icon,
};

const actionColors: Record<AuditAction, string> = {
  create: "text-emerald-600 dark:text-emerald-400",
  update: "text-blue-600 dark:text-blue-400",
  delete: "text-red-600 dark:text-red-400",
  publish: "text-green-600 dark:text-green-400",
  unpublish: "text-amber-600 dark:text-amber-400",
  submit_review: "text-purple-600 dark:text-purple-400",
  approve: "text-green-600 dark:text-green-400",
  reject: "text-red-600 dark:text-red-400",
  restore: "text-blue-600 dark:text-blue-400",
  upload: "text-cyan-600 dark:text-cyan-400",
  duplicate: "text-indigo-600 dark:text-indigo-400",
  schedule: "text-orange-600 dark:text-orange-400",
};

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatFullDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEntityLink = (entry: AuditEntry): string | null => {
  switch (entry.entityType) {
    case "page":
      return `/admin/pages/${entry.entityId}`;
    case "media":
      return `/admin/media`;
    case "menu":
      return `/admin/menus/${entry.entityId}`;
    default:
      return null;
  }
};

interface ActivityItemProps {
  entry: AuditEntry;
  globalExpanded: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  entry,
  globalExpanded,
}) => {
  const [isItemExpanded, setIsItemExpanded] = useState(false);
  const ActionIcon = actionIcons[entry.action] || PencilIcon;
  const EntityIcon = entityIcons[entry.entityType] || DocumentTextIcon;
  const link = getEntityLink(entry);

  // Show expanded if either globally expanded or individually expanded
  const showExpanded = globalExpanded || isItemExpanded;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsItemExpanded(!isItemExpanded);
  };

  const content = (
    <div className="p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      {/* Compact view */}
      {!showExpanded && (
        <div className="flex items-center gap-3">
          <div className={`shrink-0 ${actionColors[entry.action]}`}>
            <ActionIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-white truncate">
                {entry.entityTitle}
              </span>
              <span className="text-xs text-slate-500 shrink-0">
                {actionLabels[entry.action]}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              {formatRelativeTime(entry.timestamp)}
            </p>
          </div>
          <button
            onClick={handleToggle}
            className="shrink-0 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Show details"
          >
            <ChevronDownIcon className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* Expanded view */}
      {showExpanded && (
        <div className="space-y-3">
          {/* Header row */}
          <div className="flex items-start gap-3">
            <div
              className={`shrink-0 mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 ${actionColors[entry.action]}`}
            >
              <ActionIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {actionLabels[entry.action]}
                </span>
                <span className="text-slate-400">-</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                  {entry.entityTitle}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <EntityIcon className="w-3.5 h-3.5" />
                  {entityTypeLabels[entry.entityType]}
                </span>
                <span>{formatFullDate(entry.timestamp)}</span>
              </div>
            </div>
            {!globalExpanded && (
              <button
                onClick={handleToggle}
                className="shrink-0 p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Hide details"
              >
                <ChevronUpIcon className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Details row */}
          <div className="ml-10 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <UserCircleIcon className="w-4 h-4" />
              <span>{entry.userName}</span>
            </div>
            {entry.locale && (
              <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                {entry.locale.toUpperCase()}
              </div>
            )}
          </div>

          {/* Additional details if present */}
          {entry.details && Object.keys(entry.details).length > 0 && (
            <div className="ml-10 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs">
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Details
              </p>
              <div className="space-y-1">
                {Object.entries(entry.details).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-slate-500 capitalize">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link to entity */}
          {link && (
            <div className="ml-10">
              <Link
                href={link}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                View {entityTypeLabels[entry.entityType].toLowerCase()}
                <ChevronRightIcon className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return content;
};

const RecentActivity: React.FC<RecentActivityProps> = ({
  entries,
  totalCount,
  onLoadMore,
  isLoadingMore,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedEntries = isExpanded ? entries : entries.slice(0, 5);
  const hasMore = totalCount > entries.length;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ClockIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <p className="text-xs text-slate-500">
                {totalCount} total actions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/audit"
              className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              View all
            </Link>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded mode indicator */}
        {isExpanded && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              Detailed view
            </span>
            <span>
              Showing {displayedEntries.length} of {totalCount} activities
            </span>
          </div>
        )}
      </div>

      {/* Activity list */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {displayedEntries.length > 0 ? (
          displayedEntries.map((entry) => (
            <ActivityItem
              key={entry.id}
              entry={entry}
              globalExpanded={isExpanded}
            />
          ))
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
            No activity recorded yet
          </div>
        )}
      </div>

      {/* Load more button (in expanded mode) */}
      {isExpanded && hasMore && onLoadMore && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="w-full py-2 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? (
              <span className="flex items-center justify-center gap-2">
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              `Load more (${totalCount - entries.length} remaining)`
            )}
          </button>
        </div>
      )}

      {/* Collapsed mode footer */}
      {!isExpanded && entries.length > 5 && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-3 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800"
        >
          Show {entries.length - 5} more activities
        </button>
      )}
    </div>
  );
};

export default RecentActivity;
