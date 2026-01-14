/**
 * Category Grid Block
 * Displays product categories in a grid layout
 */

import React from 'react';
import classNames from 'classnames';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { PageBlock, CategoryGridContent } from '../../../types';

interface CategoryGridProps {
  block: PageBlock;
  isPreview?: boolean;
}

// Mock categories for preview
const mockCategories = [
  { id: '1', title: 'Women', image: null },
  { id: '2', title: 'Men', image: null },
  { id: '3', title: 'Accessories', image: null },
  { id: '4', title: 'Shoes', image: null },
  { id: '5', title: 'Sale', image: null },
  { id: '6', title: 'New Arrivals', image: null },
];

const CategoryGrid: React.FC<CategoryGridProps> = ({ block }) => {
  const content = block.content as unknown as CategoryGridContent;
  const style = block.style;

  const categories =
    content.categoryIds?.length > 0
      ? mockCategories.filter((c) => content.categoryIds.includes(c.id))
      : mockCategories.slice(0, content.columns || 3);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const mobileGridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
  };

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div
          className={classNames(
            'grid gap-4',
            mobileGridCols[content.mobileColumns as keyof typeof mobileGridCols] || 'grid-cols-1',
            `md:${gridCols[content.columns as keyof typeof gridCols] || 'grid-cols-3'}`
          )}
        >
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={classNames(
                'relative overflow-hidden rounded-lg group cursor-pointer',
                // First two categories are larger if using masonry layout
                content.layout === 'masonry' && index < 2 ? 'aspect-[4/3]' : 'aspect-square'
              )}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="w-16 h-16 text-slate-300 dark:text-slate-500" />
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

              {/* Content */}
              {content.showTitle && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                    {category.title}
                  </h3>
                  <span className="mt-2 text-white/80 text-sm group-hover:text-white transition-colors">
                    Shop Now →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
