/**
 * Session History Component
 * Displays a visual timeline of actions in the current editing session
 */

import React from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";
import {
  PlusIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  ArrowPathIcon,
  DocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import type { HistoryActionType, HistoryEntry } from "../../types";

// Get icon for action type
const getActionIcon = (action: HistoryActionType) => {
  switch (action) {
    case "add":
      return PlusIcon;
    case "delete":
      return TrashIcon;
    case "move":
      return ArrowsUpDownIcon;
    case "duplicate":
      return DocumentDuplicateIcon;
    case "update":
      return PencilIcon;
    case "restore":
      return ArrowPathIcon;
    case "initial":
      return DocumentIcon;
    default:
      return DocumentIcon;
  }
};

// Get color for action type (minimal - text only, no backgrounds)
const getActionColor = (action: HistoryActionType) => {
  switch (action) {
    case "add":
      return "text-slate-500 dark:text-slate-400";
    case "delete":
      return "text-slate-500 dark:text-slate-400";
    case "move":
      return "text-slate-500 dark:text-slate-400";
    case "duplicate":
      return "text-slate-500 dark:text-slate-400";
    case "update":
      return "text-slate-500 dark:text-slate-400";
    case "restore":
      return "text-slate-500 dark:text-slate-400";
    case "initial":
      return "text-slate-400 dark:text-slate-500";
    default:
      return "text-slate-400 dark:text-slate-500";
  }
};

// Format relative time
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    return "Just now";
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
};

interface SessionHistoryItemProps {
  entry: HistoryEntry;
  index: number;
  isActive: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

const SessionHistoryItem: React.FC<SessionHistoryItemProps> = ({
  entry,
  index,
  isActive,
  isCurrent,
  onClick,
}) => {
  const Icon = getActionIcon(entry.action);
  const colorClass = getActionColor(entry.action);

  return (
    <button
      onClick={onClick}
      className={classNames(
        "w-full flex items-center gap-2 py-1.5 text-left transition-colors",
        {
          "bg-slate-50/50 dark:bg-slate-800/30": isActive,
          "hover:bg-slate-50/30 dark:hover:bg-slate-800/20": !isActive,
          "opacity-40": index > 0 && !isCurrent && !isActive,
        },
      )}
    >
      {/* Icon */}
      <div className={classNames("flex-shrink-0", colorClass)}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span
          className={classNames(
            "text-[11px] truncate",
            isActive
              ? "text-slate-700 dark:text-slate-200 font-medium"
              : "text-slate-600 dark:text-slate-400",
          )}
        >
          {entry.label}
        </span>
        {isCurrent && (
          <CheckCircleIcon className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        )}
      </div>

      {/* Time */}
      <span className="text-[9px] text-slate-400 dark:text-slate-500 flex-shrink-0">
        {formatRelativeTime(entry.timestamp)}
      </span>
    </button>
  );
};

interface SessionHistoryProps {
  className?: string;
  maxItems?: number;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  className,
  maxItems = 20,
}) => {
  const { formatMessage } = useIntl();
  const { state, undo, redo, canUndo, canRedo } = usePageBuilder();
  const { history, historyIndex } = state;

  // Get visible history entries (most recent first, limited)
  const visibleHistory = [...history]
    .map((entry, idx) => ({ entry, originalIndex: idx }))
    .reverse()
    .slice(0, maxItems);

  const handleJumpToHistory = (targetIndex: number) => {
    const steps = targetIndex - historyIndex;
    if (steps > 0) {
      // Need to redo
      for (let i = 0; i < steps; i++) {
        redo();
      }
    } else if (steps < 0) {
      // Need to undo
      for (let i = 0; i < Math.abs(steps); i++) {
        undo();
      }
    }
  };

  if (history.length === 0) {
    return (
      <div
        className={classNames(
          "flex flex-col items-center justify-center h-24 px-3",
          className,
        )}
      >
        <DocumentIcon className="w-5 h-5 text-slate-300 dark:text-slate-600 mb-1.5" />
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
          {formatMessage({
            id: "pb_session_history_empty",
            defaultMessage: "No actions yet",
          })}
        </p>
      </div>
    );
  }

  return (
    <div className={classNames("flex flex-col", className)}>
      {/* Header with undo/redo counts */}
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {history.length}{" "}
          {formatMessage({
            id: "pb_session_history_changes",
            defaultMessage: "changes",
          })}
        </span>
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500">
          <span
            className={classNames({
              "text-slate-600 dark:text-slate-300": canUndo,
            })}
          >
            {historyIndex} undo
          </span>
          <span>·</span>
          <span
            className={classNames({
              "text-slate-600 dark:text-slate-300": canRedo,
            })}
          >
            {history.length - historyIndex - 1} redo
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
        {visibleHistory.map(({ entry, originalIndex }) => (
          <SessionHistoryItem
            key={`${originalIndex}-${entry.timestamp}`}
            entry={entry}
            index={history.length - 1 - originalIndex}
            isActive={originalIndex === historyIndex}
            isCurrent={originalIndex === history.length - 1}
            onClick={() => handleJumpToHistory(originalIndex)}
          />
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-1.5 border-t border-slate-100/80 dark:border-slate-800/50">
        <p className="text-[9px] text-slate-400 dark:text-slate-500 text-center">
          {formatMessage({
            id: "pb_session_history_hint",
            defaultMessage: "Click to jump to any state",
          })}
        </p>
      </div>
    </div>
  );
};

export default SessionHistory;
