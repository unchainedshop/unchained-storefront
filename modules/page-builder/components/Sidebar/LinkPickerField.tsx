/**
 * Link Picker Field
 * Allows selecting from existing pages (internal links) or entering custom URLs (external)
 */

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import {
  DocumentTextIcon,
  LinkIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { cmsConfig } from "../../../../lib/cms.config";

interface Page {
  id: string;
  slug: string;
  title: Record<string, string>;
}

// Get displayable title from localized object
const getPageTitle = (page: Page): string => {
  if (typeof page.title === "string") return page.title;
  return (
    page.title?.[cmsConfig.defaultLocale] ||
    Object.values(page.title || {})[0] ||
    "Untitled"
  );
};

interface LinkPickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

type LinkMode = "page" | "url";

const LinkPickerField: React.FC<LinkPickerFieldProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = "/link or https://...",
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine mode based on value
  const isExternalUrl =
    value?.startsWith("http://") || value?.startsWith("https://");
  const [mode, setMode] = useState<LinkMode>(isExternalUrl ? "url" : "page");

  // Fetch pages on mount
  useEffect(() => {
    const abortController = new AbortController();

    const fetchPages = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/pages", {
          signal: abortController.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setPages(data.pages || []);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Failed to fetch pages:", err);
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    fetchPages();

    return () => abortController.abort();
  }, []);

  // Update mode when value changes externally
  useEffect(() => {
    if (value?.startsWith("http://") || value?.startsWith("https://")) {
      setMode("url");
    }
  }, [value]);

  const handleModeChange = (newMode: LinkMode) => {
    setMode(newMode);
    if (newMode === "page") {
      // Clear external URL when switching to page mode
      if (value?.startsWith("http")) {
        onChange("");
      }
    }
  };

  const handlePageSelect = (page: Page) => {
    onChange(`/p/${page.slug}`);
    setIsDropdownOpen(false);
    onBlur?.();
  };

  const selectedPage = pages.find(
    (p) => value === `/p/${p.slug}` || value === `/${p.slug}`,
  );

  return (
    <div className="space-y-1.5">
      {/* Mode Toggle */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-0.5 gap-0.5">
        <button
          type="button"
          onClick={() => handleModeChange("page")}
          className={classNames(
            "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium rounded transition-all",
            mode === "page"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
          )}
        >
          <DocumentTextIcon className="w-3 h-3" />
          Page
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("url")}
          className={classNames(
            "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium rounded transition-all",
            mode === "url"
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
          )}
        >
          <LinkIcon className="w-3 h-3" />
          URL
        </button>
      </div>

      {/* Page Selector */}
      {mode === "page" && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-left"
          >
            <span
              className={classNames(
                selectedPage
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400",
              )}
            >
              {isLoading
                ? "Loading..."
                : selectedPage
                  ? getPageTitle(selectedPage)
                  : "Select a page..."}
            </span>
            <ChevronUpDownIcon className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {pages.length === 0 ? (
                  <div className="px-3 py-2 text-[11px] text-slate-400">
                    No pages found
                  </div>
                ) : (
                  pages.map((page) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => handlePageSelect(page)}
                      className={classNames(
                        "w-full px-3 py-2 text-left text-[11px] hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2",
                        selectedPage?.id === page.id
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-slate-300",
                      )}
                    >
                      <DocumentTextIcon className="w-3.5 h-3.5 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {getPageTitle(page)}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          /p/{page.slug}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* URL Input */}
      {mode === "url" && (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
        />
      )}

      {/* Display current value */}
      {value && (
        <div className="text-[10px] text-slate-400 truncate px-0.5">
          {value}
        </div>
      )}
    </div>
  );
};

export default LinkPickerField;
