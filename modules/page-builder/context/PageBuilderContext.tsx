/**
 * Page Builder Context
 * State management for the visual page editor
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type {
  EditorState,
  EditorAction,
  Page,
  PageBlock,
  Viewport,
  DragState,
  LocalizedSEOSettings,
  LocalizedString,
  LocalizedContent,
  PageStatus,
  HistoryActionType,
  BlockType,
  BlockContent,
  TranslationStatus,
  PageBuilderError,
} from "../types";
import { blockRegistry } from "../utils/blockRegistry";
import { cmsConfig } from "../../../lib/cms.config";
import { copyPageContentToLocale } from "../utils/localization";

const initialState: EditorState = {
  page: null,
  selection: {
    blockId: null,
    parentId: null,
  },
  viewport: "desktop",
  zoom: 100,
  showGrid: false,
  showOutlines: false,
  showSiteFrame: false,
  isDirty: false,
  isSaving: false,
  isPreviewMode: false,
  isFocusMode: false,
  dragState: {
    isDragging: false,
    draggedBlockId: null,
    draggedBlockType: null,
    dropTargetId: null,
    dropPosition: null,
  },
  history: [],
  historyIndex: -1,
  sidebarTab: "blocks",
  activeLocale: cmsConfig.defaultLocale,
  hoveredBlockId: null,
  error: null,
  focusSection: null,
};

// Helper functions for immutable block updates (exported for use in other components)
export const findBlockById = (
  blocks: PageBlock[],
  id: string,
): PageBlock | null => {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlockById(block.children, id);
      if (found) return found;
    }
  }
  return null;
};

const updateBlockInTree = (
  blocks: PageBlock[],
  blockId: string,
  updater: (block: PageBlock) => PageBlock,
): PageBlock[] => {
  return blocks.map((block) => {
    if (block.id === blockId) {
      return updater(block);
    }
    if (block.children) {
      return {
        ...block,
        children: updateBlockInTree(block.children, blockId, updater),
      };
    }
    return block;
  });
};

const removeBlockFromTree = (
  blocks: PageBlock[],
  blockId: string,
): PageBlock[] => {
  return blocks
    .filter((block) => block.id !== blockId)
    .map((block) => {
      if (block.children) {
        return {
          ...block,
          children: removeBlockFromTree(block.children, blockId),
        };
      }
      return block;
    });
};

const addBlockToTree = (
  blocks: PageBlock[],
  newBlock: PageBlock,
  parentId?: string,
  position?: number,
): PageBlock[] => {
  if (!parentId) {
    // Add to root level
    if (position !== undefined) {
      const newBlocks = [...blocks];
      newBlocks.splice(position, 0, newBlock);
      return newBlocks;
    }
    return [...blocks, newBlock];
  }

  return blocks.map((block) => {
    if (block.id === parentId && block.children !== undefined) {
      const newChildren = [...block.children];
      if (position !== undefined) {
        newChildren.splice(position, 0, newBlock);
      } else {
        newChildren.push(newBlock);
      }
      return { ...block, children: newChildren };
    }
    if (block.children) {
      return {
        ...block,
        children: addBlockToTree(block.children, newBlock, parentId, position),
      };
    }
    return block;
  });
};

const duplicateBlock = (block: PageBlock): PageBlock => {
  const newId = `block_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  return {
    ...block,
    id: newId,
    children: block.children?.map(duplicateBlock),
  };
};

const findBlockIndex = (blocks: PageBlock[], blockId: string): number => {
  return blocks.findIndex((b) => b.id === blockId);
};

export const findParentBlock = (
  blocks: PageBlock[],
  blockId: string,
  parent: PageBlock | null = null,
): PageBlock | null => {
  for (const block of blocks) {
    if (block.id === blockId) return parent;
    if (block.children) {
      const found = findParentBlock(block.children, blockId, block);
      if (found !== null) return found;
    }
  }
  return null;
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
        isDirty: false,
        history: [
          {
            blocks: action.payload.blocks,
            timestamp: Date.now(),
            action: "initial",
            label: "Page loaded",
          },
        ],
        historyIndex: 0,
      };

    case "SELECT_BLOCK": {
      // Don't switch sidebar tab when selecting - the SettingsPanel is always visible
      // in the right sidebar, so no need to change the left sidebar tab
      return {
        ...state,
        selection: {
          blockId: action.payload.blockId,
          parentId: action.payload.parentId ?? null,
        },
      };
    }

    case "ADD_BLOCK":
      if (!state.page) return state;
      const newBlocks = addBlockToTree(
        state.page.blocks,
        action.payload.block,
        action.payload.parentId,
        action.payload.position,
      );
      return {
        ...state,
        page: { ...state.page, blocks: newBlocks },
        isDirty: true,
        selection: {
          blockId: action.payload.block.id,
          parentId: action.payload.parentId ?? null,
        },
      };

    case "UPDATE_BLOCK":
      if (!state.page) return state;
      return {
        ...state,
        page: {
          ...state.page,
          blocks: updateBlockInTree(
            state.page.blocks,
            action.payload.blockId,
            (block) => {
              // Handle content updates - merge into the active locale
              let newContent = block.content;
              if (action.payload.updates.content) {
                const activeLocale = state.activeLocale;

                // Check if content is in legacy (non-localized) format
                // Legacy content has block keys directly (heading, text) not locale keys (de, fr)
                const contentKeys = Object.keys(block.content);
                const isLegacyContent =
                  contentKeys.length > 0 &&
                  !cmsConfig.locales.some((locale) => locale in block.content);

                if (isLegacyContent) {
                  // Migrate legacy content: wrap existing content in active locale
                  newContent = {
                    [activeLocale]: {
                      ...(block.content as unknown as Record<string, unknown>),
                      ...action.payload.updates.content,
                    },
                  } as LocalizedContent;
                } else {
                  // Already localized: merge into active locale
                  const existingLocaleContent =
                    block.content[activeLocale] || {};
                  newContent = {
                    ...block.content,
                    [activeLocale]: {
                      ...existingLocaleContent,
                      ...action.payload.updates.content,
                    },
                  } as LocalizedContent;
                }
              }

              return {
                ...block,
                ...action.payload.updates,
                content: newContent,
                style: action.payload.updates.style
                  ? { ...block.style, ...action.payload.updates.style }
                  : block.style,
              };
            },
          ),
        },
        isDirty: true,
      };

    case "DELETE_BLOCK":
      if (!state.page) return state;
      return {
        ...state,
        page: {
          ...state.page,
          blocks: removeBlockFromTree(
            state.page.blocks,
            action.payload.blockId,
          ),
        },
        isDirty: true,
        selection:
          state.selection.blockId === action.payload.blockId
            ? { blockId: null, parentId: null }
            : state.selection,
      };

    case "MOVE_BLOCK":
      if (!state.page) return state;
      const blockToMove = findBlockById(
        state.page.blocks,
        action.payload.blockId,
      );
      if (!blockToMove) return state;

      let blocksAfterRemove = removeBlockFromTree(
        state.page.blocks,
        action.payload.blockId,
      );

      if (action.payload.position === "inside") {
        blocksAfterRemove = addBlockToTree(
          blocksAfterRemove,
          blockToMove,
          action.payload.targetId,
        );
      } else {
        const targetParent = findParentBlock(
          blocksAfterRemove,
          action.payload.targetId,
        );
        const parentBlocks = targetParent
          ? targetParent.children!
          : blocksAfterRemove;
        const targetIndex = findBlockIndex(
          parentBlocks,
          action.payload.targetId,
        );
        const insertIndex =
          action.payload.position === "after" ? targetIndex + 1 : targetIndex;

        blocksAfterRemove = addBlockToTree(
          blocksAfterRemove,
          blockToMove,
          targetParent?.id,
          insertIndex,
        );
      }

      return {
        ...state,
        page: { ...state.page, blocks: blocksAfterRemove },
        isDirty: true,
      };

    case "DUPLICATE_BLOCK":
      if (!state.page) return state;
      const originalBlock = findBlockById(
        state.page.blocks,
        action.payload.blockId,
      );
      if (!originalBlock) return state;

      const duplicatedBlock = duplicateBlock(originalBlock);
      const parent = findParentBlock(state.page.blocks, action.payload.blockId);
      const parentBlocks = parent ? parent.children! : state.page.blocks;
      const originalIndex = findBlockIndex(
        parentBlocks,
        action.payload.blockId,
      );

      return {
        ...state,
        page: {
          ...state.page,
          blocks: addBlockToTree(
            state.page.blocks,
            duplicatedBlock,
            parent?.id,
            originalIndex + 1,
          ),
        },
        isDirty: true,
        selection: {
          blockId: duplicatedBlock.id,
          parentId: parent?.id ?? null,
        },
      };

    case "SET_VIEWPORT":
      return { ...state, viewport: action.payload };

    case "SET_ZOOM":
      return { ...state, zoom: Math.max(25, Math.min(200, action.payload)) };

    case "TOGGLE_GRID":
      return { ...state, showGrid: action.payload ?? !state.showGrid };

    case "TOGGLE_OUTLINES":
      return { ...state, showOutlines: action.payload ?? !state.showOutlines };

    case "TOGGLE_PREVIEW": {
      const enteringPreview = action.payload ?? !state.isPreviewMode;
      return {
        ...state,
        isPreviewMode: enteringPreview,
        // Clear selection when entering preview mode
        selection: enteringPreview
          ? { blockId: null, parentId: null }
          : state.selection,
      };
    }

    case "TOGGLE_FOCUS_MODE":
      return {
        ...state,
        isFocusMode: action.payload ?? !state.isFocusMode,
      };

    case "TOGGLE_SITE_FRAME":
      return {
        ...state,
        showSiteFrame: action.payload ?? !state.showSiteFrame,
      };

    case "SET_SIDEBAR_TAB":
      return { ...state, sidebarTab: action.payload };

    case "SET_DRAG_STATE":
      return {
        ...state,
        dragState: { ...state.dragState, ...action.payload },
      };

    case "SAVE_HISTORY":
      if (!state.page) return state;
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        blocks: state.page.blocks,
        timestamp: Date.now(),
        action: action.payload.action,
        label: action.payload.label,
        blockType: action.payload.blockType,
        blockId: action.payload.blockId,
      });
      // Keep last 50 history entries
      if (newHistory.length > 50) newHistory.shift();
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };

    case "UNDO":
      if (!state.page || state.historyIndex <= 0) return state;
      const prevIndex = state.historyIndex - 1;
      return {
        ...state,
        page: { ...state.page, blocks: state.history[prevIndex].blocks },
        historyIndex: prevIndex,
        isDirty: true,
      };

    case "REDO":
      if (!state.page || state.historyIndex >= state.history.length - 1)
        return state;
      const nextIndex = state.historyIndex + 1;
      return {
        ...state,
        page: { ...state.page, blocks: state.history[nextIndex].blocks },
        historyIndex: nextIndex,
        isDirty: true,
      };

    case "SET_SAVING":
      return { ...state, isSaving: action.payload };

    case "MARK_CLEAN":
      return { ...state, isDirty: false };

    case "UPDATE_SEO":
      if (!state.page) return state;
      return {
        ...state,
        page: { ...state.page, seo: { ...state.page.seo, ...action.payload } },
        isDirty: true,
      };

    case "UPDATE_PAGE_META":
      if (!state.page) return state;
      return {
        ...state,
        page: {
          ...state.page,
          ...(action.payload.title !== undefined && {
            title: action.payload.title,
          }),
          ...(action.payload.slug !== undefined && {
            slug: action.payload.slug,
          }),
          ...(action.payload.status !== undefined && {
            status: action.payload.status,
          }),
        },
        isDirty: true,
      };

    case "SET_ACTIVE_LOCALE":
      return { ...state, activeLocale: action.payload };

    case "UPDATE_TRANSLATION_STATUS":
      if (!state.page) return state;
      return {
        ...state,
        page: {
          ...state.page,
          translations: {
            ...state.page.translations,
            status: {
              ...state.page.translations.status,
              [action.payload.locale]: {
                ...state.page.translations.status[action.payload.locale],
                ...action.payload.status,
              },
            },
          },
        },
        isDirty: true,
      };

    case "COPY_CONTENT_TO_LOCALE":
      if (!state.page) return state;
      return {
        ...state,
        page: {
          ...state.page,
          blocks: copyPageContentToLocale(
            state.page.blocks,
            action.payload.fromLocale,
            action.payload.toLocale,
          ),
          // Also copy the page title
          title: {
            ...state.page.title,
            [action.payload.toLocale]:
              state.page.title[action.payload.fromLocale] ||
              state.page.title[cmsConfig.defaultLocale] ||
              "",
          },
        },
        isDirty: true,
      };

    case "SET_HOVERED_BLOCK":
      return {
        ...state,
        hoveredBlockId: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_FOCUS_SECTION":
      return {
        ...state,
        focusSection: action.payload,
      };

    default:
      return state;
  }
}

interface PageBuilderContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  // Convenience methods
  selectBlock: (
    blockId: string | null,
    parentId?: string | null,
    keepTab?: boolean,
  ) => void;
  addBlock: (block: PageBlock, parentId?: string, position?: number) => void;
  updateBlock: (
    blockId: string,
    updates: Partial<Omit<PageBlock, "content">> & {
      content?: Partial<BlockContent>;
    },
  ) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (
    blockId: string,
    targetId: string,
    position: "before" | "after" | "inside",
  ) => void;
  duplicateBlock: (blockId: string) => void;
  setViewport: (viewport: Viewport) => void;
  setZoom: (zoom: number) => void;
  togglePreview: (forceState?: boolean) => void;
  toggleFocusMode: () => void;
  toggleSiteFrame: (forceState?: boolean) => void;
  undo: () => void;
  redo: () => void;
  saveHistory: (
    action: HistoryActionType,
    label: string,
    blockType?: BlockType,
    blockId?: string,
  ) => void;
  setPage: (page: Page) => void;
  updateSEO: (seo: Partial<LocalizedSEOSettings>) => void;
  updatePageMeta: (meta: {
    title?: LocalizedString;
    slug?: string;
    status?: PageStatus;
  }) => void;
  setDragState: (dragState: Partial<DragState>) => void;
  setSidebarTab: (tab: "blocks" | "layers" | "settings" | "history") => void;
  selectedBlock: PageBlock | null;
  canUndo: boolean;
  canRedo: boolean;
  // Localization methods
  activeLocale: string;
  setActiveLocale: (locale: string) => void;
  copyContentToLocale: (fromLocale: string, toLocale: string) => void;
  updateTranslationStatus: (
    locale: string,
    status: Partial<TranslationStatus>,
  ) => void;
  // Hover tracking
  setHoveredBlock: (blockId: string | null) => void;
  // Error handling
  setError: (error: PageBuilderError | null) => void;
  clearError: () => void;
  // Focus section (for navigating to settings sections)
  setFocusSection: (section: string | null) => void;
}

const PageBuilderContext = createContext<PageBuilderContextValue | null>(null);

// Track newly added blocks for entrance animation
const newlyAddedBlocks = new Set<string>();

export const isNewlyAddedBlock = (blockId: string): boolean => {
  return newlyAddedBlocks.has(blockId);
};

export const clearNewlyAddedBlock = (blockId: string): void => {
  newlyAddedBlocks.delete(blockId);
};

export const PageBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const selectBlock = useCallback(
    (blockId: string | null, parentId?: string | null, keepTab?: boolean) => {
      dispatch({
        type: "SELECT_BLOCK",
        payload: { blockId, parentId, keepTab },
      });
    },
    [],
  );

  const addBlock = useCallback(
    (block: PageBlock, parentId?: string, position?: number) => {
      const blockDef = blockRegistry[block.type];
      const label = blockDef?.label || block.type;
      // Track for entrance animation
      newlyAddedBlocks.add(block.id);
      dispatch({
        type: "SAVE_HISTORY",
        payload: {
          action: "add",
          label: `Added ${label}`,
          blockType: block.type,
          blockId: block.id,
        },
      });
      dispatch({ type: "ADD_BLOCK", payload: { block, parentId, position } });
    },
    [],
  );

  const updateBlock = useCallback(
    (
      blockId: string,
      updates: Partial<Omit<PageBlock, "content">> & {
        content?: Partial<BlockContent>;
      },
    ) => {
      dispatch({ type: "UPDATE_BLOCK", payload: { blockId, updates } });
    },
    [],
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      // Get block info before deleting for history label
      const block = state.page
        ? findBlockById(state.page.blocks, blockId)
        : null;
      const blockDef = block ? blockRegistry[block.type] : null;
      const label = blockDef?.label || block?.type || "block";
      dispatch({
        type: "SAVE_HISTORY",
        payload: {
          action: "delete",
          label: `Deleted ${label}`,
          blockType: block?.type,
          blockId,
        },
      });
      dispatch({ type: "DELETE_BLOCK", payload: { blockId } });
    },
    [state.page],
  );

  const moveBlock = useCallback(
    (
      blockId: string,
      targetId: string,
      position: "before" | "after" | "inside",
    ) => {
      const block = state.page
        ? findBlockById(state.page.blocks, blockId)
        : null;
      const blockDef = block ? blockRegistry[block.type] : null;
      const label = blockDef?.label || block?.type || "block";
      dispatch({
        type: "SAVE_HISTORY",
        payload: {
          action: "move",
          label: `Moved ${label}`,
          blockType: block?.type,
          blockId,
        },
      });
      dispatch({
        type: "MOVE_BLOCK",
        payload: { blockId, targetId, position },
      });
    },
    [state.page],
  );

  const duplicateBlockFn = useCallback(
    (blockId: string) => {
      const block = state.page
        ? findBlockById(state.page.blocks, blockId)
        : null;
      const blockDef = block ? blockRegistry[block.type] : null;
      const label = blockDef?.label || block?.type || "block";
      dispatch({
        type: "SAVE_HISTORY",
        payload: {
          action: "duplicate",
          label: `Duplicated ${label}`,
          blockType: block?.type,
          blockId,
        },
      });
      dispatch({ type: "DUPLICATE_BLOCK", payload: { blockId } });
    },
    [state.page],
  );

  const setViewport = useCallback((viewport: Viewport) => {
    dispatch({ type: "SET_VIEWPORT", payload: viewport });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: "SET_ZOOM", payload: zoom });
  }, []);

  const togglePreview = useCallback((forceState?: boolean) => {
    dispatch({ type: "TOGGLE_PREVIEW", payload: forceState });
  }, []);

  const toggleFocusMode = useCallback(() => {
    dispatch({ type: "TOGGLE_FOCUS_MODE" });
  }, []);

  const toggleSiteFrame = useCallback((forceState?: boolean) => {
    dispatch({ type: "TOGGLE_SITE_FRAME", payload: forceState });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const saveHistory = useCallback(
    (
      action: HistoryActionType,
      label: string,
      blockType?: BlockType,
      blockId?: string,
    ) => {
      dispatch({
        type: "SAVE_HISTORY",
        payload: { action, label, blockType, blockId },
      });
    },
    [],
  );

  const setPage = useCallback((page: Page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const updateSEO = useCallback((seo: Partial<LocalizedSEOSettings>) => {
    dispatch({ type: "UPDATE_SEO", payload: seo });
  }, []);

  const updatePageMeta = useCallback(
    (meta: { title?: LocalizedString; slug?: string; status?: PageStatus }) => {
      dispatch({ type: "UPDATE_PAGE_META", payload: meta });
    },
    [],
  );

  const setActiveLocale = useCallback((locale: string) => {
    dispatch({ type: "SET_ACTIVE_LOCALE", payload: locale });
  }, []);

  const copyContentToLocaleFn = useCallback(
    (fromLocale: string, toLocale: string) => {
      dispatch({
        type: "COPY_CONTENT_TO_LOCALE",
        payload: { fromLocale, toLocale },
      });
    },
    [],
  );

  const updateTranslationStatus = useCallback(
    (locale: string, status: Partial<TranslationStatus>) => {
      dispatch({
        type: "UPDATE_TRANSLATION_STATUS",
        payload: { locale, status },
      });
    },
    [],
  );

  const setDragState = useCallback((dragState: Partial<DragState>) => {
    dispatch({ type: "SET_DRAG_STATE", payload: dragState });
  }, []);

  const setSidebarTab = useCallback(
    (tab: "blocks" | "layers" | "settings" | "history") => {
      dispatch({ type: "SET_SIDEBAR_TAB", payload: tab });
    },
    [],
  );

  const setHoveredBlock = useCallback((blockId: string | null) => {
    dispatch({ type: "SET_HOVERED_BLOCK", payload: blockId });
  }, []);

  const setError = useCallback((error: PageBuilderError | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const setFocusSection = useCallback((section: string | null) => {
    dispatch({ type: "SET_FOCUS_SECTION", payload: section });
  }, []);

  const selectedBlock = useMemo(() => {
    if (!state.page || !state.selection.blockId) return null;
    return findBlockById(state.page.blocks, state.selection.blockId);
  }, [state.page, state.selection.blockId]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value: PageBuilderContextValue = {
    state,
    dispatch,
    selectBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    duplicateBlock: duplicateBlockFn,
    setViewport,
    setZoom,
    togglePreview,
    toggleFocusMode,
    toggleSiteFrame,
    undo,
    redo,
    saveHistory,
    setPage,
    updateSEO,
    updatePageMeta,
    setDragState,
    setSidebarTab,
    selectedBlock,
    canUndo,
    canRedo,
    // Localization
    activeLocale: state.activeLocale,
    setActiveLocale,
    copyContentToLocale: copyContentToLocaleFn,
    updateTranslationStatus,
    setHoveredBlock,
    // Error handling
    setError,
    clearError,
    // Focus section
    setFocusSection,
  };

  return (
    <PageBuilderContext.Provider value={value}>
      {children}
    </PageBuilderContext.Provider>
  );
};

export const usePageBuilder = (): PageBuilderContextValue => {
  const context = useContext(PageBuilderContext);
  if (!context) {
    throw new Error("usePageBuilder must be used within a PageBuilderProvider");
  }
  return context;
};

export default PageBuilderContext;
