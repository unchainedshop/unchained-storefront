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
} from "@heroicons/react/24/outline";

const AdminNavIsland: React.FC = () => {
  const router = useRouter();
  const isPages = router.pathname.startsWith("/admin/pages");
  const isMedia = router.pathname.startsWith("/admin/media");
  const isMenus = router.pathname.startsWith("/admin/menus");
  const isCollections = router.pathname.startsWith("/admin/collections");

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="flex items-center gap-1 px-2 py-2 rounded-2xl
          bg-white/80 dark:bg-slate-900/80
          backdrop-blur-xl backdrop-saturate-150
          border border-white/50 dark:border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          ring-1 ring-black/5 dark:ring-white/5"
      >
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <HomeIcon className="w-4 h-4" />
          Home
        </Link>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <Link
          href="/admin/pages"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isPages
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
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
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
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
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
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
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <RectangleStackIcon className="w-4 h-4" />
          Collections
        </Link>
      </nav>
    </div>
  );
};

export default AdminNavIsland;
