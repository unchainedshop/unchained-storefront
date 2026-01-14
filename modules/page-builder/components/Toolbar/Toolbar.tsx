/**
 * Toolbar Component
 * Main toolbar with save, preview, publish, and viewport controls
 */

import React, { useState } from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";
import {
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  CheckIcon,
  CloudArrowUpIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import type { Viewport, PageStatus } from "../../types";
import { VIEWPORT_WIDTHS } from "../../types";
import { PresenceAvatars, ConnectionStatus } from "../Collaboration";
import UndoRedoButtons from "./UndoRedoButtons";

interface ToolbarProps {
  onBack?: () => void;
  onSave?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  onOpenTemplates?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onBack,
  onSave,
  onPublish,
  onOpenTemplates,
}) => {
  const { formatMessage } = useIntl();
  const {
    state,
    setViewport,
    setZoom,
    togglePreview,
    toggleFocusMode,
    updatePageMeta,
  } = usePageBuilder();

  const {
    page,
    viewport,
    zoom,
    isDirty,
    isSaving,
    isPreviewMode,
    isFocusMode,
  } = state;
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  const [showViewportMenu, setShowViewportMenu] = useState(false);

  // Viewport categories for the button group
  type ViewportCategory = "mobile" | "tablet" | "desktop";
  const viewportCategories: {
    id: ViewportCategory;
    icon: React.FC<{ className?: string }>;
    viewports: Viewport[];
  }[] = [
    {
      id: "mobile",
      icon: DevicePhoneMobileIcon,
      viewports: ["mobile"],
    },
    {
      id: "tablet",
      icon: DeviceTabletIcon,
      viewports: ["tablet", "tablet-lg"],
    },
    {
      id: "desktop",
      icon: ComputerDesktopIcon,
      viewports: ["laptop", "desktop", "desktop-lg", "desktop-xl"],
    },
  ];

  // Get current category from viewport
  const getCurrentCategory = (): ViewportCategory => {
    if (viewport === "mobile") return "mobile";
    if (["tablet", "tablet-lg"].includes(viewport)) return "tablet";
    return "desktop";
  };

  // All viewport options for dropdown
  const allViewportOptions: {
    id: Viewport;
    label: string;
    width: number;
    category: ViewportCategory;
  }[] = [
    { id: "mobile", label: "Mobile", width: 390, category: "mobile" },
    { id: "tablet", label: "Tablet", width: 768, category: "tablet" },
    {
      id: "tablet-lg",
      label: "Tablet Landscape",
      width: 1024,
      category: "tablet",
    },
    { id: "laptop", label: "Laptop", width: 1280, category: "desktop" },
    { id: "desktop", label: "Desktop", width: 1520, category: "desktop" },
    {
      id: "desktop-lg",
      label: "Desktop Large",
      width: 1728,
      category: "desktop",
    },
    { id: "desktop-xl", label: "Desktop XL", width: 1920, category: "desktop" },
  ];

  const zoomOptions = [50, 75, 100, 125, 150, 200];

  const statusOptions: { value: PageStatus; label: string; color: string }[] = [
    {
      value: "draft",
      label: formatMessage({ id: "pb_draft", defaultMessage: "Draft" }),
      color: "bg-amber-500",
    },
    {
      value: "published",
      label: formatMessage({ id: "pb_published", defaultMessage: "Published" }),
      color: "bg-green-500",
    },
    {
      value: "archived",
      label: formatMessage({ id: "pb_archived", defaultMessage: "Archived" }),
      color: "bg-slate-500",
    },
  ];

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
  };

  const handlePublish = async () => {
    if (onPublish) {
      await onPublish();
    }
  };

  const currentStatus =
    statusOptions.find((s) => s.value === page?.status) || statusOptions[0];

  return (
    <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Pages</span>
          </button>
        )}

        {/* Page title */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={page?.title || ""}
            onChange={(e) => updatePageMeta({ title: e.target.value })}
            className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white"
            placeholder="Page Title"
          />
          {isDirty && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Unsaved
            </span>
          )}
        </div>
      </div>

      {/* Center section - Viewport & Zoom */}
      <div className="flex items-center gap-2">
        {/* Templates button */}
        {onOpenTemplates && (
          <button
            onClick={onOpenTemplates}
            className="p-2 rounded transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2"
            title="Templates"
          >
            <RectangleStackIcon className="w-4 h-4" />
          </button>
        )}

        {/* Undo/Redo with dropdown */}
        <UndoRedoButtons />

        {/* Viewport switcher */}
        <div className="relative flex items-center">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {viewportCategories.map((category) => {
              const Icon = category.icon;
              const isActive = getCurrentCategory() === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    // Set to first viewport in category if not already in this category
                    if (!isActive) {
                      setViewport(category.viewports[0]);
                    }
                  }}
                  className={classNames(
                    "p-2 rounded transition-colors",
                    isActive
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
                  )}
                  title={
                    category.id.charAt(0).toUpperCase() + category.id.slice(1)
                  }
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Width dropdown */}
          <button
            onClick={() => setShowViewportMenu(!showViewportMenu)}
            className="flex items-center gap-1 ml-2 px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <span>{VIEWPORT_WIDTHS[viewport]}px</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>

          {showViewportMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowViewportMenu(false)}
              />
              <div className="absolute top-full mt-1 left-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 min-w-[180px]">
                {/* Group by category */}
                {(["mobile", "tablet", "desktop"] as const).map(
                  (category, idx) => (
                    <div key={category}>
                      {idx > 0 && (
                        <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                      )}
                      <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {category}
                      </div>
                      {allViewportOptions
                        .filter((opt) => opt.category === category)
                        .map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setViewport(option.id);
                              setShowViewportMenu(false);
                            }}
                            className={classNames(
                              "w-full flex items-center justify-between px-3 py-1.5 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700",
                              viewport === option.id
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-600 dark:text-slate-400",
                            )}
                          >
                            <span>{option.label}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {option.width}px
                            </span>
                            {viewport === option.id && (
                              <CheckIcon className="w-4 h-4 text-slate-900 dark:text-white ml-2" />
                            )}
                          </button>
                        ))}
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </div>

        {/* Zoom */}
        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <span>{zoom}%</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>

          {showZoomMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowZoomMenu(false)}
              />
              <div className="absolute top-full mt-1 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20">
                {zoomOptions.map((z) => (
                  <button
                    key={z}
                    onClick={() => {
                      setZoom(z);
                      setShowZoomMenu(false);
                    }}
                    className={classNames(
                      "w-full px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700",
                      zoom === z
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300",
                    )}
                  >
                    {z}%
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-3">
        {/* Collaboration presence */}
        <div className="hidden lg:flex items-center gap-3 border-r border-slate-200 dark:border-slate-700 pr-3 mr-1">
          <PresenceAvatars maxVisible={4} />
          <ConnectionStatus showLabel={false} />
        </div>

        {/* Focus mode toggle */}
        <button
          onClick={() => toggleFocusMode()}
          className={classNames(
            "p-2 rounded transition-colors",
            isFocusMode
              ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
          )}
          title={isFocusMode ? "Exit Focus Mode (F)" : "Focus Mode (F)"}
        >
          {isFocusMode ? (
            <ArrowsPointingOutIcon className="w-4 h-4" />
          ) : (
            <ArrowsPointingInIcon className="w-4 h-4" />
          )}
        </button>

        {/* Preview toggle */}
        <button
          onClick={() => togglePreview()}
          className={classNames(
            "flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors",
            isPreviewMode
              ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
          )}
        >
          {isPreviewMode ? (
            <>
              <EyeSlashIcon className="w-4 h-4" />
              <span>Exit Preview</span>
            </>
          ) : (
            <>
              <EyeIcon className="w-4 h-4" />
              <span>Preview</span>
            </>
          )}
        </button>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
            <span>{currentStatus.label}</span>
            <ChevronDownIcon className="w-3 h-3" />
          </button>

          {showStatusMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowStatusMenu(false)}
              />
              <div className="absolute top-full mt-1 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-20 min-w-[140px]">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => {
                      updatePageMeta({ status: status.value });
                      setShowStatusMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                    <span className="text-slate-700 dark:text-slate-300">
                      {status.label}
                    </span>
                    {page?.status === status.value && (
                      <CheckIcon className="w-4 h-4 ml-auto text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={classNames(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            isDirty && !isSaving
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
              : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed",
          )}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="w-4 h-4" />
              <span>Save</span>
            </>
          )}
        </button>

        {/* Publish button */}
        <button
          onClick={handlePublish}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <span>Publish</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
