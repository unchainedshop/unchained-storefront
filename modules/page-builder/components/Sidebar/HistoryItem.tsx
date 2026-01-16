/**
 * History Item
 * Individual commit in the timeline
 */

import React, { useState } from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";
import {
  EyeIcon,
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { GitCommit } from "../../types/history";

interface HistoryItemProps {
  commit: GitCommit;
  isSelected: boolean;
  isFirst: boolean;
  isLoading: boolean;
  onPreview: () => void;
  onRestore: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  commit,
  isSelected,
  isFirst,
  isLoading,
  onPreview,
  onRestore,
}) => {
  const { formatMessage } = useIntl();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={classNames(
        "relative pl-8 pr-3 py-1.5 transition-colors",
        isSelected
          ? "bg-slate-50/50 dark:bg-slate-800/30"
          : "hover:bg-slate-50/30 dark:hover:bg-slate-800/20",
      )}
    >
      {/* Timeline dot */}
      <div
        className={classNames(
          "absolute left-[15px] top-[10px] w-2 h-2 rounded-full",
          isFirst
            ? "bg-slate-500 dark:bg-slate-400"
            : isSelected
              ? "bg-slate-400 dark:bg-slate-500"
              : "bg-slate-300 dark:bg-slate-600",
        )}
      />

      {/* Content */}
      <div className="min-w-0">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-left min-w-0 flex-1"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
            )}
            <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
              {commit.message ||
                formatMessage({
                  id: "pb_history_no_message",
                  defaultMessage: "No message",
                })}
            </span>
          </button>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 flex-shrink-0">
            {formatTime(commit.date)}
          </span>
        </div>

        {/* Author and hash */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 ml-3.5">
          <span className="truncate">{commit.author}</span>
          <span>·</span>
          <code className="font-mono">{commit.shortHash}</code>
        </div>

        {/* Expanded details and actions */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-slate-100/80 dark:border-slate-800/50 ml-3.5">
            {/* Full message if truncated */}
            {commit.message && commit.message.length > 40 && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 whitespace-pre-wrap">
                {commit.message}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onPreview}
                disabled={isLoading}
                className={classNames(
                  "flex items-center gap-1 px-2 py-1 text-[10px] rounded transition-colors",
                  isSelected
                    ? "text-slate-600 dark:text-slate-300"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                )}
              >
                {isLoading ? (
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <EyeIcon className="w-3 h-3" />
                )}
                {formatMessage({
                  id: "pb_history_preview",
                  defaultMessage: "Preview",
                })}
              </button>

              <button
                onClick={onRestore}
                disabled={isFirst}
                className={classNames(
                  "flex items-center gap-1 px-2 py-1 text-[10px] rounded transition-colors",
                  isFirst
                    ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                )}
                title={
                  isFirst
                    ? formatMessage({
                        id: "pb_history_current_version",
                        defaultMessage: "This is the current version",
                      })
                    : formatMessage({
                        id: "pb_history_restore_tooltip",
                        defaultMessage: "Restore this version",
                      })
                }
              >
                <ArrowUturnLeftIcon className="w-3 h-3" />
                {formatMessage({
                  id: "pb_history_restore",
                  defaultMessage: "Restore",
                })}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;
