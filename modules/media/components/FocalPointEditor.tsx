/**
 * FocalPointEditor Component
 * Interactive editor for setting image focal point
 * Click or drag to set where the image should focus when cropped
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import classNames from "classnames";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface FocalPoint {
  x: number;
  y: number;
}

interface FocalPointEditorProps {
  imageUrl: string;
  initialFocalPoint?: FocalPoint;
  onSave: (focalPoint: FocalPoint) => void;
  onCancel: () => void;
  /** Optional aspect ratio preview */
  previewAspectRatio?: string;
}

const FocalPointEditor: React.FC<FocalPointEditorProps> = ({
  imageUrl,
  initialFocalPoint = { x: 50, y: 50 },
  onSave,
  onCancel,
  previewAspectRatio,
}) => {
  const [focalPoint, setFocalPoint] = useState<FocalPoint>(initialFocalPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFocalPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

      setFocalPoint({ x: Math.round(x), y: Math.round(y) });
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updateFocalPoint(e.clientX, e.clientY);
    },
    [updateFocalPoint]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateFocalPoint(e.clientX, e.clientY);
    },
    [isDragging, updateFocalPoint]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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

  const handleSave = useCallback(() => {
    onSave(focalPoint);
  }, [focalPoint, onSave]);

  // Calculate preview crop area based on aspect ratio
  const getPreviewStyle = (): React.CSSProperties => {
    if (!previewAspectRatio || previewAspectRatio === "original") {
      return {};
    }

    // Parse aspect ratio
    const [w, h] = previewAspectRatio.split(":").map(Number);
    if (!w || !h) return {};

    const aspectRatio = w / h;

    return {
      aspectRatio: `${w}/${h}`,
      objectFit: "cover" as const,
      objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
    };
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Set Focal Point
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click or drag to set where the image should focus when cropped
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex gap-6">
            {/* Main Editor */}
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Click to set focal point
              </p>
              <div
                ref={containerRef}
                className={classNames(
                  "relative rounded-xl overflow-hidden cursor-crosshair select-none",
                  "ring-2 ring-slate-200 dark:ring-slate-700",
                  isDragging && "ring-blue-500 dark:ring-blue-400"
                )}
                onMouseDown={handleMouseDown}
              >
                <img
                  src={imageUrl}
                  alt="Focal point editor"
                  className="w-full h-auto block"
                  onLoad={() => setImageLoaded(true)}
                  draggable={false}
                />

                {/* Crosshair overlay */}
                {imageLoaded && (
                  <>
                    {/* Vertical line */}
                    <div
                      className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none transition-all duration-75"
                      style={{ left: `${focalPoint.x}%` }}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Horizontal line */}
                    <div
                      className="absolute left-0 right-0 h-px bg-white/80 pointer-events-none transition-all duration-75"
                      style={{ top: `${focalPoint.y}%` }}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Center point */}
                    <div
                      className="absolute pointer-events-none transition-all duration-75"
                      style={{
                        left: `${focalPoint.x}%`,
                        top: `${focalPoint.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Outer ring */}
                      <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg">
                        <div className="absolute inset-0 rounded-full border-2 border-black/30" />
                      </div>
                      {/* Inner dot */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md">
                        <div className="absolute inset-0 rounded-full bg-black/20" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Coordinates display */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span className="text-xs text-slate-500 dark:text-slate-400">X:</span>
                  <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                    {focalPoint.x}%
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Y:</span>
                  <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                    {focalPoint.y}%
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            {previewAspectRatio && previewAspectRatio !== "original" && (
              <div className="w-48">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  Preview ({previewAspectRatio})
                </p>
                <div className="rounded-xl overflow-hidden ring-2 ring-slate-200 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full"
                    style={getPreviewStyle()}
                    draggable={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setFocalPoint({ x: 50, y: 50 })}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Reset to Center
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocalPointEditor;
