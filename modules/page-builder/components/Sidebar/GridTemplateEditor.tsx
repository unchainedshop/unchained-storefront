/**
 * Grid Template Editor
 * Visual editor for CSS Grid template configuration
 * Features:
 * - Visual grid size picker (like Figma)
 * - Bento-style drag-to-select for creating areas
 * - Track size editing
 */

import React, { useState, useMemo } from "react";
import {
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import type {
  GridTemplate,
  GridTrackSize,
  GridChildPlacement,
} from "../../types";
import GridSizePicker from "./GridSizePicker";
import BentoGridEditor from "./BentoGridEditor";

interface GridTemplateEditorProps {
  template: GridTemplate;
  onChange: (template: GridTemplate) => void;
  placements?: GridChildPlacement[];
  onAreaCreate?: (area: {
    colStart: number;
    rowStart: number;
    colSpan: number;
    rowSpan: number;
  }) => void;
  onAreaClick?: (blockId: string) => void;
  onAreaDelete?: (blockId: string) => void;
  selectedBlockId?: string | null;
  // Legacy props for compatibility
  selectedCell?: { col: number; row: number } | null;
  onCellSelect?: (col: number, row: number) => void;
  occupiedCells?: Set<string>;
}

const TRACK_SIZE_PRESETS: { value: GridTrackSize; label: string }[] = [
  { value: "1fr", label: "1fr" },
  { value: "2fr", label: "2fr" },
  { value: "auto", label: "auto" },
  { value: "min-content", label: "min" },
  { value: "max-content", label: "max" },
];

const GridTemplateEditor: React.FC<GridTemplateEditorProps> = ({
  template,
  onChange,
  placements = [],
  onAreaCreate,
  onAreaClick,
  onAreaDelete,
  selectedBlockId,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editingTrack, setEditingTrack] = useState<{
    type: "column" | "row";
    index: number;
  } | null>(null);

  const columns = template.columns || ["1fr", "1fr"];
  const rows = template.rows || ["1fr"];

  // Handle grid size change from picker
  const handleSizeChange = (newCols: number, newRows: number) => {
    const newColumns: GridTrackSize[] = Array.from(
      { length: newCols },
      (_, i) => columns[i] || "1fr",
    );
    const newRowsArr: GridTrackSize[] = Array.from(
      { length: newRows },
      (_, i) => rows[i] || "1fr",
    );
    onChange({
      ...template,
      columns: newColumns,
      rows: newRowsArr,
    });
  };

  const handleTrackSizeChange = (
    type: "column" | "row",
    index: number,
    size: GridTrackSize,
  ) => {
    if (type === "column") {
      const newColumns = [...columns];
      newColumns[index] = size;
      onChange({ ...template, columns: newColumns });
    } else {
      const newRows = [...rows];
      newRows[index] = size;
      onChange({ ...template, rows: newRows });
    }
  };

  // Handle bento area creation
  const handleAreaCreate = (area: {
    colStart: number;
    rowStart: number;
    colSpan: number;
    rowSpan: number;
  }) => {
    onAreaCreate?.(area);
  };

  return (
    <div className="space-y-4">
      {/* Grid Size Picker */}
      <div>
        <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-2">
          Grid Size
        </label>
        <GridSizePicker
          columns={columns.length}
          rows={rows.length}
          onChange={handleSizeChange}
        />
      </div>

      {/* Bento Grid Editor */}
      {onAreaCreate && (
        <div>
          <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-2">
            Layout Areas
          </label>
          <BentoGridEditor
            columns={columns.length}
            rows={rows.length}
            placements={placements}
            onAreaCreate={handleAreaCreate}
            onAreaClick={onAreaClick || (() => {})}
            onAreaDelete={onAreaDelete}
            selectedBlockId={selectedBlockId}
          />
        </div>
      )}

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <Cog6ToothIcon className="w-4 h-4" />
        <span>Track Sizes</span>
        {showAdvanced ? (
          <ChevronUpIcon className="w-3 h-3 ml-auto" />
        ) : (
          <ChevronDownIcon className="w-3 h-3 ml-auto" />
        )}
      </button>

      {/* Advanced Track Size Controls */}
      {showAdvanced && (
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          {/* Column sizes */}
          <div>
            <p className="text-[10px] text-slate-400 mb-2">Column widths</p>
            <div className="flex flex-wrap gap-1">
              {columns.map((size, idx) => (
                <button
                  key={`col-size-${idx}`}
                  onClick={() =>
                    setEditingTrack(
                      editingTrack?.type === "column" &&
                        editingTrack.index === idx
                        ? null
                        : { type: "column", index: idx },
                    )
                  }
                  className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                    editingTrack?.type === "column" &&
                    editingTrack.index === idx
                      ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  C{idx + 1}: {size}
                </button>
              ))}
            </div>
          </div>

          {/* Row sizes */}
          <div>
            <p className="text-[10px] text-slate-400 mb-2">Row heights</p>
            <div className="flex flex-wrap gap-1">
              {rows.map((size, idx) => (
                <button
                  key={`row-size-${idx}`}
                  onClick={() =>
                    setEditingTrack(
                      editingTrack?.type === "row" && editingTrack.index === idx
                        ? null
                        : { type: "row", index: idx },
                    )
                  }
                  className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                    editingTrack?.type === "row" && editingTrack.index === idx
                      ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  R{idx + 1}: {size.replace("-content", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Track size presets */}
          {editingTrack && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-400 mb-2">
                Set {editingTrack.type === "column" ? "column" : "row"}{" "}
                {editingTrack.index + 1} size:
              </p>
              <div className="flex flex-wrap gap-1">
                {TRACK_SIZE_PRESETS.map((preset) => {
                  const currentSize =
                    editingTrack.type === "column"
                      ? columns[editingTrack.index]
                      : rows[editingTrack.index];
                  return (
                    <button
                      key={preset.value}
                      onClick={() =>
                        handleTrackSizeChange(
                          editingTrack.type,
                          editingTrack.index,
                          preset.value,
                        )
                      }
                      className={`px-2.5 py-1 text-[10px] rounded transition-colors ${
                        currentSize === preset.value
                          ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GridTemplateEditor;
