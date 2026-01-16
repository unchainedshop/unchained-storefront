/**
 * Grid Cell Editor
 * Editor for configuring a child block's placement within a Grid
 * Includes position, spanning, and cell-specific styling
 */

import React, { useMemo } from "react";
import classNames from "classnames";
import { useAdminSettings } from "../../../admin/context/AdminSettingsContext";
import type {
  GridChildPlacement,
  GridCellPlacement,
  GridCellStyle,
  GridTemplate,
} from "../../types";

interface GridCellEditorProps {
  placement: GridChildPlacement | null;
  template: GridTemplate;
  onChange: (placement: GridChildPlacement) => void;
  blockId: string;
}

// Compact number input component
const MiniInput: React.FC<{
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}> = ({ value, min, max, onChange, label }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase">
      {label}
    </span>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v >= min && v <= max) {
          onChange(v);
        }
      }}
      className="w-12 px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white text-center"
    />
  </div>
);

// Alignment button group
const AlignmentSelect: React.FC<{
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const options = ["start", "center", "end", "stretch"];
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase">
        {label}
      </span>
      <div className="flex gap-0.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 px-1.5 py-1 text-[9px] rounded transition-colors ${
              value === opt || (!value && opt === "stretch")
                ? "bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {opt.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

const GridCellEditor: React.FC<GridCellEditorProps> = ({
  placement,
  template,
  onChange,
  blockId,
}) => {
  const { settings } = useAdminSettings();
  const maxCols = template.columns.length;
  const maxRows = template.rows.length;

  // Current values with defaults
  const colStart = placement?.placement.colStart || 1;
  const rowStart = placement?.placement.rowStart || 1;
  const colSpan = placement?.placement.colSpan || 1;
  const rowSpan = placement?.placement.rowSpan || 1;
  const cellStyle = placement?.cellStyle || {};

  // Build color presets from admin settings
  const colorPresets = useMemo(() => {
    const result: { color: string; label: string; isBrand?: boolean }[] = [
      { color: settings.primaryColor, label: "Brand", isBrand: true },
      { color: "#ffffff", label: "White" },
      { color: "#f8fafc", label: "Slate 50" },
      { color: "#f1f5f9", label: "Slate 100" },
      { color: "#e2e8f0", label: "Slate 200" },
      { color: "#1e293b", label: "Slate 800" },
      { color: "#0f172a", label: "Slate 900" },
      { color: "#000000", label: "Black" },
    ];
    // Add custom presets from settings
    (settings.colorPresets || []).forEach((preset) => {
      result.push({ color: preset.color, label: preset.name });
    });
    return result;
  }, [settings.primaryColor, settings.colorPresets]);

  const handlePlacementChange = (updates: Partial<GridCellPlacement>) => {
    onChange({
      blockId,
      placement: {
        colStart,
        rowStart,
        colSpan,
        rowSpan,
        ...updates,
      },
      cellStyle: placement?.cellStyle,
    });
  };

  const handleStyleChange = (updates: Partial<GridCellStyle>) => {
    onChange({
      blockId,
      placement: placement?.placement || { colStart: 1, rowStart: 1 },
      cellStyle: {
        ...cellStyle,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Position & Span - combined row */}
      <div>
        <div className="flex items-center gap-4">
          {/* Position */}
          <div className="flex items-center gap-2">
            <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase w-6">
              Pos
            </div>
            <MiniInput
              label="Col"
              value={colStart}
              min={1}
              max={maxCols}
              onChange={(v) => handlePlacementChange({ colStart: v })}
            />
            <MiniInput
              label="Row"
              value={rowStart}
              min={1}
              max={maxRows}
              onChange={(v) => handlePlacementChange({ rowStart: v })}
            />
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Span */}
          <div className="flex items-center gap-2">
            <div className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase w-7">
              Span
            </div>
            <MiniInput
              label="Cols"
              value={colSpan}
              min={1}
              max={maxCols - colStart + 1}
              onChange={(v) => handlePlacementChange({ colSpan: v })}
            />
            <MiniInput
              label="Rows"
              value={rowSpan}
              min={1}
              max={maxRows - rowStart + 1}
              onChange={(v) => handlePlacementChange({ rowSpan: v })}
            />
          </div>
        </div>
        {(colSpan > 1 || rowSpan > 1) && (
          <div className="mt-1.5 text-[9px] text-slate-400 dark:text-slate-500">
            Spanning {colSpan} × {rowSpan} cells
          </div>
        )}
      </div>

      {/* Alignment */}
      <div>
        <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-2">
          Alignment
        </div>
        <div className="space-y-2">
          <AlignmentSelect
            label="Horizontal"
            value={cellStyle.justifySelf}
            onChange={(v) =>
              handleStyleChange({
                justifySelf: v as GridCellStyle["justifySelf"],
              })
            }
          />
          <AlignmentSelect
            label="Vertical"
            value={cellStyle.alignSelf}
            onChange={(v) =>
              handleStyleChange({ alignSelf: v as GridCellStyle["alignSelf"] })
            }
          />
        </div>
      </div>

      {/* Cell Background */}
      <div>
        <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-2">
          Cell Background
        </div>
        {/* Color presets */}
        <div className="flex flex-wrap items-center gap-1 mb-2">
          {colorPresets.map((preset) => {
            const isSelected =
              cellStyle.backgroundColor?.toLowerCase() ===
              preset.color.toLowerCase();
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  handleStyleChange({ backgroundColor: preset.color })
                }
                className={classNames(
                  "w-5 h-5 rounded transition-all hover:scale-110",
                  isSelected
                    ? "ring-2 ring-slate-900 dark:ring-white ring-offset-1"
                    : "ring-1 ring-slate-200 dark:ring-slate-600",
                  preset.isBrand && !isSelected && "ring-amber-400/50",
                )}
                style={{ backgroundColor: preset.color }}
                title={
                  preset.isBrand ? `${preset.label} (Primary)` : preset.label
                }
              />
            );
          })}
        </div>
        {/* Color picker + hex input */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={cellStyle.backgroundColor || "#ffffff"}
            onChange={(e) =>
              handleStyleChange({ backgroundColor: e.target.value })
            }
            className="w-7 h-7 rounded border border-slate-200 dark:border-slate-600 cursor-pointer"
          />
          <input
            type="text"
            value={cellStyle.backgroundColor || ""}
            onChange={(e) =>
              handleStyleChange({
                backgroundColor: e.target.value || undefined,
              })
            }
            placeholder="transparent"
            className="flex-1 px-2 py-1.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 border-0 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 dark:text-white"
          />
          {cellStyle.backgroundColor && (
            <button
              onClick={() => handleStyleChange({ backgroundColor: undefined })}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Z-Index (for overlapping) */}
      <div>
        <div className="text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-2">
          Layer Order
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={cellStyle.zIndex || 0}
            min={-10}
            max={100}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              handleStyleChange({ zIndex: isNaN(v) ? undefined : v });
            }}
            className="w-16 px-2 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white text-center"
          />
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Higher = on top
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded px-2 py-1.5">
          grid-column: {colStart}
          {colSpan > 1 ? ` / span ${colSpan}` : ""}; grid-row: {rowStart}
          {rowSpan > 1 ? ` / span ${rowSpan}` : ""};
        </div>
      </div>
    </div>
  );
};

export default GridCellEditor;
