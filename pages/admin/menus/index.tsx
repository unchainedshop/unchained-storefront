/**
 * Menus List
 * Admin page to list and manage all navigation menus
 */

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  Bars3Icon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import { useMenus } from "../../../modules/menu-builder/hooks/useMenus";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import { getLocalizedString } from "../../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../../lib/cms.config";
import type {
  Menu,
  MenuType,
  MenuStatus,
} from "../../../modules/menu-builder/types";

const menuTypeIcons: Record<
  MenuType,
  React.ComponentType<{ className?: string }>
> = {
  header: GlobeAltIcon,
  sidebar: DevicePhoneMobileIcon,
  footer: RectangleGroupIcon,
};

const menuTypeLabels: Record<MenuType, string> = {
  header: "Header",
  sidebar: "Sidebar",
  footer: "Footer",
};

const MenuStatusBadge: React.FC<{ status: MenuStatus }> = ({ status }) => {
  const colors = {
    draft:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    published:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-full ${colors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MenusAdmin: React.FC = () => {
  const router = useRouter();
  const { formatDate } = useIntl();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<MenuType | "all">("all");

  const { menus, isLoading, error, fetchMenus, deleteMenu } = useMenus();

  const filteredMenus = menus.filter((menu) => {
    const menuName = getLocalizedString(menu.name, cmsConfig.defaultLocale);
    const matchesSearch =
      menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || menu.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: menus.length,
    published: menus.filter((m) => m.status === "published").length,
    draft: menus.filter((m) => m.status === "draft").length,
    byType: {
      header: menus.filter((m) => m.type === "header").length,
      sidebar: menus.filter((m) => m.type === "sidebar").length,
      footer: menus.filter((m) => m.type === "footer").length,
    },
  };

  return (
    <>
      <MetaTags title="Menus - Admin" />
      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Hero Header */}
        <div className="relative pt-16 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          {/* Decorative grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-200 dark:bg-slate-800 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-slate-300 dark:bg-slate-700 rounded-full opacity-15 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14">
              {/* Logo & Brand */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                  <UnchainedLogo
                    size={20}
                    className="text-slate-900 dark:text-white"
                  />
                  <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Menu Builder
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Menus
                    </h1>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    Create and manage navigation menus for your storefront
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchMenus}
                    disabled={isLoading}
                    className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                    title="Refresh"
                  >
                    <ArrowPathIcon
                      className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  <Link
                    href="/admin/menus/new"
                    className="admin-btn-primary group px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    Create Menu
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Search & Menus */}
            <div className="flex-1 min-w-0">
              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search menus..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Type filter */}
                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) =>
                        setTypeFilter(e.target.value as MenuType | "all")
                      }
                      className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Types</option>
                      <option value="header">Header</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="footer">Footer</option>
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Menus list */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : filteredMenus.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredMenus.map((menu) => {
                      const TypeIcon = menuTypeIcons[menu.type];
                      return (
                        <div
                          key={menu.id}
                          onClick={() =>
                            router.push(`/admin/menus/${menu.slug}`)
                          }
                          className="group flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                              <TypeIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                {getLocalizedString(
                                  menu.name,
                                  cmsConfig.defaultLocale,
                                )}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {menuTypeLabels[menu.type]}
                                </span>
                                <span className="text-slate-300 dark:text-slate-600">
                                  •
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                                  {menu.slug}
                                </span>
                                <span className="text-slate-300 dark:text-slate-600">
                                  •
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {menu.items.length} items
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <MenuStatusBadge status={menu.status} />

                            <div
                              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link
                                href={`/admin/menus/${menu.slug}`}
                                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                                title="Edit menu"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => deleteMenu(menu)}
                                className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                title="Delete menu"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Bars3Icon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {searchQuery || typeFilter !== "all"
                        ? "No menus found"
                        : "No menus yet"}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
                      {searchQuery || typeFilter !== "all"
                        ? "Try adjusting your search or filter"
                        : "Create your first navigation menu to get started"}
                    </p>
                    {!searchQuery && typeFilter === "all" && (
                      <Link
                        href="/admin/menus/new"
                        className="admin-btn-primary px-4 py-2 font-medium rounded-lg"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Create Menu
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="lg:w-80 space-y-6">
              {/* Overview Stats */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.total}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Total
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.published}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Published
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {stats.draft}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Drafts
                    </div>
                  </div>
                </div>
              </div>

              {/* By Type */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  By Type
                </h3>
                <div className="space-y-3">
                  {(["header", "sidebar", "footer"] as MenuType[]).map(
                    (type) => {
                      const TypeIcon = menuTypeIcons[type];
                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <TypeIcon className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {menuTypeLabels[type]}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {stats.byType[type]}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <AdminNavIsland />
      </div>
    </>
  );
};

export default MenusAdmin;
