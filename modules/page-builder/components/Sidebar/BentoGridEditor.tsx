/**
 * Bento Grid Editor
 * Visual editor for creating bento-style grid layouts
 * Click and drag to select cells, creating spanning areas for components
 * Supports resizing areas via drag handles
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import classNames from "classnames";
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

type ResizeDirection = "e" | "s" | "se";

interface ResizeState {
  blockId: string;
  direction: ResizeDirection;
  startX: number;
  startY: number;
  startColSpan: number;
  startRowSpan: number;
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
  onAreaResize?: (
    blockId: string,
    newSize: { colSpan: number; rowSpan: number },
  ) => void;
  selectedBlockId?: string | null;
}

// Colors for bento areas - subtle monochrome palette
const AREA_COLORS = [
  "bg-slate-200/60 dark:bg-slate-700/40 border-slate-400 dark:border-slate-500",
  "bg-slate-300/50 dark:bg-slate-600/40 border-slate-500 dark:border-slate-400",
  "bg-slate-200/50 dark:bg-slate-700/30 border-slate-400 dark:border-slate-500",
  "bg-slate-300/40 dark:bg-slate-600/30 border-slate-500 dark:border-slate-400",
  "bg-slate-200/40 dark:bg-slate-700/25 border-slate-400 dark:border-slate-500",
  "bg-slate-300/30 dark:bg-slate-600/25 border-slate-500 dark:border-slate-400",
];

const BentoGridEditor: React.FC<BentoGridEditorProps> = ({
  columns,
  rows,
  placements,
  onAreaCreate,
  onAreaClick,
  onAreaDelete,
  onAreaResize,
  selectedBlockId,
}) => {
  const [cellHeight, setCellHeight] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ col: number; row: number } | null>(
    null,
  );
  const gridRef = useRef<HTMLDivElement>(null);

  // Resize state
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [previewSpan, setPreviewSpan] = useState<{
    colSpan: number;
    rowSpan: number;
  } | null>(null);

  // Calculate cell size from grid
  const getCellSize = useCallback(() => {
    if (!gridRef.current) return { width: 40, height: cellHeight };
    const gridRect = gridRef.current.getBoundingClientRect();
    const gap = 4; // gap-1 = 4px
    const padding = 12; // p-1.5 = 6px * 2
    const availableWidth = gridRect.width - padding;
    const cellWidth = (availableWidth - gap * (columns - 1)) / columns;
    return { width: cellWidth + gap, height: cellHeight + gap };
  }, [columns, rows, cellHeight]);

  // Handle resize start
  const handleResizeStart = useCallback(
    (
      e: React.MouseEvent,
      blockId: string,
      direction: ResizeDirection,
      currentColSpan: number,
      currentRowSpan: number,
    ) => {
      e.stopPropagation();
      e.preventDefault();

      setResizeState({
        blockId,
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startColSpan: currentColSpan,
        startRowSpan: currentRowSpan,
      });
      setPreviewSpan({ colSpan: currentColSpan, rowSpan: currentRowSpan });
    },
    [],
  );

  // Handle resize mouse move and up
  useEffect(() => {
    if (!resizeState) return;

    const cellSize = getCellSize();
    const area = placements.find((p) => p.blockId === resizeState.blockId);

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeState.startX;
      const deltaY = e.clientY - resizeState.startY;

      let newColSpan = resizeState.startColSpan;
      let newRowSpan = resizeState.startRowSpan;

      if (resizeState.direction === "e" || resizeState.direction === "se") {
        const colDelta = Math.round(deltaX / cellSize.width);
        newColSpan = Math.max(1, resizeState.startColSpan + colDelta);
      }

      if (resizeState.direction === "s" || resizeState.direction === "se") {
        const rowDelta = Math.round(deltaY / cellSize.height);
        newRowSpan = Math.max(1, resizeState.startRowSpan + rowDelta);
      }

      // Ensure we don't exceed grid bounds
      if (area) {
        const maxColSpan = columns - area.placement.colStart + 1;
        const maxRowSpan = rows - area.placement.rowStart + 1;
        newColSpan = Math.min(newColSpan, maxColSpan);
        newRowSpan = Math.min(newRowSpan, maxRowSpan);
      }

      setPreviewSpan({ colSpan: newColSpan, rowSpan: newRowSpan });
    };

    const handleMouseUp = () => {
      if (previewSpan && onAreaResize) {
        onAreaResize(resizeState.blockId, previewSpan);
      }
      setResizeState(null);
      setPreviewSpan(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    resizeState,
    previewSpan,
    onAreaResize,
    getCellSize,
    columns,
    rows,
    placements,
  ]);

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
    <>
      {/* Global resize overlay - captures mouse during resize */}
      {resizeState && (
        <div
          className="fixed inset-0 z-[9999]"
          style={{
            cursor:
              resizeState.direction === "e"
                ? "ew-resize"
                : resizeState.direction === "s"
                  ? "ns-resize"
                  : "nwse-resize",
          }}
        />
      )}
      <div className="space-y-2">
        <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Click & drag to create areas
        </p>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className="relative bg-slate-50 dark:bg-slate-800/30 rounded p-1.5 select-none border border-slate-100 dark:border-slate-800"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid cells */}
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
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
                  const isResizing = resizeState?.blockId === occupant.id;

                  // Use preview span during resize
                  const displayColSpan =
                    isResizing && previewSpan
                      ? previewSpan.colSpan
                      : occupant.colSpan;
                  const displayRowSpan =
                    isResizing && previewSpan
                      ? previewSpan.rowSpan
                      : occupant.rowSpan;

                  return (
                    <div
                      key={`area-${occupant.id}`}
                      className={classNames(
                        "relative rounded border cursor-pointer transition-all group/area",
                        occupant.color,
                        {
                          "ring-1 ring-slate-700 dark:ring-slate-300 ring-offset-1":
                            isSelected && !isResizing,
                          "border-dashed border-slate-500": isResizing,
                        },
                      )}
                      style={{
                        gridColumn: `${occupant.colStart} / span ${displayColSpan}`,
                        gridRow: `${occupant.rowStart} / span ${displayRowSpan}`,
                      }}
                      onClick={(e) => handleAreaClick(e, occupant.id)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          {displayColSpan}×{displayRowSpan}
                        </span>
                      </div>

                      {/* Delete button */}
                      {onAreaDelete && isSelected && !isResizing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAreaDelete(occupant.id);
                          }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-600 dark:bg-slate-400 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors z-10"
                        >
                          <TrashIcon className="w-2.5 h-2.5 text-white dark:text-slate-800" />
                        </button>
                      )}

                      {/* Resize handles - visible on hover or when resizing */}
                      {onAreaResize && (
                        <>
                          {/* East (right) resize edge */}
                          <div
                            className={classNames(
                              "absolute top-2 bottom-2 -right-px w-1.5 cursor-ew-resize group/handle z-10",
                              isResizing
                                ? "opacity-100"
                                : "opacity-0 group-hover/area:opacity-100",
                            )}
                            onMouseDown={(e) =>
                              handleResizeStart(
                                e,
                                occupant.id,
                                "e",
                                occupant.colSpan,
                                occupant.rowSpan,
                              )
                            }
                          >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-5 bg-slate-500 dark:bg-slate-400 rounded-full group-hover/handle:scale-110 group-hover/handle:bg-slate-700 dark:group-hover/handle:bg-slate-200 transition-all" />
                          </div>
                          {/* South (bottom) resize edge */}
                          <div
                            className={classNames(
                              "absolute left-2 right-2 -bottom-px h-1.5 cursor-ns-resize group/handle z-10",
                              isResizing
                                ? "opacity-100"
                                : "opacity-0 group-hover/area:opacity-100",
                            )}
                            onMouseDown={(e) =>
                              handleResizeStart(
                                e,
                                occupant.id,
                                "s",
                                occupant.colSpan,
                                occupant.rowSpan,
                              )
                            }
                          >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-5 bg-slate-500 dark:bg-slate-400 rounded-full group-hover/handle:scale-110 group-hover/handle:bg-slate-700 dark:group-hover/handle:bg-slate-200 transition-all" />
                          </div>
                          {/* Southeast (corner) resize handle */}
                          <div
                            className={classNames(
                              "absolute -bottom-1 -right-1 w-3.5 h-3.5 cursor-nwse-resize group/handle z-10 flex items-center justify-center",
                              isResizing
                                ? "opacity-100"
                                : "opacity-0 group-hover/area:opacity-100",
                            )}
                            onMouseDown={(e) =>
                              handleResizeStart(
                                e,
                                occupant.id,
                                "se",
                                occupant.colSpan,
                                occupant.rowSpan,
                              )
                            }
                          >
                            <div className="w-2 h-2 bg-slate-600 dark:bg-slate-300 rounded-sm group-hover/handle:scale-125 group-hover/handle:bg-slate-800 dark:group-hover/handle:bg-slate-100 transition-all shadow-sm" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                }

                // Render empty cell
                return (
                  <div
                    key={`cell-${col}-${row}`}
                    className={`rounded border border-dashed transition-all cursor-crosshair ${
                      inSelection
                        ? selectionValid
                          ? "border-slate-600 bg-slate-600/20 dark:border-slate-400 dark:bg-slate-400/20"
                          : "border-slate-400 bg-slate-400/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                    onMouseDown={(e) => handleMouseDown(col, row, e)}
                    onMouseEnter={() => handleMouseEnter(col, row)}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {!inSelection && (
                        <PlusIcon className="w-3 h-3 text-slate-200 dark:text-slate-700" />
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
                className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-medium shadow-sm ${
                  isSelectionValid()
                    ? "bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-800"
                    : "bg-slate-400 text-white"
                }`}
              >
                {Math.abs(dragEnd.col - dragStart.col) + 1} ×{" "}
                {Math.abs(dragEnd.row - dragStart.row) + 1}
              </span>
            </div>
          )}
        </div>

        {/* Legend & Height control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[9px] text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded border border-dashed border-slate-200 dark:border-slate-700" />
              <span>Empty</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-slate-200/60 dark:bg-slate-700/40 border border-slate-400 dark:border-slate-500" />
              <span>Content</span>
            </div>
          </div>
          {/* Height slider */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-400 dark:text-slate-500">
              H
            </span>
            <input
              type="range"
              min={24}
              max={60}
              value={cellHeight}
              onChange={(e) => setCellHeight(Number(e.target.value))}
              className="w-12 h-1 accent-slate-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BentoGridEditor;
