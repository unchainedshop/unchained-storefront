/**
 * Restore Confirm Dialog
 * Confirmation modal before restoring a previous version
 */

import React from "react";
import { useIntl } from "react-intl";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AnimatedModal from "../../../common/components/AnimatedModal";
import type { GitCommit } from "../../types/history";

interface RestoreConfirmDialogProps {
  isOpen: boolean;
  commit: GitCommit | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const RestoreConfirmDialog: React.FC<RestoreConfirmDialogProps> = ({
  isOpen,
  commit,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const { formatMessage } = useIntl();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleClose = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  // Don't render if no commit (but let AnimatedModal handle isOpen)
  if (!commit) return null;

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnBackdrop={!isLoading}
      closeOnEscape={!isLoading}
    >
      {/* Dialog */}
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {formatMessage({
                id: "pb_history_restore_confirm_title",
                defaultMessage: "Restore Version",
              })}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {formatMessage({
              id: "pb_history_restore_confirm_message",
              defaultMessage:
                "Are you sure you want to restore this version? Your current changes will be replaced.",
            })}
          </p>

          {/* Version details */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatMessage({
                  id: "pb_history_restore_version",
                  defaultMessage: "Restoring to:",
                })}
              </span>
              <code className="text-xs text-slate-400">{commit.shortHash}</code>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
              {commit.message || "No message"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {commit.author} - {formatDateTime(commit.date)}
            </p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {formatMessage({
                id: "pb_history_restore_warning",
                defaultMessage:
                  "This action will create a new version in history. You can undo by restoring a previous version.",
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {formatMessage({
              id: "pb_history_cancel",
              defaultMessage: "Cancel",
            })}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {formatMessage({
              id: "pb_history_restore_button",
              defaultMessage: "Restore Version",
            })}
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
};

export default RestoreConfirmDialog;
