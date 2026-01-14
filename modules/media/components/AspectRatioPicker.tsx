/**
 * AspectRatioPicker Component
 * Visual aspect ratio selector with preview icons
 */

import React from "react";
import classNames from "classnames";

export type AspectRatioOption =
  | "original"
  | "1:1"
  | "4:3"
  | "3:2"
  | "16:9"
  | "21:9"
  | "9:16";

interface AspectRatioPickerProps {
  value: AspectRatioOption;
  onChange: (ratio: AspectRatioOption) => void;
  /** Only show landscape ratios */
  landscapeOnly?: boolean;
  /** Only show these specific ratios */
  options?: AspectRatioOption[];
  className?: string;
}

const aspectRatioData: Record<
  AspectRatioOption,
  { label: string; width: number; height: number }
> = {
  original: { label: "Original", width: 4, height: 3 },
  "1:1": { label: "Square", width: 1, height: 1 },
  "4:3": { label: "4:3", width: 4, height: 3 },
  "3:2": { label: "3:2", width: 3, height: 2 },
  "16:9": { label: "16:9", width: 16, height: 9 },
  "21:9": { label: "21:9", width: 21, height: 9 },
  "9:16": { label: "Portrait", width: 9, height: 16 },
};

const AspectRatioPicker: React.FC<AspectRatioPickerProps> = ({
  value,
  onChange,
  landscapeOnly = false,
  options,
  className,
}) => {
  const availableOptions =
    options ||
    (landscapeOnly
      ? (["original", "1:1", "4:3", "16:9", "21:9"] as AspectRatioOption[])
      : (["original", "1:1", "4:3", "16:9", "21:9", "9:16"] as AspectRatioOption[]));

  return (
    <div className={classNames("flex flex-wrap gap-1.5", className)}>
      {availableOptions.map((ratio) => {
        const data = aspectRatioData[ratio];
        const isSelected = value === ratio;

        // Calculate preview box dimensions (max 24px)
        const maxSize = 20;
        const aspectRatio = data.width / data.height;
        let previewWidth: number;
        let previewHeight: number;

        if (aspectRatio >= 1) {
          previewWidth = maxSize;
          previewHeight = maxSize / aspectRatio;
        } else {
          previewHeight = maxSize;
          previewWidth = maxSize * aspectRatio;
        }

        return (
          <button
            key={ratio}
            type="button"
            onClick={() => onChange(ratio)}
            className={classNames(
              "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all",
              isSelected
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
            title={data.label}
          >
            {/* Visual preview */}
            <div
              className="flex items-center justify-center"
              style={{ width: maxSize, height: maxSize }}
            >
              <div
                className={classNames(
                  "rounded-sm transition-colors",
                  isSelected
                    ? "bg-white/80 dark:bg-slate-900/80"
                    : "bg-slate-400 dark:bg-slate-500"
                )}
                style={{
                  width: previewWidth,
                  height: previewHeight,
                }}
              />
            </div>
            {/* Label */}
            <span className="text-[10px] font-medium leading-none">
              {ratio === "original" ? "Auto" : ratio}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default AspectRatioPicker;
