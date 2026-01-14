/**
 * FAQ Accordion Block
 * Expandable Q&A sections with smooth animations
 */

import React, { useState } from "react";
import classNames from "classnames";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { PageBlock, FAQAccordionContent } from "../../../types";

interface FAQAccordionProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as unknown as FAQAccordionContent;
  const style = block.style;
  const [openItems, setOpenItems] = useState<Set<string>>(
    content.defaultOpenFirst && content.items.length > 0
      ? new Set([content.items[0].id])
      : new Set(),
  );

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!content.allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  if (content.items.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add FAQ items in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading) && (
          <div className="text-center mb-10">
            {content.heading && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: style.textColor }}
              >
                {content.heading}
              </h2>
            )}
            {content.subheading && (
              <p
                className="text-lg opacity-80"
                style={{ color: style.textColor }}
              >
                {content.subheading}
              </p>
            )}
          </div>
        )}

        {/* Accordion Items */}
        <div className="space-y-3">
          {content.items.map((item) => {
            const isOpen = openItems.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDownIcon
                    className={classNames(
                      "w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={classNames(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-96" : "max-h-0",
                  )}
                >
                  <div className="px-6 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
