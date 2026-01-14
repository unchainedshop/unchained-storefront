/**
 * Undo/Redo Buttons with History Dropdown
 * Glassmorphism-styled history controls
 */

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  ArrowPathIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import type { HistoryActionType, HistoryEntry } from "../../types";

// Get icon for action type
const getActionIcon = (action: HistoryActionType) => {
  switch (action) {
    case "add":
      return PlusIcon;
    case "delete":
      return TrashIcon;
    case "move":
      return ArrowsUpDownIcon;
    case "duplicate":
      return DocumentDuplicateIcon;
    case "update":
      return PencilIcon;
    case "restore":
      return ArrowPathIcon;
    case "initial":
      return DocumentIcon;
    default:
      return DocumentIcon;
  }
};

// Format relative time (compact)
const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return new Date(timestamp).toLocaleDateString();
};

interface HistoryDropdownItemProps {
  entry: HistoryEntry;
  onClick: () => void;
  isActive: boolean;
}

const HistoryDropdownItem: React.FC<HistoryDropdownItemProps> = ({
  entry,
  onClick,
  isActive,
}) => {
  const Icon = getActionIcon(entry.action);

  return (
    <button
      onClick={onClick}
      className={classNames(
        "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150",
        "hover:bg-white/50 dark:hover:bg-white/5",
        isActive && "bg-white/40 dark:bg-white/10",
      )}
    >
      <div
        className={classNames(
          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
          "bg-white/60 dark:bg-white/10",
          "border border-white/40 dark:border-white/5",
        )}
      >
        <Icon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
      </div>
      <span
        className={classNames(
          "flex-1 truncate text-left",
          isActive
            ? "text-slate-900 dark:text-white font-medium"
            : "text-slate-700 dark:text-slate-300",
        )}
      >
        {entry.label}
      </span>
      <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0 tabular-nums">
        {formatTime(entry.timestamp)}
      </span>
    </button>
  );
};

const UndoRedoButtons: React.FC = () => {
  const { state, undo, redo, canUndo, canRedo } = usePageBuilder();
  const { history, historyIndex } = state;
  const [showUndoMenu, setShowUndoMenu] = useState(false);
  const [showRedoMenu, setShowRedoMenu] = useState(false);
  const undoRef = useRef<HTMLDivElement>(null);
  const redoRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (undoRef.current && !undoRef.current.contains(e.target as Node)) {
        setShowUndoMenu(false);
      }
      if (redoRef.current && !redoRef.current.contains(e.target as Node)) {
        setShowRedoMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get undo entries (entries before current index)
  const undoEntries = history.slice(0, historyIndex).reverse().slice(0, 10);

  // Get redo entries (entries after current index)
  const redoEntries = history.slice(historyIndex + 1).slice(0, 10);

  const handleUndoTo = (targetIndex: number) => {
    const steps = historyIndex - targetIndex;
    for (let i = 0; i < steps; i++) {
      undo();
    }
    setShowUndoMenu(false);
  };

  const handleRedoTo = (targetIndex: number) => {
    const steps = targetIndex - historyIndex;
    for (let i = 0; i < steps; i++) {
      redo();
    }
    setShowRedoMenu(false);
  };

  // Glassmorphism dropdown component
  const HistoryDropdown: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    count: number;
    children: React.ReactNode;
  }> = ({ isOpen, onClose, title, count, children }) => {
    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <div
          className={classNames(
            "absolute top-full mt-2 left-0 z-50",
            // Glassmorphism
            "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl backdrop-saturate-150",
            "rounded-2xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            "border border-white/50 dark:border-white/10",
            "ring-1 ring-black/5 dark:ring-white/5",
            "overflow-hidden",
            "min-w-[280px] max-h-[360px]",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
          )}
        >
          {/* Header */}
          <div
            className={classNames(
              "px-4 py-3 border-b border-white/30 dark:border-white/5",
              "bg-white/30 dark:bg-white/5",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {title}
              </span>
              <span
                className={classNames(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  "bg-white/60 dark:bg-white/10",
                  "text-slate-500 dark:text-slate-400",
                )}
              >
                {count}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="overflow-y-auto max-h-[280px] py-1">{children}</div>
        </div>
      </>
    );
  };

  // Button component with glassmorphism
  const ActionButton: React.FC<{
    onClick: () => void;
    disabled: boolean;
    title: string;
    children: React.ReactNode;
    isFirst?: boolean;
    isLast?: boolean;
  }> = ({ onClick, disabled, title, children, isFirst, isLast }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={classNames(
        "p-2 transition-all duration-200",
        isFirst && "rounded-l-lg",
        isLast && "rounded-r-lg",
        !isFirst && !isLast && "rounded-none",
        disabled
          ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5",
      )}
    >
      {children}
    </button>
  );

  // Chevron button
  const ChevronButton: React.FC<{
    onClick: () => void;
    disabled: boolean;
    isOpen: boolean;
  }> = ({ onClick, disabled, isOpen }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "p-1 pr-1.5 transition-all duration-200 rounded-r-lg",
        "border-l border-white/30 dark:border-white/10",
        disabled
          ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
          : "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5",
      )}
    >
      <ChevronDownIcon
        className={classNames(
          "w-3 h-3 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      {/* Undo button group */}
      <div ref={undoRef} className="relative flex items-center">
        <div
          className={classNames(
            "flex items-center rounded-xl overflow-hidden",
            "bg-white/40 dark:bg-white/5",
            "backdrop-blur-xl",
            "border border-white/60 dark:border-white/10",
          )}
        >
          <ActionButton
            onClick={undo}
            disabled={!canUndo}
            title={`Undo (Ctrl+Z)${canUndo ? ` - ${history[historyIndex - 1]?.label || ""}` : ""}`}
            isFirst
          >
            <ArrowUturnLeftIcon className="w-4 h-4" />
          </ActionButton>
          <ChevronButton
            onClick={() => {
              if (canUndo) {
                setShowUndoMenu(!showUndoMenu);
                setShowRedoMenu(false);
              }
            }}
            disabled={!canUndo}
            isOpen={showUndoMenu}
          />
        </div>

        {/* Undo dropdown */}
        <HistoryDropdown
          isOpen={showUndoMenu && undoEntries.length > 0}
          onClose={() => setShowUndoMenu(false)}
          title="Undo History"
          count={undoEntries.length}
        >
          {undoEntries.map((entry, idx) => {
            const targetIndex = historyIndex - 1 - idx;
            return (
              <HistoryDropdownItem
                key={`${targetIndex}-${entry.timestamp}`}
                entry={entry}
                onClick={() => handleUndoTo(targetIndex)}
                isActive={false}
              />
            );
          })}
        </HistoryDropdown>
      </div>

      {/* Redo button group */}
      <div ref={redoRef} className="relative flex items-center">
        <div
          className={classNames(
            "flex items-center rounded-xl overflow-hidden",
            "bg-white/40 dark:bg-white/5",
            "backdrop-blur-xl",
            "border border-white/60 dark:border-white/10",
          )}
        >
          <ActionButton
            onClick={redo}
            disabled={!canRedo}
            title={`Redo (Ctrl+Shift+Z)${canRedo ? ` - ${history[historyIndex + 1]?.label || ""}` : ""}`}
            isFirst
          >
            <ArrowUturnRightIcon className="w-4 h-4" />
          </ActionButton>
          <ChevronButton
            onClick={() => {
              if (canRedo) {
                setShowRedoMenu(!showRedoMenu);
                setShowUndoMenu(false);
              }
            }}
            disabled={!canRedo}
            isOpen={showRedoMenu}
          />
        </div>

        {/* Redo dropdown */}
        <HistoryDropdown
          isOpen={showRedoMenu && redoEntries.length > 0}
          onClose={() => setShowRedoMenu(false)}
          title="Redo History"
          count={redoEntries.length}
        >
          {redoEntries.map((entry, idx) => {
            const targetIndex = historyIndex + 1 + idx;
            return (
              <HistoryDropdownItem
                key={`${targetIndex}-${entry.timestamp}`}
                entry={entry}
                onClick={() => handleRedoTo(targetIndex)}
                isActive={false}
              />
            );
          })}
        </HistoryDropdown>
      </div>
    </div>
  );
};

export default UndoRedoButtons;
