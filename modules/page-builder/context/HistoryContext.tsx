/**
 * History Context
 * Provides undo/redo history state
 */

import { createContext, useContext } from "react";
import type { HistoryEntry } from "../types";

export interface HistoryContextValue {
  history: HistoryEntry[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export const HistoryContext = createContext<HistoryContextValue | null>(null);

export const usePageBuilderHistory = (): HistoryContextValue => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error(
      "usePageBuilderHistory must be used within a PageBuilderProvider",
    );
  }
  return context;
};
