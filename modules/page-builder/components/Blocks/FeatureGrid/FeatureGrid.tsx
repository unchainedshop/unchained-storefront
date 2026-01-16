/**
 * Feature Grid Block
 * Icon + title + description feature cards
 */

import React, { useCallback } from "react";
import Link from "next/link";
import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/outline";
import * as HeroIcons from "@heroicons/react/24/outline";
import type { PageBlock, FeatureGridContent } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import InlineRichText from "../../InlineRichText";

interface FeatureGridProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

// Map icon names to Heroicons
const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  // Convert kebab-case to PascalCase
  const pascalCase = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const IconComponent = (HeroIcons as any)[`${pascalCase}Icon`];
  return IconComponent || null;
};

const FeatureGrid: React.FC<FeatureGridProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as unknown as FeatureGridContent;
  const style = block.style;
  const { updateBlock, state } = usePageBuilder();
  const canEdit = isEditing && !state.isPreviewMode;

  // Handler for updating individual feature fields
  const updateFeature = useCallback(
    (featureId: string, field: "title" | "description", value: string) => {
      const updatedFeatures = content.features.map((f) =>
        f.id === featureId ? { ...f, [field]: value } : f,
      );
      updateBlock(block.id, {
        content: { features: updatedFeatures },
      });
    },
    [block.id, content.features, updateBlock],
  );

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  const columnClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const iconStyleClasses = {
    none: "",
    circle:
      "rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md p-3 ring-1 ring-slate-200/50 dark:ring-white/10",
    square:
      "rounded-none bg-white/40 dark:bg-white/5 backdrop-blur-md p-3 ring-1 ring-slate-200/50 dark:ring-white/10",
    rounded:
      "rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-md p-3 ring-1 ring-slate-200/50 dark:ring-white/10",
  };

  if (content.features.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-periwinkle-50/30 dark:bg-periwinkle-500/5 rounded-xl border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-periwinkle-400 dark:text-periwinkle-300 mb-3" />
        <p className="text-periwinkle-400 dark:text-periwinkle-300 text-sm font-medium">
          Add features in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading || canEdit) && (
          <div
            className={classNames(
              "mb-12",
              content.alignment === "center" && "text-center",
            )}
          >
            <InlineRichText
              blockId={block.id}
              field="heading"
              value={content.heading || ""}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: style.textColor }}
              placeholder="Add heading..."
              multiline={false}
              enableLinks={false}
            />
            <InlineRichText
              blockId={block.id}
              field="subheading"
              value={content.subheading || ""}
              tag="p"
              className="text-lg opacity-80"
              style={{ color: style.textColor }}
              placeholder="Add subheading..."
              multiline={false}
            />
          </div>
        )}

        {/* Features Grid */}
        <div
          className={classNames(
            "grid gap-8",
            columnClasses[content.columns || 3],
          )}
        >
          {content.features.map((feature) => {
            const IconComponent = getIcon(feature.icon);

            const FeatureContent = (
              <div
                className={classNames(
                  content.alignment === "center" && "text-center items-center",
                  content.alignment === "left" && "text-left items-start",
                  "flex flex-col",
                )}
              >
                {/* Icon */}
                {IconComponent && content.iconStyle !== "none" && (
                  <div
                    className={classNames(
                      "mb-4 inline-flex",
                      iconStyleClasses[content.iconStyle || "circle"],
                    )}
                  >
                    <IconComponent
                      className="w-6 h-6"
                      style={{ color: style.textColor || "#0f172a" }}
                    />
                  </div>
                )}

                {/* Title */}
                <InlineRichText
                  blockId={block.id}
                  field={`features.${feature.id}.title`}
                  value={feature.title || ""}
                  tag="h3"
                  className="text-lg font-semibold mb-2"
                  style={{ color: style.textColor || "#0f172a" }}
                  placeholder="Feature title..."
                  multiline={false}
                  enableLinks={false}
                  onUpdate={(value) =>
                    updateFeature(feature.id, "title", value)
                  }
                />

                {/* Description */}
                <InlineRichText
                  blockId={block.id}
                  field={`features.${feature.id}.description`}
                  value={feature.description || ""}
                  tag="p"
                  className="text-sm opacity-70 leading-relaxed"
                  style={{ color: style.textColor }}
                  placeholder="Feature description..."
                  multiline={true}
                  onUpdate={(value) =>
                    updateFeature(feature.id, "description", value)
                  }
                />
              </div>
            );

            if (feature.link && !isPreview && !canEdit) {
              return (
                <Link
                  key={feature.id}
                  href={feature.link}
                  className="group p-4 -m-4 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-150 ease-out"
                >
                  {FeatureContent}
                </Link>
              );
            }

            return (
              <div
                key={feature.id}
                className="p-4 -m-4 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-150 ease-out"
              >
                {FeatureContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
