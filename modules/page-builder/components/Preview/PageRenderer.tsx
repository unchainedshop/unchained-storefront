/**
 * Page Renderer
 * Renders a page from page builder data for frontend display
 */

import React from 'react';
import BlockRenderer from '../Blocks/BlockRenderer';
import type { Page, PageBlock } from '../../types';

interface PageRendererProps {
  page: Page;
  className?: string;
}

const PageRenderer: React.FC<PageRendererProps> = ({ page, className }) => {
  const renderBlocks = (blocks: PageBlock[]) => {
    return blocks.map((block) => {
      if (block.hidden) return null;

      return (
        <div key={block.id}>
          <BlockRenderer block={block} isPreview>
            {block.children && block.children.length > 0 && renderBlocks(block.children)}
          </BlockRenderer>
        </div>
      );
    });
  };

  return (
    <div className={className}>
      {page.blocks.length > 0 ? (
        renderBlocks(page.blocks)
      ) : (
        <div className="min-h-[400px] flex items-center justify-center text-slate-500">
          This page has no content yet.
        </div>
      )}
    </div>
  );
};

export default PageRenderer;
