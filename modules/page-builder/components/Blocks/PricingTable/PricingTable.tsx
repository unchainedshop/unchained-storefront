/**
 * Pricing Table Block
 * Compare pricing tiers with features
 */

import React from "react";
import Link from "next/link";
import classNames from "classnames";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { PageBlock, PricingTableContent } from "../../../types";

interface PricingTableProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const PricingTable: React.FC<PricingTableProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as PricingTableContent;
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

  if (content.tiers.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add pricing tiers in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading) && (
          <div className="text-center mb-12">
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

        {/* Tiers Grid */}
        <div
          className={classNames(
            "grid gap-6",
            columnClasses[content.columns || 3],
          )}
        >
          {content.tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                "relative flex flex-col rounded-2xl p-8 transition-all",
                tier.highlighted
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105 z-10"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
              )}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3
                className={classNames(
                  "text-xl font-bold mb-2",
                  tier.highlighted
                    ? "text-white dark:text-slate-900"
                    : "text-slate-900 dark:text-white",
                )}
              >
                {tier.name}
              </h3>

              {/* Description */}
              {tier.description && (
                <p
                  className={classNames(
                    "text-sm mb-6",
                    tier.highlighted
                      ? "text-slate-300 dark:text-slate-600"
                      : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {tier.description}
                </p>
              )}

              {/* Price */}
              <div className="mb-6">
                <span
                  className={classNames(
                    "text-4xl font-bold",
                    tier.highlighted
                      ? "text-white dark:text-slate-900"
                      : "text-slate-900 dark:text-white",
                  )}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span
                    className={classNames(
                      "text-sm ml-1",
                      tier.highlighted
                        ? "text-slate-400 dark:text-slate-500"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    /{tier.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon
                      className={classNames(
                        "w-5 h-5 flex-shrink-0 mt-0.5",
                        tier.highlighted
                          ? "text-green-400 dark:text-green-600"
                          : "text-green-500",
                      )}
                    />
                    <span
                      className={classNames(
                        "text-sm",
                        tier.highlighted
                          ? "text-slate-300 dark:text-slate-600"
                          : "text-slate-600 dark:text-slate-300",
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={isPreview ? "#" : tier.buttonLink}
                className={classNames(
                  "w-full py-3 px-6 text-center font-semibold rounded-lg transition-colors",
                  tier.highlighted
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100",
                )}
              >
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
