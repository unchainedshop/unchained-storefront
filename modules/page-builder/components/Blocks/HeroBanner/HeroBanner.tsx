/**
 * Hero Banner Block
 * Full-width hero section with background image, heading, and CTA
 */

import React, { useState, Suspense } from "react";
import Link from "next/link";
import classNames from "classnames";
import {
  PhotoIcon,
  PlusIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import type { PageBlock, HeroBannerContent } from "../../../types";
import type { MediaAsset } from "../../../../media/types";
import EditableText from "../../EditableText";
import { usePageBuilder } from "../../../context/PageBuilderContext";

// Lazy load MediaPickerModal at module level to avoid re-creation on each render
const MediaPickerModal = React.lazy(
  () => import("../../../../media/components/MediaPickerModal"),
);

interface HeroBannerProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as HeroBannerContent;
  const style = block.style;
  const { updateBlock } = usePageBuilder();
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Check if the block is empty (no content set)
  const isEmpty =
    !content.heading &&
    !content.subheading &&
    !style.backgroundImage &&
    !style.backgroundColor;
  const hasNoBackground = !style.backgroundImage && !style.backgroundColor;

  // Handle background image selection
  const handleImageSelect = (asset: MediaAsset) => {
    // Use url or thumbnailUrl as fallback
    const imageUrl = asset.url || asset.thumbnailUrl;
    if (imageUrl) {
      updateBlock(block.id, {
        style: {
          ...style,
          backgroundImage: imageUrl,
        },
      });
    }
    setShowMediaPicker(false);
  };

  const containerStyle: React.CSSProperties = {
    minHeight: style.minHeight || 500,
    backgroundColor: isEmpty ? undefined : style.backgroundColor || "#1e293b",
    backgroundImage: style.backgroundImage
      ? `url(${style.backgroundImage})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  const verticalAlignmentClasses = {
    top: "justify-start",
    center: "justify-center",
    bottom: "justify-end",
  };

  // Empty state skeleton
  if (isEmpty && isEditing) {
    return (
      <>
        <div
          className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group"
          style={{ minHeight: style.minHeight || 500 }}
        >
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#475569_1px,transparent_1px),linear-gradient(to_bottom,#475569_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          {/* Main content area */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[inherit] px-4 py-12">
            {/* Two options: Upload image or Start with color */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              {/* Upload image option */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMediaPicker(true);
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all w-56"
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <ArrowUpTrayIcon className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Upload Image
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Add a background image
                </p>
              </button>

              <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                or
              </span>

              {/* Start with color option */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlock(block.id, {
                    content: {
                      ...content,
                      heading: "Your Headline Here",
                      subheading:
                        "Add a compelling description for your hero section",
                    },
                    style: {
                      ...style,
                      backgroundColor: "#1e293b",
                      textColor: "#ffffff",
                    },
                  });
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all w-56"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mb-3">
                  <PhotoIcon className="w-6 h-6 text-white/80" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Solid Color
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Start with a color background
                </p>
              </button>
            </div>

            {/* Content skeleton preview */}
            <div className="max-w-xl mx-auto text-center space-y-4 opacity-40">
              {/* Heading skeleton */}
              <div className="space-y-2">
                <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg w-3/4 mx-auto" />
                <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg w-1/2 mx-auto" />
              </div>

              {/* Subheading skeleton */}
              <div className="space-y-1.5 pt-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mx-auto" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto" />
              </div>

              {/* Button skeletons */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <div className="h-10 w-28 bg-slate-300 dark:bg-slate-600 rounded-lg" />
                <div className="h-10 w-28 border-2 border-slate-300 dark:border-slate-600 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Media Picker Modal */}
        {showMediaPicker && (
          <Suspense fallback={null}>
            <MediaPickerModal
              isOpen={showMediaPicker}
              onClose={() => setShowMediaPicker(false)}
              onSelect={handleImageSelect}
              allowedTypes={["image/*"]}
            />
          </Suspense>
        )}
      </>
    );
  }

  return (
    <div className="relative overflow-hidden" style={containerStyle}>
      {/* Background placeholder pattern when no image */}
      {hasNoBackground && !isEmpty && isEditing && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%)] bg-[length:20px_20px]" />
        </div>
      )}

      {/* Background overlay */}
      {style.backgroundOverlay && style.backgroundOverlay > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: style.backgroundOverlayColor || "#000000",
            opacity: style.backgroundOverlay / 100,
          }}
        />
      )}

      {/* Content */}
      <div
        className={classNames(
          "relative z-10 flex flex-col h-full min-h-[inherit] px-4 sm:px-8 md:px-16 lg:px-24 w-full",
          alignmentClasses[style.alignmentX || "center"],
          verticalAlignmentClasses[style.alignmentY || "center"],
        )}
      >
        <div
          className={classNames(
            "w-full",
            style.alignmentX === "center" && "max-w-4xl mx-auto",
          )}
        >
          <EditableText
            blockId={block.id}
            field="heading"
            value={content.heading || ""}
            tag="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ color: style.textColor || "#ffffff" }}
            placeholder="Enter heading..."
          />

          <EditableText
            blockId={block.id}
            field="subheading"
            value={content.subheading || ""}
            tag="p"
            className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90"
            style={{ color: style.textColor || "#ffffff" }}
            placeholder="Enter subheading..."
          />

          <div
            className={classNames(
              "flex flex-wrap gap-4",
              style.alignmentX === "right"
                ? "justify-end"
                : style.alignmentX === "left"
                  ? "justify-start"
                  : "justify-center",
            )}
          >
            {content.buttonText && content.buttonLink ? (
              <Link
                href={isPreview ? "#" : content.buttonLink}
                className={classNames(
                  "inline-flex items-center px-8 py-3 font-semibold rounded-lg transition-colors",
                  content.buttonVariant === "link"
                    ? "underline hover:no-underline"
                    : content.buttonVariant === "secondary"
                      ? "border-2 border-current hover:bg-white/10"
                      : "bg-white text-slate-900 hover:bg-slate-100",
                )}
                style={
                  content.buttonVariant === "link" ||
                  content.buttonVariant === "secondary"
                    ? { color: style.textColor || "#ffffff" }
                    : undefined
                }
              >
                {content.buttonText}
              </Link>
            ) : isEditing ? (
              <div className="px-8 py-3 border-2 border-dashed border-white/30 rounded-lg text-white/50 text-sm">
                Add primary button in settings
              </div>
            ) : null}

            {content.secondaryButtonText && content.secondaryButtonLink ? (
              <Link
                href={isPreview ? "#" : content.secondaryButtonLink}
                className={classNames(
                  "inline-flex items-center px-8 py-3 font-semibold rounded-lg transition-colors",
                  content.secondaryButtonVariant === "link"
                    ? "underline hover:no-underline"
                    : content.secondaryButtonVariant === "primary"
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "border-2 border-current hover:bg-white/10",
                )}
                style={
                  content.secondaryButtonVariant === "primary"
                    ? undefined
                    : { color: style.textColor || "#ffffff" }
                }
              >
                {content.secondaryButtonText}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
