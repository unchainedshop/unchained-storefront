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
} from "@heroicons/react/24/outline";

const AdminNavIsland: React.FC = () => {
  const router = useRouter();
  const isPages = router.pathname.startsWith("/admin/pages");
  const isMedia = router.pathname.startsWith("/admin/media");
  const isMenus = router.pathname.startsWith("/admin/menus");
  const isCollections = router.pathname.startsWith("/admin/collections");
  const isSettings = router.pathname.startsWith("/admin/settings");

  const pillStyles = `
    bg-white/80 dark:bg-slate-900/80
    backdrop-blur-xl backdrop-saturate-150
    border border-white/50 dark:border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    ring-1 ring-black/5 dark:ring-white/5
  `;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="flex items-center justify-between">
        {/* Home - Left */}
        <Link
          href="/admin"
          className={`p-3 rounded-2xl transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 ${pillStyles}`}
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isPages
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <DocumentTextIcon className="w-4 h-4" />
            Pages
          </Link>
          <Link
            href="/admin/media"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isMedia
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <PhotoIcon className="w-4 h-4" />
            Media
          </Link>
          <Link
            href="/admin/menus"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isMenus
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bars3Icon className="w-4 h-4" />
            Menus
          </Link>
          <Link
            href="/admin/collections"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isCollections
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <RectangleStackIcon className="w-4 h-4" />
            Collections
          </Link>
        </nav>

        {/* Settings - Right */}
        <Link
          href="/admin/settings"
          className={`p-3 rounded-2xl transition-all ${
            isSettings
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
              : `${pillStyles} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800`
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
