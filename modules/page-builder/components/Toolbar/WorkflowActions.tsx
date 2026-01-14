/**
 * Workflow Actions
 * Compact dropdown for managing page workflow (submit, approve, reject, publish)
 */

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import {
  PaperAirplaneIcon,
  CheckIcon,
  XMarkIcon,
  GlobeAltIcon,
  EyeSlashIcon,
  CalendarIcon,
  ArrowPathIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { statusConfig } from "../../../cms/utils/permissions";
import type { PageStatus } from "../../types";
import ReviewModal from "../Modals/ReviewModal";
import ScheduleModal from "../Modals/ScheduleModal";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

interface WorkflowActionsProps {
  onWorkflowChange?: (newStatus: PageStatus) => Promise<void>;
  userRoles?: string[];
}

interface ActionItem {
  label: string;
  icon: React.FC<{ className?: string }>;
  onClick: () => void;
  color: "emerald" | "amber" | "red" | "blue" | "slate";
}

const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  onWorkflowChange,
  userRoles = ["admin"],
}) => {
  const { state } = usePageBuilder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">(
    "approve",
  );
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (!state.page) return null;

  const { status } = state.page;
  const config = statusConfig[status];

  const isAdmin = userRoles.includes("admin");
  const isEditor = userRoles.includes("editor") || isAdmin;
  const isReviewer = userRoles.includes("reviewer") || isAdmin;
  const isPublisher = userRoles.includes("publisher") || isAdmin;

  const handleTransition = async (targetStatus: PageStatus, note?: string) => {
    if (!onWorkflowChange) return;

    setIsSubmitting(true);
    setShowDropdown(false);
    try {
      await onWorkflowChange(targetStatus);
      const statusLabel = statusConfig[targetStatus]?.label || targetStatus;
      showSuccessToast(`Page status changed to ${statusLabel}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update page status";
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (note: string) => {
    try {
      const targetStatus = reviewAction === "approve" ? "approved" : "draft";
      await handleTransition(targetStatus, note);
      setShowReviewModal(false);
    } catch {
      // Error already handled in handleTransition
    }
  };

  const handleScheduleSubmit = async (date: string) => {
    try {
      await handleTransition("scheduled");
      setShowScheduleModal(false);
    } catch {
      // Error already handled in handleTransition
    }
  };

  const openReviewModal = (action: "approve" | "reject") => {
    setReviewAction(action);
    setShowReviewModal(true);
    setShowDropdown(false);
  };

  const openScheduleModal = () => {
    setShowScheduleModal(true);
    setShowDropdown(false);
  };

  // Build actions list based on current status
  const getActions = (): ActionItem[] => {
    const actions: ActionItem[] = [];

    if (status === "draft") {
      if (isEditor) {
        actions.push({
          label: "Submit for Review",
          icon: PaperAirplaneIcon,
          onClick: () => handleTransition("in_review"),
          color: "amber",
        });
      }
      if (isPublisher) {
        actions.push({
          label: "Publish",
          icon: GlobeAltIcon,
          onClick: () => handleTransition("published"),
          color: "emerald",
        });
      }
    }

    if (status === "in_review") {
      if (isReviewer) {
        actions.push({
          label: "Approve",
          icon: CheckIcon,
          onClick: () => openReviewModal("approve"),
          color: "emerald",
        });
        actions.push({
          label: "Reject",
          icon: XMarkIcon,
          onClick: () => openReviewModal("reject"),
          color: "red",
        });
      }
    }

    if (status === "approved") {
      if (isPublisher) {
        actions.push({
          label: "Publish Now",
          icon: GlobeAltIcon,
          onClick: () => handleTransition("published"),
          color: "emerald",
        });
        actions.push({
          label: "Schedule",
          icon: CalendarIcon,
          onClick: openScheduleModal,
          color: "blue",
        });
      }
      if (isAdmin) {
        actions.push({
          label: "Return to Draft",
          icon: ArrowPathIcon,
          onClick: () => handleTransition("draft"),
          color: "slate",
        });
      }
    }

    if (status === "scheduled") {
      if (isPublisher) {
        actions.push({
          label: "Publish Now",
          icon: GlobeAltIcon,
          onClick: () => handleTransition("published"),
          color: "emerald",
        });
        actions.push({
          label: "Cancel Schedule",
          icon: XMarkIcon,
          onClick: () => handleTransition("draft"),
          color: "red",
        });
      }
    }

    if (status === "published") {
      if (isPublisher) {
        actions.push({
          label: "Unpublish",
          icon: EyeSlashIcon,
          onClick: () => handleTransition("draft"),
          color: "slate",
        });
      }
    }

    if (status === "archived") {
      if (isAdmin) {
        actions.push({
          label: "Restore",
          icon: ArrowPathIcon,
          onClick: () => handleTransition("draft"),
          color: "slate",
        });
      }
    }

    return actions;
  };

  const actions = getActions();
  const hasActions = actions.length > 0;

  const colorStyles = {
    emerald:
      "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    amber:
      "text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20",
    red: "text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
    blue: "text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    slate:
      "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Status badge - clickable if has actions */}
        <button
          onClick={() => hasActions && setShowDropdown(!showDropdown)}
          disabled={isSubmitting || !hasActions}
          className={classNames(
            "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl transition-all duration-200",
            config.color,
            config.bgColor,
            hasActions && "cursor-pointer hover:opacity-90 active:scale-[0.98]",
            !hasActions && "cursor-default",
            isSubmitting && "opacity-50",
          )}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : null}
          <span>{config.label}</span>
          {hasActions && (
            <ChevronDownIcon
              className={classNames(
                "w-3 h-3 transition-transform duration-200",
                showDropdown && "rotate-180",
              )}
            />
          )}
        </button>

        {/* Dropdown menu */}
        {showDropdown && hasActions && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div
              className={classNames(
                "absolute top-full mt-2 right-0 z-50 min-w-[180px]",
                "bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl backdrop-saturate-150",
                "rounded-xl",
                "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                "border border-white/50 dark:border-white/10",
                "ring-1 ring-black/5 dark:ring-white/5",
                "py-1.5 overflow-hidden",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
              )}
            >
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    disabled={isSubmitting}
                    className={classNames(
                      "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors",
                      colorStyles[action.color],
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Scheduled indicator - shown inline when scheduled */}
        {state.page.workflow?.scheduledFor && (
          <div className="absolute -bottom-5 right-0 flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 whitespace-nowrap">
            <CalendarIcon className="w-3 h-3" />
            {new Date(state.page.workflow.scheduledFor).toLocaleDateString()}
          </div>
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
