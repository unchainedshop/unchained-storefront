/**
 * Stats Block
 * Display metrics with big numbers and labels
 */

import React, { useCallback } from "react";
import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { PageBlock, StatsContent } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import InlineRichText from "../../InlineRichText";

interface StatsProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const Stats: React.FC<StatsProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as unknown as StatsContent;
  const style = block.style;
  const { updateBlock, state } = usePageBuilder();
  const canEdit = isEditing && !state.isPreviewMode;

  // Handler for updating individual stat fields
  const updateStat = useCallback(
    (statId: string, field: "value" | "label", value: string) => {
      const updatedStats = content.stats.map((s) =>
        s.id === statId ? { ...s, [field]: value } : s,
      );
      updateBlock(block.id, {
        content: { stats: updatedStats },
      });
    },
    [block.id, content.stats, updateBlock],
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

  if (content.stats.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add stats in the settings panel
        </p>
      </div>
    );
  }

  const renderStat = (stat: StatsContent["stats"][0]) => {
    const renderValue = (className: string, textColor?: string) => (
      <div
        className={classNames(
          className,
          "flex items-baseline justify-center gap-1",
        )}
        style={{ color: textColor }}
      >
        {stat.prefix && (
          <span className="text-2xl md:text-3xl">{stat.prefix}</span>
        )}
        <InlineRichText
          blockId={block.id}
          field={`stats.${stat.id}.value`}
          value={stat.value || ""}
          tag="span"
          className="inline"
          style={{ color: textColor }}
          placeholder="0"
          multiline={false}
          enableLinks={false}
          onUpdate={(value) => updateStat(stat.id, "value", value)}
        />
        {stat.suffix && (
          <span className="text-2xl md:text-3xl">{stat.suffix}</span>
        )}
      </div>
    );

    const renderLabel = (className: string, textColor?: string) => (
      <InlineRichText
        blockId={block.id}
        field={`stats.${stat.id}.label`}
        value={stat.label || ""}
        tag="div"
        className={className}
        style={{ color: textColor }}
        placeholder="Label..."
        multiline={false}
        enableLinks={false}
        onUpdate={(value) => updateStat(stat.id, "label", value)}
      />
    );

    switch (content.style) {
      case "cards":
        return (
          <div
            key={stat.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700"
          >
            {renderValue(
              "text-4xl md:text-5xl font-bold mb-2",
              style.textColor || "#0f172a",
            )}
            {renderLabel(
              "text-slate-500 dark:text-slate-400 font-medium text-center",
            )}
          </div>
        );

      case "bordered":
        return (
          <div
            key={stat.id}
            className="text-center py-8 border-l border-slate-200 dark:border-slate-700 first:border-l-0"
          >
            {renderValue(
              "text-4xl md:text-5xl font-bold mb-2",
              style.textColor,
            )}
            {renderLabel(
              "text-sm uppercase tracking-wide opacity-70 text-center",
              style.textColor,
            )}
          </div>
        );

      case "simple":
      default:
        return (
          <div key={stat.id} className="text-center">
            {renderValue(
              "text-5xl md:text-6xl font-bold mb-2",
              style.textColor,
            )}
            {renderLabel("text-lg opacity-70 text-center", style.textColor)}
          </div>
        );
    }
  };

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

        {/* Stats Grid */}
        <div
          className={classNames(
            "grid gap-8",
            columnClasses[content.columns || 4],
          )}
        >
          {content.stats.map(renderStat)}
        </div>
      </div>
    </div>
  );
};

export default Stats;
