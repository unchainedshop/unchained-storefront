/**
 * InlineRichText Component
 * Lightweight inline editable rich text using TipTap
 * Designed for use within blocks for headings, descriptions, etc.
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import classNames from "classnames";
import { usePageBuilder } from "../context/PageBuilderContext";

interface InlineRichTextProps {
  blockId: string;
  field: string;
  value: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  /** Allow multi-line content (default: false for headings, true for paragraphs) */
  multiline?: boolean;
  /** Enable link editing (default: true) */
  enableLinks?: boolean;
  /** Callback for nested field updates (e.g., features[0].title) */
  onUpdate?: (value: string) => void;
}

const InlineRichText: React.FC<InlineRichTextProps> = ({
  blockId,
  field,
  value,
  tag: Tag = "p",
  className,
  style,
  placeholder = "Click to edit...",
  multiline,
  enableLinks = true,
  onUpdate,
}) => {
  const { state, updateBlock } = usePageBuilder();
  const isEditing = !state.isPreviewMode;

  // Determine if multiline based on tag if not explicitly set
  const allowMultiline = multiline ?? (Tag === "p" || Tag === "div");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable features we don't need for inline editing
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      ...(enableLinks
        ? [
            Link.configure({
              openOnClick: false,
              HTMLAttributes: {
                class: "text-pink-600 underline hover:text-pink-700",
              },
            }),
          ]
        : []),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
    ],
    content: value || "",
    editable: isEditing,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Strip wrapper tags for simple content
      const cleanedHtml = html
        .replace(/^<p>/, "")
        .replace(/<\/p>$/, "")
        .replace(/<p><\/p>/g, "<br>");

      if (onUpdate) {
        onUpdate(cleanedHtml);
      } else {
        updateBlock(blockId, {
          content: { [field]: cleanedHtml },
        });
      }
    },
    editorProps: {
      attributes: {
        class: "outline-none",
      },
      handleKeyDown: (view, event) => {
        // Prevent Enter in single-line mode
        if (!allowMultiline && event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHtml = editor.getHTML();
      const cleanedCurrent = currentHtml
        .replace(/^<p>/, "")
        .replace(/<\/p>$/, "")
        .replace(/<p><\/p>/g, "<br>");

      if (cleanedCurrent !== value) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [editor, isEditing]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Preview mode - render static HTML
  if (!isEditing) {
    return (
      <Tag
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: value || placeholder }}
      />
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <Tag
      className={classNames("inline-rich-text", className)}
      style={{
        ...style,
        cursor: "text",
      }}
    >
      {/* Bubble Menu - appears when text is selected */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 p-1 bg-slate-900 rounded-lg shadow-xl"
      >
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={classNames(
            "p-1.5 rounded transition-colors",
            editor.isActive("bold")
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          title="Bold (Ctrl+B)"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={classNames(
            "p-1.5 rounded transition-colors",
            editor.isActive("italic")
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          title="Italic (Ctrl+I)"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4h4l-2 16h-4z M14 4l2 0 M8 20l2 0" />
          </svg>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={classNames(
            "p-1.5 rounded transition-colors",
            editor.isActive("underline")
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          title="Underline (Ctrl+U)"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
            <path d="M4 21h16" />
          </svg>
        </button>

        {/* Strike */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={classNames(
            "p-1.5 rounded transition-colors",
            editor.isActive("strike")
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          title="Strikethrough"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M16 4H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H8" />
            <path d="M4 12h16" />
          </svg>
        </button>

        {/* Link */}
        {enableLinks && (
          <>
            <div className="w-px h-4 bg-slate-600 mx-0.5" />
            <button
              type="button"
              onClick={setLink}
              className={classNames(
                "p-1.5 rounded transition-colors",
                editor.isActive("link")
                  ? "bg-white/20 text-white"
                  : "text-slate-300 hover:text-white hover:bg-white/10",
              )}
              title="Add Link"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>

            {/* Unlink */}
            {editor.isActive("link") && (
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Remove Link"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.84 12.25l1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M5.16 11.75l-1.72 1.71a5 5 0 0 0 7.07 7.07l1.72-1.71" />
                  <path d="M8 2l2 2 M14 20l2 2 M2 8l2 2 M20 14l2 2" />
                </svg>
              </button>
            )}
          </>
        )}
      </BubbleMenu>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Minimal styles */}
      <style jsx global>{`
        .inline-rich-text .ProseMirror {
          outline: none;
          white-space: ${allowMultiline ? "normal" : "nowrap"};
        }

        .inline-rich-text .ProseMirror p {
          margin: 0;
        }

        .inline-rich-text .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: currentColor;
          opacity: 0.4;
          pointer-events: none;
          height: 0;
        }

        .inline-rich-text .ProseMirror a {
          color: inherit;
          text-decoration: underline;
        }

        .inline-rich-text .ProseMirror a:hover {
          opacity: 0.8;
        }
      `}</style>
    </Tag>
  );
};

export default InlineRichText;
