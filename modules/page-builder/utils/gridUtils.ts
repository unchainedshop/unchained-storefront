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
 * Parse computed grid track sizes from getComputedStyle
 * Returns array of pixel values for each track
 */
function parseComputedTracks(computedValue: string): number[] {
  if (!computedValue || computedValue === "none") return [];
  // Computed grid-template-columns/rows returns space-separated pixel values
  // e.g., "200px 150px 200px" or "100px 1fr 100px" becomes "100px 200px 100px"
  return computedValue
    .split(/\s+/)
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v) && v > 0);
}

/**
 * Get actual track sizes from computed styles or fall back to equal distribution
 */
function getTrackSizes(
  gridElement: HTMLElement,
  template: GridTemplate,
  dimension: "columns" | "rows",
): number[] {
  const computedStyle = window.getComputedStyle(gridElement);
  const property =
    dimension === "columns" ? "gridTemplateColumns" : "gridTemplateRows";
  const computedTracks = parseComputedTracks(computedStyle[property]);

  const expectedCount = template[dimension].length;

  // Use computed values if they match expected track count
  if (computedTracks.length === expectedCount) {
    return computedTracks;
  }

  // Fall back to equal distribution
  const rect = gridElement.getBoundingClientRect();
  const totalSize = dimension === "columns" ? rect.width : rect.height;
  const gap = parseFloat(computedStyle.gap) || 0;
  const totalGap = gap * (expectedCount - 1);
  const trackSize = (totalSize - totalGap) / expectedCount;

  return Array(expectedCount).fill(trackSize);
}

/**
 * Calculate which grid cell a point is in
 * Uses computed grid track sizes for accurate targeting with any track values
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

  const computedStyle = window.getComputedStyle(gridElement);
  const gap = parseFloat(computedStyle.gap) || 0;

  const colSizes = getTrackSizes(gridElement, template, "columns");
  const rowSizes = getTrackSizes(gridElement, template, "rows");

  // Find column by accumulating widths
  let col = 1;
  let accumulatedX = 0;
  for (let i = 0; i < colSizes.length; i++) {
    accumulatedX += colSizes[i] + (i > 0 ? gap : 0);
    if (x < accumulatedX) {
      col = i + 1;
      break;
    }
    col = i + 1;
  }

  // Find row by accumulating heights
  let row = 1;
  let accumulatedY = 0;
  for (let i = 0; i < rowSizes.length; i++) {
    accumulatedY += rowSizes[i] + (i > 0 ? gap : 0);
    if (y < accumulatedY) {
      row = i + 1;
      break;
    }
    row = i + 1;
  }

  return {
    col: Math.max(1, Math.min(col, template.columns.length)),
    row: Math.max(1, Math.min(row, template.rows.length)),
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
  const colSpan = Math.max(
    1,
    Math.min(placement.colSpan || 1, cols - colStart + 1),
  );
  const rowSpan = Math.max(
    1,
    Math.min(placement.rowSpan || 1, rows - rowStart + 1),
  );

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
