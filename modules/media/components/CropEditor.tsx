/**
 * CropEditor Component
 * Interactive image cropping editor with aspect ratio presets
 */

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import classNames from "classnames";
import {
  XMarkIcon,
  CheckIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

export interface CropArea {
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
}

export type AspectRatioPreset =
  | "free"
  | "1:1"
  | "4:3"
  | "3:2"
  | "16:9"
  | "21:9"
  | "9:16"
  | "2:3"
  | "3:4";

interface CropEditorProps {
  imageUrl: string;
  initialCrop?: CropArea;
  aspectRatio?: AspectRatioPreset;
  onSave: (crop: CropArea, aspectRatio: AspectRatioPreset) => void;
  onCancel: () => void;
}

const aspectRatioValues: Record<AspectRatioPreset, number | null> = {
  free: null,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
  "21:9": 21 / 9,
  "9:16": 9 / 16,
  "2:3": 2 / 3,
  "3:4": 3 / 4,
};

const CropEditor: React.FC<CropEditorProps> = ({
  imageUrl,
  initialCrop,
  aspectRatio: initialAspectRatio = "free",
  onSave,
  onCancel,
}) => {
  const [aspectRatio, setAspectRatio] =
    useState<AspectRatioPreset>(initialAspectRatio);
  const [crop, setCrop] = useState<CropArea>(
    initialCrop || { x: 10, y: 10, width: 80, height: 80 },
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<
    "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null
  >(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState<CropArea>(crop);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Calculate constrained crop based on aspect ratio
  const constrainCrop = useCallback(
    (newCrop: CropArea, fromCorner?: string): CropArea => {
      const ratio = aspectRatioValues[aspectRatio];
      if (!ratio || !imageDimensions.width || !imageDimensions.height) {
        return {
          x: Math.max(0, Math.min(100 - newCrop.width, newCrop.x)),
          y: Math.max(0, Math.min(100 - newCrop.height, newCrop.y)),
          width: Math.max(10, Math.min(100 - newCrop.x, newCrop.width)),
          height: Math.max(10, Math.min(100 - newCrop.y, newCrop.height)),
        };
      }

      // Convert to pixels for aspect ratio calculation
      const imgRatio = imageDimensions.width / imageDimensions.height;
      const cropWidthPx = (newCrop.width / 100) * imageDimensions.width;
      const cropHeightPx = (newCrop.height / 100) * imageDimensions.height;

      let finalWidth = newCrop.width;
      let finalHeight = newCrop.height;

      // Adjust based on aspect ratio
      const currentRatio = cropWidthPx / cropHeightPx;
      if (Math.abs(currentRatio - ratio) > 0.01) {
        if (fromCorner?.includes("e") || fromCorner?.includes("w")) {
          // Width changed, adjust height
          const newHeightPx = cropWidthPx / ratio;
          finalHeight = (newHeightPx / imageDimensions.height) * 100;
        } else {
          // Height changed, adjust width
          const newWidthPx = cropHeightPx * ratio;
          finalWidth = (newWidthPx / imageDimensions.width) * 100;
        }
      }

      return {
        x: Math.max(0, Math.min(100 - finalWidth, newCrop.x)),
        y: Math.max(0, Math.min(100 - finalHeight, newCrop.y)),
        width: Math.max(10, Math.min(100, finalWidth)),
        height: Math.max(10, Math.min(100, finalHeight)),
      };
    },
    [aspectRatio, imageDimensions],
  );

  // Handle aspect ratio change - expand to fill as much space as possible
  useEffect(() => {
    if (
      aspectRatio !== "free" &&
      imageDimensions.width &&
      imageDimensions.height
    ) {
      const ratio = aspectRatioValues[aspectRatio];
      if (ratio) {
        // Calculate the aspect ratio in percentage terms
        // ratio = width/height in pixels
        // We need to convert this to percentage space
        const imgAspect = imageDimensions.width / imageDimensions.height;
        const percentRatio = ratio / imgAspect; // width% / height%

        // Start with maximum possible size (80% of image)
        const maxSize = 80;
        let newWidth: number;
        let newHeight: number;

        if (percentRatio >= 1) {
          // Wider than tall (in percentage terms)
          newWidth = maxSize;
          newHeight = maxSize / percentRatio;
        } else {
          // Taller than wide
          newHeight = maxSize;
          newWidth = maxSize * percentRatio;
        }

        // Ensure minimum size
        newWidth = Math.max(20, Math.min(90, newWidth));
        newHeight = Math.max(20, Math.min(90, newHeight));

        // Center in the image
        const newX = (100 - newWidth) / 2;
        const newY = (100 - newHeight) / 2;

        setCrop({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    }
  }, [aspectRatio, imageDimensions]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: typeof dragType) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragType(type);
      setDragStart({ x: e.clientX, y: e.clientY });
      setCropStart(crop);
    },
    [crop],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragType || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

      let newCrop = { ...cropStart };

      if (dragType === "move") {
        newCrop.x = cropStart.x + deltaX;
        newCrop.y = cropStart.y + deltaY;
      } else {
        // Handle resize from corners/edges
        if (dragType.includes("n")) {
          newCrop.y = cropStart.y + deltaY;
          newCrop.height = cropStart.height - deltaY;
        }
        if (dragType.includes("s")) {
          newCrop.height = cropStart.height + deltaY;
        }
        if (dragType.includes("w")) {
          newCrop.x = cropStart.x + deltaX;
          newCrop.width = cropStart.width - deltaX;
        }
        if (dragType.includes("e")) {
          newCrop.width = cropStart.width + deltaX;
        }
      }

      setCrop(constrainCrop(newCrop, dragType));
    },
    [isDragging, dragType, dragStart, cropStart, constrainCrop],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setImageLoaded(true);
    },
    [],
  );

  const handleSave = useCallback(() => {
    onSave(crop, aspectRatio);
  }, [crop, aspectRatio, onSave]);

  // Preview dimensions
  const previewDimensions = useMemo(() => {
    if (!imageDimensions.width || !imageDimensions.height) return null;
    const cropWidth = Math.round((crop.width / 100) * imageDimensions.width);
    const cropHeight = Math.round((crop.height / 100) * imageDimensions.height);
    return { width: cropWidth, height: cropHeight };
  }, [crop, imageDimensions]);

  return (
    <div className="fixed inset-0 z-[1100] flex flex-col bg-slate-950">
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-white">Crop Image</h2>

          {/* Aspect Ratio Presets - Inline */}
          <div className="flex items-center gap-1">
            {(Object.keys(aspectRatioValues) as AspectRatioPreset[]).map(
              (preset) => (
                <button
                  key={preset}
                  onClick={() => setAspectRatio(preset)}
                  className={classNames(
                    "px-2.5 py-1 text-[11px] font-medium rounded transition-all",
                    aspectRatio === preset
                      ? "bg-white text-slate-900"
                      : "text-slate-400 hover:text-white hover:bg-slate-800",
                  )}
                >
                  {preset === "free" ? (
                    <span className="flex items-center gap-1">
                      <ArrowsPointingOutIcon className="w-3 h-3" />
                      Free
                    </span>
                  ) : (
                    preset
                  )}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {previewDimensions && (
            <span className="text-[11px] text-slate-500 mr-2">
              {previewDimensions.width} × {previewDimensions.height}px
            </span>
          )}
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-900 bg-white hover:bg-slate-100 rounded transition-colors"
          >
            <CheckIcon className="w-3.5 h-3.5" />
            Apply
          </button>
        </div>
      </div>

      {/* Full-Screen Editor Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Main Crop Editor - Full Available Space */}
        <div className="relative max-w-full max-h-full">
          <div
            ref={containerRef}
            className="relative select-none"
            style={{ maxHeight: "calc(100vh - 80px)" }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop editor"
              className="block max-h-[calc(100vh-80px)] w-auto"
              onLoad={handleImageLoad}
              draggable={false}
            />

            {imageLoaded && (
              <>
                {/* Darkened overlay outside crop area */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top */}
                  <div
                    className="absolute left-0 right-0 top-0 bg-black/60"
                    style={{ height: `${crop.y}%` }}
                  />
                  {/* Bottom */}
                  <div
                    className="absolute left-0 right-0 bottom-0 bg-black/60"
                    style={{ height: `${100 - crop.y - crop.height}%` }}
                  />
                  {/* Left */}
                  <div
                    className="absolute left-0 bg-black/60"
                    style={{
                      top: `${crop.y}%`,
                      height: `${crop.height}%`,
                      width: `${crop.x}%`,
                    }}
                  />
                  {/* Right */}
                  <div
                    className="absolute right-0 bg-black/60"
                    style={{
                      top: `${crop.y}%`,
                      height: `${crop.height}%`,
                      width: `${100 - crop.x - crop.width}%`,
                    }}
                  />
                </div>

                {/* Crop area */}
                <div
                  className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0)] cursor-move"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "move")}
                >
                  {/* Rule of thirds grid */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
                  </div>

                  {/* Resize handles - Corners */}
                  <div
                    className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-sm shadow cursor-nw-resize"
                    onMouseDown={(e) => handleMouseDown(e, "nw")}
                  />
                  <div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-sm shadow cursor-ne-resize"
                    onMouseDown={(e) => handleMouseDown(e, "ne")}
                  />
                  <div
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-sm shadow cursor-sw-resize"
                    onMouseDown={(e) => handleMouseDown(e, "sw")}
                  />
                  <div
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-sm shadow cursor-se-resize"
                    onMouseDown={(e) => handleMouseDown(e, "se")}
                  />
                  {/* Resize handles - Edges */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white rounded-sm shadow cursor-n-resize"
                    onMouseDown={(e) => handleMouseDown(e, "n")}
                  />
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white rounded-sm shadow cursor-s-resize"
                    onMouseDown={(e) => handleMouseDown(e, "s")}
                  />
                  <div
                    className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-8 bg-white rounded-sm shadow cursor-w-resize"
                    onMouseDown={(e) => handleMouseDown(e, "w")}
                  />
                  <div
                    className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-8 bg-white rounded-sm shadow cursor-e-resize"
                    onMouseDown={(e) => handleMouseDown(e, "e")}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropEditor;
