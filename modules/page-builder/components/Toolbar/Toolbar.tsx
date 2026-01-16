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
import ProfileMenu from "./ProfileMenu";

interface ToolbarProps {
  onBack?: () => void;
  onSave?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  onWorkflowChange?: (newStatus: PageStatus) => Promise<void>;
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
  triggerRef?: React.RefObject<HTMLElement>;
}

const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  align = "left",
  width = "min-w-[180px]",
  triggerRef,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    ready: boolean;
  }>({
    top: 0,
    left: 0,
    ready: false,
  });

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

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        left: align === "right" ? rect.right : rect.left,
        ready: true,
      });
    } else if (!isOpen) {
      // Reset ready state when closed
      setPosition((prev) => ({ ...prev, ready: false }));
    }
  }, [isOpen, triggerRef, align]);

  if (!isOpen) return null;

  // Use fixed positioning when triggerRef is provided
  const useFixed = !!triggerRef;

  // Don't render until position is calculated for fixed positioning
  if (useFixed && !position.ready) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        style={
          useFixed
            ? {
                position: "fixed",
                top: position.top,
                left: align === "right" ? "auto" : position.left,
                right:
                  align === "right"
                    ? window.innerWidth - position.left
                    : "auto",
              }
            : undefined
        }
        className={classNames(
          useFixed ? "z-50" : "absolute top-full mt-1.5 z-50",
          // Clean white background with subtle blur
          "bg-white dark:bg-slate-900/95 backdrop-blur-xl",
          "rounded-xl",
          "shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
          "border border-slate-200/80 dark:border-slate-700/40",
          "py-1.5 overflow-hidden",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150",
          width,
          !useFixed && (align === "right" ? "right-0" : "left-0"),
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
    "inline-flex items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-400/50";

  const variants = {
    ghost: classNames(
      "rounded-lg",
      active
        ? "bg-slate-100/80 dark:bg-slate-800/60 text-slate-900 dark:text-white"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30",
      disabled &&
        "!text-slate-300 dark:!text-slate-600 cursor-not-allowed hover:bg-transparent",
    ),
    glass: classNames(
      "rounded-lg bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm",
      "border border-slate-200/50 dark:border-slate-700/30",
      active
        ? "text-slate-900 dark:text-white border-slate-300/60 dark:border-slate-600/40"
        : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/50",
      disabled && "!text-slate-400 dark:!text-slate-500 cursor-not-allowed",
    ),
    secondary: classNames(
      "rounded-lg bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm",
      "border border-slate-200/60 dark:border-slate-700/40",
      "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/50",
      disabled &&
        "!text-slate-400 dark:!text-slate-500 !bg-white/20 cursor-not-allowed",
    ),
    primary: classNames(
      "rounded-lg",
      "bg-slate-900 dark:bg-white",
      "text-white dark:text-slate-900",
      "hover:bg-slate-800 dark:hover:bg-slate-100",
      "shadow-sm",
      disabled && "!bg-slate-300 dark:!bg-slate-600 cursor-not-allowed",
    ),
  };

  const sizes = {
    sm: "h-7 px-2.5 text-[11px]",
    md: "h-8 px-3 text-xs",
  };

  return (
    <button
      type="button"
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

// Subtle divider
const ToolbarDivider: React.FC = () => (
  <div className="w-px h-4 bg-slate-200/80 dark:bg-slate-700/50 mx-2" />
);

const Toolbar: React.FC<ToolbarProps> = ({
  onBack,
  onSave,
  onPublish,
  onWorkflowChange,
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
  const viewportButtonRef = useRef<HTMLButtonElement>(null);
  const zoomButtonRef = useRef<HTMLButtonElement>(null);

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
        "h-12 flex items-center px-3 sticky top-0 z-50",
        // Clean background with subtle blur
        "bg-white/80 dark:bg-slate-900/80",
        "backdrop-blur-xl",
        // Thin border
        "border-b border-slate-200/60 dark:border-slate-700/40",
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Logo + Brand */}
        <button
          type="button"
          onClick={onBack}
          className={classNames(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg",
            onBack &&
              "cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40",
            "transition-colors duration-150",
          )}
          title={onBack ? "Back to Pages" : undefined}
        >
          <UnchainedLogo
            size={13}
            className="text-slate-700 dark:text-slate-200"
          />
          <span className="hidden md:block text-[11px] font-semibold text-slate-600 dark:text-slate-300 tracking-tight">
            Buildor
          </span>
        </button>

        <ToolbarDivider />

        {/* Page title */}
        <div className="flex items-center gap-2">
          <div
            className={classNames(
              "relative px-2 py-1 rounded-lg transition-all duration-150",
              titleFocused
                ? "bg-slate-100/70 dark:bg-slate-800/50 ring-1 ring-slate-300/50 dark:ring-slate-600/40"
                : "hover:bg-slate-100/40 dark:hover:bg-slate-800/30",
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
              className="text-[13px] font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 dark:text-slate-200 w-[120px] sm:w-[160px] md:w-[200px] placeholder:text-slate-400 dark:placeholder:text-slate-500"
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

      {/* Center section - Viewport & Zoom (only on xl screens) */}
      <div className="hidden xl:flex flex-1 items-center justify-center gap-3 overflow-hidden mx-4">
        {/* Undo/Redo */}
        <UndoRedoButtons />

        <ToolbarDivider />

        {/* Language Switcher */}
        <LanguageSwitcher />

        <ToolbarDivider />

        {/* Viewport switcher - clean segmented control */}
        <div className="relative flex items-center gap-2">
          <div
            className={classNames(
              "flex items-center p-0.5 rounded-lg",
              "bg-slate-100/60 dark:bg-slate-800/40",
              "border border-slate-200/50 dark:border-slate-700/30",
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
                    "relative p-1.5 rounded transition-all duration-150",
                    isActive
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-700 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300",
                  )}
                  title={category.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Width dropdown trigger */}
          <button
            ref={viewportButtonRef}
            onClick={() => setShowViewportMenu(!showViewportMenu)}
            className={classNames(
              "flex items-center gap-1 px-2 py-1 rounded-lg whitespace-nowrap",
              "text-[11px] font-medium text-slate-500 dark:text-slate-400",
              "hover:bg-slate-100/50 dark:hover:bg-slate-800/30",
              "transition-colors duration-150",
            )}
          >
            <span className="tabular-nums">{VIEWPORT_WIDTHS[viewport]}px</span>
            <ChevronDownIcon
              className={classNames(
                "w-2.5 h-2.5 transition-transform duration-150",
                showViewportMenu && "rotate-180",
              )}
            />
          </button>

          {/* Viewport dropdown */}
          <Dropdown
            isOpen={showViewportMenu}
            onClose={() => setShowViewportMenu(false)}
            width="min-w-[200px]"
            triggerRef={viewportButtonRef}
          >
            {(["mobile", "tablet", "desktop"] as const).map((category, idx) => (
              <div key={category}>
                {idx > 0 && (
                  <div className="my-1 mx-2 border-t border-slate-100 dark:border-slate-800" />
                )}
                <div className="px-3 py-1 text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
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
                        "w-full flex items-center justify-between px-3 py-1.5 text-[11px] transition-colors duration-100",
                        "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        viewport === option.id
                          ? "text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-800/30"
                          : "text-slate-500 dark:text-slate-400",
                      )}
                    >
                      <span>{option.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                          {option.width}px
                        </span>
                        {viewport === option.id && (
                          <CheckIcon className="w-3 h-3 text-slate-600 dark:text-slate-300" />
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
            ref={zoomButtonRef}
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className={classNames(
              "flex items-center gap-1 px-2 py-1 rounded-lg whitespace-nowrap",
              "text-[11px] font-medium text-slate-500 dark:text-slate-400",
              "hover:bg-slate-100/50 dark:hover:bg-slate-800/30",
              "transition-colors duration-150",
            )}
          >
            <span className="tabular-nums">{zoom}%</span>
            <ChevronDownIcon
              className={classNames(
                "w-2.5 h-2.5 transition-transform duration-150",
                showZoomMenu && "rotate-180",
              )}
            />
          </button>

          <Dropdown
            isOpen={showZoomMenu}
            onClose={() => setShowZoomMenu(false)}
            align="right"
            width="min-w-[100px]"
            triggerRef={zoomButtonRef}
          >
            {zoomOptions.map((z) => (
              <button
                key={z}
                onClick={() => {
                  setZoom(z);
                  setShowZoomMenu(false);
                }}
                className={classNames(
                  "w-full flex items-center justify-between px-3 py-1.5 text-[11px] transition-colors duration-100",
                  "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                  zoom === z
                    ? "text-slate-800 dark:text-slate-200 font-medium bg-slate-50 dark:bg-slate-800/30"
                    : "text-slate-500 dark:text-slate-400",
                )}
              >
                <span className="tabular-nums">{z}%</span>
                {zoom === z && <CheckIcon className="w-3 h-3" />}
              </button>
            ))}
          </Dropdown>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
        {/* Collaboration presence - hide on small screens */}
        <div className="hidden md:flex items-center gap-2">
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
              <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
            ) : (
              <ArrowsPointingInIcon className="w-3.5 h-3.5" />
            )}
          </ToolbarButton>
        </div>

        {/* Preview toggle */}
        <ToolbarButton
          onClick={() => togglePreview()}
          active={isPreviewMode}
          size="sm"
        >
          <EyeIcon className="w-3.5 h-3.5" />
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

        {/* Save button with rainbow glow when dirty */}
        <div className="relative">
          <ToolbarButton
            onClick={handleSave}
            disabled={
              (!isDirty && autosaveStatus !== "error") ||
              autosaveStatus === "saving"
            }
            variant="secondary"
            size="sm"
            className={
              isDirty && autosaveStatus !== "saving"
                ? "!bg-[linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.5)_100%)] dark:!bg-[linear-gradient(135deg,rgba(30,41,59,0.95)_0%,rgba(30,41,59,0.5)_100%)]"
                : undefined
            }
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
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
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
                  className="w-3.5 h-3.5"
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
          {/* Rainbow glow around button when dirty */}
          {isDirty && autosaveStatus !== "saving" && (
            <div
              className="absolute -inset-0.5 rounded-lg opacity-40 blur-sm animate-rainbow-glow -z-10"
              style={{
                background:
                  "linear-gradient(90deg, #e879a9, #f0a870, #7dd3c0, #a99be0, #e879a9)",
                backgroundSize: "300% 100%",
              }}
            />
          )}
        </div>

        {/* Profile menu */}
        <div className="flex items-center justify-center h-full ml-0.5">
          <ProfileMenu size="sm" />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
