/**
 * Team Grid Block
 * Display team members with photos and bios
 */

import React from "react";
import classNames from "classnames";
import { PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import type { PageBlock, TeamGridContent } from "../../../types";

interface TeamGridProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const TeamGrid: React.FC<TeamGridProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as TeamGridContent;
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

  if (content.members.length === 0 && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlusIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add team members in the settings panel
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

        {/* Team Grid */}
        <div
          className={classNames(
            "grid gap-8",
            columnClasses[content.columns || 3],
          )}
        >
          {content.members.map((member) => (
            <div key={member.id} className="text-center">
              {/* Photo */}
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: style.textColor || "#0f172a" }}
              >
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {member.role}
              </p>

              {/* Bio */}
              {content.showBio && member.bio && (
                <p
                  className="text-sm opacity-80 mb-4"
                  style={{ color: style.textColor }}
                >
                  {member.bio}
                </p>
              )}

              {/* Social Links */}
              {content.showSocial && member.social && (
                <div className="flex items-center justify-center gap-3">
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {member.social.email && (
                    <a
                      href={`mailto:${member.social.email}`}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamGrid;
