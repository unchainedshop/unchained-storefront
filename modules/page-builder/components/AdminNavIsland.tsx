/**
 * Admin Navigation Island
 * Floating glassmorphism navigation for switching between admin pages
 */

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  DocumentTextIcon,
  PhotoIcon,
  HomeIcon,
  Bars3Icon,
  RectangleStackIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const AdminNavIsland: React.FC = () => {
  const router = useRouter();
  const isHome = router.pathname === "/admin";
  const isPages = router.pathname.startsWith("/admin/pages");
  const isMedia = router.pathname.startsWith("/admin/media");
  const isMenus = router.pathname.startsWith("/admin/menus");
  const isCollections = router.pathname.startsWith("/admin/collections");
  const isForms = router.pathname.startsWith("/admin/forms");
  const isSettings = router.pathname.startsWith("/admin/settings");

  const pillStyles = `
    bg-white/30 dark:bg-slate-900/30
    backdrop-blur-2xl backdrop-saturate-200
    border border-white/30 dark:border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.06),_0_0_0_1px_rgba(255,255,255,0.08)_inset]
    dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(255,255,255,0.05)_inset]
  `;

  const activeItemStyles = `
    bg-gradient-to-b from-white/50 to-white/30 dark:from-white/15 dark:to-white/5
    backdrop-blur-md
    border border-slate-300/60 dark:border-white/25
    text-slate-900 dark:text-white
    shadow-[0_2px_8px_rgba(0,0,0,0.08),_0_1px_0_rgba(255,255,255,0.5)_inset]
    dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),_0_1px_0_rgba(255,255,255,0.1)_inset]
  `;

  const inactiveItemStyles = `
    text-slate-600 dark:text-slate-400
    hover:text-slate-900 dark:hover:text-white
    hover:bg-white/25 dark:hover:bg-white/5
    hover:backdrop-blur-sm
    hover:border-white/30 dark:hover:border-white/10
    border border-transparent
  `;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="flex items-center justify-between">
        {/* Home - Left */}
        <Link
          href="/admin"
          className={`p-3 rounded-2xl transition-all duration-200 ${pillStyles} ${
            isHome
              ? activeItemStyles
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/25 dark:hover:bg-white/5"
          }`}
          title="Home"
        >
          <HomeIcon className="w-5 h-5" />
        </Link>

        {/* Main Nav - Center */}
        <nav
          className={`flex items-center gap-1 px-2 py-2 rounded-2xl ${pillStyles}`}
        >
          <Link
            href="/admin/pages"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isPages ? activeItemStyles : inactiveItemStyles
            }`}
          >
            <DocumentTextIcon className="w-4 h-4" />
            Pages
          </Link>
          <Link
            href="/admin/media"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isMedia ? activeItemStyles : inactiveItemStyles
            }`}
          >
            <PhotoIcon className="w-4 h-4" />
            Media
          </Link>
          <Link
            href="/admin/menus"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isMenus ? activeItemStyles : inactiveItemStyles
            }`}
          >
            <Bars3Icon className="w-4 h-4" />
            Menus
          </Link>
          <Link
            href="/admin/collections"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isCollections ? activeItemStyles : inactiveItemStyles
            }`}
          >
            <RectangleStackIcon className="w-4 h-4" />
            Collections
          </Link>
          <Link
            href="/admin/forms"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isForms ? activeItemStyles : inactiveItemStyles
            }`}
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            Forms
          </Link>
        </nav>

        {/* Settings - Right */}
        <Link
          href="/admin/settings"
          className={`p-3 rounded-2xl transition-all duration-200 ${pillStyles} ${
            isSettings
              ? activeItemStyles
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/25 dark:hover:bg-white/5"
          }`}
          title="Settings"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default AdminNavIsland;
