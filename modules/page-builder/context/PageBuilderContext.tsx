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
  SEOSettings,
  PageStatus,
  HistoryActionType,
  BlockType,
} from "../types";
import { blockRegistry } from "../utils/blockRegistry";

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
  const newId = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
            (block) => ({
              ...block,
              ...action.payload.updates,
              content: action.payload.updates.content
                ? { ...block.content, ...action.payload.updates.content }
                : block.content,
              style: action.payload.updates.style
                ? { ...block.style, ...action.payload.updates.style }
                : block.style,
            }),
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

    case "TOGGLE_PREVIEW":
      return {
        ...state,
        isPreviewMode: action.payload ?? !state.isPreviewMode,
      };

    case "TOGGLE_FOCUS_MODE":
      return {
        ...state,
        isFocusMode: action.payload ?? !state.isFocusMode,
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
  updateBlock: (blockId: string, updates: Partial<PageBlock>) => void;
  deleteBlock: (blockId: string) => void;
  moveBlock: (
    blockId: string,
    targetId: string,
    position: "before" | "after" | "inside",
  ) => void;
  duplicateBlock: (blockId: string) => void;
  setViewport: (viewport: Viewport) => void;
  setZoom: (zoom: number) => void;
  togglePreview: () => void;
  toggleFocusMode: () => void;
  undo: () => void;
  redo: () => void;
  saveHistory: (
    action: HistoryActionType,
    label: string,
    blockType?: BlockType,
    blockId?: string,
  ) => void;
  setPage: (page: Page) => void;
  updateSEO: (seo: Partial<SEOSettings>) => void;
  updatePageMeta: (meta: {
    title?: string;
    slug?: string;
    status?: PageStatus;
  }) => void;
  setDragState: (dragState: Partial<DragState>) => void;
  setSidebarTab: (tab: "blocks" | "layers" | "settings") => void;
  selectedBlock: PageBlock | null;
  canUndo: boolean;
  canRedo: boolean;
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
    (blockId: string, updates: Partial<PageBlock>) => {
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

  const togglePreview = useCallback(() => {
    dispatch({ type: "TOGGLE_PREVIEW" });
  }, []);

  const toggleFocusMode = useCallback(() => {
    dispatch({ type: "TOGGLE_FOCUS_MODE" });
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

  const updateSEO = useCallback((seo: Partial<SEOSettings>) => {
    dispatch({ type: "UPDATE_SEO", payload: seo });
  }, []);

  const updatePageMeta = useCallback(
    (meta: { title?: string; slug?: string; status?: PageStatus }) => {
      dispatch({ type: "UPDATE_PAGE_META", payload: meta });
    },
    [],
  );

  const setDragState = useCallback((dragState: Partial<DragState>) => {
    dispatch({ type: "SET_DRAG_STATE", payload: dragState });
  }, []);

  const setSidebarTab = useCallback((tab: "blocks" | "layers" | "settings") => {
    dispatch({ type: "SET_SIDEBAR_TAB", payload: tab });
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
