/**
 * CMS Admin Dashboard
 * Clean bento grid layout
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
} from "@heroicons/react/24/outline";
import UnchainedLogo from "../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../modules/page-builder/components/AdminNavIsland";
import PageStatusBadge from "../../modules/page-builder/components/PageStatusBadge";
import type { PageStatus } from "../../modules/page-builder/types";

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

      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <UnchainedLogo className="h-5 w-5 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {greeting()}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {currentTime.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchStats}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowPathIcon
                    className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
                <Link
                  href="/admin/pages/new"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  New Page
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400">
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
                    <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats?.pages.published || 0}
                    </p>
                    <p className="text-sm text-slate-500">Published</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                      {stats?.pages.draft || 0}
                    </p>
                    <p className="text-sm text-slate-500">Drafts</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
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
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <PhotoIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                  <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <RectangleStackIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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

            {/* Recent Edits - Tall */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <PencilIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Recent Edits
                  </h3>
                </div>
                <Link
                  href="/admin/pages"
                  className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats?.recentEdits?.slice(0, 6).map((page) => (
                  <Link
                    key={page.id}
                    href={`/admin/pages/${page.slug}`}
                    className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 dark:text-white truncate pr-4">
                        {page.title}
                      </span>
                      <PageStatusBadge status={page.status} />
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatRelativeTime(page.updatedAt)}
                    </p>
                  </Link>
                )) || (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No pages yet
                  </div>
                )}
              </div>
            </div>

            {/* Media Stats */}
            <div className="col-span-6 lg:col-span-4 row-span-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <PhotoIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
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

            {/* Collections Stats */}
            <div className="col-span-6 lg:col-span-4 row-span-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                <RectangleStackIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 mb-0.5">Collections</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stats?.collections?.totalEntries || 0} entries
                </p>
                <p className="text-sm text-slate-500">
                  {stats?.collections?.total || 0} schemas
                </p>
              </div>
            </div>

            {/* Pending Reviews */}
            {(stats?.pendingReviews?.length || 0) > 0 && (
              <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <EyeIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Pending Reviews
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-medium">
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
                    <div className="h-9 w-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Scheduled
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 font-medium">
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
                      <p className="text-xs text-cyan-600 dark:text-cyan-400">
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
                    <div className="h-9 w-9 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <GlobeAltIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Translations
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-medium">
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

            {/* Quick Actions Bar */}
            <div className="col-span-12 row-span-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <BoltIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Quick Actions
                    </h3>
                    <p className="text-sm text-slate-500">
                      Jump right into creating
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    New Page
                  </Link>
                  <Link
                    href="/admin/media"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Upload Media
                  </Link>
                  <Link
                    href="/admin/collections/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                  >
                    <RectangleStackIcon className="w-4 h-4" />
                    New Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AdminNavIsland />
      </div>
    </>
  );
}
