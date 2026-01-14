/**
 * Tabs Block
 * Tabbed content sections
 */

import React, { useState } from "react";
import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { PageBlock, TabsContent } from "../../../types";

interface TabsProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const Tabs: React.FC<TabsProps> = ({ block, isPreview, isEditing = true }) => {
  const content = block.content as unknown as TabsContent;
  const style = block.style;
  const [activeTab, setActiveTab] = useState(content.defaultTab || 0);

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  if (content.tabs.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add tabs in the settings panel
        </p>
      </div>
    );
  }

  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    stretch: "justify-stretch",
  };

  const renderTabButton = (tab: TabsContent["tabs"][0], index: number) => {
    const isActive = activeTab === index;

    const baseClasses = "px-5 py-3 font-medium text-sm transition-all";

    switch (content.variant) {
      case "pills":
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={classNames(
              baseClasses,
              "rounded-full",
              isActive
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
              content.alignment === "stretch" && "flex-1",
            )}
          >
            {tab.label}
          </button>
        );

      case "boxed":
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={classNames(
              baseClasses,
              "border",
              isActive
                ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white -mb-px"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
              content.alignment === "stretch" && "flex-1",
            )}
          >
            {tab.label}
          </button>
        );

      case "underline":
      default:
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={classNames(
              baseClasses,
              "border-b-2 -mb-px",
              isActive
                ? "border-slate-900 dark:border-white text-slate-900 dark:text-white"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600",
              content.alignment === "stretch" && "flex-1",
            )}
          >
            {tab.label}
          </button>
        );
    }
  };

  return (
    <div style={containerStyle}>
      <div className="max-w-4xl mx-auto">
        {/* Tab Headers */}
        <div
          className={classNames(
            "flex gap-1",
            alignmentClasses[content.alignment || "left"],
            content.variant === "underline" &&
              "border-b border-slate-200 dark:border-slate-700",
            content.variant === "boxed" &&
              "border-b border-slate-200 dark:border-slate-700",
          )}
        >
          {content.tabs.map((tab, index) => renderTabButton(tab, index))}
        </div>

        {/* Tab Content */}
        <div
          className={classNames(
            "py-6",
            content.variant === "boxed" &&
              "border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-lg px-6 bg-white dark:bg-slate-800",
          )}
        >
          {content.tabs[activeTab] && (
            <div
              className="prose dark:prose-invert max-w-none"
              style={{ color: style.textColor }}
              dangerouslySetInnerHTML={{
                __html: content.tabs[activeTab].content
                  .replace(/\n/g, "<br />")
                  .replace(/### (.*)/g, "<h3>$1</h3>")
                  .replace(/## (.*)/g, "<h2>$1</h2>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
