/**
 * EditableText Component
 * Inline editable text using contentEditable
 */

import React, { useRef, useEffect, useCallback } from "react";
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
  const { state, updateBlock, selectedBlock } = usePageBuilder();
  const elementRef = useRef<HTMLElement>(null);
  const isUpdatingRef = useRef(false);

  const isEditing = !state.isPreviewMode;

  // Update the DOM when value changes externally (only on mount or external changes)
  useEffect(() => {
    if (elementRef.current && !isUpdatingRef.current) {
      // Only update if the DOM content is truly different (not just during typing)
      const currentText = elementRef.current.innerText;
      if (currentText !== value && currentText !== (value || "")) {
        elementRef.current.innerText = value || "";
      }
    }
  }, [value]);

  // Set initial value on mount
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.innerText = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = useCallback(() => {
    if (!elementRef.current) return;

    isUpdatingRef.current = true;
    const newValue = elementRef.current.innerText;

    // Update the block content using the updateBlock method
    const currentContent =
      selectedBlock?.id === blockId
        ? selectedBlock.content
        : ({} as Record<string, unknown>);
    updateBlock(blockId, {
      content: { ...currentContent, [field]: newValue } as any,
    });

    // Reset the flag after a short delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  }, [blockId, field, updateBlock, selectedBlock]);

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
      style={{
        ...style,
        outline: "none",
        cursor: "text",
        minHeight: "1em",
      }}
      data-placeholder={!value ? placeholder : undefined}
    />
  );
};

export default EditableText;
