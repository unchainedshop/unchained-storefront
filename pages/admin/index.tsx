/**
 * CMS Admin Dashboard
 * Clean bento grid layout - monochrome
 */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  DocumentTextIcon,
  PhotoIcon,
  GlobeAltIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  RectangleStackIcon,
  BoltIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import UnchainedLogo from "../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../modules/page-builder/components/AdminNavIsland";
import PageStatusBadge from "../../modules/page-builder/components/PageStatusBadge";
import RecentActivity from "../../modules/page-builder/components/RecentActivity";
import type { PageStatus } from "../../modules/page-builder/types";
import type { AuditEntry } from "../../modules/cms/types/audit";

interface PageStat {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  updatedAt: string;
  workflow?: {
    submittedAt?: string;
    submittedBy?: string;
    scheduledFor?: string;
  };
  translationCompleteness: number;
}

interface DashboardStats {
  pages: {
    total: number;
    draft: number;
    in_review: number;
    approved: number;
    published: number;
    archived: number;
  };
  media: {
    total: number;
    totalSizeBytes: number;
  };
  collections?: {
    total: number;
    totalEntries: number;
  };
  pendingReviews: PageStat[];
  recentEdits: PageStat[];
  incompleteTranslations: PageStat[];
  scheduledPublishes: PageStat[];
  recentActivity: AuditEntry[];
  totalActivityCount: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const TranslationProgress = ({ percentage }: { percentage: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-slate-900 dark:bg-white rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="text-xs text-slate-500 w-8 text-right">{percentage}%</span>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingMoreActivity, setLoadingMoreActivity] = useState(false);

  useEffect(() => {
    fetchStats();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/cms/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreActivity = async () => {
    if (!stats || loadingMoreActivity) return;
    setLoadingMoreActivity(true);
    try {
      const offset = stats.recentActivity.length;
      const response = await fetch(`/api/audit?limit=20&offset=${offset}`);
      if (!response.ok) throw new Error("Failed to load more activity");
      const data = await response.json();
      setStats({
        ...stats,
        recentActivity: [...stats.recentActivity, ...data.entries],
      });
    } catch (err) {
      console.error("Failed to load more activity:", err);
    } finally {
      setLoadingMoreActivity(false);
    }
  };

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | Unchained CMS</title>
      </Head>

      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Hero Header */}
        <div className="relative pt-16 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
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
                    CMS Dashboard
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {greeting()}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    {currentTime.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                    title="Refresh"
                  >
                    <ArrowPathIcon
                      className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                    />
                  </button>
                  <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    New Page
                  </Link>
                  <Link
                    href="/admin/media"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Upload Media
                  </Link>
                  <Link
                    href="/admin/menus/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <Bars3Icon className="w-4 h-4" />
                    New Menu
                  </Link>
                  <Link
                    href="/admin/collections/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <RectangleStackIcon className="w-4 h-4" />
                    New Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-300">
              {error}
            </div>
          )}

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[120px]">
            {/* Hero Stats - Large Card */}
            <div className="col-span-12 lg:col-span-8 row-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Content Overview
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Your Content at a Glance
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {stats?.pages.total || 0}
                    </p>
                    <p className="text-sm text-slate-500">Total Pages</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                      {stats?.pages.published || 0}
                    </p>
                    <p className="text-sm text-slate-500">Published</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-600 dark:text-slate-400">
                      {stats?.pages.draft || 0}
                    </p>
                    <p className="text-sm text-slate-500">Drafts</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-600 dark:text-slate-400">
                      {stats?.pages.in_review || 0}
                    </p>
                    <p className="text-sm text-slate-500">In Review</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Nav - Pages */}
            <Link
              href="/admin/pages"
              className="col-span-6 lg:col-span-2 row-span-1 group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <DocumentTextIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Pages
                  </p>
                  <p className="text-sm text-slate-500">Manage content</p>
                </div>
              </div>
            </Link>

            {/* Quick Nav - Media */}
            <Link
              href="/admin/media"
              className="col-span-6 lg:col-span-2 row-span-1 group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <PhotoIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Media
                  </p>
                  <p className="text-sm text-slate-500">
                    {stats?.media.total || 0} files
                  </p>
                </div>
              </div>
            </Link>

            {/* Quick Nav - Collections */}
            <Link
              href="/admin/collections"
              className="col-span-6 lg:col-span-2 row-span-1 group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <RectangleStackIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Collections
                  </p>
                  <p className="text-sm text-slate-500">
                    {stats?.collections?.total || 0} schemas
                  </p>
                </div>
              </div>
            </Link>

            {/* Quick Nav - Audit */}
            <Link
              href="/admin/audit"
              className="col-span-6 lg:col-span-2 row-span-1 group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Audit Log
                  </p>
                  <p className="text-sm text-slate-500">View activity</p>
                </div>
              </div>
            </Link>

            {/* Recent Activity - Expandable */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-3">
              <RecentActivity
                entries={stats?.recentActivity || []}
                totalCount={stats?.totalActivityCount || 0}
                onLoadMore={loadMoreActivity}
                isLoadingMore={loadingMoreActivity}
              />
            </div>

            {/* Media Stats */}
            <div className="col-span-6 lg:col-span-4 row-span-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <PhotoIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 mb-0.5">Media Library</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatBytes(stats?.media.totalSizeBytes || 0)}
                </p>
                <p className="text-sm text-slate-500">
                  {stats?.media.total || 0} files
                </p>
              </div>
            </div>

            {/* Pending Reviews */}
            {(stats?.pendingReviews?.length || 0) > 0 && (
              <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <EyeIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Pending Reviews
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {stats?.pendingReviews.length}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats?.pendingReviews.slice(0, 4).map((page) => (
                    <Link
                      key={page.id}
                      href={`/admin/pages/${page.slug}`}
                      className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white truncate block mb-1">
                        {page.title}
                      </span>
                      <p className="text-xs text-slate-500">
                        Submitted{" "}
                        {formatRelativeTime(
                          page.workflow?.submittedAt || page.updatedAt,
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Publishes */}
            {(stats?.scheduledPublishes?.length || 0) > 0 && (
              <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Scheduled
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {stats?.scheduledPublishes.length}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats?.scheduledPublishes.slice(0, 4).map((page) => (
                    <Link
                      key={page.id}
                      href={`/admin/pages/${page.slug}`}
                      className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white truncate block mb-1">
                        {page.title}
                      </span>
                      <p className="text-xs text-slate-500">
                        {page.workflow?.scheduledFor
                          ? new Date(
                              page.workflow.scheduledFor,
                            ).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Translations */}
            {(stats?.incompleteTranslations?.length || 0) > 0 && (
              <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <GlobeAltIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Translations
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {stats?.incompleteTranslations.length} incomplete
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats?.incompleteTranslations.slice(0, 4).map((page) => (
                    <Link
                      key={page.id}
                      href={`/admin/pages/${page.slug}`}
                      className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 dark:text-white truncate block mb-2">
                        {page.title}
                      </span>
                      <TranslationProgress
                        percentage={page.translationCompleteness}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <AdminNavIsland />
      </div>
    </>
  );
}
