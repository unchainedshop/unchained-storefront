/**
 * Text Content Block
 * Rich text content with WYSIWYG formatting
 */

import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import type { PageBlock, TextContentBlock } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import("../../RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded h-24" />
  ),
});

interface TextContentProps {
  block: PageBlock;
  isPreview?: boolean;
}

const TextContent: React.FC<TextContentProps> = ({ block, isPreview }) => {
  const content = block.content as unknown as TextContentBlock;
  const style = block.style;
  const { updateBlock, state } = usePageBuilder();

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    textAlign: style.alignmentX || "left",
  };

  const handleContentChange = useCallback(
    (newContent: string) => {
      updateBlock(block.id, {
        content: { content: newContent },
      });
    },
    [block.id, updateBlock],
  );

  const isEditable = !isPreview && !state.isPreviewMode;

  return (
    <div style={containerStyle} className="max-w-4xl mx-auto">
      {isEditable ? (
        <RichTextEditor
          content={content.content || ""}
          onChange={handleContentChange}
          placeholder="Start typing..."
          className="text-slate-900 dark:text-white"
          editable={isEditable}
        />
      ) : (
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content.content || "" }}
        />
      )}
    </div>
  );
};

export default TextContent;
