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
                "group relative overflow-hidden rounded-2xl",
                "bg-white/80 dark:bg-white/5",
                "backdrop-blur-xl backdrop-saturate-150",
                "border border-slate-200/60 dark:border-white/10",
                "shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
                "hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]",
                "hover:border-slate-300/80 dark:hover:border-white/20",
                "hover:-translate-y-1",
                "transition-all duration-300 ease-out",
              )}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
                {product?.media?.length ? (
                  <img
                    src={product?.media?.[0]?.file?.url}
                    alt={product?.media?.[0]?.file?.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                  {content.showSaleBadge && (product as any).sale && (
                    <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.4)]">
                      Sale
                    </span>
                  )}
                  {(product as any)?.tags?.includes("new") && (
                    <span className="px-2.5 py-1 ml-auto bg-white/90 dark:bg-white/10 backdrop-blur-sm text-slate-800 dark:text-white text-xs font-semibold rounded-full border border-slate-200/60 dark:border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      New
                    </span>
                  )}
                </div>

                {/* Quick Add - Frost style */}
                {content.showQuickAdd && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <button
                      className={classNames(
                        "w-full py-2.5 px-4 flex items-center justify-center gap-2",
                        "bg-white/90 dark:bg-white/10",
                        "backdrop-blur-xl backdrop-saturate-150",
                        "text-slate-900 dark:text-white text-sm font-medium",
                        "rounded-xl border border-slate-200/60 dark:border-white/20",
                        "shadow-[0_4px_16px_rgba(0,0,0,0.1)]",
                        "hover:bg-white dark:hover:bg-white/20",
                        "hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
                        "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
                        "transition-all duration-300 ease-out",
                      )}
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      Quick Add
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors">
                  {product?.texts?.title}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-white/5 px-2 py-0.5 rounded-md inline-block">
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
