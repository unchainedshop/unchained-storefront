/**
 * Page Renderer
 * Renders a page from page builder data for frontend display
 */

import React from "react";
import BlockRenderer from "../Blocks/BlockRenderer";
import type { Page, PageBlock } from "../../types";
import { cmsConfig } from "../../../../lib/cms.config";

interface PageRendererProps {
  page: Page;
  className?: string;
  locale?: string;
}

const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  className,
  locale,
}) => {
  const activeLocale = locale || cmsConfig.defaultLocale;

  const renderBlocks = (blocks: PageBlock[]) => {
    return blocks.map((block) => {
      if (block.hidden) return null;

      return (
        <div key={block.id}>
          <BlockRenderer block={block} isPreview locale={activeLocale}>
            {block.children &&
              block.children.length > 0 &&
              renderBlocks(block.children)}
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
