/**
 * BlockPickerModal Component
 * Beautiful modal wizard for selecting and adding blocks
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  RectangleGroupIcon,
  ViewColumnsIcon,
  ArrowsUpDownIcon,
  DocumentTextIcon,
  PhotoIcon,
  PresentationChartBarIcon,
  Squares2X2Icon,
  ArrowsRightLeftIcon,
  FolderIcon,
  ClockIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  SparklesIcon,
  ArrowLeftIcon,
  CheckIcon,
  VideoCameraIcon,
  TableCellsIcon,
  MapPinIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { blockRegistry, blockCategories } from "../utils/blockRegistry";
import { getAvailableBlocksForParent } from "../utils/nestingRules";
import { heroPresets, type HeroPreset } from "../utils/heroPresets";
import type { BlockType } from "../types";

// Map string icon names to actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "rectangle-group": RectangleGroupIcon,
  "view-columns": ViewColumnsIcon,
  "arrows-up-down": ArrowsUpDownIcon,
  "document-text": DocumentTextIcon,
  photo: PhotoIcon,
  "presentation-chart-bar": PresentationChartBarIcon,
  "squares-2x2": Squares2X2Icon,
  "arrows-right-left": ArrowsRightLeftIcon,
  folder: FolderIcon,
  clock: ClockIcon,
  envelope: EnvelopeIcon,
  megaphone: MegaphoneIcon,
  "chat-bubble-left-right": ChatBubbleLeftRightIcon,
  "code-bracket": CodeBracketIcon,
  "video-camera": VideoCameraIcon,
  "table-cells": TableCellsIcon,
  "map-pin": MapPinIcon,
  camera: CameraIcon,
};

interface BlockOverrides {
  content?: Record<string, any>;
  style?: Record<string, any>;
}

interface BlockPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (blockType: BlockType, overrides?: BlockOverrides) => void;
  /** If adding inside a parent block, pass the parent's type to filter available blocks */
  parentBlockType?: BlockType | null;
}

const BlockPickerModal: React.FC<BlockPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectBlock,
  parentBlockType = null,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showHeroPresets, setShowHeroPresets] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const resetModal = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setShowHeroPresets(false);
    setSelectedPresetId(null);
  }, []);

  const handleSelectBlock = useCallback(
    (blockType: BlockType, overrides?: BlockOverrides) => {
      // If selecting hero-banner, show preset selection first
      if (blockType === "hero-banner" && !overrides) {
        setShowHeroPresets(true);
        return;
      }
      onSelectBlock(blockType, overrides);
      onClose();
      resetModal();
    },
    [onSelectBlock, onClose, resetModal],
  );

  const handleSelectPreset = useCallback(
    (preset: HeroPreset) => {
      onSelectBlock("hero-banner", {
        content: preset.content,
        style: preset.style,
      });
      onClose();
      resetModal();
    },
    [onSelectBlock, onClose, resetModal],
  );

  const handleBack = useCallback(() => {
    setShowHeroPresets(false);
    setSelectedPresetId(null);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Get available block types based on parent context
  const availableBlockTypes = getAvailableBlocksForParent(parentBlockType);

  const filteredBlocks = Object.entries(blockRegistry).filter(
    ([type, block]) => {
      // Check if this block type is available for the current parent
      const isAvailableForParent = availableBlockTypes.includes(
        type as BlockType,
      );
      if (!isAvailableForParent) return false;

      const matchesSearch =
        searchQuery === "" ||
        block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || block.category === selectedCategory;

      return matchesSearch && matchesCategory;
    },
  );

  // Use portal to render outside of any stacking context
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={classNames(
          "fixed inset-0 z-[10000] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Right-side Panel */}
      <div
        className={classNames(
          "fixed top-3 right-3 bottom-3 z-[10001] w-[50vw]",
          "rounded-2xl flex flex-col overflow-hidden",
          // Glassmorphism
          "bg-white/80 dark:bg-slate-900/80",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-white/60 dark:border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2.5">
            {showHeroPresets && (
              <button
                onClick={handleBack}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors mr-0.5"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="w-7 h-7 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center">
              {showHeroPresets ? (
                <PresentationChartBarIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              ) : (
                <SparklesIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              )}
            </div>
            <div>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">
                {showHeroPresets ? "Choose Hero Style" : "Add Block"}
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {showHeroPresets
                  ? "Select a preset to start with"
                  : parentBlockType
                    ? `Add inside ${blockRegistry[parentBlockType]?.label || parentBlockType}`
                    : "Choose a component to add"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {!showHeroPresets && (
          <>
            {/* Search */}
            <div className="px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search components..."
                  className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-lg focus:outline-none focus:border-slate-300 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 transition-colors text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setSelectedCategory(null)}
                className={classNames(
                  "px-2.5 py-1 text-[10px] font-medium rounded-md transition-all",
                  selectedCategory === null
                    ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50",
                )}
              >
                All
              </button>
              {blockCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={classNames(
                    "px-2.5 py-1 text-[10px] font-medium rounded-md transition-all",
                    selectedCategory === category.id
                      ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {showHeroPresets ? (
            /* Hero Preset Grid */
            <div className="grid grid-cols-2 gap-3">
              {heroPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  onMouseEnter={() => setSelectedPresetId(preset.id)}
                  onMouseLeave={() => setSelectedPresetId(null)}
                  className={classNames(
                    "group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-150",
                    selectedPresetId === preset.id
                      ? "border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 shadow-md"
                      : "border-slate-200/80 dark:border-slate-700/80 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm",
                  )}
                >
                  {/* Preview Thumbnail */}
                  <div
                    className="h-20 w-full flex items-center justify-center relative"
                    style={{ background: preset.preview }}
                  >
                    {/* Mini preview of alignment */}
                    <div
                      className={classNames(
                        "absolute inset-3 flex flex-col gap-1",
                        preset.style.alignmentX === "left" && "items-start",
                        preset.style.alignmentX === "center" && "items-center",
                        preset.style.alignmentX === "right" && "items-end",
                        preset.style.alignmentY === "top" && "justify-start",
                        preset.style.alignmentY === "center" &&
                          "justify-center",
                        preset.style.alignmentY === "bottom" && "justify-end",
                      )}
                    >
                      <div className="w-12 h-1.5 bg-white/80 rounded" />
                      <div className="w-10 h-1 bg-white/50 rounded" />
                      <div className="w-6 h-1 bg-white/70 rounded mt-0.5" />
                    </div>
                    {/* Selection indicator */}
                    {selectedPresetId === preset.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-slate-500 dark:bg-slate-400 rounded-full flex items-center justify-center shadow-sm">
                        <CheckIcon className="w-3 h-3 text-white dark:text-slate-900" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-2.5 text-left">
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center mb-2.5">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                No blocks found
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Try a different search term
              </p>
            </div>
          ) : (
            /* Block Grid */
            <div className="grid grid-cols-2 gap-2">
              {filteredBlocks.map(([type, block]) => {
                const IconComponent =
                  typeof block.icon === "string" ? iconMap[block.icon] : null;

                return (
                  <button
                    key={type}
                    onClick={() => handleSelectBlock(type as BlockType)}
                    className="group flex items-start gap-2.5 p-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all duration-150 text-left"
                  >
                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-slate-100/80 dark:bg-slate-700/50 rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
                      {IconComponent ? (
                        <IconComponent className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      ) : (
                        <div className="w-4 h-4 bg-slate-300 dark:bg-slate-500 rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {block.label}
                      </div>
                      {block.description && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
                          {block.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>
              {showHeroPresets
                ? `${heroPresets.length} hero styles`
                : `${filteredBlocks.length} components`}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-100/80 dark:bg-slate-800/80 rounded text-[9px] font-mono text-slate-400 dark:text-slate-500">
                Esc
              </kbd>
              <span className="text-slate-400 dark:text-slate-500">
                to close
              </span>
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default BlockPickerModal;
