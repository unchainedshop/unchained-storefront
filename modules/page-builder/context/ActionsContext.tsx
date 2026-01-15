/**
 * Actions Context
 * Provides stable action callbacks that never cause re-renders
 */

import { createContext, useContext } from "react";
import type {
  PageBlock,
  Page,
  Viewport,
  DragState,
  LocalizedSEOSettings,
  LocalizedString,
  PageStatus,
  HistoryActionType,
  BlockType,
  BlockContent,
  TranslationStatus,
  PageBuilderError,
} from "../types";

export interface PageBuilderActions {
  // Block operations
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

  // Viewport & zoom
  setViewport: (viewport: Viewport) => void;
  setZoom: (zoom: number) => void;

  // UI toggles
  togglePreview: (forceState?: boolean) => void;
  toggleFocusMode: () => void;
  toggleSiteFrame: (forceState?: boolean) => void;
  toggleGrid: (forceState?: boolean) => void;
  toggleOutlines: (forceState?: boolean) => void;

  // History
  undo: () => void;
  redo: () => void;
  saveHistory: (
    action: HistoryActionType,
    label: string,
    blockType?: BlockType,
    blockId?: string,
  ) => void;

  // Page operations
  setPage: (page: Page) => void;
  updateSEO: (seo: Partial<LocalizedSEOSettings>) => void;
  updatePageMeta: (meta: {
    title?: LocalizedString;
    slug?: string;
    status?: PageStatus;
  }) => void;

  // Drag state
  setDragState: (dragState: Partial<DragState>) => void;

  // Sidebar
  setSidebarTab: (tab: "blocks" | "layers" | "settings" | "history") => void;

  // Localization
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

  // Focus section
  setFocusSection: (section: string | null) => void;
}

export const ActionsContext = createContext<PageBuilderActions | null>(null);

export const usePageBuilderActions = (): PageBuilderActions => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error(
      "usePageBuilderActions must be used within a PageBuilderProvider",
    );
  }
  return context;
};
