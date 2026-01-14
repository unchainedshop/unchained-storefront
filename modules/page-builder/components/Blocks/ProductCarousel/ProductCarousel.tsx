/**
 * Product Carousel Block
 * Displays products in a horizontal scrollable carousel
 */

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PhotoIcon } from '@heroicons/react/24/outline';
import type { PageBlock, ProductCarouselContent } from '../../../types';
import useProducts from '../../../../products/hooks/useProducts';
import formatPrice from '../../../../common/utils/formatPrice';

interface ProductCarouselProps {
  block: PageBlock;
  isPreview?: boolean;
}

// Mock product for preview
const mockProducts = [
  { id: '1', texts: {title: 'Featured Product One'}, simulatedPrice:{ amount: 4900, currencyCode: 'USD'}, media: [] },
  { id: '2', texts: {title: 'Featured Product Two'}, simulatedPrice:{ amount: 5900, currencyCode: 'USD'}, media: [] },
  { id: '3', texts: {title: 'Featured Product Three'}, simulatedPrice:{ amount: 14900, currencyCode: 'USD'}, media: [] },
  { id: '4', texts: {title: 'Featured Product Four'}, simulatedPrice:{ amount: 4600, currencyCode: 'USD'}, media: [] },
  { id: '5', texts: {title: 'Featured Product Five'}, simulatedPrice:{ amount: 8900, currencyCode: 'USD'}, media: [] },
  { id: '6', texts: {title: 'Featured Product Six'}, simulatedPrice:{ amount: 7000, currencyCode: 'USD'}, media: [] },
  { id: '7', texts: {title: 'Featured Product Seven'}, simulatedPrice:{ amount: 12900, currencyCode: 'USD'} , media: [] },
  { id: '8', texts: {title: 'Featured Product Eight'}, simulatedPrice:{ amount: 8800, currencyCode: 'USD'}, media: [] },
  { id: '9', texts: {title: 'Featured Product Nine'}, simulatedPrice:{ amount: 6700, currencyCode: 'USD'}, media: [] },
];

const ProductCarousel: React.FC<ProductCarouselProps> = ({ block }) => {
  const {products: allProducts} = useProducts()
  const content = block.content as unknown as ProductCarouselContent;
  const style = block.style;
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [...allProducts, ...mockProducts ].filter(Boolean).slice(0, content.limit || 6);
  const visibleCount = 4;
  const maxIndex = Math.max(0, products.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto relative">
        {/* Navigation Arrows */}
        {content.showArrows && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </>
        )}

        {/* Products Container */}
        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-1/4">
                <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                    {product?.media?.length ? (
                      <img
                        src={product?.media?.[0]?.file?.url}
                    alt={product?.media?.[0]?.file?.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PhotoIcon className="w-12 h-12 text-slate-300 dark:text-slate-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate">
                      {product?.texts.title}
                    </h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{formatPrice( product.simulatedPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {content.showDots && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-slate-900 dark:bg-white'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
