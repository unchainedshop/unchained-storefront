/**
 * Block Library
 * Quick overview panel with tips and page structure info
 * (Blocks are added via modal - click + buttons on canvas)
 */

import React from "react";
import {
  SparklesIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";

const BlockLibrary: React.FC = () => {
  const { state } = usePageBuilder();
  const blockCount = state.page?.blocks.length || 0;

  const tips = [
    {
      icon: CursorArrowRaysIcon,
      title: "Click + to add blocks",
      description: "Use the + buttons on the canvas to add new components",
    },
    {
      icon: EyeIcon,
      title: "Preview your page",
      description: "Click Preview in the toolbar to see the final result",
    },
    {
      icon: DocumentDuplicateIcon,
      title: "Duplicate blocks",
      description: "Select a block and click the duplicate icon",
    },
    {
      icon: ArrowPathIcon,
      title: "Undo changes",
      description: "Press ⌘Z to undo, ⌘⇧Z to redo",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Page Stats */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl rainbow-gradient flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Page Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {blockCount} {blockCount === 1 ? "block" : "blocks"} on this page
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              {blockCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Total Blocks
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              {state.page?.status === "published" ? "Live" : "Draft"}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Status
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 mb-3">
          <LightBulbIcon className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Quick Tips
          </span>
        </div>

        <div className="space-y-2">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <tip.icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium">
            +
          </span>
          <span>Click to add blocks</span>
        </div>
      </div>
    </div>
  );
};

export default BlockLibrary;
