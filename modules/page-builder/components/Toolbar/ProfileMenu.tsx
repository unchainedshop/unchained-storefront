/**
 * Profile Menu Component
 * Profile photo that links directly to settings
 */

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface ProfileMenuProps {
  size?: "sm" | "md";
  slideOnHover?: boolean;
}

export const PROFILE_PHOTO_STORAGE_KEY = "cms_profile_photo";

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  size = "md",
  slideOnHover = false,
}) => {
  const isSmall = size === "sm";
  const [isHovered, setIsHovered] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Load profile photo from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY);
    if (stored) {
      setProfilePhoto(stored);
    }

    // Listen for storage changes (when photo is updated in settings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROFILE_PHOTO_STORAGE_KEY) {
        setProfilePhoto(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Link
      href="/admin/settings"
      className={classNames(
        "relative rounded-full overflow-hidden block",
        "transition-all duration-300 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
        isSmall ? "w-7 h-7" : "w-9 h-9",
        isSmall
          ? "ring-1 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700"
          : "ring-2 ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600",
        slideOnHover && isHovered && "-translate-x-1",
      )}
      title="Settings"
      onMouseEnter={() => slideOnHover && setIsHovered(true)}
      onMouseLeave={() => slideOnHover && setIsHovered(false)}
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
    </Link>
  );
};

export default ProfileMenu;
