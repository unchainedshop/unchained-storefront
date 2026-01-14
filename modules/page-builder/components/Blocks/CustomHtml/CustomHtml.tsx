/**
 * Custom HTML Block
 * Renders custom HTML content (use with caution)
 */

import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import type { PageBlock, CustomHtmlContent } from '../../../types';

interface CustomHtmlProps {
  block: PageBlock;
  isPreview?: boolean;
}

const CustomHtml: React.FC<CustomHtmlProps> = ({ block, isPreview }) => {
  const content = block.content as CustomHtmlContent;
  const style = block.style;

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  // In preview mode, show placeholder for safety
  if (!content.html || content.html.trim() === '') {
    return (
      <div style={containerStyle}>
        <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
          <CodeBracketIcon className="w-12 h-12 mb-2" />
          <p className="text-sm">Custom HTML Block</p>
          <p className="text-xs">Add your HTML in the settings panel</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Custom CSS */}
      {content.css && <style dangerouslySetInnerHTML={{ __html: content.css }} />}

      {/* Custom HTML */}
      <div
        className="custom-html-content"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </div>
  );
};

export default CustomHtml;
