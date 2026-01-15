/**
 * Pages List
 * Admin page to list and manage all pages
 */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CubeIcon,
  ClockIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import { usePages } from "../../../modules/page-builder/hooks/usePages";
import PageStatusBadge from "../../../modules/page-builder/components/PageStatusBadge";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import { blockRegistry } from "../../../modules/page-builder/utils/blockRegistry";
import { getLocalizedString } from "../../../modules/page-builder/utils/localization";
import { cmsConfig } from "../../../lib/cms.config";
import type {
  Page,
  PageStatus,
  PageBlock,
  BlockType,
} from "../../../modules/page-builder/types";

interface RecentActivityPanelProps {
  pages: Page[];
  formatDate: (date: Date, options: Intl.DateTimeFormatOptions) => string;
}

const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  pages,
  formatDate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort pages by updatedAt and get all for expanded, 3 for collapsed
  const sortedPages = useMemo(() => {
    return [...pages].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [pages]);

  const displayedPages = isExpanded ? sortedPages : sortedPages.slice(0, 3);
  const hasMore = sortedPages.length > 3;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isExpanded ? "Show less" : "Show more"}
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {sortedPages.length > 0 ? (
        <div
          className={`px-5 pb-5 space-y-4 transition-all duration-300 ${
            isExpanded ? "max-h-[500px] overflow-y-auto" : ""
          }`}
        >
          {displayedPages.map((page) => {
            const latestVersion = page.versions?.[page.versions.length - 1];
            const author = latestVersion?.createdBy || "You";
            return (
              <Link
                key={page.id}
                href={`/admin/pages/${page.slug}`}
                className="block group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {author}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(new Date(page.updatedAt), {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors truncate">
                      Updated{" "}
                      <span className="font-medium">
                        {getLocalizedString(
                          page.title,
                          cmsConfig.defaultLocale,
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="px-5 pb-5">
          <p className="text-sm text-slate-400">No activity yet</p>
        </div>
      )}

      {/* Footer with count when expanded */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-3 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800"
        >
          {isExpanded
            ? "Show less"
            : `Show ${sortedPages.length - 3} more activities`}
        </button>
      )}
    </div>
  );
};

const PagesAdmin: React.FC = () => {
  const router = useRouter();
  const { formatDate } = useIntl();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PageStatus | "all">("all");

  const { pages, isLoading, error, fetchPages, deletePage, duplicatePage } =
    usePages();

  const filteredPages = pages.filter((page) => {
    const pageTitle = getLocalizedString(page.title, cmsConfig.defaultLocale);
    const matchesSearch = pageTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDuplicate = async (page: Page) => {
    const newPage = await duplicatePage(page);
    if (newPage) {
      router.push(`/admin/pages/${newPage.slug}`);
    }
  };

  const stats = {
    total: pages.length,
    published: pages.filter((p) => p.status === "published").length,
    draft: pages.filter((p) => p.status === "draft").length,
  };

  // Calculate comprehensive block statistics
  const blockStats = useMemo(() => {
    // Helper to count blocks recursively
    const countBlocks = (blocks: PageBlock[]): number => {
      let count = 0;
      for (const block of blocks) {
        count += 1;
        if (block.children && block.children.length > 0) {
          count += countBlocks(block.children);
        }
      }
      return count;
    };

    // Helper to collect block types recursively
    const collectBlockTypes = (
      blocks: PageBlock[],
      typeCounts: Record<string, number>,
    ): void => {
      for (const block of blocks) {
        typeCounts[block.type] = (typeCounts[block.type] || 0) + 1;
        if (block.children && block.children.length > 0) {
          collectBlockTypes(block.children, typeCounts);
        }
      }
    };

    // Calculate totals
    let totalBlocks = 0;
    const typeCounts: Record<string, number> = {};
    const pageBlockCounts: { page: Page; count: number }[] = [];

    for (const page of pages) {
      const pageBlockCount = countBlocks(page.blocks);
      totalBlocks += pageBlockCount;
      pageBlockCounts.push({ page, count: pageBlockCount });
      collectBlockTypes(page.blocks, typeCounts);
    }

    // Sort block types by usage
    const sortedTypes = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 most used

    // Sort pages by block count for "most content"
    const mostContentPages = [...pageBlockCounts]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Recently updated pages
    const recentlyUpdated = [...pages]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 3);

    return {
      totalBlocks,
      avgBlocksPerPage: pages.length > 0 ? totalBlocks / pages.length : 0,
      topBlockTypes: sortedTypes,
      mostContentPages,
      recentlyUpdated,
    };
  }, [pages]);

  return (
    <>
      <MetaTags title="Pages - Admin" />
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
                    Visual Page Builder
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Pages
                    </h1>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Live
                      </span>
                    </div>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    Design, build, and publish beautiful storefront pages with
                    our visual editor
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchPages}
                    disabled={isLoading}
                    className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                    title="Refresh"
                  >
                    <ArrowPathIcon
                      className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  <Link
                    href="/admin/pages/new"
                    className="admin-btn-primary group px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    Create Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Search & Pages */}
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
                      placeholder="Search pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Status filter */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value as PageStatus | "all")
                      }
                      className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
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

              {/* Pages list */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : filteredPages.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredPages.map((page) => (
                      <div
                        key={page.id}
                        onClick={() => router.push(`/admin/pages/${page.slug}`)}
                        className="group flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                            <DocumentTextIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                              {getLocalizedString(
                                page.title,
                                cmsConfig.defaultLocale,
                              )}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                /{page.slug}
                              </span>
                              <span className="text-slate-300 dark:text-slate-600 flex-shrink-0">
                                •
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0">
                                {formatDate(new Date(page.updatedAt), {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <PageStatusBadge status={page.status} />

                          <div
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/p/${page.slug}`}
                              target="_blank"
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                              title="View page"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Link>
                            <Link
                              href={`/admin/pages/${page.slug}`}
                              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                              title="Edit page"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDuplicate(page)}
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                              title="Duplicate page"
                            >
                              <DocumentDuplicateIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deletePage(page)}
                              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                              title="Delete page"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <DocumentTextIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No pages found
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                      {searchQuery
                        ? "Try adjusting your search"
                        : "Get started by creating your first page"}
                    </p>
                    <Link
                      href="/admin/pages/new"
                      className="admin-btn-primary px-5 py-2.5 font-semibold rounded-lg"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Create your first page
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-400 dark:text-slate-500">
                <UnchainedLogo
                  size={12}
                  className="text-slate-400 dark:text-slate-500"
                />
                <span>Powered by Unchained Commerce</span>
              </div>
            </div>

            {/* Right Column - Analytics Sidebar */}
            {pages.length > 0 && (
              <div className="lg:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-8 space-y-4">
                  {/* Recent Activity - Expandable */}
                  <RecentActivityPanel pages={pages} formatDate={formatDate} />

                  {/* Quick Stats Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                      Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {stats.total}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Pages
                        </p>
                      </div>
                      <div className="text-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                          {blockStats.totalBlocks}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Blocks
                        </p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {stats.published}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Published
                        </p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          {stats.draft}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Drafts
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                          Avg blocks/page
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {blockStats.avgBlocksPerPage.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Components */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <SparklesIcon className="w-4 h-4 text-violet-500" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Top Components
                      </h3>
                    </div>
                    {blockStats.topBlockTypes.length > 0 ? (
                      <div className="space-y-3">
                        {blockStats.topBlockTypes.map(
                          ([type, count], index) => {
                            const blockDef = blockRegistry[type as BlockType];
                            const maxCount = blockStats.topBlockTypes[0][1];
                            const percentage = (count / maxCount) * 100;
                            return (
                              <div key={type}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-slate-700 dark:text-slate-300">
                                    {blockDef?.label || type}
                                  </span>
                                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {count}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${percentage}%`,
                                      background:
                                        index === 0
                                          ? "linear-gradient(90deg, #8b5cf6, #a78bfa)"
                                          : index === 1
                                            ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                                            : index === 2
                                              ? "linear-gradient(90deg, #10b981, #34d399)"
                                              : index === 3
                                                ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                                : "linear-gradient(90deg, #64748b, #94a3b8)",
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">
                        No components yet
                      </p>
                    )}
                  </div>

                  {/* Most Content */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CubeIcon className="w-4 h-4 text-blue-500" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Most Content
                      </h3>
                    </div>
                    {blockStats.mostContentPages.length > 0 ? (
                      <div className="space-y-3">
                        {blockStats.mostContentPages.map(
                          ({ page, count }, index) => (
                            <Link
                              key={page.id}
                              href={`/admin/pages/${page.slug}`}
                              className="flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                                  style={{
                                    background:
                                      index === 0
                                        ? "linear-gradient(135deg, #fef3c7, #fde68a)"
                                        : index === 1
                                          ? "linear-gradient(135deg, #f1f5f9, #e2e8f0)"
                                          : "linear-gradient(135deg, #fed7aa, #fdba74)",
                                    color:
                                      index === 0
                                        ? "#92400e"
                                        : index === 1
                                          ? "#475569"
                                          : "#9a3412",
                                  }}
                                >
                                  {index + 1}
                                </span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate max-w-[140px]">
                                  {getLocalizedString(
                                    page.title,
                                    cmsConfig.defaultLocale,
                                  )}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {count}
                              </span>
                            </Link>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No pages yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Island */}
      <AdminNavIsland />
    </>
  );
};

export default PagesAdmin;
