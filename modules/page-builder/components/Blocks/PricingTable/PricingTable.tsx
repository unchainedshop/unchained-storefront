/**
 * Pricing Table Block
 * Compare pricing tiers with features
 */

import React, { useCallback } from "react";
import Link from "next/link";
import classNames from "classnames";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { PageBlock, PricingTableContent } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import InlineRichText from "../../InlineRichText";

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
  const content = block.content as unknown as PricingTableContent;
  const style = block.style;
  const { updateBlock, state } = usePageBuilder();
  const canEdit = isEditing && !state.isPreviewMode;
  const isMobileViewport = state.viewport === "mobile";

  // Handler for updating individual tier fields
  const updateTier = useCallback(
    (
      tierId: string,
      field:
        | "name"
        | "description"
        | "price"
        | "period"
        | "badge"
        | "buttonText",
      value: string,
    ) => {
      const updatedTiers = content.tiers.map((t) =>
        t.id === tierId ? { ...t, [field]: value } : t,
      );
      updateBlock(block.id, {
        content: { tiers: updatedTiers },
      });
    },
    [block.id, content.tiers, updateBlock],
  );

  // Handler for updating tier features
  const updateTierFeature = useCallback(
    (tierId: string, featureIndex: number, value: string) => {
      const updatedTiers = content.tiers.map((t) => {
        if (t.id === tierId) {
          const updatedFeatures = [...t.features];
          updatedFeatures[featureIndex] = value;
          return { ...t, features: updatedFeatures };
        }
        return t;
      });
      updateBlock(block.id, {
        content: { tiers: updatedTiers },
      });
    },
    [block.id, content.tiers, updateBlock],
  );

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  // Compute columns based on simulated viewport
  const columns = isMobileViewport ? 1 : content.tiers?.length || 3;

  if (content.tiers.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-periwinkle-50/30 dark:bg-periwinkle-500/5 rounded-xl border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-periwinkle-400 dark:text-periwinkle-300 mb-3" />
        <p className="text-periwinkle-400 dark:text-periwinkle-300 text-sm font-medium">
          Add pricing tiers in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading || canEdit) && (
          <div className="text-center mb-12">
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

        {/* Tiers Grid */}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {content.tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                "relative flex flex-col rounded-2xl p-8",
                // Frost glassmorphism
                "shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
                "hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]",
                "transition-all duration-300 ease-out",
                tier.highlighted
                  ? // Highlighted: grey glass style
                    "bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"
                  : // Standard: frosted glass
                    "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
              )}
            >
              {/* Badge - Grey glass style */}
              {(tier.badge || canEdit) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-semibold bg-slate-800/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-slate-900 rounded-full">
                    <InlineRichText
                      blockId={block.id}
                      field={`tiers.${tier.id}.badge`}
                      value={tier.badge || ""}
                      tag="span"
                      placeholder="Badge"
                      multiline={false}
                      enableLinks={false}
                      onUpdate={(value) => updateTier(tier.id, "badge", value)}
                    />
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <InlineRichText
                blockId={block.id}
                field={`tiers.${tier.id}.name`}
                value={tier.name || ""}
                tag="h3"
                className="text-xl font-bold mb-2 text-slate-900 dark:text-white"
                placeholder="Tier name..."
                multiline={false}
                enableLinks={false}
                onUpdate={(value) => updateTier(tier.id, "name", value)}
              />

              {/* Description */}
              <InlineRichText
                blockId={block.id}
                field={`tiers.${tier.id}.description`}
                value={tier.description || ""}
                tag="p"
                className="text-sm mb-6 text-slate-500 dark:text-slate-400"
                placeholder="Description..."
                multiline={false}
                onUpdate={(value) => updateTier(tier.id, "description", value)}
              />

              {/* Price */}
              <div className="mb-6">
                <InlineRichText
                  blockId={block.id}
                  field={`tiers.${tier.id}.price`}
                  value={tier.price || ""}
                  tag="span"
                  className="text-4xl font-bold text-slate-900 dark:text-white"
                  placeholder="$0"
                  multiline={false}
                  enableLinks={false}
                  onUpdate={(value) => updateTier(tier.id, "price", value)}
                />
                {(tier.period || canEdit) && (
                  <InlineRichText
                    blockId={block.id}
                    field={`tiers.${tier.id}.period`}
                    value={tier.period ? `/${tier.period}` : ""}
                    tag="span"
                    className="text-sm ml-1 text-slate-500 dark:text-slate-400"
                    placeholder="/month"
                    multiline={false}
                    enableLinks={false}
                    onUpdate={(value) =>
                      updateTier(tier.id, "period", value.replace(/^\//, ""))
                    }
                  />
                )}
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" />
                    <InlineRichText
                      blockId={block.id}
                      field={`tiers.${tier.id}.features.${idx}`}
                      value={feature || ""}
                      tag="span"
                      className="text-sm text-slate-600 dark:text-slate-300"
                      placeholder="Feature..."
                      multiline={false}
                      onUpdate={(value) =>
                        updateTierFeature(tier.id, idx, value)
                      }
                    />
                  </li>
                ))}
              </ul>

              {/* CTA Button - Frost style */}
              {canEdit ? (
                <div className="w-full py-3 px-6 text-center font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all duration-200">
                  <InlineRichText
                    blockId={block.id}
                    field={`tiers.${tier.id}.buttonText`}
                    value={tier.buttonText || ""}
                    tag="span"
                    placeholder="Button text..."
                    multiline={false}
                    enableLinks={false}
                    onUpdate={(value) =>
                      updateTier(tier.id, "buttonText", value)
                    }
                  />
                </div>
              ) : (
                <Link
                  href={isPreview ? "#" : tier.buttonLink}
                  className="w-full py-3 px-6 text-center font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200"
                >
                  {tier.buttonText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
