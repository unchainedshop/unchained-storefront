/**
 * Error Boundary for Page Builder
 * Catches React errors and displays a friendly fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class PageBuilderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console for debugging
    console.error("[PageBuilder Error]", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Something went wrong
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
            An unexpected error occurred in the page builder. Your changes have been preserved.
          </p>

          {this.state.error && (
            <details className="mb-6 w-full max-w-lg">
              <summary className="cursor-pointer text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                View error details
              </summary>
              <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-auto max-h-32">
                <code className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {this.state.error.message}
                </code>
              </div>
            </details>
          )}

          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageBuilderErrorBoundary;
