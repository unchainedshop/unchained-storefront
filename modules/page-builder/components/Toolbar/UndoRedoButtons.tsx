/**
 * Undo/Redo Buttons with History Dropdown
 * Shows recent history entries in a dropdown menu
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
        "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
        isActive && "bg-blue-50 dark:bg-blue-900/20",
      )}
    >
      <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
      <span
        className={classNames(
          "flex-1 truncate",
          isActive
            ? "text-blue-700 dark:text-blue-300 font-medium"
            : "text-slate-700 dark:text-slate-300",
        )}
      >
        {entry.label}
      </span>
      <span className="text-xs text-slate-400 flex-shrink-0">
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

  return (
    <div className="flex items-center border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
      {/* Undo button with dropdown */}
      <div ref={undoRef} className="relative flex items-center">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={classNames(
            "p-2 rounded-l transition-colors",
            canUndo
              ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed",
          )}
          title={`Undo (Ctrl+Z)${canUndo ? ` - ${history[historyIndex - 1]?.label || ""}` : ""}`}
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (canUndo) {
              setShowUndoMenu(!showUndoMenu);
              setShowRedoMenu(false);
            }
          }}
          disabled={!canUndo}
          className={classNames(
            "p-1 pr-2 rounded-r border-l border-slate-200 dark:border-slate-700 transition-colors",
            canUndo
              ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-500"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed",
          )}
        >
          <ChevronDownIcon className="w-3 h-3" />
        </button>

        {/* Undo dropdown */}
        {showUndoMenu && undoEntries.length > 0 && (
          <div className="absolute top-full mt-1 left-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-[220px] max-h-[300px] overflow-y-auto">
            <div className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              Undo History ({undoEntries.length})
            </div>
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
          </div>
        )}
      </div>

      {/* Redo button with dropdown */}
      <div ref={redoRef} className="relative flex items-center">
        <button
          onClick={redo}
          disabled={!canRedo}
          className={classNames(
            "p-2 rounded-l transition-colors",
            canRedo
              ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed",
          )}
          title={`Redo (Ctrl+Shift+Z)${canRedo ? ` - ${history[historyIndex + 1]?.label || ""}` : ""}`}
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (canRedo) {
              setShowRedoMenu(!showRedoMenu);
              setShowUndoMenu(false);
            }
          }}
          disabled={!canRedo}
          className={classNames(
            "p-1 pr-2 rounded-r border-l border-slate-200 dark:border-slate-700 transition-colors",
            canRedo
              ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-500"
              : "text-slate-300 dark:text-slate-600 cursor-not-allowed",
          )}
        >
          <ChevronDownIcon className="w-3 h-3" />
        </button>

        {/* Redo dropdown */}
        {showRedoMenu && redoEntries.length > 0 && (
          <div className="absolute top-full mt-1 left-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-[220px] max-h-[300px] overflow-y-auto">
            <div className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              Redo History ({redoEntries.length})
            </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default UndoRedoButtons;
