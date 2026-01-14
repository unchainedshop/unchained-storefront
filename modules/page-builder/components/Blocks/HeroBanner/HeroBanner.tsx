/**
 * Hero Banner Block
 * Full-width hero section with multiple layout variants
 */

import React, { useState, Suspense } from "react";
import Link from "next/link";
import classNames from "classnames";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import type {
  PageBlock,
  HeroBannerContent,
  HeroVariant,
  TextOverlayVariant,
} from "../../../types";
import type { MediaAsset } from "../../../../media/types";
import EditableText from "../../EditableText";
import { usePageBuilder } from "../../../context/PageBuilderContext";

// Lazy load MediaPickerModal
const MediaPickerModal = React.lazy(
  () => import("../../../../media/components/MediaPickerModal"),
);

// Helper to check if a color is light (for auto mode)
const isLightColor = (hex: string): boolean => {
  if (!hex) return true;
  const c = hex.replace("#", "");
  if (c.length < 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

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
  const content = block.content as unknown as HeroBannerContent;
  const style = block.style;
  const { updateBlock } = usePageBuilder();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<
    "background" | "hero" | "grid-0" | "grid-1" | "grid-2"
  >("background");

  const variant = content.variant || "centered";

  // Check if the block is empty
  const isEmpty =
    !content.heading &&
    !content.subheading &&
    !style.backgroundImage &&
    !style.backgroundColor;
  const hasNoBackground = !style.backgroundImage && !style.backgroundColor;

  // Handle image selection
  const handleImageSelect = (asset: MediaAsset) => {
    const imageUrl = asset.url || asset.thumbnailUrl;
    if (!imageUrl) {
      setShowMediaPicker(false);
      return;
    }

    if (mediaPickerTarget === "background") {
      updateBlock(block.id, {
        style: { backgroundImage: imageUrl },
      });
    } else if (mediaPickerTarget === "hero") {
      updateBlock(block.id, {
        content: { heroImage: imageUrl },
      });
    } else if (mediaPickerTarget.startsWith("grid-")) {
      const index = parseInt(mediaPickerTarget.split("-")[1]);
      const gridImages = [...(content.gridImages || [])];
      gridImages[index] = imageUrl;
      updateBlock(block.id, {
        content: { gridImages },
      });
    }
    setShowMediaPicker(false);
  };

  const openMediaPicker = (
    target: "background" | "hero" | "grid-0" | "grid-1" | "grid-2",
  ) => {
    setMediaPickerTarget(target);
    setShowMediaPicker(true);
  };

  // Calculate background position from focal point
  const focalPoint = style.backgroundFocalPoint || { x: 50, y: 50 };
  const backgroundPosition = `${focalPoint.x}% ${focalPoint.y}%`;

  const containerStyle: React.CSSProperties = {
    minHeight: style.minHeight || 500,
    backgroundColor: isEmpty ? undefined : style.backgroundColor || "#1e293b",
    backgroundImage:
      variant === "centered" && style.backgroundImage
        ? `url(${style.backgroundImage})`
        : undefined,
    backgroundSize: style.backgroundObjectFit || "cover",
    backgroundPosition,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
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
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMediaPicker("background");
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all w-56"
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-3">
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

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateBlock(block.id, {
                    content: {
                      heading: "Your Headline Here",
                      subheading:
                        "Add a compelling description for your hero section",
                    },
                    style: {
                      backgroundColor: "#1e293b",
                      textColor: "#ffffff",
                    },
                  });
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all w-56"
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
              <div className="space-y-2">
                <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg w-3/4 mx-auto" />
                <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg w-1/2 mx-auto" />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mx-auto" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto" />
              </div>
              <div className="flex items-center justify-center gap-3 pt-4">
                <div className="h-10 w-28 bg-slate-300 dark:bg-slate-600 rounded-lg" />
                <div className="h-10 w-28 border-2 border-slate-300 dark:border-slate-600 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

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

  // Render text content section
  const renderTextContent = (
    alignment: "left" | "center" | "right" = "left",
  ) => {
    const alignClasses = {
      left: "text-left items-start",
      center: "text-center items-center",
      right: "text-right items-end",
    };

    // Text overlay settings
    const overlayVariant = content.textOverlay || "none";
    const intensity = content.textOverlayIntensity ?? 50;
    const colorMode = content.textOverlayColorMode || "dark";

    // Determine if using light or dark overlay
    const useLightOverlay =
      colorMode === "light" ||
      (colorMode === "auto" && !isLightColor(style.textColor || "#ffffff"));

    // Calculate overlay styles
    const getOverlayStyles = (): {
      wrapperClass: string;
      wrapperStyle: React.CSSProperties;
      textStyle: React.CSSProperties;
    } => {
      const baseOpacity = intensity / 100;
      const overlayRgb = useLightOverlay ? "255,255,255" : "0,0,0";
      const borderRgb = useLightOverlay ? "0,0,0" : "255,255,255";

      switch (overlayVariant) {
        case "glass":
          return {
            wrapperClass:
              "backdrop-blur-md rounded-2xl p-6 @md:p-8 border transition-all",
            wrapperStyle: {
              backgroundColor: `rgba(${overlayRgb}, ${baseOpacity * 0.4})`,
              borderColor: `rgba(${borderRgb}, 0.1)`,
            },
            textStyle: {},
          };
        case "solid":
          return {
            wrapperClass: "rounded-xl p-6 @md:p-8 transition-all",
            wrapperStyle: {
              backgroundColor: `rgba(${overlayRgb}, ${baseOpacity * 0.7})`,
            },
            textStyle: {},
          };
        case "gradient":
          return {
            wrapperClass: "relative rounded-xl p-6 @md:p-8 transition-all",
            wrapperStyle: {
              background: `linear-gradient(to top, rgba(${overlayRgb}, ${baseOpacity * 0.8}) 0%, rgba(${overlayRgb}, ${baseOpacity * 0.4}) 50%, transparent 100%)`,
            },
            textStyle: {},
          };
        case "text-shadow":
          return {
            wrapperClass: "",
            wrapperStyle: {},
            textStyle: {
              textShadow: `0 2px 4px rgba(${overlayRgb}, ${baseOpacity}), 0 4px 12px rgba(${overlayRgb}, ${baseOpacity * 0.8}), 0 8px 24px rgba(${overlayRgb}, ${baseOpacity * 0.6})`,
            },
          };
        default:
          return {
            wrapperClass: "",
            wrapperStyle: {},
            textStyle: {},
          };
      }
    };

    const { wrapperClass, wrapperStyle, textStyle } = getOverlayStyles();
    const hasWrapper =
      overlayVariant !== "none" && overlayVariant !== "text-shadow";

    const textContentElement = (
      <>
        <EditableText
          blockId={block.id}
          field="heading"
          value={content.heading || ""}
          tag="h1"
          className="text-4xl @md:text-5xl @lg:text-6xl font-bold mb-4"
          style={{ color: style.textColor || "#ffffff", ...textStyle }}
          placeholder="Enter heading..."
        />

        <EditableText
          blockId={block.id}
          field="subheading"
          value={content.subheading || ""}
          tag="p"
          className="text-lg @md:text-xl @lg:text-2xl mb-8 opacity-90"
          style={{ color: style.textColor || "#ffffff", ...textStyle }}
          placeholder="Enter subheading..."
        />

        <div
          className={classNames(
            "flex flex-wrap gap-4",
            alignment === "right"
              ? "justify-end"
              : alignment === "left"
                ? "justify-start"
                : "justify-center",
          )}
          style={textStyle}
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

          {content.secondaryButtonText && content.secondaryButtonLink && (
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
          )}
        </div>
      </>
    );

    // Wrap content if overlay requires a wrapper
    if (hasWrapper) {
      return (
        <div className={classNames("flex flex-col", alignClasses[alignment])}>
          <div className={wrapperClass} style={wrapperStyle}>
            <div
              className={classNames("flex flex-col", alignClasses[alignment])}
            >
              {textContentElement}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={classNames("flex flex-col", alignClasses[alignment])}>
        {textContentElement}
      </div>
    );
  };

  // Render hero image for split layouts
  const renderHeroImage = () => {
    if (content.heroImage) {
      const heroFocalPoint = content.heroImageFocalPoint || { x: 50, y: 50 };
      const heroObjectPosition = `${heroFocalPoint.x}% ${heroFocalPoint.y}%`;

      return (
        <div className="relative w-full min-h-[300px] @md:min-h-[400px]">
          <img
            src={content.heroImage}
            alt=""
            className="w-full h-full object-cover rounded-2xl"
            style={{ objectPosition: heroObjectPosition }}
          />
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openMediaPicker("hero");
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-2xl"
            >
              <span className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium text-sm">
                Change Image
              </span>
            </button>
          )}
        </div>
      );
    }

    if (isEditing) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openMediaPicker("hero");
          }}
          className="w-full min-h-[300px] @md:min-h-[400px] flex flex-col items-center justify-center bg-white/10 border-2 border-dashed border-white/30 rounded-2xl hover:border-white/50 hover:bg-white/20 transition-all"
        >
          <PhotoIcon className="w-12 h-12 text-white/50 mb-3" />
          <span className="text-white/70 font-medium">Add Hero Image</span>
        </button>
      );
    }

    return null;
  };

  // Render image grid for grid layouts
  const renderImageGrid = () => {
    const images = content.gridImages || [];
    const focalPoints = content.gridImagesFocalPoints || [];

    return (
      <div className="grid grid-cols-2 gap-3 h-full">
        {[0, 1, 2].map((index) => {
          const image = images[index];
          const isLarge = index === 0;
          const gridFocalPoint = focalPoints[index] || { x: 50, y: 50 };
          const gridObjectPosition = `${gridFocalPoint.x}% ${gridFocalPoint.y}%`;

          if (image) {
            return (
              <div
                key={index}
                className={classNames(
                  "relative overflow-hidden rounded-xl",
                  isLarge && "col-span-2 row-span-1",
                )}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{
                    minHeight: isLarge ? 200 : 150,
                    objectPosition: gridObjectPosition,
                  }}
                />
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openMediaPicker(`grid-${index}` as any);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <span className="px-3 py-1.5 bg-white text-slate-900 rounded-lg font-medium text-xs">
                      Change
                    </span>
                  </button>
                )}
              </div>
            );
          }

          if (isEditing) {
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  openMediaPicker(`grid-${index}` as any);
                }}
                className={classNames(
                  "flex flex-col items-center justify-center bg-white/10 border-2 border-dashed border-white/30 rounded-xl hover:border-white/50 hover:bg-white/20 transition-all",
                  isLarge && "col-span-2",
                )}
                style={{ minHeight: isLarge ? 200 : 150 }}
              >
                <PhotoIcon className="w-8 h-8 text-white/50 mb-2" />
                <span className="text-white/70 text-sm">Add Image</span>
              </button>
            );
          }

          return null;
        })}
      </div>
    );
  };

  // Layout-specific rendering
  const renderLayout = () => {
    switch (variant) {
      case "text-left":
        return (
          <div className="relative z-10 flex items-center h-full min-h-[inherit] px-6 @sm:px-12 @md:px-16 @lg:px-24">
            <div className="max-w-2xl">{renderTextContent("left")}</div>
          </div>
        );

      case "text-right":
        return (
          <div className="relative z-10 flex items-center justify-end h-full min-h-[inherit] px-6 @sm:px-12 @md:px-16 @lg:px-24">
            <div className="max-w-2xl">{renderTextContent("right")}</div>
          </div>
        );

      case "split-left":
        return (
          <div className="relative z-10 grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12 items-center min-h-[inherit] px-6 @sm:px-12 @md:px-16 @lg:px-24 py-12">
            <div>{renderTextContent("left")}</div>
            <div>{renderHeroImage()}</div>
          </div>
        );

      case "split-right":
        return (
          <div className="relative z-10 grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12 items-center min-h-[inherit] px-6 @sm:px-12 @md:px-16 @lg:px-24 py-12">
            <div className="order-2 @md:order-1">{renderHeroImage()}</div>
            <div className="order-1 @md:order-2">
              {renderTextContent("left")}
            </div>
          </div>
        );

      case "image-grid-right":
        return (
          <div className="relative z-10 grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12 items-center min-h-[inherit] px-6 @sm:px-12 @md:px-16 @lg:px-24 py-12">
            <div>{renderTextContent("left")}</div>
            <div>{renderImageGrid()}</div>
          </div>
        );

      case "image-grid-left":
        return (
          <div className="relative z-10 grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12 items-center min-h-[inherit] px-6 @sm:px-12 @md:px-16 @lg:px-24 py-12">
            <div className="order-2 @md:order-1">{renderImageGrid()}</div>
            <div className="order-1 @md:order-2">
              {renderTextContent("left")}
            </div>
          </div>
        );

      case "centered":
      default:
        return (
          <div
            className={classNames(
              "relative z-10 flex flex-col h-full min-h-[inherit] px-4 @sm:px-8 @md:px-16 @lg:px-24 w-full",
              style.alignmentX === "left"
                ? "items-start"
                : style.alignmentX === "right"
                  ? "items-end"
                  : "items-center",
              style.alignmentY === "top"
                ? "justify-start"
                : style.alignmentY === "bottom"
                  ? "justify-end"
                  : "justify-center",
            )}
          >
            <div
              className={classNames(
                "w-full",
                style.alignmentX === "center" && "max-w-4xl mx-auto",
              )}
            >
              {renderTextContent(style.alignmentX || "center")}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="@container relative overflow-hidden"
        style={containerStyle}
      >
        {/* Background image for non-centered layouts */}
        {variant !== "centered" && style.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${style.backgroundImage})` }}
          />
        )}

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

        {renderLayout()}
      </div>

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
};

export default HeroBanner;
