/**
 * Keyboard Shortcuts Help Modal
 * Displays available keyboard shortcuts
 */

import React from "react";
import classNames from "classnames";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ShortcutDefinition } from "../../hooks/useKeyboardShortcuts";
import { formatShortcut } from "../../hooks/useKeyboardShortcuts";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutDefinition[];
}

const categoryLabels: Record<string, string> = {
  editing: "Editing",
  navigation: "Navigation",
  view: "View",
  general: "General",
};

const categoryOrder = ["editing", "navigation", "view", "general"];

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
}) => {
  if (!isOpen) return null;

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, ShortcutDefinition[]>,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={classNames(
          "relative w-full max-w-md mx-4 rounded-2xl overflow-hidden",
          "bg-white dark:bg-slate-900",
          "shadow-2xl",
          "border border-slate-200 dark:border-slate-700",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          {categoryOrder.map((category) => {
            const categoryShortcuts = groupedShortcuts[category];
            if (!categoryShortcuts?.length) return null;

            return (
              <div key={category} className="mb-5 last:mb-0">
                <h3 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {categoryLabels[category]}
                </h3>
                <div className="space-y-1.5">
                  {categoryShortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {shortcut.description}
                      </span>
                      <kbd
                        className={classNames(
                          "px-2 py-1 text-xs font-mono font-medium rounded",
                          "bg-slate-100 dark:bg-slate-800",
                          "text-slate-600 dark:text-slate-300",
                          "border border-slate-200 dark:border-slate-700",
                        )}
                      >
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-700 rounded">?</kbd> to show this dialog
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
