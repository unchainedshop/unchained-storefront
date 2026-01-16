/**
 * Product Grid Block
 * Displays products in a responsive grid layout
 */

import React from "react";
import classNames from "classnames";
import { PhotoIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import type { PageBlock, ProductGridContent } from "../../../types";
import useProducts from "../../../../products/hooks/useProducts";
import formatPrice from "../../../../common/utils/formatPrice";

interface ProductGridProps {
  block: PageBlock;
  isPreview?: boolean;
}

// Mock product for preview
const mockProducts = [
  {
    id: "1",
    texts: { title: "Product One" },
    simulatedPrice: { amount: 4900, currencyCode: "USD" },
    media: [],
  },
  {
    id: "2",
    texts: { title: "Product Two" },
    simulatedPrice: { amount: 5900, currencyCode: "USD" },
    media: [],
  },
  {
    id: "3",
    texts: { title: "Product Three" },
    simulatedPrice: { amount: 14900, currencyCode: "USD" },
    media: [],
  },
  {
    id: "4",
    texts: { title: "Product Four" },
    simulatedPrice: { amount: 4600, currencyCode: "USD" },
    media: [],
  },
  {
    id: "5",
    texts: { title: "Product Five" },
    simulatedPrice: { amount: 8900, currencyCode: "USD" },
    media: [],
  },
  {
    id: "6",
    texts: { title: "Product Six" },
    simulatedPrice: { amount: 7000, currencyCode: "USD" },
    media: [],
  },
  {
    id: "7",
    texts: { title: "Product Seven" },
    simulatedPrice: { amount: 12900, currencyCode: "USD" },
    media: [],
  },
  {
    id: "8",
    texts: { title: "Product Eight" },
    simulatedPrice: { amount: 8800, currencyCode: "USD" },
    media: [],
  },
  {
    id: "9",
    texts: { title: "Product Nine" },
    simulatedPrice: { amount: 6700, currencyCode: "USD" },
    media: [],
  },
];

const ProductGrid: React.FC<ProductGridProps> = ({ block }) => {
  const { products: allProducts } = useProducts();
  const content = block.content as unknown as ProductGridContent;
  const style = block.style;

  const products = [...allProducts, ...mockProducts]
    .filter(Boolean)
    .slice(0, content.limit || 8);

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  const mobileGridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
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
            "grid gap-6",
            mobileGridCols[
              content.mobileColumns as keyof typeof mobileGridCols
            ] || "grid-cols-2",
            `md:${gridCols[content.columns as keyof typeof gridCols] || "grid-cols-4"}`,
          )}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className={classNames(
                "group relative overflow-hidden rounded-xl",
                // Frost Card
                "bg-white/60 dark:bg-white/5",
                "backdrop-blur-lg",
                "border border-slate-200/50 dark:border-white/10",
                "shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
                "hover:bg-white/80 dark:hover:bg-white/10",
                "hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
                "transition-all duration-200 ease-out",
              )}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-slate-50 dark:bg-slate-800/50">
                {product?.media?.length ? (
                  <img
                    src={product?.media?.[0]?.file?.url}
                    alt={product?.media?.[0]?.file?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PhotoIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
                  {content.showSaleBadge && (product as any).sale && (
                    <span className="px-2 py-1 bg-red-500 text-white text-[11px] font-semibold rounded-md">
                      Sale
                    </span>
                  )}
                  {(product as any)?.tags?.includes("new") && (
                    <span className="px-2 py-1 ml-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-semibold rounded-md">
                      New
                    </span>
                  )}
                </div>

                {/* Quick Add - Frost style */}
                {content.showQuickAdd && (
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <button
                      className={classNames(
                        "w-full py-2 px-3 flex items-center justify-center gap-1.5",
                        "bg-white/90 dark:bg-slate-900/90",
                        "backdrop-blur-md",
                        "text-slate-900 dark:text-white text-sm font-medium",
                        "rounded-lg border border-slate-200/60 dark:border-white/10",
                        "opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-200",
                      )}
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      Quick Add
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-slate-900 dark:text-white text-sm truncate">
                  {product?.texts?.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {formatPrice(product?.simulatedPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
