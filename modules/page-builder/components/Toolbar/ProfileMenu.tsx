/**
 * Profile Menu Component
 * User profile photo with upload capability
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import classNames from "classnames";
import {
  UserCircleIcon,
  CameraIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface ProfileMenuProps {
  onLogout?: () => void;
  size?: "sm" | "md";
  slideOnHover?: boolean;
}

const STORAGE_KEY = "cms_profile_photo";

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  onLogout,
  size = "md",
  slideOnHover = false,
}) => {
  const isSmall = size === "sm";
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load profile photo from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProfilePhoto(stored);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }

      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;

        // Create an image to resize
        const img = new Image();
        img.onload = () => {
          // Resize to 128x128 for storage efficiency
          const canvas = document.createElement("canvas");
          const size = 128;
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Calculate crop to make square
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

          const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

          // Save to localStorage and state
          localStorage.setItem(STORAGE_KEY, resizedDataUrl);
          setProfilePhoto(resizedDataUrl);
          setIsUploading(false);
          setIsOpen(false);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);

      // Reset input
      e.target.value = "";
    },
    [],
  );

  const handleRemovePhoto = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfilePhoto(null);
    setIsOpen(false);
  }, []);

  return (
    <div
      className="relative"
      ref={menuRef}
      onMouseEnter={() => slideOnHover && setIsHovered(true)}
      onMouseLeave={() => slideOnHover && setIsHovered(false)}
    >
      {/* Profile button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          "relative rounded-full overflow-hidden",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          isSmall ? "w-7 h-7" : "w-9 h-9",
          isSmall
            ? "ring-1 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700"
            : "ring-2 ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600",
          isOpen &&
            (isSmall
              ? "ring-slate-300 dark:ring-slate-600"
              : "ring-slate-400 dark:ring-slate-500"),
          slideOnHover && (isHovered || isOpen) && "-translate-x-1",
        )}
        title="Profile"
      >
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={classNames(
              "w-full h-full flex items-center justify-center",
              isSmall
                ? "bg-transparent"
                : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800",
            )}
          >
            <UserCircleIcon
              className={
                isSmall
                  ? "w-5 h-5 text-slate-500 dark:text-slate-400"
                  : "w-6 h-6 text-slate-500 dark:text-slate-400"
              }
            />
          </div>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Dropdown menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={classNames(
              "absolute top-full right-0 mt-2 z-50",
              "w-64 py-2",
              // Glassmorphism
              "bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl backdrop-saturate-150",
              "rounded-2xl",
              "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
              "border border-white/50 dark:border-white/10",
              "ring-1 ring-black/5 dark:ring-white/5",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
            )}
          >
            {/* Profile preview */}
            <div className="px-4 py-3 border-b border-slate-200/50 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircleIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    CMS Editor
                  </p>
                </div>
              </div>
            </div>

            {/* Upload photo option */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={classNames(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left",
                "text-slate-700 dark:text-slate-300",
                "hover:bg-slate-100/80 dark:hover:bg-white/5",
                "transition-colors",
                isUploading && "opacity-50 cursor-not-allowed",
              )}
            >
              <CameraIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
            </button>

            {/* Remove photo option (if photo exists) */}
            {profilePhoto && (
              <button
                onClick={handleRemovePhoto}
                className={classNames(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left",
                  "text-slate-700 dark:text-slate-300",
                  "hover:bg-slate-100/80 dark:hover:bg-white/5",
                  "transition-colors",
                )}
              >
                <svg
                  className="w-5 h-5 text-slate-500 dark:text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Remove Photo</span>
              </button>
            )}

            {/* Divider */}
            {onLogout && (
              <>
                <div className="my-2 mx-3 border-t border-slate-200/50 dark:border-white/10" />

                {/* Logout option */}
                <button
                  onClick={onLogout}
                  className={classNames(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left",
                    "text-red-600 dark:text-red-400",
                    "hover:bg-red-50 dark:hover:bg-red-900/20",
                    "transition-colors",
                  )}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
