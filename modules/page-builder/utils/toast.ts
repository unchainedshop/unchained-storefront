/**
 * Toast Utility for Page Builder
 * Provides consistent toast notifications using react-hot-toast
 */

import toast from "react-hot-toast";
import type { ErrorCode, ErrorSeverity, PageBuilderError } from "../types";

// Error code to user-friendly message mapping
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  SAVE_FAILED: "Failed to save changes",
  LOAD_FAILED: "Failed to load page",
  DELETE_FAILED: "Failed to delete page",
  DUPLICATE_FAILED: "Failed to duplicate page",
  WORKFLOW_FAILED: "Failed to update page status",
  VALIDATION_FAILED: "Please fix the validation errors",
  NETWORK_ERROR: "Network error. Please check your connection",
  PERMISSION_DENIED: "You don't have permission to perform this action",
  CONFLICT: "Another user has modified this page",
  UNKNOWN: "An unexpected error occurred",
};

// Frost glassmorphism toast style - white frosted glass
const TOAST_STYLE = {
  background: "rgba(255, 255, 255, 0.75)",
  color: "#0f172a",
  borderRadius: "16px",
  padding: "12px 16px",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.01em",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  boxShadow:
    "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
};

interface ToastOptions {
  duration?: number;
  id?: string;
}

/**
 * Show a success toast notification
 */
export function showSuccessToast(
  message: string,
  options?: ToastOptions,
): string {
  return toast.success(message, {
    duration: options?.duration ?? 3000,
    id: options?.id,
    style: TOAST_STYLE,
    iconTheme: {
      primary: "#0d9488",
      secondary: "rgba(255, 255, 255, 0.9)",
    },
  });
}

/**
 * Show an error toast notification
 */
export function showErrorToast(
  message: string,
  options?: ToastOptions,
): string {
  return toast.error(message, {
    duration: options?.duration ?? 5000,
    id: options?.id,
    style: TOAST_STYLE,
    iconTheme: {
      primary: "#dc2626",
      secondary: "rgba(255, 255, 255, 0.9)",
    },
  });
}

/**
 * Show a warning toast notification
 */
export function showWarningToast(
  message: string,
  options?: ToastOptions,
): string {
  return toast(message, {
    duration: options?.duration ?? 4000,
    id: options?.id,
    icon: "⚠",
    style: TOAST_STYLE,
  });
}

/**
 * Show an info toast notification
 */
export function showInfoToast(message: string, options?: ToastOptions): string {
  return toast(message, {
    duration: options?.duration ?? 3000,
    id: options?.id,
    icon: "ℹ",
    style: TOAST_STYLE,
  });
}

/**
 * Show a loading toast that can be updated
 */
export function showLoadingToast(message: string, id?: string): string {
  return toast.loading(message, {
    id,
    style: TOAST_STYLE,
  });
}

/**
 * Dismiss a specific toast or all toasts
 */
export function dismissToast(id?: string): void {
  if (id) {
    toast.dismiss(id);
  } else {
    toast.dismiss();
  }
}

/**
 * Create a PageBuilderError object
 */
export function createError(
  code: ErrorCode,
  options?: {
    message?: string;
    details?: string;
    severity?: ErrorSeverity;
    retryAction?: () => Promise<void>;
  },
): PageBuilderError {
  return {
    code,
    message: options?.message ?? ERROR_MESSAGES[code],
    severity: options?.severity ?? "error",
    details: options?.details,
    timestamp: Date.now(),
    retryAction: options?.retryAction,
  };
}

/**
 * Show toast from a PageBuilderError object
 */
export function showErrorFromPageBuilderError(
  error: PageBuilderError,
  options?: ToastOptions,
): string {
  const toastFn =
    error.severity === "warning"
      ? showWarningToast
      : error.severity === "info"
        ? showInfoToast
        : showErrorToast;

  return toastFn(error.message, options);
}

/**
 * Handle API response and show appropriate toast
 */
export async function handleApiResponse<T>(
  response: Response,
  options: {
    successMessage?: string;
    errorCode?: ErrorCode;
  } = {},
): Promise<{ data: T | null; error: PageBuilderError | null }> {
  if (response.ok) {
    const data = (await response.json()) as T;
    if (options.successMessage) {
      showSuccessToast(options.successMessage);
    }
    return { data, error: null };
  }

  let errorMessage: string;
  try {
    const errorData = await response.json();
    errorMessage =
      errorData.error ||
      errorData.message ||
      ERROR_MESSAGES[options.errorCode || "UNKNOWN"];
  } catch {
    errorMessage = ERROR_MESSAGES[options.errorCode || "UNKNOWN"];
  }

  const error = createError(options.errorCode || "UNKNOWN", {
    message: errorMessage,
    details: `HTTP ${response.status}: ${response.statusText}`,
  });

  showErrorToast(error.message);
  return { data: null, error };
}

/**
 * Wrap an async operation with loading toast and error handling
 */
export async function withLoadingToast<T>(
  operation: () => Promise<T>,
  options: {
    loadingMessage?: string;
    successMessage?: string;
    errorCode?: ErrorCode;
    errorMessage?: string;
  } = {},
): Promise<{ result: T | null; error: PageBuilderError | null }> {
  const toastId = showLoadingToast(options.loadingMessage ?? "Processing...");

  try {
    const result = await operation();
    dismissToast(toastId);
    if (options.successMessage) {
      showSuccessToast(options.successMessage);
    }
    return { result, error: null };
  } catch (err) {
    dismissToast(toastId);
    const errorMessage =
      options.errorMessage ??
      (err instanceof Error
        ? err.message
        : ERROR_MESSAGES[options.errorCode || "UNKNOWN"]);

    const error = createError(options.errorCode || "UNKNOWN", {
      message: errorMessage,
      details: err instanceof Error ? err.stack : undefined,
    });

    showErrorToast(error.message);
    return { result: null, error };
  }
}
