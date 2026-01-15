/**
 * CodeEditor Component
 * Syntax-highlighted code editor using CodeMirror
 */

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css";
  placeholder?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder,
  height = "200px",
}) => {
  const extensions = language === "html" ? [html()] : [css()];

  return (
    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <CodeMirror
        value={value}
        height={height}
        extensions={extensions}
        onChange={onChange}
        theme="dark"
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
        className="text-sm"
      />
    </div>
  );
};

export default CodeEditor;
