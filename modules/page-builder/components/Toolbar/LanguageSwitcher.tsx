/**
 * Language Switcher
 * Toolbar component for switching between locales in the page builder
 */

import React, { useState, useRef, useEffect } from "react";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { cmsConfig } from "../../../../lib/cms.config";

export function LanguageSwitcher() {
  const { activeLocale, setActiveLocale, state } = usePageBuilder();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  // Get translation completeness for each locale
  const getCompleteness = (locale: string): number => {
    if (!state.page?.translations?.status) return 0;
    return state.page.translations.status[locale]?.completeness || 0;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate position for fixed dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  // Count locales with complete translations
  const completedCount = cmsConfig.locales.filter(
    (locale) => getCompleteness(locale) === 100,
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        title="Change language"
      >
        <span className="font-bold uppercase">{activeLocale}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({completedCount}/{cmsConfig.locales.length})
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed z-50 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-slate-200 focus:outline-none dark:bg-slate-800 dark:ring-slate-700"
          style={{ top: position.top, right: position.right }}
        >
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 dark:text-slate-400">
              Content Language
            </div>
            {cmsConfig.locales.map((locale) => {
              const completeness = getCompleteness(locale);
              const isActive = locale === activeLocale;
              const isSource =
                locale === state.page?.translations?.sourceLocale;

              return (
                <button
                  key={locale}
                  type="button"
                  onClick={() => {
                    setActiveLocale(locale);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm ${
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase">{locale}</span>
                    {isSource && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-200 text-slate-600 rounded dark:bg-slate-600 dark:text-slate-300">
                        Source
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {completeness === 100 ? (
                      <span className="text-slate-600 dark:text-slate-400">
                        <svg
                          className="w-4 h-4"
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
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {completeness}%
                      </span>
                    )}
                    {isActive && (
                      <svg
                        className="w-4 h-4 text-slate-700 dark:text-slate-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
