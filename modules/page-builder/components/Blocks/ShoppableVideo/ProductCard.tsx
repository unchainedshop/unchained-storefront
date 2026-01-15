/**
 * Product Card
 * Displays product information on hotspot hover
 */

import React from "react";
import Link from "next/link";
import { PhotoIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import type { ProductHotspot } from "../../../types";

interface ProductCardProps {
  hotspot: ProductHotspot;
  position: { x: number; y: number };
  onClose?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  hotspot,
  position,
  onClose,
}) => {
  // Calculate card position to keep it in viewport
  const cardStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 50,
  };

  // Position card relative to hotspot, avoiding edges
  if (position.x < 30) {
    cardStyle.left = `${position.x + 5}%`;
  } else if (position.x > 70) {
    cardStyle.right = `${100 - position.x + 5}%`;
  } else {
    cardStyle.left = `${position.x}%`;
    cardStyle.transform = "translateX(-50%)";
  }

  if (position.y < 50) {
    cardStyle.top = `${position.y + 8}%`;
  } else {
    cardStyle.bottom = `${100 - position.y + 8}%`;
  }

  return (
    <div
      style={cardStyle}
      className="w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      onMouseLeave={onClose}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
        {hotspot.productImage ? (
          <img
            src={hotspot.productImage}
            alt={hotspot.productTitle || "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-slate-300 dark:text-slate-500" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2">
          {hotspot.productTitle || "Product Name"}
        </h4>
        {hotspot.productPrice && (
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
            {hotspot.productPrice}
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Link
            href={`/product/${hotspot.productId}`}
            className="flex-1 py-2 px-3 text-center text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            View Product
          </Link>
          <button
            className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Quick Add"
          >
            <ShoppingBagIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
