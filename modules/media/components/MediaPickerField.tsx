/**
 * MediaPickerField Component
 * Form field for selecting media from the DAM library
 * Designed for integration with the page builder SettingsPanel
 */

import React, { useState } from "react";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import MediaPickerModal from "./MediaPickerModal";
import type { MediaAsset } from "../types";

interface MediaPickerFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  onBlur?: () => void;
  allowedTypes?: string[];
  placeholder?: string;
  description?: string;
  compact?: boolean;
}

const MediaPickerField: React.FC<MediaPickerFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  allowedTypes = ["image/*"],
  placeholder = "Select an image...",
  description,
  compact = false,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(value);

  const hasValue = value && value.trim() !== "";
  const isExternalUrl = hasValue && !value.startsWith("/media/");

  const handleSelect = (asset: MediaAsset) => {
    onChange(asset.url || "");
    setIsPickerOpen(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChange("");
    onBlur?.();
  };

  const handleUrlSubmit = () => {
    onChange(urlInputValue);
    setShowUrlInput(false);
    onBlur?.();
  };

  // Compact mode for settings panel
  if (compact) {
    return (
      <div className="space-y-1.5">
        {hasValue ? (
          <div className="flex items-center gap-2">
            {/* Thumbnail */}
            <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
              {value.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i) ? (
                <img
                  src={value}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PhotoIcon className="w-5 h-5 text-slate-400" />
                </div>
              )}
            </div>
            {/* Actions */}
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="flex-1 px-2 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left truncate"
            >
              Change image
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <PhotoIcon className="w-4 h-4" />
            {placeholder}
          </button>
        )}

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleSelect}
          allowedTypes={allowedTypes}
          currentValue={value}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}

      {/* Preview/Picker */}
      {hasValue ? (
        <div className="relative group">
          {/* Image preview */}
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {value.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i) ? (
              <img
                src={value}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PhotoIcon className="w-12 h-12 text-slate-400" />
              </div>
            )}

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-1.5 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                Change
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                title="Remove image"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* URL display */}
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={value}
              readOnly
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono truncate"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            {isExternalUrl && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                title="Open in new tab"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Empty state - picker button */}
          <button
            onClick={() => setIsPickerOpen(true)}
            className="w-full aspect-video flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
          >
            <PhotoIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors" />
            <span className="mt-2 text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {placeholder}
            </span>
          </button>

          {/* URL input toggle */}
          {showUrlInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUrlSubmit();
                  if (e.key === "Escape") setShowUrlInput(false);
                }}
                autoFocus
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInputValue.trim()}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowUrlInput(false)}
                className="px-3 py-2 text-slate-600 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowUrlInput(true)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Or enter URL manually
            </button>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelect}
        allowedTypes={allowedTypes}
        currentValue={value}
      />
    </div>
  );
};

export default MediaPickerField;
