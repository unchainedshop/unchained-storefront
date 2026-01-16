/**
 * Page Renderer
 * Renders a page from page builder data for frontend display
 */

import React, { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize scroll reveal observer for animated cells
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(
      "[data-scroll-reveal]",
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const once = element.dataset.once !== "false";

          if (entry.isIntersecting) {
            element.classList.add("is-visible");
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            element.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [page.blocks]);

  const renderBlocks = (blocks: PageBlock[]) => {
    return blocks.map((block) => {
      if (block.hidden) return null;

      const isFullWidth = block.style?.fullWidth;

      return (
        <div
          key={block.id}
          className={isFullWidth ? "full-width-block" : undefined}
          style={
            isFullWidth
              ? {
                  width: "100vw",
                  marginLeft: "calc(-50vw + 50%)",
                  maxWidth: "none",
                }
              : undefined
          }
        >
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
    <div ref={containerRef} className={className}>
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
