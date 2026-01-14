/**
 * Spacer Block
 * Adds vertical spacing between blocks
 */

import React from 'react';
import { usePageBuilder } from '../../../context/PageBuilderContext';
import type { PageBlock, SpacerContent } from '../../../types';

interface SpacerProps {
  block: PageBlock;
  isPreview?: boolean;
}

const Spacer: React.FC<SpacerProps> = ({ block }) => {
  const { state } = usePageBuilder();
  const content = block.content as unknown as SpacerContent;

  const height =
    state.viewport === 'mobile' && content.mobileHeight
      ? content.mobileHeight
      : content.height;

  return (
    <div
      className="relative"
      style={{ height }}
    >
      {/* Show visual indicator in editor mode */}
      {!state.isPreviewMode && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-8 border-t border-dashed border-slate-300 dark:border-slate-600" />
            <span>{height}px</span>
            <div className="w-8 border-t border-dashed border-slate-300 dark:border-slate-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Spacer;
