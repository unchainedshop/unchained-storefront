/**
 * Translation Status Panel
 * Shows translation completeness and status for all locales
 */

import React from "react";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { cmsConfig } from "../../../../lib/cms.config";

interface TranslationStatusProps {
  onCopyFromSource?: () => void;
}

export function TranslationStatus({
  onCopyFromSource,
}: TranslationStatusProps) {
  const { state, activeLocale, setActiveLocale, copyContentToLocale } =
    usePageBuilder();

  const translations = state.page?.translations;
  const sourceLocale = translations?.sourceLocale || cmsConfig.defaultLocale;

  // Get completeness for a locale
  const getCompleteness = (locale: string): number => {
    return translations?.status[locale]?.completeness || 0;
  };

  // Get status for a locale
  const getStatus = (locale: string): string => {
    return translations?.status[locale]?.status || "not_started";
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-slate-700 dark:bg-slate-300";
      case "in_progress":
        return "bg-slate-500 dark:bg-slate-400";
      case "needs_update":
        return "bg-slate-400 dark:bg-slate-500";
      default:
        return "bg-slate-300 dark:bg-slate-600";
    }
  };

  // Handle copy from source
  const handleCopyFromSource = (targetLocale: string) => {
    copyContentToLocale(sourceLocale, targetLocale);
    onCopyFromSource?.();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Translations
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Source: {sourceLocale.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        {cmsConfig.locales.map((locale) => {
          const completeness = getCompleteness(locale);
          const status = getStatus(locale);
          const isActive = locale === activeLocale;
          const isSource = locale === sourceLocale;

          return (
            <div
              key={locale}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                isActive
                  ? "border-slate-400 bg-slate-100 dark:border-slate-500 dark:bg-slate-800/50"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveLocale(locale)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveLocale(locale)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 w-6">
                    {locale.toUpperCase()}
                  </span>
                  {isSource && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-200 text-slate-700 rounded dark:bg-slate-700 dark:text-slate-300">
                      Source
                    </span>
                  )}
                </div>
                {completeness === 100 ? (
                  <span className="text-slate-600 dark:text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {completeness}%
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
                <div
                  className="h-full transition-all duration-300 bg-slate-600 dark:bg-slate-400"
                  style={{ width: `${completeness}%` }}
                />
              </div>

              {/* Status indicator and actions */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
                  />
                  <span className="text-xs text-slate-500 capitalize dark:text-slate-400">
                    {status.replace("_", " ")}
                  </span>
                </div>

                {/* Copy from source button (only for non-source locales with incomplete translations) */}
                {!isSource && completeness < 100 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyFromSource(locale);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Copy from {sourceLocale.toUpperCase()}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall summary */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Overall completion
          </span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {Math.round(
              cmsConfig.locales.reduce(
                (sum, locale) => sum + getCompleteness(locale),
                0,
              ) / cmsConfig.locales.length,
            )}
            %
          </span>
        </div>
        <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden dark:bg-slate-700">
          <div
            className="h-full bg-slate-600 dark:bg-slate-400 transition-all duration-300"
            style={{
              width: `${Math.round(
                cmsConfig.locales.reduce(
                  (sum, locale) => sum + getCompleteness(locale),
                  0,
                ) / cmsConfig.locales.length,
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TranslationStatus;
