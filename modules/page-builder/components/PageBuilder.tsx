/**
 * Page Builder Component
 * Main component that assembles the complete page builder interface
 */

import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import {
  PageBuilderProvider,
  usePageBuilder,
} from "../context/PageBuilderContext";
import { CollaborationProvider } from "../collaboration/CollaborationContext";
import type { CollaborationConfig } from "../collaboration/types";
import Toolbar from "./Toolbar/Toolbar";
import Canvas from "./Canvas/Canvas";
import BlockLibrary from "./Sidebar/BlockLibrary";
import SettingsPanel from "./Sidebar/SettingsPanel";
import LayersPanel from "./Sidebar/LayersPanel";
import HistoryPanel from "./Sidebar/HistoryPanel";
import { TemplatePicker } from "./TemplatePicker";
import KeyboardShortcutsModal from "./Modals/KeyboardShortcutsModal";
import PageBuilderErrorBoundary from "./ErrorBoundary";
import { pageTemplates, type PageTemplate } from "../templates";
import type { Page, PageBlock, PageStatus } from "../types";
import { cmsConfig } from "../../../lib/cms.config";
import { createInitialTranslations } from "../utils/localization";
import type { ShortcutDefinition } from "../hooks/useKeyboardShortcuts";
import { formatShortcut } from "../hooks/useKeyboardShortcuts";
import { showErrorToast, showSuccessToast } from "../utils/toast";

interface PageBuilderProps {
  initialPage?: Page;
  onSave?: (page: Page) => Promise<void>;
  onPublish?: (page: Page) => Promise<void>;
  onBack?: () => void;
  onCreatePage?: () => void;
  collaborationConfig?: {
    wsUrl: string;
    user: { id: string; name: string; avatar?: string };
  };
}

// Default page for new pages
const createDefaultPage = (): Page => ({
  id: `page_${Date.now()}`,
  title: { [cmsConfig.defaultLocale]: "Untitled Page" },
  slug: "untitled-page",
  status: "draft",
  blocks: [],
  seo: {},
  translations: createInitialTranslations(cmsConfig.defaultLocale),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  versions: [],
});

const PageBuilderInner: React.FC<PageBuilderProps> = ({
  initialPage,
  onSave,
  onPublish,
  onBack,
  onCreatePage,
}) => {
  const router = useRouter();
  const {
    state,
    setPage,
    dispatch,
    undo,
    redo,
    toggleFocusMode,
    togglePreview,
    duplicateBlock,
    canUndo,
    canRedo,
  } = usePageBuilder();
  const { sidebarTab, isPreviewMode, isFocusMode } = state;

  // Template picker state
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  // Keyboard shortcuts help modal
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Initialize page
  useEffect(() => {
    setPage(initialPage || createDefaultPage());
  }, [initialPage, setPage]);

  // Template picker is now opened manually via toolbar button

  // Generate random alphanumeric suffix like "234M3"
  const generateRandomSuffix = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Handle creating a new blank page
  const handleCreateNewPage = useCallback(() => {
    if (!state.page) return;

    const newTitle = `Untitled Page #${generateRandomSuffix()}`;

    setPage({
      ...state.page,
      id: `page_${Date.now()}`,
      title: { [cmsConfig.defaultLocale]: newTitle },
      slug: "untitled-page",
      blocks: [],
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [state.page, setPage]);

  // Handle template selection
  const handleSelectTemplate = useCallback(
    (template: PageTemplate) => {
      if (!state.page) return;

      // Convert template blocks to full PageBlocks with new IDs
      // Handles nested grids by updating childPlacements at each level
      const convertBlock = (
        block: (typeof template.blocks)[number],
      ): PageBlock => {
        const newId = `block_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

        // Build ID mapping for this block's children
        const idMapping: Record<string, string> = {};
        let convertedChildren: PageBlock[] | undefined;

        if (block.children && block.children.length > 0) {
          // First pass: generate new IDs and build mapping
          const childIdPairs = block.children.map((child) => ({
            oldId: child.id,
            newId: `block_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            child,
          }));

          // Build mapping from old IDs to new IDs
          childIdPairs.forEach(({ oldId, newId: childNewId }) => {
            if (oldId) {
              idMapping[oldId] = childNewId;
            }
          });

          // Second pass: convert children with correct IDs
          convertedChildren = childIdPairs.map(
            ({ newId: childNewId, child }) => {
              // Recursively convert this child (handles nested grids)
              const convertedChild = convertBlock(child);
              // Override the ID with our pre-generated one
              return {
                ...convertedChild,
                id: childNewId,
              };
            },
          );
        }

        // Update childPlacements with new IDs if this is a Grid block
        let content = block.content || {};
        if (
          block.type === "grid" &&
          content.childPlacements &&
          Array.isArray(content.childPlacements)
        ) {
          content = {
            ...content,
            childPlacements: content.childPlacements.map(
              (placement: { blockId: string; placement: unknown }) => ({
                ...placement,
                blockId: idMapping[placement.blockId] || placement.blockId,
              }),
            ),
          };
        }

        return {
          id: newId,
          type: block.type,
          content,
          style: block.style || {},
          responsive: {},
          children: convertedChildren,
        } as unknown as PageBlock;
      };

      const newBlocks = template.blocks.map((block) => convertBlock(block));

      // Generate new page name from template name with random suffix
      const newTitle = `${template.name} #${generateRandomSuffix()}`;

      setPage({
        ...state.page,
        title: { [cmsConfig.defaultLocale]: newTitle },
        blocks: newBlocks,
      });

      setShowTemplatePicker(false);
    },
    [state.page, setPage],
  );

  const handleSave = useCallback(async () => {
    if (onSave && state.page) {
      dispatch({ type: "SET_SAVING", payload: true });
      try {
        await onSave(state.page);
        dispatch({ type: "MARK_CLEAN" });
        showSuccessToast("Page saved successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save page";
        showErrorToast(errorMessage);
      } finally {
        dispatch({ type: "SET_SAVING", payload: false });
      }
    }
  }, [onSave, state.page, dispatch]);

  const handlePublish = useCallback(async () => {
    if (onPublish && state.page) {
      dispatch({ type: "SET_SAVING", payload: true });
      try {
        await onPublish({
          ...state.page,
          status: "published",
          publishedAt: new Date().toISOString(),
        });
        dispatch({
          type: "UPDATE_PAGE_META",
          payload: { status: "published" },
        });
        dispatch({ type: "MARK_CLEAN" });
        showSuccessToast("Page published successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to publish page";
        showErrorToast(errorMessage);
      } finally {
        dispatch({ type: "SET_SAVING", payload: false });
      }
    }
  }, [onPublish, state.page, dispatch]);

  const handleWorkflowChange = useCallback(
    async (newStatus: PageStatus) => {
      if (onSave && state.page) {
        dispatch({ type: "SET_SAVING", payload: true });
        try {
          const updatedPage = {
            ...state.page,
            status: newStatus,
            ...(newStatus === "published"
              ? { publishedAt: new Date().toISOString() }
              : {}),
          };
          await onSave(updatedPage);
          dispatch({
            type: "UPDATE_PAGE_META",
            payload: { status: newStatus },
          });
          dispatch({ type: "MARK_CLEAN" });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to update page status";
          showErrorToast(errorMessage);
          throw err; // Re-throw so WorkflowActions knows it failed
        } finally {
          dispatch({ type: "SET_SAVING", payload: false });
        }
      }
    },
    [onSave, state.page, dispatch],
  );

  // Keyboard shortcuts definitions (for help modal)
  const keyboardShortcuts: ShortcutDefinition[] = useMemo(
    () => [
      {
        key: "z",
        ctrl: true,
        description: "Undo",
        category: "editing",
      },
      {
        key: "z",
        ctrl: true,
        shift: true,
        description: "Redo",
        category: "editing",
      },
      {
        key: "d",
        ctrl: true,
        description: "Duplicate block",
        category: "editing",
      },
      {
        key: "Backspace",
        description: "Delete block",
        category: "editing",
      },
      {
        key: "s",
        ctrl: true,
        description: "Save page",
        category: "general",
      },
      {
        key: "p",
        ctrl: true,
        description: "Toggle preview",
        category: "view",
      },
      {
        key: "Escape",
        description: "Deselect / Exit mode",
        category: "navigation",
      },
      {
        key: "f",
        description: "Toggle focus mode",
        category: "view",
      },
      {
        key: "?",
        description: "Show shortcuts",
        category: "general",
      },
    ],
    [],
  );

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in an input field (except for some shortcuts)
      const isInputField =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);

      const ctrlOrMeta = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + S = Save
      if (ctrlOrMeta && e.key === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

      // Cmd/Ctrl + Z = Undo
      if (ctrlOrMeta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
        return;
      }

      // Cmd/Ctrl + Shift + Z = Redo
      if (ctrlOrMeta && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }

      // Cmd/Ctrl + Y = Redo (alternative)
      if (ctrlOrMeta && e.key === "y") {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }

      // Cmd/Ctrl + D = Duplicate selected block
      if (ctrlOrMeta && e.key === "d" && state.selection.blockId) {
        e.preventDefault();
        duplicateBlock(state.selection.blockId);
        return;
      }

      // Cmd/Ctrl + P = Toggle preview
      if (ctrlOrMeta && e.key === "p") {
        e.preventDefault();
        togglePreview();
        return;
      }

      // Don't process remaining shortcuts if in input field
      if (isInputField) return;

      // ? = Show keyboard shortcuts help
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcutsModal(true);
        return;
      }

      // Escape = Deselect, exit preview, exit focus mode, or close modals
      if (e.key === "Escape") {
        if (showShortcutsModal) {
          setShowShortcutsModal(false);
        } else if (isPreviewMode) {
          togglePreview();
        } else if (isFocusMode) {
          toggleFocusMode();
        } else if (state.selection.blockId) {
          dispatch({ type: "SELECT_BLOCK", payload: { blockId: null } });
        }
        return;
      }

      // F = Toggle focus mode (when not in input)
      if (e.key === "f" && !ctrlOrMeta) {
        e.preventDefault();
        toggleFocusMode();
        return;
      }

      // Delete/Backspace = Delete selected block
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        state.selection.blockId
      ) {
        e.preventDefault();
        dispatch({
          type: "DELETE_BLOCK",
          payload: { blockId: state.selection.blockId },
        });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    dispatch,
    state.selection.blockId,
    isFocusMode,
    isPreviewMode,
    toggleFocusMode,
    togglePreview,
    duplicateBlock,
    handleSave,
    showShortcutsModal,
  ]);

  const handleSetSidebarTab = useCallback(
    (tab: "blocks" | "layers" | "settings" | "history") => {
      dispatch({ type: "SET_SIDEBAR_TAB", payload: tab });
    },
    [dispatch],
  );

  const handlePageRestored = useCallback(
    (restoredPage: Page) => {
      setPage(restoredPage);
    },
    [setPage],
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Toolbar - hidden in preview mode */}
      {!isPreviewMode && (
        <Toolbar
          onBack={onBack}
          onSave={handleSave}
          onPublish={handlePublish}
          onWorkflowChange={handleWorkflowChange}
        />
      )}

      {/* Floating exit preview button */}
      {isPreviewMode && (
        <button
          onClick={() => dispatch({ type: "TOGGLE_PREVIEW" })}
          className="fixed top-4 right-4 z-[1030] flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Exit Preview
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3 relative z-0">
        {/* Left Sidebar - Glassmorphism */}
        {!isPreviewMode && !isFocusMode && (
          <div
            className={classNames(
              "w-72 flex flex-col overflow-hidden rounded-2xl",
              // Glassmorphism
              "bg-white/70 dark:bg-slate-900/70",
              "backdrop-blur-2xl backdrop-saturate-150",
              "border border-white/50 dark:border-white/10",
              "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
              "ring-1 ring-black/5 dark:ring-white/5",
            )}
          >
            {/* Page actions */}
            <div className="flex p-2 gap-2 border-b border-slate-200/50 dark:border-white/10">
              <button
                onClick={handleCreateNewPage}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New
              </button>
              <button
                onClick={() => setShowTemplatePicker(true)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
                  />
                </svg>
                Templates
              </button>
            </div>

            {/* Sidebar tabs */}
            <div className="flex p-2 gap-1">
              <button
                onClick={() => handleSetSidebarTab("blocks")}
                className={classNames(
                  "flex-1 px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-200",
                  sidebarTab === "blocks"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                Overview
              </button>
              <button
                onClick={() => handleSetSidebarTab("layers")}
                className={classNames(
                  "flex-1 px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-200",
                  sidebarTab === "layers"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                Layers
              </button>
              <button
                onClick={() => handleSetSidebarTab("history")}
                className={classNames(
                  "flex-1 px-3 py-2.5 text-xs font-medium rounded-xl transition-all duration-200",
                  sidebarTab === "history"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                History
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 overflow-hidden">
              {sidebarTab === "blocks" && <BlockLibrary />}
              {sidebarTab === "layers" && <LayersPanel />}
              {sidebarTab === "history" && (
                <HistoryPanel onPageRestored={handlePageRestored} />
              )}
            </div>
          </div>
        )}

        {/* Canvas */}
        <Canvas className="flex-1" />

        {/* Right Sidebar - Settings - Glassmorphism */}
        {!isPreviewMode && !isFocusMode && (
          <div
            className={classNames(
              "w-80 rounded-2xl overflow-hidden",
              // Glassmorphism
              "bg-white/70 dark:bg-slate-900/70",
              "backdrop-blur-2xl backdrop-saturate-150",
              "border border-white/50 dark:border-white/10",
              "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
              "ring-1 ring-black/5 dark:ring-white/5",
            )}
          >
            <SettingsPanel />
          </div>
        )}
      </div>

      {/* Template Picker Modal */}
      <TemplatePicker
        isOpen={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        shortcuts={keyboardShortcuts}
      />
    </div>
  );
};

// Wrapper component with providers
const PageBuilder: React.FC<PageBuilderProps> = (props) => {
  const { collaborationConfig, initialPage } = props;

  // Build full collaboration config with room ID from page slug
  const fullCollabConfig: CollaborationConfig | null = useMemo(() => {
    if (!collaborationConfig || !initialPage?.slug) {
      return null;
    }

    return {
      wsUrl: collaborationConfig.wsUrl,
      roomId: initialPage.slug,
      user: collaborationConfig.user,
      lockTimeout: 30000, // 30 seconds
      lockRenewInterval: 10000, // 10 seconds
    };
  }, [collaborationConfig, initialPage?.slug]);

  return (
    <PageBuilderProvider>
      <CollaborationProvider config={fullCollabConfig}>
        <PageBuilderErrorBoundary>
          <PageBuilderInner {...props} />
        </PageBuilderErrorBoundary>
      </CollaborationProvider>
    </PageBuilderProvider>
  );
};

export default PageBuilder;
