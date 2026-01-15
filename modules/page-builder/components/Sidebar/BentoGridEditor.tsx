/**
 * Bento Grid Editor
 * Visual editor for creating bento-style grid layouts
 * Click and drag to select cells, creating spanning areas for components
 */

import React, { useState, useCallback, useRef } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { GridChildPlacement } from "../../types";

interface BentoArea {
  id: string;
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
  color: string;
}

interface BentoGridEditorProps {
  columns: number;
  rows: number;
  placements: GridChildPlacement[];
  onAreaCreate: (area: {
    colStart: number;
    rowStart: number;
    colSpan: number;
    rowSpan: number;
  }) => void;
  onAreaClick: (blockId: string) => void;
  onAreaDelete?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

// Colors for bento areas
const AREA_COLORS = [
  "bg-slate-500/20 border-slate-500",
  "bg-emerald-500/20 border-emerald-500",
  "bg-purple-500/20 border-purple-500",
  "bg-amber-500/20 border-amber-500",
  "bg-rose-500/20 border-rose-500",
  "bg-cyan-500/20 border-cyan-500",
];

const BentoGridEditor: React.FC<BentoGridEditorProps> = ({
  columns,
  rows,
  placements,
  onAreaCreate,
  onAreaClick,
  onAreaDelete,
  selectedBlockId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ col: number; row: number } | null>(
    null,
  );
  const gridRef = useRef<HTMLDivElement>(null);

  // Convert placements to bento areas with colors
  const bentoAreas: BentoArea[] = placements.map((p, idx) => ({
    id: p.blockId,
    colStart: p.placement.colStart,
    rowStart: p.placement.rowStart,
    colSpan: p.placement.colSpan || 1,
    rowSpan: p.placement.rowSpan || 1,
    color: AREA_COLORS[idx % AREA_COLORS.length],
  }));

  // Check if a cell is occupied by any placement
  const getCellOccupant = (col: number, row: number): BentoArea | null => {
    for (const area of bentoAreas) {
      const colEnd = area.colStart + area.colSpan - 1;
      const rowEnd = area.rowStart + area.rowSpan - 1;
      if (
        col >= area.colStart &&
        col <= colEnd &&
        row >= area.rowStart &&
        row <= rowEnd
      ) {
        return area;
      }
    }
    return null;
  };

  // Get selection bounds from drag
  const getSelectionBounds = () => {
    if (!dragStart) return null;
    const end = dragEnd || dragStart;
    return {
      colStart: Math.min(dragStart.col, end.col),
      colEnd: Math.max(dragStart.col, end.col),
      rowStart: Math.min(dragStart.row, end.row),
      rowEnd: Math.max(dragStart.row, end.row),
    };
  };

  // Check if selection overlaps with existing areas
  const isSelectionValid = (): boolean => {
    const bounds = getSelectionBounds();
    if (!bounds) return false;

    for (let col = bounds.colStart; col <= bounds.colEnd; col++) {
      for (let row = bounds.rowStart; row <= bounds.rowEnd; row++) {
        if (getCellOccupant(col, row)) return false;
      }
    }
    return true;
  };

  const handleMouseDown = useCallback(
    (col: number, row: number, e: React.MouseEvent) => {
      e.preventDefault();
      // Don't start drag on occupied cells
      if (getCellOccupant(col, row)) return;

      setIsDragging(true);
      setDragStart({ col, row });
      setDragEnd({ col, row });
    },
    [bentoAreas],
  );

  const handleMouseEnter = useCallback(
    (col: number, row: number) => {
      if (isDragging) {
        setDragEnd({ col, row });
      }
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragStart && isSelectionValid()) {
      const bounds = getSelectionBounds();
      if (bounds) {
        onAreaCreate({
          colStart: bounds.colStart,
          rowStart: bounds.rowStart,
          colSpan: bounds.colEnd - bounds.colStart + 1,
          rowSpan: bounds.rowEnd - bounds.rowStart + 1,
        });
      }
    }
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [isDragging, dragStart, dragEnd, onAreaCreate]);

  const handleAreaClick = useCallback(
    (e: React.MouseEvent, blockId: string) => {
      e.stopPropagation();
      onAreaClick(blockId);
    },
    [onAreaClick],
  );

  const isCellInSelection = (col: number, row: number): boolean => {
    const bounds = getSelectionBounds();
    if (!bounds) return false;
    return (
      col >= bounds.colStart &&
      col <= bounds.colEnd &&
      row >= bounds.rowStart &&
      row <= bounds.rowEnd
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-slate-400 uppercase tracking-wide">
        Click & drag to create areas
      </p>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="relative bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2 select-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid cells */}
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 40px)`,
          }}
        >
          {Array.from({ length: rows }).map((_, rowIdx) =>
            Array.from({ length: columns }).map((_, colIdx) => {
              const col = colIdx + 1;
              const row = rowIdx + 1;
              const occupant = getCellOccupant(col, row);
              const inSelection = isCellInSelection(col, row);
              const selectionValid = isSelectionValid();

              // Skip cells that are part of a multi-cell area (not the origin)
              if (
                occupant &&
                (occupant.colStart !== col || occupant.rowStart !== row)
              ) {
                return null;
              }

              // Render area block
              if (occupant) {
                const isSelected = selectedBlockId === occupant.id;
                return (
                  <div
                    key={`area-${occupant.id}`}
                    className={`relative rounded-lg border-2 cursor-pointer transition-all ${occupant.color} ${
                      isSelected
                        ? "ring-2 ring-slate-900 dark:ring-slate-300 ring-offset-2"
                        : ""
                    }`}
                    style={{
                      gridColumn: `${occupant.colStart} / span ${occupant.colSpan}`,
                      gridRow: `${occupant.rowStart} / span ${occupant.rowSpan}`,
                    }}
                    onClick={(e) => handleAreaClick(e, occupant.id)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {occupant.colSpan}×{occupant.rowSpan}
                      </span>
                    </div>
                    {onAreaDelete && isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAreaDelete(occupant.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      >
                        <TrashIcon className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                );
              }

              // Render empty cell
              return (
                <div
                  key={`cell-${col}-${row}`}
                  className={`rounded border-2 border-dashed transition-all cursor-crosshair ${
                    inSelection
                      ? selectionValid
                        ? "border-slate-900 bg-slate-900/30 dark:border-slate-300 dark:bg-slate-300/30"
                        : "border-red-500 bg-red-500/30"
                      : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                  }`}
                  onMouseDown={(e) => handleMouseDown(col, row, e)}
                  onMouseEnter={() => handleMouseEnter(col, row)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {!inSelection && (
                      <PlusIcon className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                </div>
              );
            }),
          )}
        </div>

        {/* Selection preview tooltip */}
        {isDragging && dragStart && dragEnd && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span
              className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium shadow-lg ${
                isSelectionValid()
                  ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                  : "bg-red-500 text-white"
              }`}
            >
              {Math.abs(dragEnd.col - dragStart.col) + 1} ×{" "}
              {Math.abs(dragEnd.row - dragStart.row) + 1}
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-dashed border-slate-300" />
          <span>Empty</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-500/20 border-2 border-slate-500" />
          <span>Has content</span>
        </div>
      </div>
    </div>
  );
};

export default BentoGridEditor;
