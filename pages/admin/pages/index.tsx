/**
 * Pages List
 * Admin page to list and manage all pages
 */

import React, { useState } from "react";
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
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import { usePages } from "../../../modules/page-builder/hooks/usePages";
import PageStatusBadge from "../../../modules/page-builder/components/PageStatusBadge";
import type { Page, PageStatus } from "../../../modules/page-builder/types";

const PagesAdmin: React.FC = () => {
  const router = useRouter();
  const { formatDate } = useIntl();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PageStatus | "all">("all");

  const { pages, isLoading, error, fetchPages, deletePage, duplicatePage } =
    usePages();

  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.title
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

  return (
    <>
      <MetaTags title="Pages - Admin" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Pages
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Create and manage your storefront pages
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchPages}
                disabled={isLoading}
                className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <Link
                href="/admin/pages/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Create Page
              </Link>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as PageStatus | "all")
                }
                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Pages list */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredPages.map((page) => (
                    <tr
                      key={page.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/admin/pages/${page.slug}`}
                            className="font-medium text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 underline-offset-2 hover:underline"
                          >
                            {page.title}
                          </Link>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            /{page.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <PageStatusBadge status={page.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(new Date(page.updatedAt), {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/p/${page.slug}`}
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            title="View page"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/pages/${page.slug}`}
                            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Edit page"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(page)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            title="Duplicate page"
                          >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deletePage(page)}
                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete page"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!isLoading && filteredPages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">
                  No pages found
                </p>
                <Link
                  href="/admin/pages/new"
                  className="inline-flex items-center gap-2 mt-4 text-slate-900 dark:text-white underline hover:no-underline"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create your first page
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PagesAdmin;
