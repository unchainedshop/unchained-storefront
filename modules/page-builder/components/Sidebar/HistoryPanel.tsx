/**
 * History Panel
 * Shows both session history (in-memory) and Git version history with tabs
 */

import React, { useState } from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";
import {
  ClockIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { usePageHistory } from "../../hooks/usePageHistory";
import HistoryTimeline from "./HistoryTimeline";
import SessionHistory from "./SessionHistory";
import RestoreConfirmDialog from "../Dialogs/RestoreConfirmDialog";
import type { GitCommit } from "../../types/history";
import type { Page } from "../../types";

type HistoryTab = "session" | "versions";

interface HistoryPanelProps {
  className?: string;
  onPageRestored?: (page: Page) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  className,
  onPageRestored,
}) => {
  const { formatMessage } = useIntl();
  const { state } = usePageBuilder();
  const { page, history } = state;

  const [activeTab, setActiveTab] = useState<HistoryTab>("session");

  const {
    commits,
    isLoading,
    error,
    selectedCommit,
    isPreviewLoading,
    previewVersion,
    restoreVersion,
    clearPreview,
    fetchHistory,
  } = usePageHistory({ slug: page?.slug || "", enabled: !!page?.slug });

  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [commitToRestore, setCommitToRestore] = useState<GitCommit | null>(
    null,
  );
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePreview = (commit: GitCommit) => {
    previewVersion(commit);
  };

  const handleRestoreClick = (commit: GitCommit) => {
    setCommitToRestore(commit);
    setShowRestoreDialog(true);
  };

  const handleRestoreConfirm = async () => {
    if (!commitToRestore) return;

    setIsRestoring(true);
    const restoredPage = await restoreVersion(commitToRestore);
    setIsRestoring(false);

    if (restoredPage) {
      onPageRestored?.(restoredPage);
      clearPreview();
    }
    setShowRestoreDialog(false);
    setCommitToRestore(null);
  };

  const handleRestoreCancel = () => {
    setShowRestoreDialog(false);
    setCommitToRestore(null);
  };

  if (!page) {
    return (
      <div
        className={classNames(
          "flex items-center justify-center h-full",
          className,
        )}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatMessage({
            id: "pb_history_no_page",
            defaultMessage: "No page loaded",
          })}
        </p>
      </div>
    );
  }

  const tabs = [
    {
      id: "session" as HistoryTab,
      label: formatMessage({
        id: "pb_history_session",
        defaultMessage: "Session",
      }),
      icon: BoltIcon,
      count: history.length,
    },
    {
      id: "versions" as HistoryTab,
      label: formatMessage({
        id: "pb_history_versions_tab",
        defaultMessage: "Saved",
      }),
      icon: CloudIcon,
      count: commits.length,
    },
  ];

  return (
    <div className={classNames("h-full flex flex-col", className)}>
      {/* Header with tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="px-4 pt-3 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-slate-500" />
              <h3 className="font-medium text-slate-900 dark:text-white">
                {formatMessage({
                  id: "pb_history_title",
                  defaultMessage: "History",
                })}
              </h3>
            </div>
            {activeTab === "versions" && (
              <button
                onClick={() => fetchHistory()}
                disabled={isLoading}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                title={formatMessage({
                  id: "pb_history_refresh",
                  defaultMessage: "Refresh",
                })}
              >
                <ArrowPathIcon
                  className={classNames("w-4 h-4 text-slate-500", {
                    "animate-spin": isLoading,
                  })}
                />
              </button>
            )}
          </div>

          {/* Tab buttons */}
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={classNames(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors",
                    isActive
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-b-0 border-slate-200 dark:border-slate-700"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={classNames(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">
        {activeTab === "session" ? (
          <SessionHistory />
        ) : (
          <>
            {isLoading && commits.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  {formatMessage({
                    id: "pb_history_loading",
                    defaultMessage: "Loading history...",
                  })}
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-32 px-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  {error}
                </p>
                <button
                  onClick={() => fetchHistory()}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  {formatMessage({
                    id: "pb_history_retry",
                    defaultMessage: "Try again",
                  })}
                </button>
              </div>
            ) : commits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 px-4">
                <CloudIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  {formatMessage({
                    id: "pb_history_empty",
                    defaultMessage:
                      "No saved versions yet. Save your page to create the first version.",
                  })}
                </p>
              </div>
            ) : (
              <HistoryTimeline
                commits={commits}
                selectedCommit={selectedCommit}
                onPreview={handlePreview}
                onRestore={handleRestoreClick}
                isPreviewLoading={isPreviewLoading}
              />
            )}
          </>
        )}
      </div>

      {/* Preview indicator (only for versions tab) */}
      {activeTab === "versions" && selectedCommit && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs text-amber-700 dark:text-amber-300">
                {formatMessage({
                  id: "pb_history_previewing",
                  defaultMessage: "Previewing version",
                })}
              </span>
            </div>
            <button
              onClick={clearPreview}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              {formatMessage({
                id: "pb_history_exit_preview",
                defaultMessage: "Exit preview",
              })}
            </button>
          </div>
        </div>
      )}

      {/* Restore Confirmation Dialog */}
      <RestoreConfirmDialog
        isOpen={showRestoreDialog}
        commit={commitToRestore}
        onConfirm={handleRestoreConfirm}
        onCancel={handleRestoreCancel}
        isLoading={isRestoring}
      />
    </div>
  );
};

export default HistoryPanel;
