/**
 * Schedule Modal
 * Modal for scheduling page publication at a future date
 */

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import AnimatedModal from "../../../common/components/AnimatedModal";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: string) => Promise<void>;
  isSubmitting?: boolean;
  initialDate?: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialDate,
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Initialize with tomorrow at 9 AM
  useEffect(() => {
    if (isOpen) {
      if (initialDate) {
        const d = new Date(initialDate);
        setDate(d.toISOString().split("T")[0]);
        setTime(d.toTimeString().slice(0, 5));
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        setDate(tomorrow.toISOString().split("T")[0]);
        setTime("09:00");
      }
    }
  }, [isOpen, initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledDate = new Date(`${date}T${time}`);
    await onSubmit(scheduledDate.toISOString());
  };

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  // Check if selected datetime is in the future
  const selectedDateTime = new Date(`${date}T${time}`);
  const isValidFutureDate = selectedDateTime > new Date();

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
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Schedule Publication
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose when to publish this page
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
          <div className="p-6 space-y-4">
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Publication Date
                </span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Time Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Publication Time
                </span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Preview */}
            {date && time && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This page will be published on:
                </p>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100 mt-1">
                  {selectedDateTime.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {selectedDateTime.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {!isValidFutureDate && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    Please select a future date and time
                  </p>
                )}
              </div>
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
              disabled={isSubmitting || !isValidFutureDate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
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
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarIcon className="w-4 h-4" />
                  Schedule Publication
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AnimatedModal>
  );
};

export default ScheduleModal;
