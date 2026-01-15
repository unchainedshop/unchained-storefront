/**
 * Review Modal
 * Modal for adding review notes when approving or rejecting a page
 */

import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import AnimatedModal from "../../../common/components/AnimatedModal";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
  action: "approve" | "reject";
  isSubmitting?: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  action,
  isSubmitting = false,
}) => {
  const [note, setNote] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset note and focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setNote("");
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(note);
  };

  const isApproval = action === "approve";

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={handleClose}
      zIndex={1100}
      closeOnBackdrop={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      {/* Modal */}
      <div className="w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isApproval
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "bg-red-100 dark:bg-red-900/30"
              }`}
            >
              {isApproval ? (
                <CheckIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isApproval ? "Approve Page" : "Reject Page"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isApproval
                  ? "Add an optional note for the team"
                  : "Provide feedback for the author"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {isApproval ? "Approval Note (Optional)" : "Rejection Reason"}
              {!isApproval && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isApproval
                  ? "Add any notes about the approval..."
                  : "Explain what needs to be changed..."
              }
              rows={4}
              required={!isApproval}
              disabled={isSubmitting}
              className="w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none disabled:opacity-50"
            />
            {!isApproval && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                This feedback will be visible to the page author
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!isApproval && !note.trim())}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
                isApproval
                  ? "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : isApproval ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Approve
                </>
              ) : (
                <>
                  <XCircleIcon className="w-4 h-4" />
                  Reject
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AnimatedModal>
  );
};

export default ReviewModal;
