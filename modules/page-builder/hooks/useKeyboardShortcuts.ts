/**
 * Keyboard Shortcuts Hook
 * Handles global keyboard shortcuts for the page builder
 */

import { useEffect, useCallback } from "react";
import { usePageBuilder } from "../context/PageBuilderContext";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  category: "editing" | "navigation" | "view" | "general";
}

export interface ShortcutDefinition {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  category: "editing" | "navigation" | "view" | "general";
}

// Check if user is typing in an input field
const isTyping = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea") return true;
  if ((activeElement as HTMLElement).contentEditable === "true") return true;

  return false;
};

export const useKeyboardShortcuts = (
  onSave?: () => void,
  onTogglePreview?: () => void,
): ShortcutDefinition[] => {
  const {
    selectedBlock,
    selectBlock,
    deleteBlock,
    duplicateBlock,
    undo,
    redo,
    canUndo,
    canRedo,
    togglePreview,
    toggleFocusMode,
    state,
  } = usePageBuilder();

  // Delete selected block
  const handleDelete = useCallback(() => {
    if (selectedBlock && !selectedBlock.locked) {
      deleteBlock(selectedBlock.id);
    }
  }, [selectedBlock, deleteBlock]);

  // Duplicate selected block
  const handleDuplicate = useCallback(() => {
    if (selectedBlock) {
      duplicateBlock(selectedBlock.id);
    }
  }, [selectedBlock, duplicateBlock]);

  // Deselect block
  const handleEscape = useCallback(() => {
    if (state.isPreviewMode) {
      togglePreview();
    } else if (selectedBlock) {
      selectBlock(null);
    }
  }, [selectedBlock, selectBlock, state.isPreviewMode, togglePreview]);

  // Handle save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
    }
  }, [onSave]);

  // Handle preview toggle
  const handlePreview = useCallback(() => {
    if (onTogglePreview) {
      onTogglePreview();
    } else {
      togglePreview();
    }
  }, [onTogglePreview, togglePreview]);

  // Define all shortcuts
  const shortcuts: ShortcutConfig[] = [
    // Editing
    {
      key: "Backspace",
      action: handleDelete,
      description: "Delete selected block",
      category: "editing",
    },
    {
      key: "Delete",
      action: handleDelete,
      description: "Delete selected block",
      category: "editing",
    },
    {
      key: "d",
      ctrl: true,
      action: handleDuplicate,
      description: "Duplicate selected block",
      category: "editing",
    },
    {
      key: "z",
      ctrl: true,
      action: () => canUndo && undo(),
      description: "Undo",
      category: "editing",
    },
    {
      key: "z",
      ctrl: true,
      shift: true,
      action: () => canRedo && redo(),
      description: "Redo",
      category: "editing",
    },
    {
      key: "y",
      ctrl: true,
      action: () => canRedo && redo(),
      description: "Redo",
      category: "editing",
    },
    // Navigation
    {
      key: "Escape",
      action: handleEscape,
      description: "Deselect / Exit preview",
      category: "navigation",
    },
    // View
    {
      key: "p",
      ctrl: true,
      action: handlePreview,
      description: "Toggle preview mode",
      category: "view",
    },
    {
      key: "f",
      ctrl: true,
      shift: true,
      action: () => toggleFocusMode(),
      description: "Toggle focus mode",
      category: "view",
    },
    // General
    {
      key: "s",
      ctrl: true,
      action: handleSave,
      description: "Save page",
      category: "general",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts while typing (except Escape)
      if (isTyping() && e.key !== "Escape") {
        return;
      }

      // Find matching shortcut
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      for (const shortcut of shortcuts) {
        const keyMatch =
          e.key.toLowerCase() === shortcut.key.toLowerCase() ||
          e.key === shortcut.key;
        const ctrlMatch = shortcut.ctrl ? ctrlOrMeta : !ctrlOrMeta;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  // Return shortcut definitions for help display
  return shortcuts
    .filter(
      (s, i, arr) =>
        // Remove duplicate descriptions (like Delete/Backspace)
        arr.findIndex((x) => x.description === s.description) === i,
    )
    .map(({ key, ctrl, shift, alt, description, category }) => ({
      key,
      ctrl,
      shift,
      alt,
      description,
      category,
    }));
};

// Format shortcut for display
export const formatShortcut = (shortcut: ShortcutDefinition): string => {
  const isMac =
    typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);
  const parts: string[] = [];

  if (shortcut.ctrl) parts.push(isMac ? "⌘" : "Ctrl");
  if (shortcut.shift) parts.push(isMac ? "⇧" : "Shift");
  if (shortcut.alt) parts.push(isMac ? "⌥" : "Alt");

  // Format key name
  let keyName = shortcut.key;
  if (keyName === "Backspace") keyName = isMac ? "⌫" : "Backspace";
  if (keyName === "Delete") keyName = isMac ? "⌦" : "Del";
  if (keyName === "Escape") keyName = "Esc";
  if (keyName.length === 1) keyName = keyName.toUpperCase();

  parts.push(keyName);

  return parts.join(isMac ? "" : "+");
};

export default useKeyboardShortcuts;
