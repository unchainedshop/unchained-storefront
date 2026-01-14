/**
 * Template Picker
 * Modal for selecting a page template to start from
 */

import React, { useState } from "react";
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

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Choose a Template
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Start with a pre-built layout or begin from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-56 border-r border-slate-100 dark:border-slate-800 p-4 flex flex-col gap-1">
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium">{label}</span>
                  <span
                    className={classNames(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-white/20 dark:bg-slate-900/20"
                        : "bg-slate-100 dark:bg-slate-800",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Template Grid */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const isSelected = selectedTemplate?.id === template.id;
                const isBlank = template.id === "blank";

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    onDoubleClick={() => {
                      setSelectedTemplate(template);
                      handleConfirm();
                    }}
                    className={classNames(
                      "group relative flex flex-col rounded-xl border-2 overflow-hidden transition-all text-left",
                      isSelected
                        ? "border-slate-900 dark:border-white ring-2 ring-slate-900/20 dark:ring-white/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                    )}
                  >
                    {/* Thumbnail */}
                    <div
                      className={classNames(
                        "aspect-[4/3] flex items-center justify-center",
                        isBlank
                          ? "bg-slate-50 dark:bg-slate-800"
                          : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700",
                      )}
                    >
                      {isBlank ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <DocumentIcon className="w-12 h-12" />
                          <span className="text-xs">Empty Canvas</span>
                        </div>
                      ) : (
                        <TemplatePreview template={template} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-white dark:bg-slate-900">
                      <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                        {template.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                        <CheckIcon className="w-4 h-4 text-white dark:text-slate-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div>
            {selectedTemplate && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Selected:{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedTemplate.name}
                </span>
                {selectedTemplate.blocks.length > 0 && (
                  <span className="text-slate-500">
                    {" "}
                    ({selectedTemplate.blocks.length} blocks)
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTemplate}
              className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
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
