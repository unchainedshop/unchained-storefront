/**
 * Workflow Actions
 * Toolbar component for managing page workflow (submit, approve, reject, publish)
 */

import React, { useState } from "react";
import {
  PaperAirplaneIcon,
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  EyeSlashIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { statusConfig } from "../../../cms/utils/permissions";
import type { PageStatus } from "../../types";
import ReviewModal from "../Modals/ReviewModal";
import ScheduleModal from "../Modals/ScheduleModal";

interface WorkflowActionsProps {
  onWorkflowChange?: (newStatus: PageStatus) => Promise<void>;
  userRoles?: string[];
}

const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  onWorkflowChange,
  userRoles = ["admin"], // Default to admin for development
}) => {
  const { state } = usePageBuilder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">(
    "approve",
  );
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  if (!state.page) return null;

  const { status } = state.page;
  const config = statusConfig[status];

  const isAdmin = userRoles.includes("admin");
  const isEditor = userRoles.includes("editor") || isAdmin;
  const isReviewer = userRoles.includes("reviewer") || isAdmin;
  const isPublisher = userRoles.includes("publisher") || isAdmin;

  const handleTransition = async (
    targetStatus: PageStatus,
    note?: string,
    scheduledFor?: string,
  ) => {
    if (!onWorkflowChange) return;

    setIsSubmitting(true);
    try {
      await onWorkflowChange(targetStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (note: string) => {
    const targetStatus = reviewAction === "approve" ? "approved" : "draft";
    await handleTransition(targetStatus, note);
    setShowReviewModal(false);
  };

  const handleScheduleSubmit = async (date: string) => {
    await handleTransition("published", undefined, date);
    setShowScheduleModal(false);
  };

  const openReviewModal = (action: "approve" | "reject") => {
    setReviewAction(action);
    setShowReviewModal(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Current Status Badge */}
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-lg ${config.color} ${config.bgColor}`}
        >
          {config.label}
        </span>

        {/* Draft Actions */}
        {status === "draft" && (
          <>
            {isEditor && (
              <button
                onClick={() => handleTransition("in_review")}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-3.5 h-3.5" />
                Submit for Review
              </button>
            )}
            {isPublisher && (
              <button
                onClick={() => handleTransition("published")}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
              >
                <GlobeAltIcon className="w-3.5 h-3.5" />
                Publish
              </button>
            )}
          </>
        )}

        {/* In Review Actions */}
        {status === "in_review" && (
          <>
            {isReviewer && (
              <>
                <button
                  onClick={() => openReviewModal("approve")}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => openReviewModal("reject")}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}
          </>
        )}

        {/* Approved Actions */}
        {status === "approved" && (
          <>
            {isPublisher && (
              <>
                <button
                  onClick={() => handleTransition("published")}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
                >
                  <GlobeAltIcon className="w-3.5 h-3.5" />
                  Publish Now
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Schedule
                </button>
              </>
            )}
            {isAdmin && (
              <button
                onClick={() => handleTransition("draft")}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
                Return to Draft
              </button>
            )}
          </>
        )}

        {/* Published Actions */}
        {status === "published" && (
          <>
            {isPublisher && (
              <button
                onClick={() => handleTransition("draft")}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <EyeSlashIcon className="w-3.5 h-3.5" />
                Unpublish
              </button>
            )}
          </>
        )}

        {/* Archived Actions */}
        {status === "archived" && (
          <>
            {isAdmin && (
              <button
                onClick={() => handleTransition("draft")}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
                Restore
              </button>
            )}
          </>
        )}

        {/* Scheduled indicator */}
        {state.page.workflow?.scheduledFor && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <CalendarIcon className="w-3.5 h-3.5" />
            Scheduled:{" "}
            {new Date(state.page.workflow.scheduledFor).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        action={reviewAction}
        isSubmitting={isSubmitting}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default WorkflowActions;
