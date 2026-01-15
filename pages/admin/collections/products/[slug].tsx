/**
 * Product Collection Editor
 * Edit a product collection - add/remove products, update settings
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  Bars3Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../../modules/page-builder/components/AdminNavIsland";
import {
  getLocalizedValue,
  sanitizeSlug,
} from "../../../../modules/collections/utils/helpers";
import { cmsConfig } from "../../../../lib/cms.config";
import type {
  ProductCollection,
  LocalizedString,
} from "../../../../modules/collections/types";

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  draft: {
    label: "Draft",
    icon: ClockIcon,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-800",
  },
  published: {
    label: "Published",
    icon: CheckCircleIcon,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
  },
  archived: {
    label: "Archived",
    icon: TrashIcon,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
  },
};

const ProductCollectionEditorPage: React.FC = () => {
  const router = useRouter();
  const { slug: collectionSlug } = router.query;

  const [collection, setCollection] = useState<ProductCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState<LocalizedString>({});
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState<LocalizedString>({});
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    "draft",
  );
  const [productIds, setProductIds] = useState<string[]>([]);
  const [activeLocale, setActiveLocale] = useState(cmsConfig.defaultLocale);

  // Product search
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const fetchCollection = useCallback(async () => {
    if (!collectionSlug || typeof collectionSlug !== "string") return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/collections/products/${collectionSlug}`);
      if (!res.ok) throw new Error("Collection not found");

      const { collection: data } = await res.json();
      setCollection(data);
      setName(data.name);
      setSlug(data.slug);
      setDescription(data.description || {});
      setStatus(data.status);
      setProductIds(data.productIds || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load collection",
      );
    } finally {
      setIsLoading(false);
    }
  }, [collectionSlug]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const handleSave = async (newStatus?: "draft" | "published" | "archived") => {
    if (!slug) {
      setError("Slug is required");
      return;
    }

    if (!name[cmsConfig.defaultLocale]) {
      setError(`Name is required for ${cmsConfig.defaultLocale}`);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/collections/products/${collectionSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug !== collectionSlug ? sanitizeSlug(slug) : undefined,
          description,
          status: newStatus || status,
          productIds,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save collection");
      }

      const { collection: updated } = await res.json();
      setCollection(updated);
      setStatus(updated.status);
      setSuccessMessage("Collection saved successfully");

      // Redirect if slug changed
      if (updated.slug !== collectionSlug) {
        router.replace(`/admin/collections/products/${updated.slug}`);
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this collection? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/collections/products/${collectionSlug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete collection");

      router.push("/admin/collections/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleAddProduct = (productId: string) => {
    if (!productIds.includes(productId)) {
      setProductIds([...productIds, productId]);
    }
    setProductSearch("");
    setShowProductPicker(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setProductIds(productIds.filter((id) => id !== productId));
  };

  const handleMoveProduct = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= productIds.length) return;

    const newProductIds = [...productIds];
    [newProductIds[index], newProductIds[newIndex]] = [
      newProductIds[newIndex],
      newProductIds[index],
    ];
    setProductIds(newProductIds);
  };

  const StatusIcon = statusConfig[status]?.icon || ClockIcon;

  if (!collectionSlug) {
    return null;
  }

  return (
    <>
      <MetaTags
        title={`Edit ${collection ? getLocalizedValue(collection.name, cmsConfig.defaultLocale) : "Collection"} - Admin`}
      />
      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="relative pt-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  href="/admin/collections/products"
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
                    Product Collections
                  </span>
                </div>

                {/* Status Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[status]?.color}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig[status]?.label}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {collection
                    ? getLocalizedValue(
                        collection.name,
                        cmsConfig.defaultLocale,
                      )
                    : "Loading..."}
                </h1>

                <button
                  onClick={handleDelete}
                  className="p-2.5 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <XMarkIcon className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
              <p className="text-emerald-700 dark:text-emerald-400">
                {successMessage}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Language Switcher */}
              {cmsConfig.locales.length > 1 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Language:
                    </span>
                    <div className="flex gap-2 ml-2">
                      {cmsConfig.locales.map((locale) => (
                        <button
                          key={locale}
                          onClick={() => setActiveLocale(locale)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            activeLocale === locale
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {locale.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Collection Details */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Collection Details
                </h2>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name[activeLocale] || ""}
                      onChange={(e) =>
                        setName({ ...name, [activeLocale]: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                      placeholder={`Collection name in ${activeLocale.toUpperCase()}`}
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white font-mono"
                      placeholder="collection-slug"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description[activeLocale] || ""}
                      onChange={(e) =>
                        setDescription({
                          ...description,
                          [activeLocale]: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white resize-none"
                      placeholder="Brief description of this collection"
                    />
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Products ({productIds.length})
                  </h2>
                  <button
                    onClick={() => setShowProductPicker(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Product
                  </button>
                </div>

                {productIds.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <ShoppingBagIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      No products in this collection yet
                    </p>
                    <button
                      onClick={() => setShowProductPicker(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productIds.map((productId, index) => (
                      <div
                        key={productId}
                        className="group flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                      >
                        <div className="flex flex-col gap-0.5 opacity-50 group-hover:opacity-100">
                          <button
                            onClick={() => handleMoveProduct(index, "up")}
                            disabled={index === 0}
                            className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                          >
                            <ChevronUpIcon className="w-3 h-3 text-slate-400" />
                          </button>
                          <button
                            onClick={() => handleMoveProduct(index, "down")}
                            disabled={index === productIds.length - 1}
                            className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                          >
                            <ChevronDownIcon className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>

                        <Bars3Icon className="w-4 h-4 text-slate-300 dark:text-slate-600" />

                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <ShoppingBagIcon className="w-5 h-5 text-slate-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">
                            Product {productId}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {productId}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveProduct(productId)}
                          className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === "draft" && (
                    <button
                      onClick={() => handleSave("published")}
                      disabled={isSaving}
                      className="px-4 py-2.5 text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 font-medium rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all disabled:opacity-50"
                    >
                      Publish
                    </button>
                  )}
                  {status === "published" && (
                    <button
                      onClick={() => handleSave("archived")}
                      disabled={isSaving}
                      className="px-4 py-2.5 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 font-medium rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
                    >
                      Archive
                    </button>
                  )}
                  {status === "archived" && (
                    <button
                      onClick={() => handleSave("draft")}
                      disabled={isSaving}
                      className="px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                      Restore
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href="/admin/collections/products"
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AdminNavIsland />

      {/* Product Picker Modal */}
      {showProductPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProductPicker(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Add Product
                </h3>
                <button
                  onClick={() => setShowProductPicker(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Enter product ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder-slate-400"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Enter a product ID to add to this collection. Product IDs can be
                found in your Unchained Engine admin.
              </p>
              <button
                onClick={() => handleAddProduct(productSearch)}
                disabled={!productSearch}
                className="w-full px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCollectionEditorPage;
