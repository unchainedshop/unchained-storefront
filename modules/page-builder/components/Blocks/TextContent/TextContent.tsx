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

  // Default horizontal padding of 1.5rem (24px) for text rhythm
  const defaultPadding = { top: 0, right: 24, bottom: 0, left: 24 };
  const padding = {
    top: style.padding?.top ?? defaultPadding.top,
    right: style.padding?.right || defaultPadding.right,
    bottom: style.padding?.bottom ?? defaultPadding.bottom,
    left: style.padding?.left || defaultPadding.left,
  };

  const containerStyle: React.CSSProperties = {
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
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
    <div
      style={{
        ...containerStyle,
        flex: 1,
        minHeight: 0,
        display: "grid",
        alignContent: "center",
      }}
      className="w-full"
    >
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
