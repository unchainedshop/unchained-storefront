/**
 * Product Collections List
 * Manage curated product collections for e-commerce
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
  PencilIcon,
  EllipsisVerticalIcon,
  ShoppingBagIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../../modules/page-builder/components/AdminNavIsland";
import { getLocalizedValue } from "../../../../modules/collections/utils/helpers";
import { cmsConfig } from "../../../../lib/cms.config";
import type { ProductCollection } from "../../../../modules/collections/types";

const statusColors: Record<string, { bg: string; text: string; dot: string }> =
  {
    draft: {
      bg: "bg-slate-100 dark:bg-slate-800",
      text: "text-slate-600 dark:text-slate-400",
      dot: "bg-slate-400",
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

const ProductCollectionsPage: React.FC = () => {
  const router = useRouter();

  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const limit = 20;

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/collections/products?${params}`);
      if (!res.ok) throw new Error("Failed to load collections");

      const data = await res.json();
      setCollections(data.items);
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load collections",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCollections();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (slug: string) => {
    const confirmed = window.confirm(
      "Delete this product collection? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/collections/products/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete collection");

      fetchCollections();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionMenuId(null);
    }
  };

  const handleDuplicate = async (slug: string) => {
    try {
      const res = await fetch(
        `/api/collections/products/${slug}?action=duplicate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newSlug: `${slug}-copy-${Date.now()}` }),
        },
      );

      if (!res.ok) throw new Error("Failed to duplicate collection");

      const { collection } = await res.json();
      router.push(`/admin/collections/products/${collection.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    } finally {
      setActionMenuId(null);
    }
  };

  return (
    <>
      <MetaTags title="Product Collections - Admin" />
      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="relative pt-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14">
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
                    Product Collections
                  </h1>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    Curated product groups for your store
                  </p>
                </div>

                <Link
                  href="/admin/collections/products/new"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
                >
                  <PlusIcon className="w-5 h-5" />
                  New Collection
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
                  placeholder="Search collections..."
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

              {/* Refresh */}
              <button
                onClick={fetchCollections}
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

          {isLoading && collections.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <ShoppingBagIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No product collections yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Create curated product groups for your store
              </p>
              <Link
                href="/admin/collections/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                Create Collection
              </Link>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="group relative bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/admin/collections/products/${collection.slug}`}
                          className="block"
                        >
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-slate-700 dark:group-hover:text-slate-200">
                            {getLocalizedValue(
                              collection.name,
                              cmsConfig.defaultLocale,
                            )}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                            {collection.slug}
                          </p>
                        </Link>
                      </div>

                      <div className="relative ml-2">
                        <button
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === collection.id
                                ? null
                                : collection.id,
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>

                        {actionMenuId === collection.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20">
                            <Link
                              href={`/admin/collections/products/${collection.slug}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDuplicate(collection.slug)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <DocumentDuplicateIcon className="w-4 h-4" />
                              Duplicate
                            </button>
                            <hr className="my-2 border-slate-200 dark:border-slate-700" />
                            <button
                              onClick={() => handleDelete(collection.slug)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBagIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {collection.productIds?.length || 0} products
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[collection.status]?.bg} ${statusColors[collection.status]?.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusColors[collection.status]?.dot}`}
                        />
                        {collection.status.charAt(0).toUpperCase() +
                          collection.status.slice(1)}
                      </span>
                    </div>

                    {/* Description */}
                    {collection.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {getLocalizedValue(
                          collection.description,
                          cmsConfig.defaultLocale,
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {total > limit && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, total)} of {total} collections
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
              )}
            </>
          )}
        </div>
      </div>

      <AdminNavIsland />

      {/* Click outside to close menus */}
      {actionMenuId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActionMenuId(null)}
        />
      )}
    </>
  );
};

export default ProductCollectionsPage;
