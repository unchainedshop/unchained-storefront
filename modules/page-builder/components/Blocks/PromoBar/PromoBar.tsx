/**
 * Promo Bar Block
 * Full-width promotional banner
 */

import React, { useState } from "react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { PageBlock, PromoBarContent } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import InlineRichText from "../../InlineRichText";

interface PromoBarProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const PromoBar: React.FC<PromoBarProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as unknown as PromoBarContent;
  const style = block.style;
  const [isDismissed, setIsDismissed] = useState(false);
  const { state } = usePageBuilder();
  const canEdit = isEditing && !state.isPreviewMode;

  if (isDismissed) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor || "#1e293b",
    textAlign: style.alignmentX || "center",
  };

  // In edit mode, don't wrap with link so users can click to edit
  const ContentWrapper =
    content.link && !canEdit
      ? ({ children }: { children: React.ReactNode }) => (
          <Link
            href={isPreview ? "#" : content.link!}
            className="hover:opacity-80 transition-opacity"
          >
            {children}
          </Link>
        )
      : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <div style={containerStyle} className="relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <ContentWrapper>
          <div
            className="text-sm font-medium flex items-center"
            style={{ color: style.textColor || "#ffffff" }}
          >
            {content.icon && <span className="mr-2">{content.icon}</span>}
            <InlineRichText
              blockId={block.id}
              field="text"
              value={content.text || ""}
              tag="span"
              style={{ color: style.textColor || "#ffffff" }}
              placeholder="Promo text..."
              multiline={false}
              enableLinks={!content.link}
            />
            {content.link && !canEdit && (
              <span className="ml-2 underline">Learn more →</span>
            )}
          </div>
        </ContentWrapper>

        {content.dismissible && !canEdit && (
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            style={{ color: style.textColor || "#ffffff" }}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PromoBar;
