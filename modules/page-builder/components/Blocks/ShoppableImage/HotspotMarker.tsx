/**
 * Hotspot Marker
 * Visual indicator for product hotspots on shoppable images
 */

import React from "react";
import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/solid";
import type { ProductHotspot } from "../../../types";

interface HotspotMarkerProps {
  hotspot: ProductHotspot;
  style: "dot" | "plus" | "pulse";
  color: string;
  showLabel: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  hotspot,
  style,
  color,
  showLabel,
  isSelected,
  isEditing,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const markerClasses = classNames(
    "absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
    "transition-transform duration-200",
    {
      "scale-110": isSelected,
      "cursor-pointer hover:scale-110": !isEditing,
      "cursor-move": isEditing,
    }
  );

  const renderMarker = () => {
    switch (style) {
      case "dot":
        return (
          <div
            className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: color }}
          />
        );

      case "plus":
        return (
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <PlusIcon className="w-5 h-5 text-white" />
          </div>
        );

      case "pulse":
      default:
        return (
          <div className="relative">
            {/* Pulse rings */}
            <div
              className="absolute inset-0 w-8 h-8 rounded-full animate-ping opacity-30"
              style={{ backgroundColor: color }}
            />
            <div
              className="absolute inset-0 w-8 h-8 rounded-full animate-pulse opacity-50"
              style={{
                backgroundColor: color,
                animationDelay: "0.5s",
              }}
            />
            {/* Center dot */}
            <div
              className="relative w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={markerClasses}
      style={{
        left: `${hotspot.position.x}%`,
        top: `${hotspot.position.y}%`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {renderMarker()}

      {/* Label */}
      {showLabel && hotspot.label && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded whitespace-nowrap">
          {hotspot.label}
        </div>
      )}
    </div>
  );
};

export default HotspotMarker;
