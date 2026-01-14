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

// Get color for action type
const getActionColor = (action: HistoryActionType) => {
  switch (action) {
    case "add":
      return "text-green-500 bg-green-100 dark:bg-green-900/30";
    case "delete":
      return "text-red-500 bg-red-100 dark:bg-red-900/30";
    case "move":
      return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
    case "duplicate":
      return "text-purple-500 bg-purple-100 dark:bg-purple-900/30";
    case "update":
      return "text-amber-500 bg-amber-100 dark:bg-amber-900/30";
    case "restore":
      return "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30";
    case "initial":
      return "text-slate-500 bg-slate-100 dark:bg-slate-800";
    default:
      return "text-slate-500 bg-slate-100 dark:bg-slate-800";
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
        "w-full flex items-start gap-3 px-3 py-2 text-left transition-colors rounded-lg",
        {
          "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800":
            isActive,
          "hover:bg-slate-50 dark:hover:bg-slate-800/50": !isActive,
          "opacity-50": index > 0 && !isCurrent && !isActive,
        },
      )}
    >
      {/* Icon */}
      <div
        className={classNames(
          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
          colorClass,
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={classNames(
              "text-sm font-medium truncate",
              isActive
                ? "text-blue-700 dark:text-blue-300"
                : "text-slate-700 dark:text-slate-300",
            )}
          >
            {entry.label}
          </span>
          {isCurrent && (
            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
          )}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {formatRelativeTime(entry.timestamp)}
        </span>
      </div>
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
          "flex flex-col items-center justify-center h-32 px-4",
          className,
        )}
      >
        <DocumentIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
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
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {formatMessage({
              id: "pb_session_history_title",
              defaultMessage: "Session Changes",
            })}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span
              className={classNames({
                "text-blue-600 dark:text-blue-400": canUndo,
              })}
            >
              {historyIndex} undo
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span
              className={classNames({
                "text-blue-600 dark:text-blue-400": canRedo,
              })}
            >
              {history.length - historyIndex - 1} redo
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
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
