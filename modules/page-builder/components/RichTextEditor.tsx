/**
 * RichTextEditor Component
 * WYSIWYG editor with formatting toolbar using TipTap
 */

import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import classNames from "classnames";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start typing...",
  className,
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-pink-600 underline hover:text-pink-700",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[100px]",
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

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

  if (!editor) {
    return null;
  }

  return (
    <div className={classNames("rich-text-editor", className)}>
      {/* Bubble Menu - appears when text is selected */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 p-1.5 bg-slate-900 rounded-lg shadow-xl"
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
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
            className="w-4 h-4"
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
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M16 4H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H8" />
            <path d="M4 12h16" />
          </svg>
        </button>

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Link */}
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
            className="w-4 h-4"
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
              className="w-4 h-4"
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

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Heading dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
          >
            <span className="text-xs font-semibold">
              {editor.isActive("heading", { level: 1 })
                ? "H1"
                : editor.isActive("heading", { level: 2 })
                  ? "H2"
                  : editor.isActive("heading", { level: 3 })
                    ? "H3"
                    : editor.isActive("heading", { level: 4 })
                      ? "H4"
                      : "¶"}
            </span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-slate-800 rounded-lg shadow-xl py-1 min-w-[100px] z-10">
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={classNames(
                "w-full px-3 py-1.5 text-left text-sm hover:bg-slate-700",
                editor.isActive("paragraph") ? "text-white" : "text-slate-300",
              )}
            >
              Paragraph
            </button>
            {[1, 2, 3, 4].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
                    .run()
                }
                className={classNames(
                  "w-full px-3 py-1.5 text-left text-sm hover:bg-slate-700",
                  editor.isActive("heading", { level })
                    ? "text-white"
                    : "text-slate-300",
                )}
              >
                Heading {level}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-slate-600 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={classNames(
            "p-1.5 rounded transition-colors",
            editor.isActive("bulletList")
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          title="Bullet List"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01" />
          </svg>
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={classNames(
            "p-1.5 rounded transition-colors",
            editor.isActive("orderedList")
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          title="Numbered List"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M10 6h11 M10 12h11 M10 18h11 M4 6h1v4 M4 10h2 M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
          </svg>
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={classNames(
            "p-1.5 rounded transition-colors",
            editor.isActive("blockquote")
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white hover:bg-white/10",
          )}
          title="Quote"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </button>
      </BubbleMenu>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Styles for the editor */}
      <style jsx global>{`
        .rich-text-editor .ProseMirror {
          outline: none;
        }

        .rich-text-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        .rich-text-editor .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .rich-text-editor .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 0.875rem;
        }

        .rich-text-editor .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .rich-text-editor .ProseMirror h4 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .rich-text-editor .ProseMirror p {
          margin-bottom: 0.75rem;
        }

        .rich-text-editor .ProseMirror ul,
        .rich-text-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .rich-text-editor .ProseMirror ul {
          list-style-type: disc;
        }

        .rich-text-editor .ProseMirror ol {
          list-style-type: decimal;
        }

        .rich-text-editor .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .rich-text-editor .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 0.75rem;
          font-style: italic;
          color: #6b7280;
        }

        .rich-text-editor .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, monospace;
          font-size: 0.875em;
        }

        .rich-text-editor .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 0.75rem;
        }

        .rich-text-editor .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .rich-text-editor .ProseMirror a {
          color: #db2777;
          text-decoration: underline;
        }

        .rich-text-editor .ProseMirror a:hover {
          color: #be185d;
        }

        .rich-text-editor .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1.5rem 0;
        }

        /* Dark mode */
        .dark
          .rich-text-editor
          .ProseMirror
          p.is-editor-empty:first-child::before {
          color: #6b7280;
        }

        .dark .rich-text-editor .ProseMirror blockquote {
          border-left-color: #374151;
          color: #9ca3af;
        }

        .dark .rich-text-editor .ProseMirror code {
          background-color: #374151;
        }

        .dark .rich-text-editor .ProseMirror hr {
          border-top-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
