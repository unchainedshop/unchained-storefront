/**
 * UI Context
 * Provides UI state (viewport, zoom, preview mode, etc.)
 */

import { createContext, useContext } from "react";
import type { Viewport, DragState, PageBuilderError } from "../types";

export interface UIContextValue {
  viewport: Viewport;
  zoom: number;
  showGrid: boolean;
  showOutlines: boolean;
  showSiteFrame: boolean;
  isPreviewMode: boolean;
  isFocusMode: boolean;
  isDirty: boolean;
  isSaving: boolean;
  dragState: DragState;
  sidebarTab: "blocks" | "layers" | "settings" | "history";
  hoveredBlockId: string | null;
  error: PageBuilderError | null;
  focusSection: string | null;
}

export const UIContext = createContext<UIContextValue | null>(null);

export const usePageBuilderUI = (): UIContextValue => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error(
      "usePageBuilderUI must be used within a PageBuilderProvider",
    );
  }
  return context;
};
