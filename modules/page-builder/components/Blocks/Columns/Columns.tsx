/**
 * Columns Block
 * Multi-column layout container
 * Supports responsive layouts via media queries
 */

import React from "react";
import type { PageBlock, ColumnsContent, ColumnLayout } from "../../../types";

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

const Columns: React.FC<ColumnsProps> = ({ block, children }) => {
  const content = block.content as ColumnsContent;
  const style = block.style;

  // Responsive settings with defaults
  const stackOnMobile = content.stackOnMobile !== false; // Default true
  const gap = content.gap || 24;
  const desktopColumns = content.columns || 2;
  const desktopLayout = content.layout || "equal";
  const tabletColumns = content.tabletColumns || desktopColumns;
  const tabletLayout = content.tabletLayout || desktopLayout;
  const mobileColumns = content.mobileColumns || 1;
  const mobileLayout = content.mobileLayout || "equal";

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  // Generate unique ID for scoped styles
  const gridId = `columns-${block.id}`;

  // Generate responsive CSS
  const responsiveCSS = `
    #${gridId} {
      display: grid;
      gap: ${gap}px;
      width: 100%;
      grid-template-columns: ${stackOnMobile ? "1fr" : getGridTemplate(mobileLayout, mobileColumns)};
    }
    @media (min-width: 768px) {
      #${gridId} {
        grid-template-columns: ${getGridTemplate(tabletLayout, tabletColumns)};
      }
    }
    @media (min-width: 1024px) {
      #${gridId} {
        grid-template-columns: ${getGridTemplate(desktopLayout, desktopColumns)};
      }
    }
  `;

  return (
    <div style={containerStyle} className="min-h-[50px]">
      {/* Scoped responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />

      <div id={gridId} className="min-h-[inherit]">
        {children ||
          Array.from({ length: desktopColumns }).map((_, index) => (
            <div
              key={index}
              className="min-h-[100px] flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4"
            >
              <p className="text-sm">Column {index + 1}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Columns;
