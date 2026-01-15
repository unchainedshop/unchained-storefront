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
          "bg-white dark:bg-slate-900 rounded-2xl shadow-2xl",
          "flex flex-col overflow-hidden",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {showHeroPresets && (
              <button
                onClick={handleBack}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mr-1"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl rainbow-gradient flex items-center justify-center">
              {showHeroPresets ? (
                <PresentationChartBarIcon className="w-5 h-5 text-slate-700" />
              ) : (
                <SparklesIcon className="w-5 h-5 text-slate-700" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {showHeroPresets ? "Choose Hero Style" : "Add Block"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {showHeroPresets
                  ? "Select a preset to start with"
                  : parentBlockType
                    ? `Choose a component to add inside ${blockRegistry[parentBlockType]?.label || parentBlockType}`
                    : "Choose a component to add to your page"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {!showHeroPresets && (
          <>
            {/* Search */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search components..."
                  className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-700 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Categories */}
            <div className="category-filter">
              <button
                onClick={() => setSelectedCategory(null)}
                className={classNames(
                  "category-filter__item",
                  selectedCategory === null && "category-filter__item--active",
                )}
              >
                All
              </button>
              {blockCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={classNames(
                    "category-filter__item",
                    selectedCategory === category.id &&
                      "category-filter__item--active",
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {showHeroPresets ? (
            /* Hero Preset Grid */
            <div className="grid grid-cols-2 gap-4">
              {heroPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  onMouseEnter={() => setSelectedPresetId(preset.id)}
                  onMouseLeave={() => setSelectedPresetId(null)}
                  className={classNames(
                    "group relative flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200",
                    selectedPresetId === preset.id
                      ? "border-slate-900 dark:border-white shadow-lg shadow-slate-900/20 dark:shadow-white/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500",
                  )}
                >
                  {/* Preview Thumbnail */}
                  <div
                    className="h-24 w-full flex items-center justify-center relative"
                    style={{ background: preset.preview }}
                  >
                    {/* Mini preview of alignment */}
                    <div
                      className={classNames(
                        "absolute inset-4 flex flex-col gap-1",
                        preset.style.alignmentX === "left" && "items-start",
                        preset.style.alignmentX === "center" && "items-center",
                        preset.style.alignmentX === "right" && "items-end",
                        preset.style.alignmentY === "top" && "justify-start",
                        preset.style.alignmentY === "center" &&
                          "justify-center",
                        preset.style.alignmentY === "bottom" && "justify-end",
                      )}
                    >
                      <div className="w-16 h-2 bg-white/80 rounded" />
                      <div className="w-12 h-1.5 bg-white/50 rounded" />
                      <div className="w-8 h-1.5 bg-white/70 rounded mt-1" />
                    </div>
                    {/* Selection indicator */}
                    {selectedPresetId === preset.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white dark:text-slate-900" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3 bg-white dark:bg-slate-800 text-left">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {preset.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {preset.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No blocks found
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            /* Block Grid */
            <div className="grid grid-cols-2 gap-4">
              {filteredBlocks.map(([type, block]) => {
                const IconComponent =
                  typeof block.icon === "string" ? iconMap[block.icon] : null;

                return (
                  <button
                    key={type}
                    onClick={() => handleSelectBlock(type as BlockType)}
                    className="group flex items-start gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-xl group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                      {IconComponent ? (
                        <IconComponent className="w-7 h-7 text-slate-600 dark:text-slate-300" />
                      ) : (
                        <div className="w-7 h-7 bg-slate-300 dark:bg-slate-500 rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {block.label}
                      </div>
                      {block.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
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
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {showHeroPresets
                ? `${heroPresets.length} hero styles available`
                : `${filteredBlocks.length} components available`}
            </span>
            <span className="flex items-center gap-1">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded shadow-sm font-mono">
                Esc
              </kbd>{" "}
              to close
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default BlockPickerModal;
