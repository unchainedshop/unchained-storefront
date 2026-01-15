/**
 * Grid Block
 * CSS Grid-based layout container with explicit cell placement
 * Supports responsive templates, cell spanning, and per-cell styling
 */

import React, { useMemo, useCallback, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import type {
  PageBlock,
  GridContent,
  GridTemplate,
  GridChildPlacement,
  GridTrackSize,
  BlockType,
} from "../../../types";
import { VIEWPORT_WIDTHS } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import GridOverlay from "../../Canvas/GridOverlay";
import { createBlock } from "../../../utils/blockRegistry";

interface GridProps {
  block: PageBlock;
  children?: React.ReactNode;
  isPreview?: boolean;
}

// Get template for viewport width
const getTemplateForViewport = (
  viewportWidth: number,
  template: GridContent["template"],
): GridTemplate => {
  if (viewportWidth >= 1520) return template.desktop;
  if (viewportWidth >= 1280 && template.laptop) return template.laptop;
  if (viewportWidth >= 768 && template.tablet) return template.tablet;
  if (template.mobile) return template.mobile;
  // Fallback to single column for mobile
  return template.mobile || { columns: ["1fr"], rows: ["auto"] };
};

// Build CSS grid-template-columns string
const buildTemplateColumns = (columns: GridTrackSize[]): string => {
  return columns.join(" ");
};

// Build CSS grid-template-rows string
const buildTemplateRows = (rows: GridTrackSize[]): string => {
  return rows.join(" ");
};

// Find placement for a child block
const findPlacement = (
  childId: string,
  placements: GridChildPlacement[],
): GridChildPlacement | undefined => {
  return placements.find((p) => p.blockId === childId);
};

// Generate responsive CSS for production
const generateResponsiveCSS = (
  gridId: string,
  content: GridContent,
): string => {
  const { template, gap, rowGap } = content;
  const gapStr = rowGap ? `${rowGap}px ${gap}px` : `${gap}px`;

  const mobileTemplate = template.mobile || {
    columns: ["1fr"],
    rows: ["auto"],
  };
  const tabletTemplate = template.tablet || template.desktop;
  const laptopTemplate = template.laptop || template.desktop;
  const desktopTemplate = template.desktop;

  return `
    #${gridId} {
      grid-template-columns: ${buildTemplateColumns(mobileTemplate.columns)};
      grid-template-rows: ${buildTemplateRows(mobileTemplate.rows)};
      gap: ${gapStr};
    }
    @media (min-width: 768px) {
      #${gridId} {
        grid-template-columns: ${buildTemplateColumns(tabletTemplate.columns)};
        grid-template-rows: ${buildTemplateRows(tabletTemplate.rows)};
      }
    }
    @media (min-width: 1280px) {
      #${gridId} {
        grid-template-columns: ${buildTemplateColumns(laptopTemplate.columns)};
        grid-template-rows: ${buildTemplateRows(laptopTemplate.rows)};
      }
    }
    @media (min-width: 1520px) {
      #${gridId} {
        grid-template-columns: ${buildTemplateColumns(desktopTemplate.columns)};
        grid-template-rows: ${buildTemplateRows(desktopTemplate.rows)};
      }
    }
  `;
};

const Grid: React.FC<GridProps> = ({ block, children, isPreview }) => {
  const content = block.content as unknown as GridContent;
  const style = block.style;
  const pageBuilder = usePageBuilder();
  const viewport = pageBuilder?.state?.viewport || "desktop-xl";
  const isInEditor = !!pageBuilder?.state?.page;
  const isSelected = pageBuilder?.state?.selection?.blockId === block.id;

  // State for cell-based add block modal
  const [pendingCellAdd, setPendingCellAdd] = useState<{
    col: number;
    row: number;
  } | null>(null);

  const currentViewportWidth = VIEWPORT_WIDTHS[viewport] || 1920;
  const currentTemplate = getTemplateForViewport(
    currentViewportWidth,
    content.template,
  );

  const gridId = `grid-${block.id}`;

  // Container styles
  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    margin: style.margin
      ? `${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px`
      : undefined,
    marginLeft:
      content.sidePadding != null ? `${content.sidePadding}px` : undefined,
    marginRight:
      content.sidePadding != null ? `${content.sidePadding}px` : undefined,
    backgroundColor: style.backgroundColor,
    borderRadius: style.borderRadius,
  };

  // Grid styles (for editor - live viewport preview)
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: buildTemplateColumns(currentTemplate.columns),
    gridTemplateRows: buildTemplateRows(currentTemplate.rows),
    gap: content.rowGap
      ? `${content.rowGap}px ${content.gap}px`
      : `${content.gap}px`,
    gridAutoFlow: content.autoFlow || "row",
    justifyItems: content.justifyItems || "stretch",
    alignItems: content.alignItems || "stretch",
    width: "100%",
    minHeight: style.minHeight || 100,
  };

  // Generate responsive CSS for production only
  const responsiveCSS = isInEditor
    ? ""
    : generateResponsiveCSS(gridId, content);

  // Wrap children with placement styles
  const wrappedChildren = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      // Extract block ID from child (BlockWrapper passes block prop)
      const childBlock = (child.props as { block?: PageBlock })?.block;
      const childBlockId = childBlock?.id;
      if (!childBlockId) return child;

      const placementData = findPlacement(
        childBlockId,
        content.childPlacements || [],
      );
      if (!placementData) return child; // Auto-placed by CSS Grid

      const { placement, cellStyle } = placementData;

      const wrapperStyle: React.CSSProperties = {
        gridColumn: placement.colSpan
          ? `${placement.colStart} / span ${placement.colSpan}`
          : String(placement.colStart),
        gridRow: placement.rowSpan
          ? `${placement.rowStart} / span ${placement.rowSpan}`
          : String(placement.rowStart),
      };

      // Apply cell-specific styles
      if (cellStyle) {
        if (cellStyle.justifySelf)
          wrapperStyle.justifySelf = cellStyle.justifySelf;
        if (cellStyle.alignSelf) wrapperStyle.alignSelf = cellStyle.alignSelf;
        if (cellStyle.backgroundColor)
          wrapperStyle.backgroundColor = cellStyle.backgroundColor;
        if (cellStyle.zIndex) wrapperStyle.zIndex = cellStyle.zIndex;
        if (cellStyle.padding) {
          const p = cellStyle.padding;
          wrapperStyle.padding = `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
        }
      }

      return (
        <div
          style={wrapperStyle}
          className="h-full min-h-0 overflow-hidden"
          data-grid-cell={childBlockId}
        >
          {child}
        </div>
      );
    });
  }, [children, content.childPlacements]);

  // Empty grid placeholder cells (for editor)
  // Don't show when selected - the overlay handles this
  const placeholderCells = useMemo(() => {
    if (
      isPreview ||
      !isInEditor ||
      React.Children.count(children) > 0 ||
      isSelected
    ) {
      return null;
    }

    const totalCells =
      currentTemplate.columns.length * currentTemplate.rows.length;
    return Array.from({ length: totalCells }).map((_, idx) => {
      const col = (idx % currentTemplate.columns.length) + 1;
      const row = Math.floor(idx / currentTemplate.columns.length) + 1;
      return (
        <div
          key={`placeholder-${idx}`}
          className="h-full min-h-[120px] flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #fafbfc 0%, #f5f7f9 50%, #fafbfc 100%)",
          }}
          data-grid-placeholder
          data-col={col}
          data-row={row}
        >
          <div className="text-center text-slate-400">
            <PhotoIcon className="w-6 h-6 mx-auto" />
            <p className="mt-1 text-xs">Add Image</p>
          </div>
        </div>
      );
    });
  }, [currentTemplate, children, isPreview, isInEditor, isSelected]);

  // Handle cell click from overlay - for adding blocks to specific cells
  const handleCellClick = useCallback(
    (col: number, row: number) => {
      if (!pageBuilder?.addBlock || !pageBuilder?.updateBlock) return;

      // Create a new text block
      const newBlock = createBlock("text-content") as PageBlock;

      // Add the block as a child of the grid
      pageBuilder.addBlock(newBlock, block.id);

      // Update the grid's childPlacements to position this block
      const currentPlacements = content.childPlacements || [];
      const newPlacement: GridChildPlacement = {
        blockId: newBlock.id,
        placement: {
          colStart: col,
          rowStart: row,
          colSpan: 1,
          rowSpan: 1,
        },
      };

      pageBuilder.updateBlock(block.id, {
        content: {
          childPlacements: [...currentPlacements, newPlacement],
        },
      });
    },
    [pageBuilder, block.id, content.childPlacements],
  );

  // Handle selecting a child block
  const handleChildSelect = useCallback(
    (blockId: string) => {
      pageBuilder?.selectBlock(blockId, block.id);
    },
    [pageBuilder, block.id],
  );

  // Get child blocks for overlay
  const childBlocks = useMemo(() => {
    const result: PageBlock[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const childBlock = (child.props as { block?: PageBlock })?.block;
        if (childBlock) {
          result.push(childBlock);
        }
      }
    });
    return result;
  }, [children]);

  // Show overlay when grid is selected in editor mode
  const showOverlay = isInEditor && isSelected && !isPreview;

  return (
    <div style={containerStyle} className="min-h-[50px] relative">
      {/* Scoped responsive styles for production */}
      {responsiveCSS && (
        <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />
      )}

      <div id={gridId} style={gridStyle} className="min-h-[inherit]">
        {wrappedChildren || placeholderCells}
        {/* Empty spacer cells when selected but no content - gives overlay dimensions */}
        {showOverlay && !wrappedChildren?.length && !placeholderCells && (
          <>
            {Array.from({
              length:
                currentTemplate.columns.length * currentTemplate.rows.length,
            }).map((_, idx) => (
              <div
                key={`spacer-${idx}`}
                className="min-h-[80px]"
                style={{ visibility: "hidden" }}
              />
            ))}
          </>
        )}
      </div>

      {/* Grid Overlay for visual cell editing */}
      {showOverlay && (
        <GridOverlay
          gridId={gridId}
          template={currentTemplate}
          childPlacements={content.childPlacements || []}
          childBlocks={childBlocks}
          gap={content.gap}
          rowGap={content.rowGap}
          onCellClick={handleCellClick}
          onChildSelect={handleChildSelect}
          selectedCellBlockId={null}
          isActive={showOverlay}
        />
      )}
    </div>
  );
};

export default Grid;
