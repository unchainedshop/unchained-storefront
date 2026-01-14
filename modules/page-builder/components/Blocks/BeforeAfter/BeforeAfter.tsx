/**
 * Before/After Block
 * Image comparison slider for showing transformations
 */

import React, { useState, useRef, useCallback } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import type { PageBlock, BeforeAfterContent } from "../../../types";

interface BeforeAfterProps {
  block: PageBlock;
  isPreview?: boolean;
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ block, isPreview }) => {
  // Content is resolved to active locale by BlockRenderer
  const content = block.content as unknown as BeforeAfterContent;
  const style = block.style;

  const [sliderPosition, setSliderPosition] = useState(
    content.initialPosition || 50,
  );
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isHorizontal = content.orientation !== "vertical";

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let position: number;

      if (isHorizontal) {
        position = ((clientX - rect.left) / rect.width) * 100;
      } else {
        position = ((clientY - rect.top) / rect.height) * 100;
      }

      setSliderPosition(Math.max(0, Math.min(100, position)));
    },
    [isHorizontal],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX, e.clientY);
    },
    [isDragging, handleMove],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPreview) return;
    setIsDragging(true);
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [isDragging, handleMove],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    if (isHorizontal) {
      if (e.key === "ArrowLeft") {
        setSliderPosition((p) => Math.max(0, p - step));
      } else if (e.key === "ArrowRight") {
        setSliderPosition((p) => Math.min(100, p + step));
      }
    } else {
      if (e.key === "ArrowUp") {
        setSliderPosition((p) => Math.max(0, p - step));
      } else if (e.key === "ArrowDown") {
        setSliderPosition((p) => Math.min(100, p + step));
      }
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const containerStyle: React.CSSProperties = {
    maxWidth: style.maxWidth || undefined,
    margin: style.alignmentX === "center" ? "0 auto" : undefined,
    borderRadius: style.borderRadius || 0,
  };

  const hasImages = content.beforeImage && content.afterImage;

  if (!hasImages) {
    return (
      <div
        style={containerStyle}
        className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <PhotoIcon className="w-16 h-16 text-slate-300 dark:text-slate-500 mx-auto" />
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              Select before and after images
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className="relative aspect-video overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Image comparison slider"
    >
      {/* Before image (full) */}
      <img
        src={content.beforeImage}
        alt={content.beforeLabel || "Before"}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* After image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={
          isHorizontal
            ? { clipPath: `inset(0 0 0 ${sliderPosition}%)` }
            : { clipPath: `inset(${sliderPosition}% 0 0 0)` }
        }
      >
        <img
          src={content.afterImage}
          alt={content.afterLabel || "After"}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider line and handle */}
      <div
        className="absolute bg-white shadow-lg"
        style={
          isHorizontal
            ? {
                left: `${sliderPosition}%`,
                top: 0,
                bottom: 0,
                width: "3px",
                transform: "translateX(-50%)",
              }
            : {
                top: `${sliderPosition}%`,
                left: 0,
                right: 0,
                height: "3px",
                transform: "translateY(-50%)",
              }
        }
      >
        {/* Handle */}
        <div
          className={`absolute bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center cursor-${isHorizontal ? "ew" : "ns"}-resize`}
          style={
            isHorizontal
              ? {
                  width: "40px",
                  height: "40px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : {
                  width: "40px",
                  height: "40px",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
          }
        >
          {isHorizontal ? (
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l-3 3 3 3m8-6l3 3-3 3"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 8l-3-3-3 3m6 8l-3 3-3-3"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Labels */}
      {content.showLabels && (
        <>
          <span
            className="absolute px-3 py-1 bg-black/60 text-white text-sm font-medium rounded"
            style={
              isHorizontal
                ? { top: "12px", left: "12px" }
                : { top: "12px", left: "12px" }
            }
          >
            {content.beforeLabel || "Before"}
          </span>
          <span
            className="absolute px-3 py-1 bg-black/60 text-white text-sm font-medium rounded"
            style={
              isHorizontal
                ? { top: "12px", right: "12px" }
                : { bottom: "12px", left: "12px" }
            }
          >
            {content.afterLabel || "After"}
          </span>
        </>
      )}
    </div>
  );
};

export default BeforeAfter;
