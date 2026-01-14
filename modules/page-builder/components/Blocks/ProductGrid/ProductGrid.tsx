/**
 * Product Grid Block
 * Displays products in a responsive grid layout
 */

import React from 'react';
import classNames from 'classnames';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { PageBlock, ProductGridContent } from '../../../types';

interface ProductGridProps {
  block: PageBlock;
  isPreview?: boolean;
}

// Mock product for preview
const mockProducts = [
  { id: '1', title: 'Product One', price: '$49.00', image: null },
  { id: '2', title: 'Product Two', price: '$79.00', image: null, sale: true },
  { id: '3', title: 'Product Three', price: '$59.00', image: null },
  { id: '4', title: 'Product Four', price: '$89.00', image: null, new: true },
  { id: '5', title: 'Product Five', price: '$129.00', image: null },
  { id: '6', title: 'Product Six', price: '$39.00', image: null, sale: true },
  { id: '7', title: 'Product Seven', price: '$99.00', image: null },
  { id: '8', title: 'Product Eight', price: '$69.00', image: null },
];

const ProductGrid: React.FC<ProductGridProps> = ({ block }) => {
  const content = block.content as ProductGridContent;
  const style = block.style;

  const products = mockProducts.slice(0, content.limit || 8);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const mobileGridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
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
            'grid gap-6',
            mobileGridCols[content.mobileColumns as keyof typeof mobileGridCols] || 'grid-cols-2',
            `md:${gridCols[content.columns as keyof typeof gridCols] || 'grid-cols-4'}`
          )}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-slate-300 dark:text-slate-500" />
                  </div>
                )}

                {/* Badges */}
                {content.showSaleBadge && (product as any).sale && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                    Sale
                  </span>
                )}
                {(product as any).new && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                    New
                  </span>
                )}

                {/* Quick Add */}
                {content.showQuickAdd && (
                  <button className="absolute bottom-2 left-2 right-2 py-2 bg-slate-900 text-white text-sm font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Quick Add
                  </button>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-slate-900 dark:text-white truncate">
                  {product.title}
                </h3>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
