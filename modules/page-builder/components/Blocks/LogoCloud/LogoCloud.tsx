/**
 * Logo Cloud Block
 * Display partner/press logos in a grid
 */

import React from "react";
import classNames from "classnames";
import { PlusIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import type { PageBlock, LogoCloudContent } from "../../../types";

interface LogoCloudProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const LogoCloud: React.FC<LogoCloudProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as LogoCloudContent;
  const style = block.style;

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  const columnClasses = {
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-3 md:grid-cols-5",
    6: "grid-cols-3 md:grid-cols-6",
  };

  if (content.logos.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add logos in the settings panel
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {content.heading && (
          <div className="text-center mb-10">
            <p
              className="text-sm font-semibold uppercase tracking-wide opacity-60"
              style={{ color: style.textColor }}
            >
              {content.heading}
            </p>
          </div>
        )}

        {/* Logos Grid */}
        <div
          className={classNames(
            "grid gap-8 items-center justify-items-center",
            columnClasses[content.columns || 5],
          )}
        >
          {content.logos.map((logo) => {
            const LogoContent = (
              <div className="flex flex-col items-center gap-3">
                {logo.image ? (
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className={classNames(
                      "h-8 md:h-10 w-auto object-contain transition-opacity",
                      content.grayscale &&
                        "grayscale opacity-50 hover:grayscale-0 hover:opacity-100",
                    )}
                  />
                ) : (
                  <div className="h-10 w-24 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                {content.showNames && (
                  <span
                    className="text-xs font-medium opacity-60"
                    style={{ color: style.textColor }}
                  >
                    {logo.name}
                  </span>
                )}
              </div>
            );

            if (logo.link && !isPreview) {
              return (
                <a
                  key={logo.id}
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-105 transition-transform"
                >
                  {LogoContent}
                </a>
              );
            }

            return <div key={logo.id}>{LogoContent}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
