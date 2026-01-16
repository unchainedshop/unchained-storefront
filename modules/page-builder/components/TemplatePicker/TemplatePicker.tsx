/**
 * Template Picker
 * Right-side panel for selecting a page template to start from
 */

import React, { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import {
  XMarkIcon,
  DocumentIcon,
  RocketLaunchIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { pageTemplates, type PageTemplate } from "../../templates";

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PageTemplate) => void;
}

type CategoryFilter = "all" | PageTemplate["category"];

const categoryInfo: Record<
  CategoryFilter,
  { label: string; icon: React.ElementType }
> = {
  all: { label: "All Templates", icon: DocumentIcon },
  landing: { label: "Landing Pages", icon: RocketLaunchIcon },
  product: { label: "Product Pages", icon: ShoppingBagIcon },
  content: { label: "Content Pages", icon: DocumentTextIcon },
  marketing: { label: "Marketing", icon: MegaphoneIcon },
};

const TemplatePicker: React.FC<TemplatePickerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(
    null,
  );

  const filteredTemplates =
    selectedCategory === "all"
      ? pageTemplates
      : pageTemplates.filter((t) => t.category === selectedCategory);

  // Auto-select first template when panel opens
  useEffect(() => {
    if (isOpen && !selectedTemplate && filteredTemplates.length > 0) {
      setSelectedTemplate(filteredTemplates[0]);
    }
  }, [isOpen, filteredTemplates, selectedTemplate]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedTemplate) {
        e.preventDefault();
        onSelectTemplate(selectedTemplate);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      // Arrow key navigation through templates
      if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        const currentIndex = selectedTemplate
          ? filteredTemplates.findIndex((t) => t.id === selectedTemplate.id)
          : -1;

        let newIndex = currentIndex;
        const cols = 3; // grid-cols-3

        if (e.key === "ArrowRight") {
          newIndex =
            currentIndex < filteredTemplates.length - 1 ? currentIndex + 1 : 0;
        } else if (e.key === "ArrowLeft") {
          newIndex =
            currentIndex > 0 ? currentIndex - 1 : filteredTemplates.length - 1;
        } else if (e.key === "ArrowDown") {
          newIndex =
            currentIndex + cols < filteredTemplates.length
              ? currentIndex + cols
              : currentIndex % cols;
        } else if (e.key === "ArrowUp") {
          newIndex =
            currentIndex - cols >= 0
              ? currentIndex - cols
              : filteredTemplates.length - cols + (currentIndex % cols);
        }

        if (newIndex >= 0 && newIndex < filteredTemplates.length) {
          setSelectedTemplate(filteredTemplates[newIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedTemplate, filteredTemplates, onSelectTemplate, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={classNames(
          "fixed inset-0 z-[1050] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Right-side Panel */}
      <div
        className={classNames(
          "fixed top-3 right-3 bottom-3 z-[1051] w-full max-w-4xl",
          "rounded-2xl flex flex-col overflow-hidden",
          // Glassmorphism
          "bg-white/80 dark:bg-slate-900/80",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-white/60 dark:border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div>
            <h2 className="text-base font-medium text-slate-700 dark:text-slate-200">
              Choose a Template
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Start with a pre-built layout or begin from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-48 border-r border-slate-200/50 dark:border-slate-700/50 p-3 flex flex-col gap-0.5">
            {(Object.keys(categoryInfo) as CategoryFilter[]).map((category) => {
              const { label, icon: Icon } = categoryInfo[category];
              const isActive = selectedCategory === category;
              const count =
                category === "all"
                  ? pageTemplates.length
                  : pageTemplates.filter((t) => t.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={classNames(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all",
                    isActive
                      ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50",
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-[11px] font-medium">
                    {label}
                  </span>
                  <span
                    className={classNames(
                      "text-[10px] px-1.5 py-0.5 rounded-full",
                      isActive
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                        : "bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Template Grid */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-3 gap-3">
              {filteredTemplates.map((template) => {
                const isSelected = selectedTemplate?.id === template.id;
                const isBlank = template.id === "blank";

                return (
                  <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    onFocus={() => setSelectedTemplate(template)}
                    className={classNames(
                      "group relative flex flex-col rounded-xl overflow-hidden transition-all text-left",
                      "border",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
                      isSelected
                        ? "border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 shadow-md"
                        : "border-slate-200/80 dark:border-slate-700/80 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm",
                    )}
                  >
                    {/* Thumbnail */}
                    <div
                      className={classNames(
                        "aspect-[4/3] flex items-center justify-center",
                        isBlank
                          ? "bg-slate-50/80 dark:bg-slate-800/80"
                          : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750",
                      )}
                    >
                      {isBlank ? (
                        <div className="flex flex-col items-center gap-1.5 text-slate-300 dark:text-slate-600">
                          <DocumentIcon className="w-10 h-10" />
                          <span className="text-[10px]">Empty Canvas</span>
                        </div>
                      ) : (
                        <TemplatePreview template={template} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2.5">
                      <h3 className="font-medium text-slate-700 dark:text-slate-200 text-[11px]">
                        {template.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-slate-500 dark:bg-slate-400 rounded-full flex items-center justify-center shadow-sm">
                        <CheckIcon className="w-3 h-3 text-white dark:text-slate-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Click a template to use it
          </p>
          <button
            onClick={onClose}
            className="px-3 py-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

// Mini preview of template layout - stylized wireframes
const TemplatePreview: React.FC<{ template: PageTemplate }> = ({
  template,
}) => {
  return (
    <div className="w-full h-full p-2.5 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-lg m-3 mt-6 shadow-sm">
      {template.blocks.slice(0, 5).map((block, index) => (
        <BlockWireframe key={index} type={block.type} />
      ))}
    </div>
  );
};

// Wireframe representations for different block types
const BlockWireframe: React.FC<{ type: string }> = ({ type }) => {
  // Hero banner - full width with centered content
  if (type.includes("hero") || type.includes("banner")) {
    return (
      <div className="relative h-12 rounded-md bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex flex-col items-center justify-center gap-1 overflow-hidden">
        <div className="w-16 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full" />
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
        <div className="w-6 h-1.5 bg-slate-400 dark:bg-slate-400 rounded-full mt-0.5" />
      </div>
    );
  }

  // Product grid - 4 small boxes
  if (type.includes("product")) {
    return (
      <div className="grid grid-cols-4 gap-1 h-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center gap-0.5 p-1"
          >
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-600 rounded-sm" />
            <div className="w-2/3 h-0.5 bg-slate-300 dark:bg-slate-500 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Columns/sections - 2-3 column layout
  if (type.includes("column") || type.includes("section")) {
    return (
      <div className="flex gap-1 h-6">
        <div className="flex-1 rounded bg-slate-100 dark:bg-slate-700" />
        <div className="flex-1 rounded bg-slate-100 dark:bg-slate-700" />
      </div>
    );
  }

  // Newsletter/CTA - centered input style
  if (type.includes("newsletter") || type.includes("cta")) {
    return (
      <div className="h-6 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center gap-2 px-3">
        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full" />
        <div className="w-8 h-3 bg-slate-300 dark:bg-slate-500 rounded" />
      </div>
    );
  }

  // Countdown
  if (type.includes("countdown")) {
    return (
      <div className="h-5 rounded bg-slate-800 dark:bg-slate-200 flex items-center justify-center gap-1.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded bg-white/20 dark:bg-slate-900/20"
          />
        ))}
      </div>
    );
  }

  // Testimonials - quote style
  if (type.includes("testimonial")) {
    return (
      <div className="h-6 rounded bg-slate-50 dark:bg-slate-800 flex items-center gap-2 px-2">
        <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 flex-shrink-0" />
        <div className="flex-1 space-y-0.5">
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
          <div className="w-2/3 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
    );
  }

  // Promo banner
  if (type.includes("promo")) {
    return (
      <div className="h-5 rounded bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-between px-2">
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-500 rounded-full" />
        <div className="w-6 h-2 bg-slate-400 dark:bg-slate-400 rounded" />
      </div>
    );
  }

  // Text/content block
  if (type.includes("text")) {
    return (
      <div className="h-4 flex flex-col justify-center gap-0.5 px-1">
        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="w-3/4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
    );
  }

  // Image block
  if (type.includes("image")) {
    return (
      <div className="h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-slate-300 dark:text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Spacer
  if (type.includes("spacer")) {
    return <div className="h-2" />;
  }

  // Default - generic content block
  return <div className="h-4 rounded bg-slate-100 dark:bg-slate-700" />;
};

export default TemplatePicker;
