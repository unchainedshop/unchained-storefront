/**
 * Toolbar Component
 * Glassmorphism toolbar with save, preview, publish, and viewport controls
 */

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { useIntl } from "react-intl";
import {
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  EyeIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import type { Viewport, PageStatus } from "../../types";
import { VIEWPORT_WIDTHS } from "../../types";
import { PresenceAvatars, ConnectionStatus } from "../Collaboration";
import UndoRedoButtons from "./UndoRedoButtons";
import WorkflowActions from "./WorkflowActions";
import UnchainedLogo from "../UnchainedLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  getLocalizedString,
  setLocalizedString,
} from "../../utils/localization";
import AutosaveIndicator from "./AutosaveIndicator";
import type { AutosaveStatus } from "../../hooks/useAutosave";

interface ToolbarProps {
  onBack?: () => void;
  onSave?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  onWorkflowChange?: (newStatus: PageStatus) => Promise<void>;
  onOpenTemplates?: () => void;
  userRoles?: string[];
  // Autosave props
  autosaveStatus?: AutosaveStatus;
  autosaveLastSaved?: Date | null;
  autosaveError?: string | null;
  onAutosaveRetry?: () => void;
  onAutosaveDismissError?: () => void;
}

// Glassmorphism dropdown component
interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  align = "left",
  width = "min-w-[180px]",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className={classNames(
          "absolute top-full mt-2 z-50",
          // Glassmorphism: translucent bg + heavy blur + subtle border
          "bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl backdrop-saturate-150",
          "rounded-2xl",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "border border-white/50 dark:border-white/10",
          "ring-1 ring-black/5 dark:ring-white/5",
          "py-2 overflow-hidden",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
          width,
          align === "right" ? "right-0" : "left-0",
        )}
      >
        {children}
      </div>
    </>
  );
};

// Glassmorphism toolbar button component
interface ToolbarButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: "ghost" | "glass" | "primary" | "secondary";
  size?: "sm" | "md";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  disabled,
  active,
  variant = "ghost",
  size = "md",
  title,
  children,
  className,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  const variants = {
    ghost: classNames(
      "rounded-xl",
      active
        ? "bg-white/60 dark:bg-white/10 backdrop-blur-xl text-slate-900 dark:text-white shadow-sm"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5",
      disabled &&
        "!text-slate-300 dark:!text-slate-600 cursor-not-allowed hover:bg-transparent",
    ),
    glass: classNames(
      "rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-xl",
      "border border-white/60 dark:border-white/10",
      "shadow-sm",
      active
        ? "text-slate-900 dark:text-white ring-2 ring-white/50 dark:ring-white/20"
        : "text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/15",
      disabled && "!text-slate-400 dark:!text-slate-500 cursor-not-allowed",
    ),
    secondary: classNames(
      "rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-xl",
      "border border-white/70 dark:border-white/15",
      "text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/15",
      "shadow-sm hover:shadow-md",
      disabled &&
        "!text-slate-400 dark:!text-slate-500 !bg-white/30 cursor-not-allowed",
    ),
    primary: classNames(
      "rounded-xl",
      "bg-gradient-to-b from-slate-800 to-slate-900 dark:from-white dark:to-slate-100",
      "text-white dark:text-slate-900",
      "shadow-lg shadow-slate-900/25 dark:shadow-white/25",
      "hover:shadow-xl hover:shadow-slate-900/30 dark:hover:shadow-white/30",
      "hover:from-slate-700 hover:to-slate-800 dark:hover:from-slate-50 dark:hover:to-white",
      "border border-slate-700 dark:border-white/80",
      disabled && "!bg-slate-300 dark:!bg-slate-600 cursor-not-allowed",
    ),
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
};

// Frosted divider
const ToolbarDivider: React.FC = () => (
  <div className="w-px h-6 bg-gradient-to-b from-slate-300/50 via-slate-400/30 to-slate-300/50 dark:from-white/20 dark:via-white/10 dark:to-white/20 mx-2" />
);

const Toolbar: React.FC<ToolbarProps> = ({
  onBack,
  onSave,
  onPublish,
  onWorkflowChange,
  onOpenTemplates,
  userRoles = ["admin"],
  autosaveStatus,
  autosaveLastSaved,
  autosaveError,
  onAutosaveRetry,
  onAutosaveDismissError,
}) => {
  const { formatMessage } = useIntl();
  const {
    state,
    setViewport,
    setZoom,
    togglePreview,
    toggleFocusMode,
    updatePageMeta,
    activeLocale,
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

  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showViewportMenu, setShowViewportMenu] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);

  // Viewport categories
  type ViewportCategory = "mobile" | "tablet" | "desktop";
  const viewportCategories: {
    id: ViewportCategory;
    icon: React.FC<{ className?: string }>;
    viewports: Viewport[];
    label: string;
  }[] = [
    {
      id: "mobile",
      icon: DevicePhoneMobileIcon,
      viewports: ["mobile"],
      label: "Mobile",
    },
    {
      id: "tablet",
      icon: DeviceTabletIcon,
      viewports: ["tablet", "tablet-lg"],
      label: "Tablet",
    },
    {
      id: "desktop",
      icon: ComputerDesktopIcon,
      viewports: ["laptop", "desktop", "desktop-lg", "desktop-xl"],
      label: "Desktop",
    },
  ];

  const getCurrentCategory = (): ViewportCategory => {
    if (viewport === "mobile") return "mobile";
    if (["tablet", "tablet-lg"].includes(viewport)) return "tablet";
    return "desktop";
  };

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

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    }
  };

  return (
    <div
      className={classNames(
        "h-14 flex items-center justify-between px-3 sticky top-0 z-50",
        // Glassmorphism background
        "bg-white/60 dark:bg-slate-900/60",
        "backdrop-blur-2xl backdrop-saturate-150",
        // Subtle border with gradient
        "border-b border-white/50 dark:border-white/10",
        // Soft shadow for depth
        "shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)]",
        "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]",
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Logo + Brand */}
        <button
          type="button"
          onClick={onBack}
          className={classNames(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl",
            onBack && "cursor-pointer hover:bg-white/50 dark:hover:bg-white/5",
            "transition-all duration-200",
          )}
          title={onBack ? "Back to Pages" : undefined}
        >
          <UnchainedLogo size={14} className="text-slate-900 dark:text-white" />
          <span className="hidden md:block text-[13px] font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            Buildor
          </span>
        </button>

        <ToolbarDivider />

        {/* Page title */}
        <div className="flex items-center gap-3">
          <div
            className={classNames(
              "relative px-3 py-1.5 rounded-xl transition-all duration-200",
              titleFocused
                ? "bg-white/70 dark:bg-white/10 backdrop-blur-xl ring-2 ring-slate-400/30 dark:ring-white/20 shadow-inner"
                : "hover:bg-white/40 dark:hover:bg-white/5",
            )}
          >
            <input
              type="text"
              value={getLocalizedString(page?.title, activeLocale) || ""}
              onChange={(e) =>
                updatePageMeta({
                  title: setLocalizedString(
                    page?.title,
                    activeLocale,
                    e.target.value,
                  ),
                })
              }
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              className="text-[15px] font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 dark:text-white w-[120px] sm:w-[180px] md:w-[240px] placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Untitled Page"
            />
          </div>

          {/* Autosave status indicator */}
          {autosaveStatus && (
            <AutosaveIndicator
              status={autosaveStatus}
              lastSaved={autosaveLastSaved || null}
              error={autosaveError || null}
              onRetry={onAutosaveRetry}
              onDismissError={onAutosaveDismissError}
            />
          )}
        </div>
      </div>

      {/* Center section - Viewport & Zoom */}
      <div className="hidden lg:flex items-center gap-1 min-w-0 flex-shrink">
        {/* Templates button */}
        {onOpenTemplates && (
          <>
            <ToolbarButton
              onClick={onOpenTemplates}
              title="Templates"
              size="sm"
            >
              <RectangleStackIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarDivider />
          </>
        )}

        {/* Undo/Redo */}
        <UndoRedoButtons />

        <ToolbarDivider />

        {/* Language Switcher */}
        <LanguageSwitcher />

        <ToolbarDivider />

        {/* Viewport switcher - glassmorphism segmented control */}
        <div className="relative flex items-center gap-2">
          <div
            className={classNames(
              "flex items-center p-1 rounded-xl",
              "bg-white/40 dark:bg-white/5",
              "backdrop-blur-xl",
              "border border-white/60 dark:border-white/10",
            )}
          >
            {viewportCategories.map((category) => {
              const Icon = category.icon;
              const isActive = getCurrentCategory() === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    if (!isActive) {
                      setViewport(category.viewports[0]);
                    }
                  }}
                  className={classNames(
                    "relative p-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-white/80 dark:bg-white/15 shadow-sm text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5",
                  )}
                  title={category.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Width dropdown trigger */}
          <button
            onClick={() => setShowViewportMenu(!showViewportMenu)}
            className={classNames(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl",
              "text-xs font-medium text-slate-600 dark:text-slate-300",
              "hover:bg-white/50 dark:hover:bg-white/5",
              "transition-all duration-200",
            )}
          >
            <span className="tabular-nums">{VIEWPORT_WIDTHS[viewport]}px</span>
            <ChevronDownIcon
              className={classNames(
                "w-3 h-3 transition-transform duration-200",
                showViewportMenu && "rotate-180",
              )}
            />
          </button>

          {/* Viewport dropdown */}
          <Dropdown
            isOpen={showViewportMenu}
            onClose={() => setShowViewportMenu(false)}
            width="min-w-[220px]"
          >
            {(["mobile", "tablet", "desktop"] as const).map((category, idx) => (
              <div key={category}>
                {idx > 0 && (
                  <div className="my-2 mx-3 border-t border-slate-200/50 dark:border-white/10" />
                )}
                <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
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
                        "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-150",
                        "hover:bg-white/50 dark:hover:bg-white/5",
                        viewport === option.id
                          ? "text-slate-900 dark:text-white font-semibold bg-white/30 dark:bg-white/5"
                          : "text-slate-600 dark:text-slate-400",
                      )}
                    >
                      <span>{option.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                          {option.width}px
                        </span>
                        {viewport === option.id && (
                          <CheckIcon className="w-4 h-4 text-slate-900 dark:text-white" />
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            ))}
          </Dropdown>
        </div>

        {/* Zoom dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className={classNames(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl",
              "text-xs font-medium text-slate-600 dark:text-slate-300",
              "hover:bg-white/50 dark:hover:bg-white/5",
              "transition-all duration-200",
            )}
          >
            <span className="tabular-nums w-8">{zoom}%</span>
            <ChevronDownIcon
              className={classNames(
                "w-3 h-3 transition-transform duration-200",
                showZoomMenu && "rotate-180",
              )}
            />
          </button>

          <Dropdown
            isOpen={showZoomMenu}
            onClose={() => setShowZoomMenu(false)}
            align="right"
            width="min-w-[120px]"
          >
            {zoomOptions.map((z) => (
              <button
                key={z}
                onClick={() => {
                  setZoom(z);
                  setShowZoomMenu(false);
                }}
                className={classNames(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-150",
                  "hover:bg-white/50 dark:hover:bg-white/5",
                  zoom === z
                    ? "text-slate-900 dark:text-white font-semibold bg-white/30 dark:bg-white/5"
                    : "text-slate-600 dark:text-slate-400",
                )}
              >
                <span className="tabular-nums">{z}%</span>
                {zoom === z && <CheckIcon className="w-4 h-4" />}
              </button>
            ))}
          </Dropdown>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Collaboration presence - hide on small screens */}
        <div className="hidden md:flex items-center gap-2 pr-1 mr-1">
          <PresenceAvatars maxVisible={4} />
          <ConnectionStatus showLabel={false} />
        </div>

        <div className="hidden md:block">
          <ToolbarDivider />
        </div>

        {/* Focus mode toggle - hide on small screens */}
        <div className="hidden sm:block">
          <ToolbarButton
            onClick={() => toggleFocusMode()}
            active={isFocusMode}
            title={isFocusMode ? "Exit Focus Mode (F)" : "Focus Mode (F)"}
            size="sm"
          >
            {isFocusMode ? (
              <ArrowsPointingOutIcon className="w-4 h-4" />
            ) : (
              <ArrowsPointingInIcon className="w-4 h-4" />
            )}
          </ToolbarButton>
        </div>

        {/* Preview toggle */}
        <ToolbarButton
          onClick={() => togglePreview()}
          active={isPreviewMode}
          size="sm"
        >
          <EyeIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </ToolbarButton>

        <div className="hidden sm:block">
          <ToolbarDivider />
        </div>

        {/* Workflow Actions - status, submit, approve, reject, publish - hide on small screens */}
        <div className="hidden sm:block">
          <WorkflowActions
            onWorkflowChange={onWorkflowChange}
            userRoles={userRoles}
          />
        </div>

        <div className="hidden sm:block">
          <ToolbarDivider />
        </div>

        {/* Save button - glassmorphism */}
        <ToolbarButton
          onClick={handleSave}
          disabled={
            (!isDirty && autosaveStatus !== "error") ||
            autosaveStatus === "saving"
          }
          variant="secondary"
          size="sm"
          title={
            autosaveStatus === "error"
              ? "Retry save"
              : isDirty
                ? "Save now (Cmd+S)"
                : "All changes saved"
          }
        >
          {autosaveStatus === "saving" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="hidden sm:inline">Saving</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </ToolbarButton>
      </div>
    </div>
  );
};

export default Toolbar;
