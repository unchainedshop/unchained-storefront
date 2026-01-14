/**
 * Shoppable Image Block
 * Lifestyle image with clickable product hotspots
 */

import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import type { PageBlock, ShoppableImageContent, ProductHotspot } from "../../../types";
import HotspotMarker from "./HotspotMarker";
import ProductCard from "./ProductCard";

interface ShoppableImageProps {
  block: PageBlock;
  isPreview?: boolean;
}

const ShoppableImage: React.FC<ShoppableImageProps> = ({ block, isPreview }) => {
  const content = block.content as ShoppableImageContent;
  const style = block.style;

  const [activeHotspot, setActiveHotspot] = useState<ProductHotspot | null>(null);

  const containerStyle: React.CSSProperties = {
    maxWidth: style.maxWidth || undefined,
    margin: style.alignmentX === "center" ? "0 auto" : undefined,
    borderRadius: style.borderRadius || 0,
  };

  const shouldShowLabel = (hotspot: ProductHotspot) => {
    if (content.showLabels === "always") return true;
    if (content.showLabels === "never") return false;
    // "hover" - show when this hotspot is active
    return activeHotspot?.id === hotspot.id;
  };

  if (!content.image) {
    return (
      <div
        style={containerStyle}
        className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <PhotoIcon className="w-16 h-16 text-slate-300 dark:text-slate-500 mx-auto" />
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              Select an image to add product hotspots
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="relative overflow-hidden">
      {/* Main Image */}
      <img
        src={content.image}
        alt={content.altText || "Shoppable image"}
        className="w-full h-auto object-cover"
        style={{ borderRadius: style.borderRadius || 0 }}
      />

      {/* Hotspots */}
      {content.hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          style={content.hotspotStyle}
          color={content.hotspotColor}
          showLabel={shouldShowLabel(hotspot)}
          isSelected={activeHotspot?.id === hotspot.id}
          isEditing={!isPreview}
          onMouseEnter={() => setActiveHotspot(hotspot)}
          onMouseLeave={() => setActiveHotspot(null)}
          onClick={() => {
            if (!isPreview) {
              // In edit mode, selection is handled by parent
              return;
            }
            // In preview mode, toggle card
            setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot);
          }}
        />
      ))}

      {/* Product Card (shown on hover in preview mode) */}
      {activeHotspot && isPreview && (
        <ProductCard
          hotspot={activeHotspot}
          position={activeHotspot.position}
          onClose={() => setActiveHotspot(null)}
        />
      )}

      {/* Empty state for no hotspots in editor */}
      {!isPreview && content.hotspots.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 rounded-lg text-sm text-slate-600 dark:text-slate-300">
            Add hotspots in the settings panel
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppableImage;
