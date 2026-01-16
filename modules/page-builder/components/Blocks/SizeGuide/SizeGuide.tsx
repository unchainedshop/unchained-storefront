/**
 * Size Guide Block
 * Interactive size chart with measurement table and how-to-measure guide
 */

import React, { useState } from "react";
import {
  TableCellsIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type { PageBlock, SizeGuideContent } from "../../../types";

interface SizeGuideProps {
  block: PageBlock;
  isPreview?: boolean;
}

const SizeGuide: React.FC<SizeGuideProps> = ({ block, isPreview }) => {
  const content = block.content as unknown as SizeGuideContent;
  const style = block.style;

  const [unit, setUnit] = useState<"cm" | "in">(content.unit);
  const [showMeasureGuide, setShowMeasureGuide] = useState(false);

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    borderRadius: style.borderRadius,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  // Convert measurements between units
  const convertMeasurement = (value: string): string => {
    if (!value || unit === content.unit) return value;

    const num = parseFloat(value);
    if (isNaN(num)) return value;

    if (unit === "in" && content.unit === "cm") {
      return (num / 2.54).toFixed(1);
    } else if (unit === "cm" && content.unit === "in") {
      return (num * 2.54).toFixed(1);
    }
    return value;
  };

  const tableStyles = {
    simple: "",
    striped:
      "[&_tbody_tr:nth-child(odd)]:bg-slate-50 dark:[&_tbody_tr:nth-child(odd)]:bg-slate-800/50",
    bordered:
      "border border-slate-200 dark:border-slate-700 [&_th]:border [&_th]:border-slate-200 dark:[&_th]:border-slate-700 [&_td]:border [&_td]:border-slate-200 dark:[&_td]:border-slate-700",
  };

  // Empty state
  if (content.sizes.length === 0 && content.measurementColumns.length === 0) {
    return (
      <div
        style={containerStyle}
        className="flex flex-col items-center justify-center py-16 px-4 bg-periwinkle-50/30 dark:bg-periwinkle-500/5 rounded-xl border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50"
      >
        <TableCellsIcon className="w-12 h-12 text-periwinkle-400 dark:text-periwinkle-300 mb-3" />
        <p className="text-periwinkle-400 dark:text-periwinkle-300 text-sm font-medium">
          Configure size measurements in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="space-y-6">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="text-center">
          {content.heading && (
            <h3 className="text-2xl font-bold mb-2">{content.heading}</h3>
          )}
          {content.subheading && (
            <p className="text-slate-600 dark:text-slate-400">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Unit Toggle */}
        {content.showUnitToggle && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Unit:
            </span>
            <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setUnit("cm")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  unit === "cm"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit("in")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  unit === "in"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                IN
              </button>
            </div>
          </div>
        )}

        {/* How to Measure Toggle */}
        {content.showHowToMeasure && content.howToMeasureContent && (
          <button
            onClick={() => setShowMeasureGuide(!showMeasureGuide)}
            className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <InformationCircleIcon className="w-4 h-4" />
            How to measure
          </button>
        )}
      </div>

      {/* How to Measure Guide */}
      {showMeasureGuide && content.howToMeasureContent && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div className="flex gap-6 flex-col md:flex-row">
            {content.howToMeasureImage && (
              <div className="md:w-1/3">
                <img
                  src={content.howToMeasureImage}
                  alt="How to measure"
                  className="w-full rounded-lg"
                />
              </div>
            )}
            <div className={content.howToMeasureImage ? "md:w-2/3" : "w-full"}>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: content.howToMeasureContent,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Size Table */}
      <div className="overflow-x-auto">
        <table
          className={`w-full text-sm ${tableStyles[content.tableStyle || "simple"]}`}
        >
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                Size
              </th>
              {content.measurementColumns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100"
                >
                  {col} ({unit.toUpperCase()})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.sizes.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {row.size}
                </td>
                {content.measurementColumns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-3 text-slate-600 dark:text-slate-400"
                  >
                    {convertMeasurement(row.measurements[col] || "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state for no sizes in editor */}
      {!isPreview && content.sizes.length === 0 && (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
          Add size rows in the settings panel
        </div>
      )}
    </div>
  );
};

export default SizeGuide;
