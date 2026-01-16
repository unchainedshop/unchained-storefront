/**
 * Spacer Block
 * Adds vertical spacing between blocks using Tailwind spacing scale
 */

import React from "react";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import type { PageBlock, SpacerContent } from "../../../types";

interface SpacerProps {
  block: PageBlock;
  isPreview?: boolean;
}

// Tailwind spacing presets
const spacingPresets: Record<number, string> = {
  8: "XS",
  16: "S",
  24: "M",
  32: "L",
  48: "XL",
  64: "2XL",
  96: "3XL",
  128: "4XL",
};

const Spacer: React.FC<SpacerProps> = ({ block }) => {
  const { state } = usePageBuilder();
  const content = block.content as unknown as SpacerContent;

  const height =
    state.viewport === "mobile" && content.mobileHeight
      ? content.mobileHeight
      : content.height || 48;

  const sizeLabel = spacingPresets[height] || `${height}px`;

  return (
    <div
      className="relative w-full flex-shrink-0 flex-grow-0"
      style={{ height: `${height}px`, minHeight: `${height}px`, flex: "none" }}
    >
      {/* Show visual indicator in editor mode */}
      {!state.isPreviewMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-8 border-t border-dashed border-slate-300 dark:border-slate-600" />
            <span className="font-medium">{sizeLabel}</span>
            <div className="w-8 border-t border-dashed border-slate-300 dark:border-slate-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Spacer;
