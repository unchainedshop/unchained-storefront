/**
 * Video Hotspot Marker
 * Clickable hotspot marker that appears on video at specific timestamps
 */

import React from "react";
import { PlusIcon, ShoppingBagIcon, TagIcon } from "@heroicons/react/24/solid";
import type { VideoHotspot } from "../../../types";

interface VideoHotspotMarkerProps {
  hotspot: VideoHotspot;
  style: "dot" | "plus" | "pulse" | "tag";
  color: string;
  isSelected: boolean;
  isEditing: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const VideoHotspotMarker: React.FC<VideoHotspotMarkerProps> = ({
  hotspot,
  style,
  color,
  isSelected,
  isEditing,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const markerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${hotspot.position.x}%`,
    top: `${hotspot.position.y}%`,
    transform: "translate(-50%, -50%)",
    zIndex: isSelected ? 20 : 10,
    pointerEvents: "auto",
  };

  const baseClasses =
    "cursor-pointer transition-all duration-200 flex items-center justify-center";
  const selectedClasses = isSelected ? "scale-125" : "hover:scale-110";

  const renderMarker = () => {
    switch (style) {
      case "dot":
        return (
          <div
            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${baseClasses} ${selectedClasses}`}
            style={{ backgroundColor: color }}
          />
        );

      case "plus":
        return (
          <div
            className={`w-8 h-8 rounded-full shadow-lg ${baseClasses} ${selectedClasses}`}
            style={{ backgroundColor: color }}
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </div>
        );

      case "pulse":
        return (
          <div className="relative">
            <div
              className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${baseClasses} ${selectedClasses}`}
              style={{ backgroundColor: color }}
            />
            <div
              className="absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: color }}
            />
          </div>
        );

      case "tag":
        return (
          <div
            className={`px-3 py-1.5 rounded-full shadow-lg ${baseClasses} ${selectedClasses} gap-1.5`}
            style={{ backgroundColor: color }}
          >
            {hotspot.productImage ? (
              <img
                src={hotspot.productImage}
                alt=""
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <ShoppingBagIcon className="w-4 h-4 text-white" />
            )}
            {hotspot.label && (
              <span className="text-xs font-medium text-white whitespace-nowrap">
                {hotspot.label}
              </span>
            )}
          </div>
        );

      default:
        return (
          <div
            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${baseClasses} ${selectedClasses}`}
            style={{ backgroundColor: color }}
          />
        );
    }
  };

  return (
    <div
      style={markerStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {renderMarker()}

      {/* Label tooltip (shown on hover when style is not tag) */}
      {isSelected && hotspot.label && style !== "tag" && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 rounded text-xs text-white whitespace-nowrap">
          {hotspot.label}
        </div>
      )}
    </div>
  );
};

export default VideoHotspotMarker;
