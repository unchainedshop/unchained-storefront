/**
 * Grid Size Picker
 * Visual grid picker like Figma - hover to select columns × rows
 */

import React, { useState, useCallback } from "react";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

interface GridSizePickerProps {
  columns: number;
  rows: number;
  onChange: (columns: number, rows: number) => void;
  maxColumns?: number;
  maxRows?: number;
}

const GridSizePicker: React.FC<GridSizePickerProps> = ({
  columns,
  rows,
  onChange,
  maxColumns = 8,
  maxRows = 8,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverCell, setHoverCell] = useState<{ col: number; row: number } | null>(null);

  const handleCellHover = useCallback((col: number, row: number) => {
    setHoverCell({ col, row });
  }, []);

  const handleCellClick = useCallback(
    (col: number, row: number) => {
      onChange(col, row);
      setIsOpen(false);
      setHoverCell(null);
    },
    [onChange]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverCell(null);
  }, []);

  const previewCols = hoverCell?.col || columns;
  const previewRows = hoverCell?.row || rows;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <Squares2X2Icon className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {columns} × {rows}
        </span>
        <span className="text-xs text-slate-400 ml-auto">
          {columns * rows} cells
        </span>
      </button>

      {/* Picker dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker panel */}
          <div className="absolute left-0 right-0 mt-2 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
            {/* Preview label */}
            <div className="text-center mb-3">
              <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full text-sm font-medium">
                {previewCols} × {previewRows}
              </span>
            </div>

            {/* Grid picker */}
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${maxColumns}, 1fr)`,
              }}
              onMouseLeave={handleMouseLeave}
            >
              {Array.from({ length: maxRows }).map((_, rowIdx) =>
                Array.from({ length: maxColumns }).map((_, colIdx) => {
                  const col = colIdx + 1;
                  const row = rowIdx + 1;
                  const isInSelection =
                    hoverCell
                      ? col <= hoverCell.col && row <= hoverCell.row
                      : col <= columns && row <= rows;
                  const isCurrentSize = col === columns && row === rows && !hoverCell;

                  return (
                    <button
                      key={`picker-${col}-${row}`}
                      onMouseEnter={() => handleCellHover(col, row)}
                      onClick={() => handleCellClick(col, row)}
                      className={`w-6 h-6 rounded border-2 transition-all ${
                        isInSelection
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
                      } ${isCurrentSize ? "ring-2 ring-blue-300 ring-offset-1" : ""}`}
                    />
                  );
                })
              )}
            </div>

            {/* Quick presets */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-wide">
                Presets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { cols: 2, rows: 1, label: "2×1" },
                  { cols: 2, rows: 2, label: "2×2" },
                  { cols: 3, rows: 2, label: "3×2" },
                  { cols: 3, rows: 3, label: "3×3" },
                  { cols: 4, rows: 2, label: "4×2" },
                  { cols: 4, rows: 3, label: "4×3" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleCellClick(preset.cols, preset.rows)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                      columns === preset.cols && rows === preset.rows
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GridSizePicker;
