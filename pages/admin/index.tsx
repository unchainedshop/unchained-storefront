/**
 * CMS Admin Dashboard
 * Overview of content management, pending reviews, and translation status
 */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  DocumentTextIcon,
  PhotoIcon,
  ClockIcon,
  GlobeAltIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  RocketLaunchIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  FolderIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../modules/common/components/MetaTags";
import UnchainedLogo from "../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../modules/page-builder/components/AdminNavIsland";
import PageStatusBadge from "../../modules/page-builder/components/PageStatusBadge";
import type { PageStatus } from "../../modules/page-builder/types";
import {
  blockRegistry,
  blockCategories,
  getBlocksByCategory,
} from "../../modules/page-builder/utils/blockRegistry";

// Icons mapping
const Icons = {
  document: <DocumentTextIcon className="w-5 h-5" />,
  photo: <PhotoIcon className="w-5 h-5" />,
  clock: <ClockIcon className="w-5 h-5" />,
  globe: <GlobeAltIcon className="w-5 h-5" />,
  calendar: <CalendarIcon className="w-5 h-5" />,
  eye: <EyeIcon className="w-5 h-5" />,
  pencil: <PencilIcon className="w-5 h-5" />,
  plus: <PlusIcon className="w-5 h-5" />,
  arrowRight: <ArrowRightIcon className="w-4 h-4" />,
  audit: <ClipboardDocumentListIcon className="w-5 h-5" />,
};

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
  pendingReviews: PageStat[];
  recentEdits: PageStat[];
  incompleteTranslations: PageStat[];
  scheduledPublishes: PageStat[];
}

// Translation Progress Bar
const TranslationProgress = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900 dark:bg-white transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">
        {percentage}%
      </span>
    </div>
  );
};

// Icon component for block icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "rectangle-group": Squares2X2Icon,
  "view-columns": Squares2X2Icon,
  "arrows-up-down": ArrowPathIcon,
  "document-text": DocumentTextIcon,
  photo: PhotoIcon,
  play: RocketLaunchIcon,
  "rectangle-stack": DocumentDuplicateIcon,
  "squares-plus": Squares2X2Icon,
  "question-mark-circle": EyeIcon,
  "shopping-cart": ClipboardDocumentListIcon,
  "chart-bar": ClipboardDocumentListIcon,
  "calendar-days": CalendarIcon,
  megaphone: SparklesIcon,
  users: UsersIcon,
  sparkles: SparklesIcon,
  "map-pin": GlobeAltIcon,
  "paint-brush": PaintBrushIcon,
  clock: ClockIcon,
  "device-phone-mobile": DevicePhoneMobileIcon,
  "document-duplicate": DocumentDuplicateIcon,
  folder: FolderIcon,
  "squares-2x2": Squares2X2Icon,
  "cloud-arrow-up": CloudArrowUpIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-path": ArrowPathIcon,
  "users-collaborate": UsersIcon,
};

const Icon = ({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) => {
  const IconComponent = iconMap[name] || Squares2X2Icon;
  return <IconComponent className={className} />;
};

// Block card component
const BlockCard = ({
  block,
  index,
}: {
  block: (typeof blockRegistry)[keyof typeof blockRegistry];
  index: number;
}) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900">
          <Icon name={block.icon} className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
            {block.label}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
            {block.description}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-full transition-transform duration-700" />
    </div>
  );
};

// Feature card component
const FeatureCard = ({
  icon,
  title,
  description,
  items,
}: {
  icon: string;
  title: string;
  description: string;
  items: string[];
}) => (
  <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 group">
    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-slate-100 dark:bg-slate-800 opacity-50 blur-2xl group-hover:opacity-70 transition-opacity" />
    <div className="relative">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg mb-4">
        <Icon name={icon} className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
        {description}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Stat card component
const StatCard = ({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 group hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {label}
        </p>
      </div>
      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
        <Icon
          name={icon}
          className="w-6 h-6 text-slate-600 dark:text-slate-400"
        />
      </div>
    </div>
  </div>
);

// Format file size
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Format relative time
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

// Format future date
const formatFutureDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Count blocks by category
  const blockCounts = blockCategories.map((cat) => ({
    ...cat,
    count: getBlocksByCategory(cat.id).length,
  }));
  const totalBlocks = Object.keys(blockRegistry).length;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/cms/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>CMS Dashboard | Unchained</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <UnchainedLogo className="h-6 w-6 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    CMS Dashboard
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Content Management System
                  </p>
                </div>
              </div>
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-colors"
              >
                {Icons.plus}
                New Page
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Pages Stats */}
            <Link
              href="/admin/pages"
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                  {Icons.document}
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {Icons.arrowRight}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats?.pages.total || 0}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Pages
              </p>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {stats?.pages.published || 0} published
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500">
                  {stats?.pages.draft || 0} drafts
                </span>
              </div>
            </Link>

            {/* Media Stats */}
            <Link
              href="/admin/media"
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                  {Icons.photo}
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {Icons.arrowRight}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats?.media.total || 0}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Media Files
              </p>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                {formatBytes(stats?.media.totalSizeBytes || 0)} total
              </div>
            </Link>

            {/* Pending Reviews */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                  {Icons.eye}
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats?.pages.in_review || 0}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pending Reviews
              </p>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
                {stats?.pages.approved || 0} approved
              </div>
            </div>

            {/* Audit Log */}
            <Link
              href="/admin/audit"
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                  {Icons.audit}
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {Icons.arrowRight}
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Audit Log
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View activity history
              </p>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Reviews */}
            {(stats?.pendingReviews?.length || 0) > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {Icons.eye}
                    Pending Reviews
                  </h2>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {stats?.pendingReviews.length} awaiting
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats?.pendingReviews.map((page) => (
                    <Link
                      key={page.id}
                      href={`/admin/pages/${page.slug}`}
                      className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900 dark:text-white truncate pr-4">
                          {page.title}
                        </span>
                        <PageStatusBadge status={page.status} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Submitted{" "}
                        {page.workflow?.submittedAt
                          ? formatRelativeTime(page.workflow.submittedAt)
                          : formatRelativeTime(page.updatedAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Edits */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  {Icons.pencil}
                  Recent Edits
                </h2>
                <Link
                  href="/admin/pages"
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats?.recentEdits?.slice(0, 5).map((page) => (
                  <Link
                    key={page.id}
                    href={`/admin/pages/${page.slug}`}
                    className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900 dark:text-white truncate pr-4">
                        {page.title}
                      </span>
                      <PageStatusBadge status={page.status} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Updated {formatRelativeTime(page.updatedAt)}
                    </p>
                  </Link>
                )) || (
                  <div className="px-5 py-8 text-center text-slate-500 dark:text-slate-500 text-sm">
                    No pages yet
                  </div>
                )}
              </div>
            </div>

            {/* Translation Status */}
            {(stats?.incompleteTranslations?.length || 0) > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {Icons.globe}
                    Translation Status
                  </h2>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {stats?.incompleteTranslations.length} incomplete
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats?.incompleteTranslations.map((page) => (
                    <Link
                      key={page.id}
                      href={`/admin/pages/${page.slug}`}
                      className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900 dark:text-white truncate pr-4">
                          {page.title}
                        </span>
                      </div>
                      <TranslationProgress
                        percentage={page.translationCompleteness}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Publishes */}
            {(stats?.scheduledPublishes?.length || 0) > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {Icons.calendar}
                    Scheduled Publishes
                  </h2>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {stats?.scheduledPublishes.length} upcoming
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stats?.scheduledPublishes.map((page) => (
                    <Link
                      key={page.id}
                      href={`/admin/pages/${page.slug}`}
                      className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900 dark:text-white truncate pr-4">
                          {page.title}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {page.workflow?.scheduledFor
                            ? formatFutureDate(page.workflow.scheduledFor)
                            : "-"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/pages/new"
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                {Icons.plus}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  New Page
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Create content
                </p>
              </div>
            </Link>

            <Link
              href="/admin/pages"
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                {Icons.document}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  All Pages
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Manage content
                </p>
              </div>
            </Link>

            <Link
              href="/admin/media"
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                {Icons.photo}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Media Library
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Upload files
                </p>
              </div>
            </Link>

            <Link
              href="/admin/audit"
              className="group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                {Icons.audit}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Audit Log
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  View history
                </p>
              </div>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              value={`${totalBlocks}+`}
              label="Block Components"
              icon="squares-2x2"
            />
            <StatCard value="5" label="Categories" icon="folder" />
            <StatCard
              value="6"
              label="Responsive Breakpoints"
              icon="device-phone-mobile"
            />
            <StatCard value="∞" label="Customizations" icon="paint-brush" />
          </div>

          {/* Component Library Section */}
          <section className="mt-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Component Library
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Professional-grade blocks for every e-commerce need
                </p>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                    activeCategory === null
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  All ({totalBlocks})
                </button>
                {blockCounts.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                      activeCategory === cat.id
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Blocks grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.values(blockRegistry)
                .filter(
                  (block) =>
                    activeCategory === null ||
                    block.category === activeCategory,
                )
                .map((block, index) => (
                  <BlockCard key={block.type} block={block} index={index} />
                ))}
            </div>
          </section>

          {/* Features Grid */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Powerful Capabilities
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need to build, manage, and optimize your
                storefront
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon="document-duplicate"
                title="Page Management"
                description="Create, edit, and organize pages with ease"
                items={[
                  "Visual drag-and-drop editor",
                  "Page versioning & history",
                  "SEO optimization tools",
                  "Draft/Published/Archived states",
                  "Duplicate & template pages",
                ]}
              />

              <FeatureCard
                icon="photo"
                title="Media Library"
                description="Organize and optimize all your media assets"
                items={[
                  "Folder organization",
                  "Tag-based filtering",
                  "Automatic thumbnails",
                  "Image optimization",
                  "Drag & drop uploads",
                ]}
              />

              <FeatureCard
                icon="device-phone-mobile"
                title="Responsive Design"
                description="Perfect on every device and screen size"
                items={[
                  "6 viewport breakpoints",
                  "Mobile-first approach",
                  "Live responsive preview",
                  "Per-block overrides",
                  "Touch-optimized interactions",
                ]}
              />

              <FeatureCard
                icon="paint-brush"
                title="Visual Styling"
                description="Pixel-perfect design without code"
                items={[
                  "Figma-style properties panel",
                  "Custom colors & typography",
                  "Spacing & layout controls",
                  "Background images & overlays",
                  "Border & shadow effects",
                ]}
              />

              <FeatureCard
                icon="users-collaborate"
                title="Collaboration"
                description="Work together in real-time"
                items={[
                  "Real-time presence indicators",
                  "Live cursor tracking",
                  "Concurrent editing",
                  "Change notifications",
                  "Team activity feed",
                ]}
              />

              <FeatureCard
                icon="arrow-path"
                title="History & Undo"
                description="Never lose your work"
                items={[
                  "Unlimited undo/redo",
                  "Version history",
                  "Auto-save functionality",
                  "Restore previous versions",
                  "Change comparison view",
                ]}
              />
            </div>
          </section>

          {/* Category Deep Dive */}
          <section className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Blocks by Category
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Specialized components for every aspect of your online store
              </p>
            </div>

            <div className="space-y-6">
              {blockCategories.map((category) => {
                const blocks = getBlocksByCategory(category.id);

                return (
                  <div
                    key={category.id}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:p-8"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-lg">
                        <Icon name={category.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {category.label} Blocks
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {blocks.length} components available
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {blocks.map((block) => (
                        <div
                          key={block.type}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                            <Icon name={block.icon} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                              {block.label}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {block.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer CTA */}
        <div className="bg-slate-900 dark:bg-slate-800 border-t border-slate-800 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to build something amazing?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Start creating beautiful, conversion-optimized pages in minutes
                with our visual page builder.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/admin/pages"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <SparklesIcon className="w-5 h-5" />
                  Start Building
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/admin/media"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 dark:border-slate-600 hover:bg-slate-700 dark:hover:bg-slate-600 hover:scale-105 transition-all duration-200"
                >
                  <CloudArrowUpIcon className="w-5 h-5" />
                  Upload Media
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
