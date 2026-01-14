/**
 * New Collection
 * Create a new collection from a template or from scratch
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import { getLocalizedValue, sanitizeSlug } from "../../../modules/collections/utils/helpers";
import { cmsConfig } from "../../../lib/cms.config";
import type { CollectionSchema, LocalizedString } from "../../../modules/collections/types";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  newspaper: NewspaperIcon,
  "chat-bubble-left-right": ChatBubbleLeftRightIcon,
  "user-group": UserGroupIcon,
  "question-mark-circle": QuestionMarkCircleIcon,
  "shopping-bag": ShoppingBagIcon,
  "rectangle-stack": RectangleStackIcon,
};

const NewCollection: React.FC = () => {
  const router = useRouter();
  const { template: preselectedTemplate } = router.query;

  const [templates, setTemplates] = useState<CollectionSchema[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState<LocalizedString>({});
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState<LocalizedString>({});

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/collections/schemas?templates=true");
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplates(data.templates || []);

        // Preselect template if provided in URL
        if (preselectedTemplate && typeof preselectedTemplate === "string") {
          setSelectedTemplate(preselectedTemplate);
          const template = data.templates?.find(
            (t: CollectionSchema) => t.slug === preselectedTemplate,
          );
          if (template) {
            setName(template.name);
            setSlug(template.slug);
            setDescription(template.description || {});
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [preselectedTemplate]);

  const handleTemplateSelect = (templateSlug: string) => {
    setSelectedTemplate(templateSlug);
    const template = templates.find((t) => t.slug === templateSlug);
    if (template) {
      setName(template.name);
      setSlug(template.slug);
      setDescription(template.description || {});
    }
    setError(null);
  };

  const handleNameChange = (locale: string, value: string) => {
    setName((prev) => ({ ...prev, [locale]: value }));
    // Auto-generate slug from default locale name
    if (locale === cmsConfig.defaultLocale && !slug) {
      setSlug(sanitizeSlug(value));
    }
  };

  const handleCreate = async () => {
    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    if (!slug) {
      setError("Slug is required");
      return;
    }

    if (!name[cmsConfig.defaultLocale]) {
      setError(`Name is required for ${cmsConfig.defaultLocale}`);
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/collections/schemas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: selectedTemplate,
          slug: sanitizeSlug(slug),
          name,
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create collection");
      }

      const { schema } = await res.json();
      router.push(`/admin/collections/${schema.slug}/entries`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setIsCreating(false);
    }
  };

  const getIcon = (iconName?: string) => {
    return iconMap[iconName || "rectangle-stack"] || RectangleStackIcon;
  };

  return (
    <>
      <MetaTags title="New Collection - Admin" />
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="flex items-center gap-4 mb-6">
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

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create Collection
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Choose a template to get started quickly
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Template Selection */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Choose Template
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {templates.map((template) => {
                    const Icon = getIcon(template.icon);
                    const isSelected = selectedTemplate === template.slug;
                    return (
                      <button
                        key={template.slug}
                        onClick={() => handleTemplateSelect(template.slug)}
                        className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-white dark:text-slate-900" />
                          </div>
                        )}
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-slate-900 dark:bg-white"
                              : "bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          <Icon
                            className={`w-7 h-7 ${
                              isSelected
                                ? "text-white dark:text-slate-900"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            isSelected
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {getLocalizedValue(
                            template.name,
                            cmsConfig.defaultLocale,
                          )}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {template.fields.length} fields
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Configuration */}
              {selectedTemplate && (
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
                      <div className="grid grid-cols-2 gap-3">
                        {cmsConfig.locales.slice(0, 2).map((locale) => (
                          <div key={locale}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                {locale}
                              </span>
                              {locale === cmsConfig.defaultLocale && (
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  Required
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={name[locale] || ""}
                              onChange={(e) =>
                                handleNameChange(locale, e.target.value)
                              }
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                              placeholder={`Collection name in ${locale.toUpperCase()}`}
                            />
                          </div>
                        ))}
                      </div>
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
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Used in URLs and API endpoints
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description[cmsConfig.defaultLocale] || ""}
                        onChange={(e) =>
                          setDescription((prev) => ({
                            ...prev,
                            [cmsConfig.defaultLocale]: e.target.value,
                          }))
                        }
                        rows={2}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white resize-none"
                        placeholder="Brief description of this collection"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Link
                  href="/admin/collections"
                  className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleCreate}
                  disabled={!selectedTemplate || isCreating}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  {isCreating ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin inline mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Collection"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <AdminNavIsland />
    </>
  );
};

export default NewCollection;
