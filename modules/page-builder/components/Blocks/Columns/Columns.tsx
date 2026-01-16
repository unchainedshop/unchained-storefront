/**
 * Columns Block
 * Multi-column layout container
 * Supports responsive layouts via media queries
 */

import React from "react";
import type {
  PageBlock,
  ColumnsContent,
  ColumnLayout,
  Viewport,
} from "../../../types";
import { VIEWPORT_WIDTHS } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";

interface ColumnsProps {
  block: PageBlock;
  children?: React.ReactNode;
  isPreview?: boolean;
}

// Helper to get grid template for a layout
const getGridTemplate = (layout: ColumnLayout, columns: number): string => {
  const templates: Record<string, string> = {
    equal: `repeat(${columns}, 1fr)`,
    "1-2": "1fr 2fr",
    "2-1": "2fr 1fr",
    "1-1-1": "1fr 1fr 1fr",
    "1-2-1": "1fr 2fr 1fr",
  };
  return templates[layout] || templates.equal;
};

// Get columns for a specific viewport width
const getColumnsForViewport = (
  viewportWidth: number,
  content: ColumnsContent,
): number => {
  const desktopColumns = content.columns || 2;
  const laptopColumns = content.laptopColumns ?? desktopColumns;
  const tabletLgColumns = content.tabletLgColumns ?? laptopColumns;
  const tabletColumns = content.tabletColumns ?? tabletLgColumns;
  const mobileColumns = content.mobileColumns ?? 1;

  if (viewportWidth >= 1520) return desktopColumns;
  if (viewportWidth >= 1280) return laptopColumns;
  if (viewportWidth >= 1024) return tabletLgColumns;
  if (viewportWidth >= 768) return tabletColumns;
  return mobileColumns;
};

const Columns: React.FC<ColumnsProps> = ({ block, children, isPreview }) => {
  const content = block.content as unknown as ColumnsContent;
  const style = block.style;
  const pageBuilder = usePageBuilder();
  const viewport = pageBuilder?.state?.viewport || "desktop-xl";

  // Responsive settings with defaults (cascade down from desktop)
  const gap = content.gap || 24;
  const desktopColumns = content.columns || 2;
  const desktopLayout = content.layout || "equal";
  const laptopColumns = content.laptopColumns ?? desktopColumns;
  const tabletLgColumns = content.tabletLgColumns ?? laptopColumns;
  const tabletColumns = content.tabletColumns ?? tabletLgColumns;
  const mobileColumns = content.mobileColumns ?? 1;

  // In editor, use viewport from state for live preview
  const currentViewportWidth = VIEWPORT_WIDTHS[viewport] || 1920;
  const currentColumns = getColumnsForViewport(currentViewportWidth, content);

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  // Generate unique ID for scoped styles
  const gridId = `columns-${block.id}`;

  // Check if we're in the editor (has page builder context with page)
  const isInEditor = !!pageBuilder?.state?.page;

  // For editor: use inline style based on current viewport (no media queries)
  // For production: use CSS media queries
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gap: `${gap}px`,
    width: "100%",
    gridTemplateColumns: getGridTemplate("equal", currentColumns),
  };

  // Generate responsive CSS for production only (not in editor)
  // In editor, inline styles handle the responsive preview
  const responsiveCSS = isInEditor
    ? ""
    : `
    #${gridId} {
      grid-template-columns: ${getGridTemplate("equal", mobileColumns)};
    }
    @media (min-width: 768px) {
      #${gridId} {
        grid-template-columns: ${getGridTemplate("equal", tabletColumns)};
      }
    }
    @media (min-width: 1024px) {
      #${gridId} {
        grid-template-columns: ${getGridTemplate("equal", tabletLgColumns)};
      }
    }
    @media (min-width: 1280px) {
      #${gridId} {
        grid-template-columns: ${getGridTemplate("equal", laptopColumns)};
      }
    }
    @media (min-width: 1520px) {
      #${gridId} {
        grid-template-columns: ${getGridTemplate(desktopLayout, desktopColumns)};
      }
    }
  `;

  return (
    <div style={containerStyle} className="min-h-[50px]">
      {/* Scoped responsive styles for production */}
      <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />

      <div id={gridId} style={gridStyle} className="min-h-[inherit]">
        {children ||
          Array.from({ length: desktopColumns }).map((_, index) => (
            <div
              key={index}
              className="min-h-[100px] flex items-center justify-center text-periwinkle-400 dark:text-periwinkle-300 border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50 bg-periwinkle-50/30 dark:bg-periwinkle-500/5 rounded-lg p-4"
            >
              <p className="text-sm font-medium">Column {index + 1}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Columns;
