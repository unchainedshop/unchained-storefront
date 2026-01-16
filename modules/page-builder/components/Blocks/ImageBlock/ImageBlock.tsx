/**
 * Image Block
 * Displays an image with optional link, caption, focal point, and aspect ratio
 */

import React from "react";
import Link from "next/link";
import { PhotoIcon } from "@heroicons/react/24/outline";
import type { PageBlock, ImageBlockContent } from "../../../types";

interface ImageBlockProps {
  block: PageBlock;
  isPreview?: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, isPreview }) => {
  const content = block.content as unknown as ImageBlockContent;
  const style = block.style;

  // Aspect ratio CSS classes
  const aspectRatioClasses: Record<string, string> = {
    original: "",
    "1:1": "aspect-square",
    "4:3": "aspect-[4/3]",
    "3:2": "aspect-[3/2]",
    "16:9": "aspect-video",
    "21:9": "aspect-[21/9]",
    "9:16": "aspect-[9/16]",
  };

  // Object fit CSS classes
  const objectFitClasses: Record<string, string> = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  };

  // Calculate object position from focal point
  const focalPoint = content.focalPoint || { x: 50, y: 50 };
  const objectPosition = `${focalPoint.x}% ${focalPoint.y}%`;

  const containerStyle: React.CSSProperties = {
    maxWidth: style.maxWidth || undefined,
    margin: style.alignmentX === "center" ? "0 auto" : undefined,
  };

  const imageStyle: React.CSSProperties = {
    objectPosition,
  };

  const aspectRatioClass =
    aspectRatioClasses[content.aspectRatio || "original"] || "";
  const objectFitClass =
    objectFitClasses[content.objectFit || "cover"] || "object-cover";

  // When no aspect ratio is set, stretch to fill container (useful for grid cells)
  const fillContainer =
    !content.aspectRatio || content.aspectRatio === "original";

  const ImageContent = (
    <div
      className={`overflow-hidden ${aspectRatioClass} ${fillContainer ? "w-full h-full min-h-[120px]" : ""}`}
      style={fillContainer ? { flex: 1 } : undefined}
    >
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt || ""}
          className={`w-full h-full ${objectFitClass}`}
          style={imageStyle}
        />
      ) : (
        <div className="w-full h-full min-h-[120px] flex items-center justify-center border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50 bg-periwinkle-50/30 dark:bg-periwinkle-500/5">
          <div className="text-center text-periwinkle-400 dark:text-periwinkle-300">
            <PhotoIcon className="w-8 h-8 mx-auto" />
            <p className="mt-2 text-sm font-medium">Add Image</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <figure
      className={fillContainer ? "w-full h-full flex flex-col" : ""}
      style={
        fillContainer
          ? { ...containerStyle, flex: 1, minHeight: 0 }
          : containerStyle
      }
    >
      {content.link && !isPreview ? (
        <Link
          href={content.link}
          className="block w-full flex flex-col"
          style={{ flex: 1, minHeight: 0 }}
        >
          {ImageContent}
        </Link>
      ) : (
        ImageContent
      )}

      {content.caption && (
        <figcaption className="mt-3 px-6 text-sm text-center text-slate-500 dark:text-slate-400">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
