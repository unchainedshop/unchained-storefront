/**
 * Template Picker
 * Modal for selecting a page template to start from
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import {
  XMarkIcon,
  DocumentIcon,
  RocketLaunchIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { pageTemplates, type PageTemplate } from '../../templates';

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PageTemplate) => void;
}

type CategoryFilter = 'all' | PageTemplate['category'];

const categoryInfo: Record<CategoryFilter, { label: string; icon: React.ElementType }> = {
  all: { label: 'All Templates', icon: DocumentIcon },
  landing: { label: 'Landing Pages', icon: RocketLaunchIcon },
  product: { label: 'Product Pages', icon: ShoppingBagIcon },
  content: { label: 'Content Pages', icon: DocumentTextIcon },
  marketing: { label: 'Marketing', icon: MegaphoneIcon },
};

const TemplatePicker: React.FC<TemplatePickerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);

  const filteredTemplates = selectedCategory === 'all'
    ? pageTemplates
    : pageTemplates.filter(t => t.category === selectedCategory);

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
              const count = category === 'all'
                ? pageTemplates.length
                : pageTemplates.filter(t => t.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={classNames(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium">{label}</span>
                  <span className={classNames(
                    'text-xs px-2 py-0.5 rounded-full',
                    isActive
                      ? 'bg-white/20 dark:bg-slate-900/20'
                      : 'bg-slate-100 dark:bg-slate-800'
                  )}>
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
                const isBlank = template.id === 'blank';

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    onDoubleClick={() => {
                      setSelectedTemplate(template);
                      handleConfirm();
                    }}
                    className={classNames(
                      'group relative flex flex-col rounded-xl border-2 overflow-hidden transition-all text-left',
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    )}
                  >
                    {/* Thumbnail */}
                    <div className={classNames(
                      'aspect-[4/3] flex items-center justify-center',
                      isBlank
                        ? 'bg-slate-50 dark:bg-slate-800'
                        : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'
                    )}>
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
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckIcon className="w-4 h-4 text-white" />
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
                Selected: <span className="font-medium text-slate-900 dark:text-white">{selectedTemplate.name}</span>
                {selectedTemplate.blocks.length > 0 && (
                  <span className="text-slate-500"> ({selectedTemplate.blocks.length} blocks)</span>
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
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mini preview of template layout
const TemplatePreview: React.FC<{ template: PageTemplate }> = ({ template }) => {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-1.5">
      {template.blocks.slice(0, 4).map((block, index) => {
        const height = block.type === 'hero-banner' ? 'h-8' : 'h-4';
        const color = getBlockColor(block.type);

        return (
          <div
            key={index}
            className={classNames(
              'rounded',
              height,
              color
            )}
          />
        );
      })}
      {template.blocks.length > 4 && (
        <div className="text-[10px] text-slate-400 text-center mt-1">
          +{template.blocks.length - 4} more
        </div>
      )}
    </div>
  );
};

const getBlockColor = (type: string): string => {
  if (type.includes('hero') || type.includes('banner')) return 'bg-blue-300 dark:bg-blue-700';
  if (type.includes('product')) return 'bg-green-300 dark:bg-green-700';
  if (type.includes('column') || type.includes('section')) return 'bg-purple-300 dark:bg-purple-700';
  if (type.includes('newsletter') || type.includes('promo')) return 'bg-amber-300 dark:bg-amber-700';
  if (type.includes('countdown')) return 'bg-red-300 dark:bg-red-700';
  if (type.includes('testimonial')) return 'bg-pink-300 dark:bg-pink-700';
  return 'bg-slate-300 dark:bg-slate-600';
};

export default TemplatePicker;
