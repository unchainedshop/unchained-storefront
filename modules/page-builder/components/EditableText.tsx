/**
 * EditableText Component
 * Inline editable text using contentEditable
 */

import React, { useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { usePageBuilder } from "../context/PageBuilderContext";

interface EditableTextProps {
  blockId: string;
  field: string; // The content field to update (e.g., "content", "title", "subtitle")
  value: string;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  blockId,
  field,
  value,
  tag: Tag = "p",
  className,
  style,
  placeholder = "Click to edit...",
}) => {
  const { state, updateBlock } = usePageBuilder();
  const elementRef = useRef<HTMLElement>(null);
  const isTypingRef = useRef(false);

  const isEditing = !state.isPreviewMode;

  // Set initial content on mount only
  useLayoutEffect(() => {
    if (elementRef.current && !isTypingRef.current) {
      const currentText = elementRef.current.innerText;
      if (currentText !== value) {
        elementRef.current.innerText = value || "";
      }
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!elementRef.current) return;

    isTypingRef.current = true;
    const newValue = elementRef.current.innerText;

    // Only pass the field being updated - the reducer handles locale merging
    updateBlock(blockId, {
      content: { [field]: newValue },
    });

    // Reset typing flag after React has re-rendered
    requestAnimationFrame(() => {
      isTypingRef.current = false;
    });
  }, [blockId, field, updateBlock]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Prevent Enter from creating new lines in single-line elements
      if (e.key === "Enter" && !e.shiftKey) {
        if (Tag !== "p" && Tag !== "div") {
          e.preventDefault();
          elementRef.current?.blur();
        }
      }
    },
    [Tag],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    // Paste as plain text only
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  const handleFocus = useCallback((e: React.FocusEvent) => {
    // Stop propagation to prevent block selection from interfering
    e.stopPropagation();
  }, []);

  if (!isEditing) {
    // In preview mode, just render the text normally
    return (
      <Tag className={className} style={style}>
        {value || placeholder}
      </Tag>
    );
  }

  const Element = Tag as any;

  // Don't render value as children - it causes React to update DOM and reset cursor
  // The useLayoutEffect handles setting/updating the content
  return (
    <Element
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      className={className}
      dir="ltr"
      style={{
        ...style,
        outline: "none",
        cursor: "text",
        minHeight: "1em",
        unicodeBidi: "plaintext",
        textAlign: style?.textAlign || "inherit",
      }}
      data-placeholder={!value ? placeholder : undefined}
    />
  );
};

export default EditableText;
