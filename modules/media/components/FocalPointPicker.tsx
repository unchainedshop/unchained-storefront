/**
 * FocalPointPicker Component
 * Compact inline focal point selector for use in settings panels
 */

import React, { useState, useCallback, useRef } from "react";
import classNames from "classnames";

interface FocalPoint {
  x: number;
  y: number;
}

interface FocalPointPickerProps {
  imageUrl: string;
  value: FocalPoint;
  onChange: (focalPoint: FocalPoint) => void;
  className?: string;
}

const FocalPointPicker: React.FC<FocalPointPickerProps> = ({
  imageUrl,
  value,
  onChange,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFocalPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

      onChange({ x: Math.round(x), y: Math.round(y) });
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updateFocalPoint(e.clientX, e.clientY);

      const handleMouseMove = (e: MouseEvent) => {
        updateFocalPoint(e.clientX, e.clientY);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [updateFocalPoint]
  );

  return (
    <div className={classNames("space-y-2", className)}>
      <div
        ref={containerRef}
        className={classNames(
          "relative rounded-lg overflow-hidden cursor-crosshair select-none",
          "ring-1 ring-slate-200 dark:ring-slate-700",
          isDragging && "ring-2 ring-blue-500 dark:ring-blue-400"
        )}
        onMouseDown={handleMouseDown}
      >
        <img
          src={imageUrl}
          alt="Focal point"
          className="w-full h-auto block"
          draggable={false}
        />

        {/* Focal point indicator */}
        <div
          className="absolute pointer-events-none transition-all duration-75"
          style={{
            left: `${value.x}%`,
            top: `${value.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Outer ring */}
          <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg">
            <div className="absolute inset-0 rounded-full border border-black/30" />
          </div>
          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
        </div>

        {/* Grid overlay on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          {/* Thirds grid */}
          <div className="absolute inset-0">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-mono">{value.x}%</span>
        <span>×</span>
        <span className="font-mono">{value.y}%</span>
        <button
          type="button"
          onClick={() => onChange({ x: 50, y: 50 })}
          className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          title="Reset to center"
        >
          ↺
        </button>
      </div>
    </div>
  );
};

export default FocalPointPicker;
