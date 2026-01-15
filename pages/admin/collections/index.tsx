/**
 * Collections List
 * Admin page to list and manage all collection schemas
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import { getLocalizedValue } from "../../../modules/collections/utils/helpers";
import { cmsConfig } from "../../../lib/cms.config";
import type { CollectionSchema } from "../../../modules/collections/types";

// Icon mapping for collection types
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  newspaper: NewspaperIcon,
  "chat-bubble-left-right": ChatBubbleLeftRightIcon,
  "user-group": UserGroupIcon,
  "question-mark-circle": QuestionMarkCircleIcon,
  "shopping-bag": ShoppingBagIcon,
  "rectangle-stack": RectangleStackIcon,
  "document-text": DocumentTextIcon,
};

interface SchemaWithCount extends CollectionSchema {
  entryCount?: number;
}

const CollectionsAdmin: React.FC = () => {
  const router = useRouter();
  const { formatDate } = useIntl();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "content" | "product">(
    "all",
  );
  const [schemas, setSchemas] = useState<SchemaWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchemas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/collections/schemas");
      if (!res.ok) throw new Error("Failed to fetch schemas");
      const data = await res.json();
      setSchemas(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemas();
  }, []);

  const filteredSchemas = schemas.filter((schema) => {
    const name = getLocalizedValue(schema.name, cmsConfig.defaultLocale);
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || schema.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (schema: SchemaWithCount, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        `Are you sure you want to delete "${getLocalizedValue(schema.name, cmsConfig.defaultLocale)}"?`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/collections/schemas/${schema.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete schema");
      fetchSchemas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const stats = {
    total: schemas.length,
    content: schemas.filter((s) => s.type === "content").length,
    product: schemas.filter((s) => s.type === "product").length,
    totalEntries: schemas.reduce((sum, s) => sum + (s.entryCount || 0), 0),
  };

  const getIcon = (iconName?: string) => {
    const Icon = iconMap[iconName || "rectangle-stack"] || RectangleStackIcon;
    return Icon;
  };

  return (
    <>
      <MetaTags title="Collections - Admin" />
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
                    Collections
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white rounded-full">
                    New
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Collections
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    Manage structured content collections like blog posts,
                    testimonials, and product groups
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchSchemas}
                    disabled={isLoading}
                    className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                    title="Refresh"
                  >
                    <ArrowPathIcon
                      className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  <Link
                    href="/admin/collections/new"
                    className="admin-btn-primary group px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    Create Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Search & Collections */}
            <div className="flex-1 min-w-0">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search collections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) =>
                        setTypeFilter(
                          e.target.value as "all" | "content" | "product",
                        )
                      }
                      className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="all">All Types</option>
                      <option value="content">Content</option>
                      <option value="product">Product</option>
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

              {/* Collections list */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : filteredSchemas.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredSchemas.map((schema) => {
                      const Icon = getIcon(schema.icon);
                      return (
                        <div
                          key={schema.id}
                          onClick={() =>
                            router.push(
                              `/admin/collections/${schema.slug}/entries`,
                            )
                          }
                          className="group flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                schema.type === "product"
                                  ? "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40"
                                  : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700"
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 ${
                                  schema.type === "product"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-slate-500 dark:text-slate-400"
                                }`}
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {getLocalizedValue(
                                  schema.name,
                                  cmsConfig.defaultLocale,
                                )}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {schema.entryCount || 0} entries
                                </span>
                                <span className="text-slate-300 dark:text-slate-600">
                                  •
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {schema.fields.length} fields
                                </span>
                                <span className="text-slate-300 dark:text-slate-600">
                                  •
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    schema.type === "product"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                  }`}
                                >
                                  {schema.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/collections/${schema.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Edit schema"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={(e) => handleDelete(schema, e)}
                              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Delete collection"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <RectangleStackIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {searchQuery || typeFilter !== "all"
                        ? "No collections found"
                        : "No collections yet"}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
                      {searchQuery || typeFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by creating your first collection from a template"}
                    </p>
                    {!searchQuery && typeFilter === "all" && (
                      <Link
                        href="/admin/collections/new"
                        className="admin-btn-primary px-4 py-2 font-medium rounded-lg"
                      >
                        <PlusIcon className="w-5 h-5" />
                        Create Collection
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
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Total Collections
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Content
                    </span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      {stats.content}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Product
                    </span>
                    <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      {stats.product}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Total Entries
                      </span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.totalEntries}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Templates */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Quick Start Templates
                </h2>
                <div className="space-y-3">
                  {[
                    { name: "Blog", icon: NewspaperIcon, slug: "blog" },
                    {
                      name: "Testimonials",
                      icon: ChatBubbleLeftRightIcon,
                      slug: "testimonials",
                    },
                    { name: "Team", icon: UserGroupIcon, slug: "team" },
                    { name: "FAQ", icon: QuestionMarkCircleIcon, slug: "faq" },
                  ].map((template) => (
                    <Link
                      key={template.slug}
                      href={`/admin/collections/new?template=${template.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                        <template.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {template.name}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Create from template
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <AdminNavIsland />
    </>
  );
};

export default CollectionsAdmin;
