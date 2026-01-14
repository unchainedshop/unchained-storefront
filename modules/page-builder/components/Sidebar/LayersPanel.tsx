/**
 * Layers Panel
 * Shows the page structure as a tree view
 */

import React from "react";
import classNames from "classnames";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { blockRegistry } from "../../utils/blockRegistry";
import type { PageBlock } from "../../types";

interface LayersPanelProps {
  className?: string;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ className }) => {
  const { state, selectBlock, updateBlock } = usePageBuilder();
  const { page, selection } = state;

  if (!page) {
    return (
      <div
        className={classNames(
          "flex items-center justify-center h-full",
          className,
        )}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No page loaded
        </p>
      </div>
    );
  }

  const renderLayer = (
    block: PageBlock,
    depth: number = 0,
    parentId?: string,
  ) => {
    const isSelected = selection.blockId === block.id;
    const blockDef = blockRegistry[block.type];
    const hasChildren = block.children && block.children.length > 0;

    return (
      <div key={block.id}>
        <div
          className={classNames(
            "group flex items-center gap-1 py-1.5 px-2 cursor-pointer rounded transition-colors",
            isSelected
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => selectBlock(block.id, parentId, true)}
        >
          {/* Expand/collapse icon */}
          <span className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              <ChevronDownIcon className="w-3 h-3" />
            ) : blockDef?.allowChildren ? (
              <ChevronRightIcon className="w-3 h-3 opacity-30" />
            ) : null}
          </span>

          {/* Block type indicator */}
          <span
            className={classNames("w-2 h-2 rounded-full flex-shrink-0", {
              "bg-blue-500":
                block.type.includes("hero") || block.type.includes("banner"),
              "bg-green-500": block.type.includes("product"),
              "bg-purple-500":
                block.type.includes("section") || block.type.includes("column"),
              "bg-amber-500":
                block.type.includes("newsletter") ||
                block.type.includes("promo"),
              "bg-slate-400": true,
            })}
          />

          {/* Block name */}
          <span className="flex-1 truncate text-sm">
            {blockDef?.label || block.type}
          </span>

          {/* Quick actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateBlock(block.id, { hidden: !block.hidden });
              }}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
              title={block.hidden ? "Show" : "Hide"}
            >
              {block.hidden ? (
                <EyeSlashIcon className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <EyeIcon className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateBlock(block.id, { locked: !block.locked });
              }}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
              title={block.locked ? "Unlock" : "Lock"}
            >
              {block.locked ? (
                <LockClosedIcon className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <LockOpenIcon className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && (
          <div>
            {block.children!.map((child) =>
              renderLayer(child, depth + 1, block.id),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classNames("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-medium text-slate-900 dark:text-white">Layers</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {page.blocks.length} {page.blocks.length === 1 ? "block" : "blocks"}
        </p>
      </div>

      {/* Tree view */}
      <div className="flex-1 overflow-y-auto p-2">
        {page.blocks.length > 0 ? (
          page.blocks.map((block) => renderLayer(block))
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No blocks yet
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Block types
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Hero
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Products
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Layout
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Marketing
          </span>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;
