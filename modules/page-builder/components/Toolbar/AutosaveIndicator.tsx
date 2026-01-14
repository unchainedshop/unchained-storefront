/**
 * AutosaveIndicator Component
 * Shows the current autosave status with glassmorphism styling
 */

import React from "react";
import classNames from "classnames";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import type { AutosaveStatus } from "../../hooks/useAutosave";

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
  lastSaved: Date | null;
  error: string | null;
  onRetry?: () => void;
  onDismissError?: () => void;
}

const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({
  status,
  lastSaved,
  error,
  onRetry,
  onDismissError,
}) => {
  // Format last saved time
  const formatLastSaved = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);

    if (diffSec < 10) return "Just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Don't show anything when idle and no recent save
  if (status === "idle" && !lastSaved) {
    return null;
  }

  // Error state
  if (status === "error") {
    return (
      <div
        className={classNames(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-red-500/15 dark:bg-red-500/20",
          "backdrop-blur-xl",
          "border border-red-500/30 dark:border-red-400/30",
          "animate-in fade-in-0 slide-in-from-left-2 duration-200",
        )}
      >
        <ExclamationCircleIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
        <span className="text-xs font-medium text-red-700 dark:text-red-300 max-w-[120px] truncate">
          {error || "Save failed"}
        </span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            Retry
          </button>
        )}
        {onDismissError && (
          <button
            onClick={onDismissError}
            className="text-red-400 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Saving state
  if (status === "saving") {
    return (
      <div
        className={classNames(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-blue-500/15 dark:bg-blue-500/20",
          "backdrop-blur-xl",
          "border border-blue-500/30 dark:border-blue-400/30",
          "animate-in fade-in-0 slide-in-from-left-2 duration-200",
        )}
      >
        <ArrowPathIcon className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-spin" />
        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
          Saving...
        </span>
      </div>
    );
  }

  // Pending state (changes detected, waiting to save)
  if (status === "pending") {
    return (
      <div
        className={classNames(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-amber-500/15 dark:bg-amber-500/20",
          "backdrop-blur-xl",
          "border border-amber-500/30 dark:border-amber-400/30",
          "animate-in fade-in-0 slide-in-from-left-2 duration-200",
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
          Unsaved
        </span>
      </div>
    );
  }

  // Saved state
  if (status === "saved") {
    return (
      <div
        className={classNames(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-emerald-500/15 dark:bg-emerald-500/20",
          "backdrop-blur-xl",
          "border border-emerald-500/30 dark:border-emerald-400/30",
          "animate-in fade-in-0 slide-in-from-left-2 duration-200",
        )}
      >
        <CheckCircleIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
          Saved
        </span>
      </div>
    );
  }

  // Idle state with last saved time
  if (status === "idle" && lastSaved) {
    return (
      <div
        className={classNames(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-slate-500/10 dark:bg-slate-500/15",
          "backdrop-blur-xl",
          "border border-slate-300/50 dark:border-slate-600/50",
        )}
      >
        <CheckCircleIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {formatLastSaved(lastSaved)}
        </span>
      </div>
    );
  }

  return null;
};

export default AutosaveIndicator;
