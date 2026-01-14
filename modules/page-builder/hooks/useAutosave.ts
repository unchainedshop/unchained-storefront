/**
 * useAutosave Hook
 * Automatically saves the page after changes with debouncing
 */

import { useEffect, useRef, useCallback, useState } from "react";
import type { Page } from "../types";

export type AutosaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

interface UseAutosaveOptions {
  /** The page to save */
  page: Page | null;
  /** Whether there are unsaved changes */
  isDirty: boolean;
  /** Save function */
  onSave: (page: Page) => Promise<void>;
  /** Delay in ms before autosave triggers (default: 2000) */
  delay?: number;
  /** Duration to show "Saved" status in ms (default: 2000) */
  savedDuration?: number;
  /** Whether autosave is enabled (default: true) */
  enabled?: boolean;
}

interface UseAutosaveReturn {
  /** Current autosave status */
  status: AutosaveStatus;
  /** Last save timestamp */
  lastSaved: Date | null;
  /** Error message if save failed */
  error: string | null;
  /** Manually trigger save */
  saveNow: () => Promise<void>;
  /** Reset error state */
  clearError: () => void;
}

export function useAutosave({
  page,
  isDirty,
  onSave,
  delay = 2000,
  savedDuration = 2000,
  enabled = true,
}: UseAutosaveOptions): UseAutosaveReturn {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const pageRef = useRef(page);

  // Keep page ref updated
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    if (status === "error") {
      setStatus("idle");
    }
  }, [status]);

  // Perform save
  const performSave = useCallback(async () => {
    if (!pageRef.current || isSavingRef.current) return;

    isSavingRef.current = true;
    setStatus("saving");
    setError(null);

    try {
      await onSave(pageRef.current);
      setLastSaved(new Date());
      setStatus("saved");

      // Reset to idle after showing "Saved"
      savedTimeoutRef.current = setTimeout(() => {
        setStatus("idle");
      }, savedDuration);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStatus("error");
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave, savedDuration]);

  // Manual save
  const saveNow = useCallback(async () => {
    // Clear any pending autosave
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    await performSave();
  }, [performSave]);

  // Autosave effect
  useEffect(() => {
    if (!enabled || !isDirty || !page) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set status to pending (changes detected, waiting to save)
    setStatus("pending");

    // Schedule autosave
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, isDirty, page, delay, performSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSaved,
    error,
    saveNow,
    clearError,
  };
}

export default useAutosave;
