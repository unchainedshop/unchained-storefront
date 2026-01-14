/**
 * Feature Grid Block
 * Icon + title + description feature cards
 */

import React from "react";
import Link from "next/link";
import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/outline";
import * as HeroIcons from "@heroicons/react/24/outline";
import type { PageBlock, FeatureGridContent } from "../../../types";

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
    circle: "rounded-full bg-slate-100 dark:bg-slate-800 p-3",
    square: "rounded-none bg-slate-100 dark:bg-slate-800 p-3",
    rounded: "rounded-xl bg-slate-100 dark:bg-slate-800 p-3",
  };

  if (content.features.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add features in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading) && (
          <div
            className={classNames(
              "mb-12",
              content.alignment === "center" && "text-center",
            )}
          >
            {content.heading && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: style.textColor }}
              >
                {content.heading}
              </h2>
            )}
            {content.subheading && (
              <p
                className="text-lg opacity-80"
                style={{ color: style.textColor }}
              >
                {content.subheading}
              </p>
            )}
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
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: style.textColor || "#0f172a" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm opacity-70 leading-relaxed"
                  style={{ color: style.textColor }}
                >
                  {feature.description}
                </p>
              </div>
            );

            if (feature.link && !isPreview) {
              return (
                <Link
                  key={feature.id}
                  href={feature.link}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 -m-4 rounded-xl transition-colors"
                >
                  {FeatureContent}
                </Link>
              );
            }

            return <div key={feature.id}>{FeatureContent}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
