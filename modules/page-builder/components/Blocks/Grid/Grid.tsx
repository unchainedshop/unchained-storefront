/**
 * Grid Block
 * CSS Grid-based layout container with explicit cell placement
 * Supports responsive templates, cell spanning, and per-cell styling
 */

import React, { useMemo, useCallback, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
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
import BlockPickerModal from "../../BlockPickerModal";
import { createBlock } from "../../../utils/blockRegistry";
import { buildCellStyleCSS } from "../../../utils/cellPresets";
import {
  buildScrollAnimationStyle,
  getScrollRevealAttributes,
} from "../../../utils/scrollAnimations";
import type { BlockOverrides } from "../../../types";

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
const buildTemplateRows = (
  rows: GridTrackSize[],
  minRowHeight?: number,
): string => {
  if (minRowHeight) {
    // Apply minRowHeight to each row
    return rows
      .map((row) => {
        if (row === "auto") return `minmax(${minRowHeight}px, auto)`;
        if (row === "1fr") return `minmax(${minRowHeight}px, 1fr)`;
        return row;
      })
      .join(" ");
  }
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
    #${gridId}-container {
      container-type: inline-size;
    }
    #${gridId} {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      gap: ${gapStr};
    }
    /* Reset grid placements on small containers - stack items naturally */
    #${gridId} > * {
      grid-column: auto !important;
      grid-row: auto !important;
    }
    @container (min-width: 600px) {
      #${gridId} {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        grid-template-rows: auto;
      }
    }
    @container (min-width: 900px) {
      #${gridId} {
        grid-template-columns: ${buildTemplateColumns(laptopTemplate.columns)};
        grid-template-rows: ${buildTemplateRows(laptopTemplate.rows)};
      }
      /* Restore grid placements on larger containers */
      #${gridId} > * {
        grid-column: unset !important;
        grid-row: unset !important;
      }
    }
    @container (min-width: 1200px) {
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

  // State for block picker modal
  const [isBlockPickerOpen, setIsBlockPickerOpen] = useState(false);
  const [pendingPlacement, setPendingPlacement] = useState<{
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

  // Grid styles - set template properties for editor, CSS handles production responsive
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isInEditor
      ? buildTemplateColumns(currentTemplate.columns)
      : undefined,
    gridTemplateRows: isInEditor
      ? buildTemplateRows(currentTemplate.rows, content.minRowHeight)
      : undefined,
    gap: content.rowGap
      ? `${content.rowGap}px ${content.gap}px`
      : `${content.gap}px`,
    gridAutoFlow: content.autoFlow || "row",
    justifyItems: content.justifyItems || "stretch",
    alignItems: content.alignItems || "stretch",
    width: "100%",
    minHeight: style.minHeight || 100,
  };

  // Generate responsive CSS only for production (not in editor)
  // In editor, we use inline styles which would be overridden by !important CSS
  const responsiveCSS = !isInEditor
    ? generateResponsiveCSS(gridId, content)
    : null;

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
        height: "100%",
        display: "flex",
        flexDirection: "column",
      };

      // Apply cell-specific styles using presets system
      if (cellStyle) {
        // Get preset and custom styles
        const presetCSS = buildCellStyleCSS(cellStyle);
        Object.assign(wrapperStyle, presetCSS);

        // Legacy properties (still supported)
        if (cellStyle.justifySelf)
          wrapperStyle.justifySelf = cellStyle.justifySelf;
        if (cellStyle.alignSelf) wrapperStyle.alignSelf = cellStyle.alignSelf;
      }

      // Scroll animation styles
      const scrollAnimation = cellStyle?.scrollAnimation;
      if (scrollAnimation && scrollAnimation.type !== "none") {
        Object.assign(wrapperStyle, buildScrollAnimationStyle(scrollAnimation));
      }

      // Scroll reveal data attributes
      const scrollRevealAttrs =
        scrollAnimation && scrollAnimation.type !== "none"
          ? getScrollRevealAttributes(scrollAnimation)
          : {};

      return (
        <div
          style={wrapperStyle}
          className="h-full w-full [&>*]:flex-1 [&>*]:min-h-0 transition-all"
          data-grid-cell={childBlockId}
          {...scrollRevealAttrs}
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
      return (
        <div
          key={`placeholder-${idx}`}
          className="h-full min-h-[80px]"
          style={{
            background:
              "linear-gradient(135deg, #fafbfc 0%, #f5f7f9 50%, #fafbfc 100%)",
          }}
          data-grid-placeholder
        />
      );
    });
  }, [currentTemplate, children, isPreview, isInEditor, isSelected]);

  // Handle cell click from overlay - open block picker
  const handleCellClick = useCallback((col: number, row: number) => {
    setPendingPlacement({ col, row });
    setIsBlockPickerOpen(true);
  }, []);

  // Handle block selection from picker - add block to grid cell
  const handleBlockSelect = useCallback(
    (blockType: BlockType, overrides?: BlockOverrides) => {
      if (
        !pendingPlacement ||
        !pageBuilder?.addBlock ||
        !pageBuilder?.updateBlock
      )
        return;

      // Create the selected block type
      const newBlock = createBlock(blockType, overrides) as PageBlock;

      // Add the block as a child of the grid
      pageBuilder.addBlock(newBlock, block.id);

      // Update the grid's childPlacements to position this block
      const currentPlacements = content.childPlacements || [];
      const newPlacement: GridChildPlacement = {
        blockId: newBlock.id,
        placement: {
          colStart: pendingPlacement.col,
          rowStart: pendingPlacement.row,
          colSpan: 1,
          rowSpan: 1,
        },
      };

      pageBuilder.updateBlock(block.id, {
        content: {
          childPlacements: [...currentPlacements, newPlacement],
        },
      });

      // Close modal and reset state
      setIsBlockPickerOpen(false);
      setPendingPlacement(null);
    },
    [pageBuilder, block.id, content.childPlacements, pendingPlacement],
  );

  // Handle selecting a child block
  const handleChildSelect = useCallback(
    (blockId: string) => {
      pageBuilder?.selectBlock(blockId, block.id);
    },
    [pageBuilder, block.id],
  );

  // Handle resizing a child block's placement
  const handlePlacementResize = useCallback(
    (blockId: string, newPlacement: { colSpan: number; rowSpan: number }) => {
      if (!pageBuilder) return;

      const currentPlacements = content.childPlacements || [];
      const updatedPlacements = currentPlacements.map((p) => {
        if (p.blockId === blockId) {
          return {
            ...p,
            placement: {
              ...p.placement,
              colSpan: newPlacement.colSpan,
              rowSpan: newPlacement.rowSpan,
            },
          };
        }
        return p;
      });

      pageBuilder.updateBlock(block.id, {
        content: {
          childPlacements: updatedPlacements,
        },
      });
    },
    [pageBuilder, block.id, content.childPlacements],
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
    <div
      id={`${gridId}-container`}
      style={containerStyle}
      className="min-h-[50px] relative"
    >
      {/* Scoped responsive styles with container queries */}
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
          onPlacementResize={handlePlacementResize}
          selectedCellBlockId={null}
          isActive={showOverlay}
        />
      )}

      {/* Block Picker Modal for Grid cells */}
      <BlockPickerModal
        isOpen={isBlockPickerOpen}
        onClose={() => {
          setIsBlockPickerOpen(false);
          setPendingPlacement(null);
        }}
        onSelectBlock={handleBlockSelect}
        parentBlockType="grid"
      />
    </div>
  );
};

export default Grid;
