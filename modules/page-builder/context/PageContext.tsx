/**
 * Page Context
 * Provides page data and selection state
 */

import { createContext, useContext } from "react";
import type { Page, EditorSelection, PageBlock } from "../types";

export interface PageContextValue {
  page: Page | null;
  selection: EditorSelection;
  selectedBlock: PageBlock | null;
}

export const PageContext = createContext<PageContextValue | null>(null);

export const usePageBuilderPage = (): PageContextValue => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error(
      "usePageBuilderPage must be used within a PageBuilderProvider",
    );
  }
  return context;
};
