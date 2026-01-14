/**
 * Section Block
 * Container block for grouping other blocks
 */

import React from 'react';
import classNames from 'classnames';
import type { PageBlock, SectionContent } from '../../../types';

interface SectionProps {
  block: PageBlock;
  children?: React.ReactNode;
  isPreview?: boolean;
}

const Section: React.FC<SectionProps> = ({ block, children }) => {
  const content = block.content as unknown as SectionContent;
  const style = block.style;

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    margin: style.margin
      ? `${style.margin.top}px ${style.margin.right}px ${style.margin.bottom}px ${style.margin.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
    backgroundImage: style.backgroundImage ? `url(${style.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: style.borderRadius,
    minHeight: style.minHeight,
  };

  const widthClasses = {
    full: 'w-full',
    container: 'max-w-7xl mx-auto',
    narrow: 'max-w-4xl mx-auto',
  };

  return (
    <section style={containerStyle} className="relative">
      {/* Background overlay */}
      {style.backgroundOverlay && style.backgroundOverlay > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: style.backgroundOverlayColor || '#000000',
            opacity: style.backgroundOverlay / 100,
            borderRadius: style.borderRadius,
          }}
        />
      )}

      {/* Content */}
      <div className={classNames('relative', widthClasses[content.containerWidth || 'container'])}>
        {children || (
          <div className="min-h-[100px] flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg m-4">
            <p className="text-sm">Drop blocks here</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Section;
