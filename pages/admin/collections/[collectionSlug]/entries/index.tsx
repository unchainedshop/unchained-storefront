/**
 * Collection Entries List
 * List all entries for a specific collection with filtering, search, and bulk actions
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  PencilIcon,
  ChevronUpDownIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../../../modules/page-builder/components/AdminNavIsland";
import { getLocalizedValue } from "../../../../../modules/collections/utils/helpers";
import { cmsConfig } from "../../../../../lib/cms.config";
import type {
  CollectionSchema,
  CollectionEntry,
  EntryStatus,
} from "../../../../../modules/collections/types";

const statusColors: Record<EntryStatus, { bg: string; text: string; dot: string }> = {
  draft: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-400",
  },
  review: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  published: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  archived: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
};

const CollectionEntriesPage: React.FC = () => {
  const router = useRouter();
  const { collectionSlug } = router.query;

  const [schema, setSchema] = useState<CollectionSchema | null>(null);
  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 20;

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // Actions
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSchema = useCallback(async () => {
    if (!collectionSlug || typeof collectionSlug !== "string") return;

    try {
      const res = await fetch(`/api/collections/schemas/${collectionSlug}`);
      if (!res.ok) throw new Error("Collection not found");
      const data = await res.json();
      setSchema(data.schema);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load collection");
    }
  }, [collectionSlug]);

  const fetchEntries = useCallback(async () => {
    if (!collectionSlug || typeof collectionSlug !== "string") return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(
        `/api/collections/${collectionSlug}/entries?${params}`,
      );
      if (!res.ok) throw new Error("Failed to load entries");

      const data = await res.json();
      setEntries(data.items);
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries");
    } finally {
      setIsLoading(false);
    }
  }, [collectionSlug, page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  useEffect(() => {
    if (schema) {
      fetchEntries();
    }
  }, [schema, fetchEntries]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (schema) {
        setPage(1);
        fetchEntries();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectAll = () => {
    if (selectedIds.size === entries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(entries.map((e) => e.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.size} entries? This cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/collections/${collectionSlug}/entries/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete",
            entryIds: Array.from(selectedIds),
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to delete entries");

      setSelectedIds(new Set());
      fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
      setShowBulkMenu(false);
    }
  };

  const handleBulkStatusChange = async (status: EntryStatus) => {
    if (selectedIds.size === 0) return;

    try {
      const res = await fetch(
        `/api/collections/${collectionSlug}/entries/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "status",
            entryIds: Array.from(selectedIds),
            status,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to update entries");

      setSelectedIds(new Set());
      fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setShowBulkMenu(false);
    }
  };

  const handleDeleteEntry = async (entrySlug: string) => {
    const confirmed = window.confirm("Delete this entry? This cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/collections/${collectionSlug}/entries/${entrySlug}`,
        { method: "DELETE" },
      );

      if (!res.ok) throw new Error("Failed to delete entry");

      fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionMenuId(null);
    }
  };

  const handleDuplicateEntry = async (entrySlug: string) => {
    try {
      const res = await fetch(
        `/api/collections/${collectionSlug}/entries/${entrySlug}?action=duplicate`,
        { method: "POST" },
      );

      if (!res.ok) throw new Error("Failed to duplicate entry");

      const { entry } = await res.json();
      router.push(
        `/admin/collections/${collectionSlug}/entries/${entry.slug}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    } finally {
      setActionMenuId(null);
    }
  };

  const getEntryTitle = (entry: CollectionEntry): string => {
    if (!schema?.titleField) return entry.slug;

    const titleValue = entry.content[schema.titleField];
    if (!titleValue) return entry.slug;

    // Check if it's a localized field
    const field = schema.fields.find((f) => f.name === schema.titleField);
    if (field?.localized && typeof titleValue === "object") {
      return (
        getLocalizedValue(
          titleValue as Record<string, string>,
          cmsConfig.defaultLocale,
        ) || entry.slug
      );
    }

    return String(titleValue) || entry.slug;
  };

  if (!collectionSlug) {
    return null;
  }

  return (
    <>
      <MetaTags
        title={`${schema ? getLocalizedValue(schema.name, cmsConfig.defaultLocale) : "Entries"} - Admin`}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  href="/admin/collections"
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                  <UnchainedLogo
                    size={18}
                    className="text-slate-900 dark:text-white"
                  />
                  <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Collections
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {schema
                      ? getLocalizedValue(schema.name, cmsConfig.defaultLocale)
                      : "Loading..."}
                  </h1>
                  {schema?.description && (
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      {getLocalizedValue(
                        schema.description,
                        cmsConfig.defaultLocale,
                      )}
                    </p>
                  )}
                </div>

                <Link
                  href={`/admin/collections/${collectionSlug}/entries/new`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
                >
                  <PlusIcon className="w-5 h-5" />
                  New Entry
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search entries..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as EntryStatus | "all");
                    setPage(1);
                  }}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="review">In Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Bulk Actions */}
              {selectedIds.size > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowBulkMenu(!showBulkMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                  >
                    <span>{selectedIds.size} selected</span>
                    <ChevronUpDownIcon className="w-4 h-4" />
                  </button>

                  {showBulkMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-30">
                      <button
                        onClick={() => handleBulkStatusChange("published")}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Publish Selected
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange("draft")}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Move to Draft
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange("archived")}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Archive Selected
                      </button>
                      <hr className="my-2 border-slate-200 dark:border-slate-700" />
                      <button
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {isDeleting ? "Deleting..." : "Delete Selected"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Refresh */}
              <button
                onClick={fetchEntries}
                disabled={isLoading}
                className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <ArrowPathIcon
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {isLoading && entries.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <PlusIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No entries yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Create your first entry to get started
              </p>
              <Link
                href={`/admin/collections/${collectionSlug}/entries/new`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                Create Entry
              </Link>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="w-12 px-4 py-3">
                        <button
                          onClick={handleSelectAll}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedIds.size === entries.length
                              ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white"
                              : "border-slate-300 dark:border-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {selectedIds.size === entries.length && (
                            <CheckIcon className="w-3 h-3 text-white dark:text-slate-900" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="w-12 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleSelectOne(entry.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              selectedIds.has(entry.id)
                                ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white"
                                : "border-slate-300 dark:border-slate-600 hover:border-slate-400"
                            }`}
                          >
                            {selectedIds.has(entry.id) && (
                              <CheckIcon className="w-3 h-3 text-white dark:text-slate-900" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/collections/${collectionSlug}/entries/${entry.slug}`}
                            className="block"
                          >
                            <p className="font-medium text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200">
                              {getEntryTitle(entry)}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                              {entry.slug}
                            </p>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[entry.status].bg} ${statusColors[entry.status].text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusColors[entry.status].dot}`}
                            />
                            {entry.status.charAt(0).toUpperCase() +
                              entry.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(entry.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActionMenuId(
                                  actionMenuId === entry.id ? null : entry.id,
                                )
                              }
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>

                            {actionMenuId === entry.id && (
                              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20">
                                <Link
                                  href={`/admin/collections/${collectionSlug}/entries/${entry.slug}`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                  Edit
                                </Link>
                                {entry.status === "published" && (
                                  <a
                                    href={`/api/collections/public/${collectionSlug}/${entry.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <EyeIcon className="w-4 h-4" />
                                    View Public
                                  </a>
                                )}
                                <button
                                  onClick={() =>
                                    handleDuplicateEntry(entry.slug)
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                  <DocumentDuplicateIcon className="w-4 h-4" />
                                  Duplicate
                                </button>
                                <hr className="my-2 border-slate-200 dark:border-slate-700" />
                                <button
                                  onClick={() => handleDeleteEntry(entry.slug)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, total)} of {total} entries
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AdminNavIsland />

      {/* Click outside to close menus */}
      {(showBulkMenu || actionMenuId) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowBulkMenu(false);
            setActionMenuId(null);
          }}
        />
      )}
    </>
  );
};

export default CollectionEntriesPage;
