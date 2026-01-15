/**
 * Admin Navigation Island
 * Floating glassmorphism navigation for switching between admin pages
 * Features direction-aware hover animation
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
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
import ProfileMenu from "./Toolbar/ProfileMenu";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const AdminNavIsland: React.FC = () => {
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [highlightStyle, setHighlightStyle] = useState({
    opacity: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const isHome = router.pathname === "/admin";
  const isPages = router.pathname.startsWith("/admin/pages");
  const isMedia = router.pathname.startsWith("/admin/media");
  const isMenus = router.pathname.startsWith("/admin/menus");
  const isCollections = router.pathname.startsWith("/admin/collections");
  const isForms = router.pathname.startsWith("/admin/forms");
  const isSettings = router.pathname.startsWith("/admin/settings");

  const navItems: NavItem[] = [
    {
      href: "/admin/pages",
      label: "Pages",
      icon: <DocumentTextIcon className="w-4 h-4" />,
      isActive: isPages,
    },
    {
      href: "/admin/media",
      label: "Media",
      icon: <PhotoIcon className="w-4 h-4" />,
      isActive: isMedia,
    },
    {
      href: "/admin/menus",
      label: "Menus",
      icon: <Bars3Icon className="w-4 h-4" />,
      isActive: isMenus,
    },
    {
      href: "/admin/collections",
      label: "Collections",
      icon: <RectangleStackIcon className="w-4 h-4" />,
      isActive: isCollections,
    },
    {
      href: "/admin/forms",
      label: "Forms",
      icon: <ClipboardDocumentListIcon className="w-4 h-4" />,
      isActive: isForms,
    },
  ];

  const activeIndex = navItems.findIndex((item) => item.isActive);

  const getHighlightPosition = useCallback((index: number) => {
    if (!navRef.current || !itemRefs.current[index]) return null;
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = itemRefs.current[index]!.getBoundingClientRect();
    return {
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      height: itemRect.height,
    };
  }, []);

  // Initialize highlight at active item position
  useEffect(() => {
    if (!isInitialized && activeIndex >= 0) {
      const pos = getHighlightPosition(activeIndex);
      if (pos) {
        setHighlightStyle({
          opacity: 0,
          ...pos,
        });
        setIsInitialized(true);
      }
    }
  }, [activeIndex, getHighlightPosition, isInitialized]);

  // Update highlight when hover changes
  useEffect(() => {
    const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    if (targetIndex < 0 || !navRef.current || !itemRefs.current[targetIndex]) {
      return;
    }

    const pos = getHighlightPosition(targetIndex);
    if (pos) {
      setHighlightStyle({
        opacity: hoveredIndex !== null ? 1 : 0,
        ...pos,
      });
    }
  }, [hoveredIndex, activeIndex, getHighlightPosition]);

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
    shadow-[0_2px_8px_rgba(0,0,0,0.06),_0_1px_0_rgba(255,255,255,0.5)_inset,_0_0_10px_rgba(255,154,158,0.35),_0_0_16px_rgba(255,206,134,0.3),_0_0_22px_rgba(168,237,234,0.3),_0_0_28px_rgba(134,239,172,0.25),_0_0_34px_rgba(168,192,255,0.25),_0_0_40px_rgba(221,160,221,0.2)]
    dark:shadow-[0_2px_8px_rgba(0,0,0,0.25),_0_1px_0_rgba(255,255,255,0.1)_inset,_0_0_10px_rgba(255,154,158,0.3),_0_0_16px_rgba(255,206,134,0.25),_0_0_22px_rgba(168,237,234,0.25),_0_0_28px_rgba(134,239,172,0.2),_0_0_34px_rgba(168,192,255,0.2),_0_0_40px_rgba(221,160,221,0.15)]
  `;

  const inactiveItemStyles = `
    text-slate-600 dark:text-slate-400
    border border-transparent
  `;

  const hoverHighlightStyles: React.CSSProperties = {
    position: "absolute",
    top: 8,
    borderRadius: 12,
    pointerEvents: "none",
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.25))",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(200,200,200,0.4)",
    boxShadow:
      "0 2px 12px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6) inset",
  };

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
          ref={navRef}
          className={`relative flex items-center gap-1 px-2 py-2 rounded-2xl ${pillStyles}`}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Animated hover highlight */}
          <div
            className="dark:!bg-gradient-to-b dark:!from-white/15 dark:!to-white/5 dark:!border-white/20"
            style={{
              ...hoverHighlightStyles,
              ...highlightStyle,
            }}
          />

          {navItems.map((item, index) => (
            <Link
              key={item.href}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={item.href}
              className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                item.isActive
                  ? activeItemStyles
                  : `${inactiveItemStyles} ${
                      hoveredIndex === index
                        ? "text-slate-900 dark:text-white"
                        : ""
                    }`
              }`}
              onMouseEnter={() => !item.isActive && setHoveredIndex(index)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Settings & Profile - Right (overlapping design, settings on top) */}
        <div className="relative flex items-center justify-center">
          <div className="absolute right-10 top-1 flex items-center justify-center">
            <ProfileMenu slideOnHover />
          </div>
          <Link
            href="/admin/settings"
            className={`relative z-10 p-3 rounded-2xl transition-all duration-200 flex items-center justify-center ${
              isSettings
                ? activeItemStyles
                : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavIsland;
