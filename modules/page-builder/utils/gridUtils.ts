/**
 * Grid Utilities
 * Helper functions for CSS Grid calculations
 */

import type {
  GridTemplate,
  GridCellPlacement,
  GridChildPlacement,
} from "../types";

/**
 * Calculate which grid cell a point is in
 * Used for drag-and-drop targeting
 */
export function calculateGridCell(
  clientX: number,
  clientY: number,
  gridElement: HTMLElement,
  template: GridTemplate,
): { col: number; row: number } {
  const rect = gridElement.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const cols = template.columns.length;
  const rows = template.rows.length;

  // For simplicity, assume equal cell sizes (works well for fr units)
  // TODO: Calculate actual sizes based on track values
  const cellWidth = rect.width / cols;
  const cellHeight = rect.height / rows;

  return {
    col: Math.max(1, Math.min(Math.floor(x / cellWidth) + 1, cols)),
    row: Math.max(1, Math.min(Math.floor(y / cellHeight) + 1, rows)),
  };
}

/**
 * Check if a placement overlaps with any existing placement
 */
export function hasCollision(
  newPlacement: GridCellPlacement,
  existingPlacements: GridChildPlacement[],
  excludeBlockId?: string,
): boolean {
  const newColEnd = newPlacement.colStart + (newPlacement.colSpan || 1) - 1;
  const newRowEnd = newPlacement.rowStart + (newPlacement.rowSpan || 1) - 1;

  for (const existing of existingPlacements) {
    if (existing.blockId === excludeBlockId) continue;

    const existingColEnd =
      existing.placement.colStart + (existing.placement.colSpan || 1) - 1;
    const existingRowEnd =
      existing.placement.rowStart + (existing.placement.rowSpan || 1) - 1;

    const overlapsCol =
      newPlacement.colStart <= existingColEnd &&
      newColEnd >= existing.placement.colStart;
    const overlapsRow =
      newPlacement.rowStart <= existingRowEnd &&
      newRowEnd >= existing.placement.rowStart;

    if (overlapsCol && overlapsRow) return true;
  }

  return false;
}

/**
 * Find the first empty cell in the grid
 * Used for auto-placement when no specific cell is targeted
 */
export function findFirstEmptyCell(
  template: GridTemplate,
  existingPlacements: GridChildPlacement[],
  autoFlow: "row" | "column" | "dense" = "row",
): { col: number; row: number } | null {
  const cols = template.columns.length;
  const rows = template.rows.length;

  // Create a grid of occupied cells
  const occupied = new Set<string>();
  for (const placement of existingPlacements) {
    const colEnd =
      placement.placement.colStart + (placement.placement.colSpan || 1);
    const rowEnd =
      placement.placement.rowStart + (placement.placement.rowSpan || 1);

    for (let col = placement.placement.colStart; col < colEnd; col++) {
      for (let row = placement.placement.rowStart; row < rowEnd; row++) {
        occupied.add(`${col},${row}`);
      }
    }
  }

  // Find first empty cell based on auto-flow direction
  if (autoFlow === "column") {
    for (let col = 1; col <= cols; col++) {
      for (let row = 1; row <= rows; row++) {
        if (!occupied.has(`${col},${row}`)) {
          return { col, row };
        }
      }
    }
  } else {
    // Default: row-based flow
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        if (!occupied.has(`${col},${row}`)) {
          return { col, row };
        }
      }
    }
  }

  return null; // Grid is full
}

/**
 * Check if a placement is valid within the grid bounds
 */
export function isValidPlacement(
  placement: GridCellPlacement,
  template: GridTemplate,
): boolean {
  const cols = template.columns.length;
  const rows = template.rows.length;

  const colEnd = placement.colStart + (placement.colSpan || 1) - 1;
  const rowEnd = placement.rowStart + (placement.rowSpan || 1) - 1;

  return (
    placement.colStart >= 1 &&
    placement.colStart <= cols &&
    placement.rowStart >= 1 &&
    placement.rowStart <= rows &&
    colEnd <= cols &&
    rowEnd <= rows
  );
}

/**
 * Get all occupied cells as a Set of "col,row" strings
 */
export function getOccupiedCells(
  placements: GridChildPlacement[],
): Set<string> {
  const occupied = new Set<string>();

  for (const placement of placements) {
    const colEnd =
      placement.placement.colStart + (placement.placement.colSpan || 1);
    const rowEnd =
      placement.placement.rowStart + (placement.placement.rowSpan || 1);

    for (let col = placement.placement.colStart; col < colEnd; col++) {
      for (let row = placement.placement.rowStart; row < rowEnd; row++) {
        occupied.add(`${col},${row}`);
      }
    }
  }

  return occupied;
}

/**
 * Clamp a placement to fit within grid bounds
 */
export function clampPlacement(
  placement: GridCellPlacement,
  template: GridTemplate,
): GridCellPlacement {
  const cols = template.columns.length;
  const rows = template.rows.length;

  const colStart = Math.max(1, Math.min(placement.colStart, cols));
  const rowStart = Math.max(1, Math.min(placement.rowStart, rows));
  const colSpan = Math.max(1, Math.min(placement.colSpan || 1, cols - colStart + 1));
  const rowSpan = Math.max(1, Math.min(placement.rowSpan || 1, rows - rowStart + 1));

  return { colStart, rowStart, colSpan, rowSpan };
}

/**
 * Remove placements for blocks that no longer exist
 */
export function cleanupPlacements(
  placements: GridChildPlacement[],
  validBlockIds: string[],
): GridChildPlacement[] {
  const validSet = new Set(validBlockIds);
  return placements.filter((p) => validSet.has(p.blockId));
}

/**
 * Create a default placement for a new block
 */
export function createDefaultPlacement(
  blockId: string,
  col: number,
  row: number,
): GridChildPlacement {
  return {
    blockId,
    placement: {
      colStart: col,
      rowStart: row,
      colSpan: 1,
      rowSpan: 1,
    },
  };
}
