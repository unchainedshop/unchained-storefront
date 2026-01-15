/**
 * Help Panel - Displays block documentation
 * Shows what the block does, tips, use cases, and key settings
 */

import React from "react";
import {
  InformationCircleIcon,
  LightBulbIcon,
  SparklesIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { blockRegistry } from "../../utils/blockRegistry";
import type { BlockType, BlockDocumentation } from "../../types";

interface HelpPanelProps {
  blockType: BlockType;
}

interface HelpSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const HelpSection: React.FC<HelpSectionProps> = ({ icon, title, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {title}
      </span>
    </div>
    <div className="pl-6">{children}</div>
  </div>
);

const HelpPanel: React.FC<HelpPanelProps> = ({ blockType }) => {
  const blockDef = blockRegistry[blockType];
  const doc = blockDef?.documentation;

  if (!doc) {
    return (
      <div className="p-4 text-center">
        <InformationCircleIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No documentation available for this block.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* About */}
      <HelpSection
        icon={<InformationCircleIcon className="w-4 h-4" />}
        title="About"
      >
        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
          {doc.helpText}
        </p>
      </HelpSection>

      {/* Tips */}
      {doc.tips && doc.tips.length > 0 && (
        <HelpSection
          icon={<LightBulbIcon className="w-4 h-4" />}
          title="Tips"
        >
          <ul className="space-y-1.5">
            {doc.tips.map((tip, index) => (
              <li
                key={index}
                className="text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2"
              >
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </HelpSection>
      )}

      {/* Use Cases */}
      {doc.useCases && doc.useCases.length > 0 && (
        <HelpSection
          icon={<SparklesIcon className="w-4 h-4" />}
          title="Use Cases"
        >
          <ul className="space-y-1.5">
            {doc.useCases.map((useCase, index) => (
              <li
                key={index}
                className="text-[12px] text-slate-600 dark:text-slate-400 flex items-start gap-2"
              >
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </HelpSection>
      )}

      {/* Key Settings */}
      {doc.keySettings && doc.keySettings.length > 0 && (
        <HelpSection
          icon={<Cog6ToothIcon className="w-4 h-4" />}
          title="Key Settings"
        >
          <div className="space-y-2">
            {doc.keySettings.map((setting, index) => (
              <div key={index}>
                <div className="text-[12px] font-medium text-slate-700 dark:text-slate-300">
                  {setting.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {setting.description}
                </div>
              </div>
            ))}
          </div>
        </HelpSection>
      )}
    </div>
  );
};

export default HelpPanel;
