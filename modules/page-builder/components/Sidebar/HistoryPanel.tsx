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
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
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
      <div className="border-b border-slate-100/80 dark:border-slate-800/50">
        <div className="px-3 pt-2.5 pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <h3 className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
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
                className="p-1 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 rounded-md transition-colors"
                title={formatMessage({
                  id: "pb_history_refresh",
                  defaultMessage: "Refresh",
                })}
              >
                <ArrowPathIcon
                  className={classNames(
                    "w-3.5 h-3.5 text-slate-400 dark:text-slate-500",
                    {
                      "animate-spin": isLoading,
                    },
                  )}
                />
              </button>
            )}
          </div>

          {/* Tab buttons */}
          <div className="flex gap-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={classNames(
                    "flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium rounded-t-md transition-colors outline-none focus:outline-none focus:ring-0",
                    isActive
                      ? "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-b-0 border-slate-200/80 dark:border-slate-700/50"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                  <span
                    className={classNames(
                      "text-[9px] px-1 py-0.5 rounded",
                      isActive
                        ? "bg-slate-100/80 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"
                        : "bg-slate-200/50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500",
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
      <div className="flex-1 overflow-y-auto bg-white/50 dark:bg-slate-800/30">
        {activeTab === "session" ? (
          <SessionHistory />
        ) : (
          <>
            {isLoading && commits.length === 0 ? (
              <div className="flex items-center justify-center h-28">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                  <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  {formatMessage({
                    id: "pb_history_loading",
                    defaultMessage: "Loading history...",
                  })}
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-28 px-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-slate-400 mb-1.5" />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                  {error}
                </p>
                <button
                  onClick={() => fetchHistory()}
                  className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {formatMessage({
                    id: "pb_history_retry",
                    defaultMessage: "Try again",
                  })}
                </button>
              </div>
            ) : commits.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 px-4">
                <CloudIcon className="w-6 h-6 text-slate-300 dark:text-slate-600 mb-1.5" />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
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
        <div className="px-3 py-1.5 border-t border-slate-100/80 dark:border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" />
              <span className="text-[9px] text-slate-400 dark:text-slate-500">
                {formatMessage({
                  id: "pb_history_previewing",
                  defaultMessage: "Previewing version",
                })}
              </span>
            </div>
            <button
              onClick={clearPreview}
              className="text-[9px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
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
