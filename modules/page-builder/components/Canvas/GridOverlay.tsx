/**
 * Grid Overlay
 * Visual overlay for editing CSS Grid blocks
 * Features:
 * - Cell boundaries and hover states
 * - Click targets for adding blocks
 */

import React, { useState, useCallback, useMemo } from "react";
import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { GridTemplate, GridChildPlacement, PageBlock } from "../../types";

interface GridOverlayProps {
  gridId: string;
  template: GridTemplate;
  childPlacements: GridChildPlacement[];
  childBlocks: PageBlock[];
  gap: number;
  rowGap?: number;
  onCellClick: (col: number, row: number) => void;
  onChildSelect?: (blockId: string) => void;
  selectedCellBlockId?: string | null;
  isActive: boolean;
}

// Check if a cell is occupied by any placement (including spanned cells)
// Also verifies the block actually exists (not just placement data)
const isCellOccupied = (
  col: number,
  row: number,
  placements: GridChildPlacement[],
  existingBlockIds: Set<string>,
): GridChildPlacement | null => {
  for (const placement of placements) {
    // Skip placements for blocks that no longer exist
    if (!existingBlockIds.has(placement.blockId)) {
      continue;
    }

    const colStart = placement.placement.colStart;
    const rowStart = placement.placement.rowStart;
    const colEnd = colStart + (placement.placement.colSpan || 1) - 1;
    const rowEnd = rowStart + (placement.placement.rowSpan || 1) - 1;

    if (col >= colStart && col <= colEnd && row >= rowStart && row <= rowEnd) {
      return placement;
    }
  }
  return null;
};

// Check if this cell is the origin of a placement
// Also verifies the block actually exists
const isPlacementOrigin = (
  col: number,
  row: number,
  placements: GridChildPlacement[],
  existingBlockIds: Set<string>,
): GridChildPlacement | null => {
  return (
    placements.find(
      (p) =>
        p.placement.colStart === col &&
        p.placement.rowStart === row &&
        existingBlockIds.has(p.blockId),
    ) || null
  );
};

const GridOverlay: React.FC<GridOverlayProps> = ({
  gridId,
  template,
  childPlacements,
  childBlocks,
  gap,
  rowGap: rowGapProp,
  onCellClick,
  onChildSelect,
  selectedCellBlockId,
  isActive,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    col: number;
    row: number;
  } | null>(null);

  const rowGap = rowGapProp ?? gap;
  const totalCols = template.columns.length;
  const totalRows = template.rows.length;

  // Create set of existing block IDs for quick lookup
  const existingBlockIds = useMemo(() => {
    return new Set(childBlocks.map((b) => b.id));
  }, [childBlocks]);

  // Generate all cell positions
  const cells = useMemo(() => {
    const result: Array<{ col: number; row: number }> = [];
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalCols; col++) {
        result.push({ col, row });
      }
    }
    return result;
  }, [totalCols, totalRows]);

  const handleCellClick = useCallback(
    (col: number, row: number, e: React.MouseEvent) => {
      e.stopPropagation();

      const occupiedPlacement = isCellOccupied(
        col,
        row,
        childPlacements,
        existingBlockIds,
      );
      if (occupiedPlacement && onChildSelect) {
        onChildSelect(occupiedPlacement.blockId);
      } else {
        onCellClick(col, row);
      }
    },
    [childPlacements, existingBlockIds, onCellClick, onChildSelect],
  );

  const handleMouseEnter = useCallback((col: number, row: number) => {
    setHoveredCell({ col, row });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // Get child block label by ID
  const getChildLabel = (blockId: string): string | null => {
    const child = childBlocks.find((c) => c.id === blockId);
    return child?.type || null;
  };

  if (!isActive) return null;

  return (
    <div
      className="grid-overlay absolute inset-0 z-[5]"
      style={{
        display: "grid",
        gridTemplateColumns: template.columns.join(" "),
        gridTemplateRows: template.rows.join(" "),
        gap: rowGap ? `${rowGap}px ${gap}px` : `${gap}px`,
        pointerEvents: "auto",
      }}
    >
      {cells.map(({ col, row }) => {
        const occupiedPlacement = isCellOccupied(
          col,
          row,
          childPlacements,
          existingBlockIds,
        );
        const isOrigin = isPlacementOrigin(
          col,
          row,
          childPlacements,
          existingBlockIds,
        );
        const isOccupied = !!occupiedPlacement;
        const isHovered = hoveredCell?.col === col && hoveredCell?.row === row;
        const isSelectedCell =
          selectedCellBlockId &&
          occupiedPlacement?.blockId === selectedCellBlockId;
        const childLabel = isOrigin ? getChildLabel(isOrigin.blockId) : null;

        // Skip cells that are part of a spanned area (not the origin)
        if (isOccupied && !isOrigin) {
          return null;
        }

        // For origin cells with spans, render a single block that spans the area
        const colSpan = isOrigin?.placement.colSpan || 1;
        const rowSpan = isOrigin?.placement.rowSpan || 1;

        return (
          <div
            key={`cell-${col}-${row}`}
            className={classNames(
              "grid-overlay-cell relative pointer-events-auto cursor-pointer transition-all duration-150 min-h-[120px] flex items-center justify-center",
              {
                // Occupied cell (origin) - spans entire area
                "border-2 border-solid border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/30":
                  isOrigin,
                // Selected cell
                "!border-blue-500 !border-2 !bg-blue-100/50 dark:!bg-blue-900/40":
                  isSelectedCell,
                // Hovered occupied
                "ring-2 ring-blue-400 dark:ring-blue-500 ring-inset":
                  isHovered && isOccupied,
              },
            )}
            style={{
              gridColumn: isOrigin ? `${col} / span ${colSpan}` : col,
              gridRow: isOrigin ? `${row} / span ${rowSpan}` : row,
              // Empty cell gets very subtle gradient background
              ...(!isOccupied && {
                background:
                  "linear-gradient(135deg, #fafbfc 0%, #f5f7f9 50%, #fafbfc 100%)",
              }),
            }}
            onClick={(e) => handleCellClick(col, row, e)}
            onMouseEnter={() => handleMouseEnter(col, row)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Cell coordinates */}
            <span className="absolute top-1 left-1 text-[9px] font-mono text-slate-400 dark:text-slate-500">
              {col},{row}
            </span>

            {/* Empty cell placeholder content */}
            {!isOccupied && !isHovered && (
              <div className="flex items-center justify-center text-slate-300">
                <PlusIcon className="w-8 h-8" />
              </div>
            )}

            {/* Child block label (for origins) */}
            {childLabel && (
              <span className="absolute bottom-1 right-1 text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-slate-800/80 px-1 rounded">
                {childLabel}
              </span>
            )}

            {/* Add button for empty cells on hover */}
            {!isOccupied && isHovered && (
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
                <PlusIcon className="w-6 h-6" />
              </div>
            )}

            {/* Span indicator for origins with spanning */}
            {isOrigin && (colSpan > 1 || rowSpan > 1) && (
              <span className="absolute top-1 right-1 text-[9px] font-mono text-emerald-500 dark:text-emerald-400">
                {colSpan}×{rowSpan}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GridOverlay;
