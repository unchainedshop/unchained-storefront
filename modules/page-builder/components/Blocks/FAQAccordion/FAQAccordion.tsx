/**
 * FAQ Accordion Block
 * Expandable Q&A sections with smooth animations
 */

import React, { useState, useCallback } from "react";
import classNames from "classnames";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { PageBlock, FAQAccordionContent } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import InlineRichText from "../../InlineRichText";

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
  const { updateBlock, state } = usePageBuilder();
  const canEdit = isEditing && !state.isPreviewMode;
  const [openItems, setOpenItems] = useState<Set<string>>(
    content.defaultOpenFirst && content.items.length > 0
      ? new Set([content.items[0].id])
      : new Set(),
  );

  // Handler for updating individual FAQ item fields
  const updateFAQItem = useCallback(
    (itemId: string, field: "question" | "answer", value: string) => {
      const updatedItems = content.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      );
      updateBlock(block.id, {
        content: { items: updatedItems },
      });
    },
    [block.id, content.items, updateBlock],
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
        className="flex flex-col items-center justify-center py-16 px-4 bg-periwinkle-50/30 dark:bg-periwinkle-500/5 rounded-xl border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-periwinkle-400 dark:text-periwinkle-300 mb-3" />
        <p className="text-periwinkle-400 dark:text-periwinkle-300 text-sm font-medium">
          Add FAQ items in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading || canEdit) && (
          <div className="text-center mb-10">
            <InlineRichText
              blockId={block.id}
              field="heading"
              value={content.heading || ""}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: style.textColor }}
              placeholder="Add heading..."
              multiline={false}
              enableLinks={false}
            />
            <InlineRichText
              blockId={block.id}
              field="subheading"
              value={content.subheading || ""}
              tag="p"
              className="text-lg opacity-80"
              style={{ color: style.textColor }}
              placeholder="Add subheading..."
              multiline={false}
            />
          </div>
        )}

        {/* Accordion Items */}
        <div className="space-y-3">
          {content.items.map((item) => {
            const isOpen = openItems.has(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 ease-out"
              >
                <div
                  onClick={() => !canEdit && toggleItem(item.id)}
                  className={classNames(
                    "w-full flex items-center justify-between px-6 py-5 text-left transition-colors",
                    !canEdit &&
                      "cursor-pointer hover:bg-white/80 dark:hover:bg-white/10",
                  )}
                >
                  <div className="flex-1 pr-4">
                    <InlineRichText
                      blockId={block.id}
                      field={`items.${item.id}.question`}
                      value={item.question || ""}
                      tag="span"
                      className="font-semibold text-slate-900 dark:text-white"
                      placeholder="Enter question..."
                      multiline={false}
                      enableLinks={false}
                      onUpdate={(value) =>
                        updateFAQItem(item.id, "question", value)
                      }
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                  >
                    <ChevronDownIcon
                      className={classNames(
                        "w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </div>
                <div
                  className={classNames(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-[500px]" : "max-h-0",
                  )}
                >
                  <div className="px-6 pb-5">
                    <InlineRichText
                      blockId={block.id}
                      field={`items.${item.id}.answer`}
                      value={item.answer || ""}
                      tag="div"
                      className="text-slate-600 dark:text-slate-300 leading-relaxed"
                      placeholder="Enter answer..."
                      multiline={true}
                      onUpdate={(value) =>
                        updateFAQItem(item.id, "answer", value)
                      }
                    />
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
