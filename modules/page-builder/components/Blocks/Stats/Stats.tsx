/**
 * Stats Block
 * Display metrics with big numbers and labels
 */

import React from "react";
import classNames from "classnames";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { PageBlock, StatsContent } from "../../../types";

interface StatsProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const Stats: React.FC<StatsProps> = ({ block, isPreview, isEditing = true }) => {
  const content = block.content as StatsContent;
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
    const valueContent = (
      <>
        {stat.prefix && <span className="text-2xl md:text-3xl">{stat.prefix}</span>}
        {stat.value}
        {stat.suffix && <span className="text-2xl md:text-3xl">{stat.suffix}</span>}
      </>
    );

    switch (content.style) {
      case "cards":
        return (
          <div
            key={stat.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <div
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ color: style.textColor || "#0f172a" }}
            >
              {valueContent}
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              {stat.label}
            </div>
          </div>
        );

      case "bordered":
        return (
          <div
            key={stat.id}
            className="text-center py-8 border-l border-slate-200 dark:border-slate-700 first:border-l-0"
          >
            <div
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ color: style.textColor }}
            >
              {valueContent}
            </div>
            <div
              className="text-sm uppercase tracking-wide opacity-70"
              style={{ color: style.textColor }}
            >
              {stat.label}
            </div>
          </div>
        );

      case "simple":
      default:
        return (
          <div key={stat.id} className="text-center">
            <div
              className="text-5xl md:text-6xl font-bold mb-2"
              style={{ color: style.textColor }}
            >
              {valueContent}
            </div>
            <div
              className="text-lg opacity-70"
              style={{ color: style.textColor }}
            >
              {stat.label}
            </div>
          </div>
        );
    }
  };

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
