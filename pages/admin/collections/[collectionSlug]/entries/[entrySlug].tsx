/**
 * Collection Entry Editor
 * Edit an existing entry for a collection
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../../../modules/page-builder/components/AdminNavIsland";
import {
  getLocalizedValue,
  sanitizeSlug,
} from "../../../../../modules/collections/utils/helpers";
import { cmsConfig } from "../../../../../lib/cms.config";
import type {
  CollectionSchema,
  CollectionEntry,
  FieldDefinition,
  EntryStatus,
  LocalizedString,
  SelectOption,
} from "../../../../../modules/collections/types";

const statusConfig: Record<
  EntryStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  draft: {
    label: "Draft",
    icon: ClockIcon,
    color: "text-slate-500 bg-slate-100 dark:bg-slate-800",
  },
  review: {
    label: "In Review",
    icon: ExclamationCircleIcon,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
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

// Field renderer component (same as in new.tsx)
const FieldRenderer: React.FC<{
  field: FieldDefinition;
  value: unknown;
  locale: string;
  onChange: (value: unknown) => void;
}> = ({ field, value, locale, onChange }) => {
  const fieldValue = field.localized
    ? ((value as Record<string, unknown>)?.[locale] ?? "")
    : value;

  const handleChange = (newValue: unknown) => {
    if (field.localized) {
      onChange({
        ...(value as Record<string, unknown>),
        [locale]: newValue,
      });
    } else {
      onChange(newValue);
    }
  };

  const baseInputClass =
    "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder-slate-400";

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={String(field.config?.placeholder || "")}
          className={baseInputClass}
        />
      );

    case "textarea":
      return (
        <textarea
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={String(field.config?.placeholder || "")}
          rows={(field.config?.rows as number) || 4}
          className={`${baseInputClass} resize-none`}
        />
      );

    case "richtext":
    case "markdown":
      return (
        <textarea
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${field.type === "richtext" ? "rich text" : "markdown"} content...`}
          rows={8}
          className={`${baseInputClass} resize-none font-mono text-sm`}
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={
            fieldValue !== undefined && fieldValue !== ""
              ? Number(fieldValue)
              : ""
          }
          onChange={(e) =>
            handleChange(e.target.value ? Number(e.target.value) : undefined)
          }
          min={field.validation?.min as number}
          max={field.validation?.max as number}
          step={field.config?.step as number}
          className={baseInputClass}
        />
      );

    case "boolean":
      return (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(fieldValue)}
            onChange={(e) => handleChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-900 dark:peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
        </label>
      );

    case "date":
      return (
        <input
          type="date"
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          className={baseInputClass}
        />
      );

    case "datetime":
      return (
        <input
          type="datetime-local"
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          className={baseInputClass}
        />
      );

    case "select":
    case "radio":
      const options = (field.config?.options as SelectOption[]) || [];
      return (
        <select
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          className={`${baseInputClass} cursor-pointer`}
        >
          <option value="">Select an option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {typeof opt.label === "string"
                ? opt.label
                : getLocalizedValue(opt.label, locale)}
            </option>
          ))}
        </select>
      );

    case "multiselect":
    case "checkbox":
      const multiOptions = (field.config?.options as SelectOption[]) || [];
      const selectedValues = Array.isArray(fieldValue) ? fieldValue : [];
      return (
        <div className="space-y-2">
          {multiOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleChange([...selectedValues, opt.value]);
                  } else {
                    handleChange(
                      selectedValues.filter((v: string) => v !== opt.value),
                    );
                  }
                }}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-slate-900 dark:focus:ring-white"
              />
              <span className="text-slate-700 dark:text-slate-300">
                {typeof opt.label === "string"
                  ? opt.label
                  : getLocalizedValue(opt.label, locale)}
              </span>
            </label>
          ))}
        </div>
      );

    case "color":
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={String(fieldValue || "#000000")}
            onChange={(e) => handleChange(e.target.value)}
            className="w-12 h-12 rounded-xl border-0 cursor-pointer"
          />
          <input
            type="text"
            value={String(fieldValue || "")}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="#000000"
            className={`${baseInputClass} flex-1 font-mono`}
          />
        </div>
      );

    case "image":
      return (
        <input
          type="text"
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter image URL..."
          className={baseInputClass}
        />
      );

    case "json":
      return (
        <textarea
          value={
            typeof fieldValue === "object"
              ? JSON.stringify(fieldValue, null, 2)
              : String(fieldValue || "")
          }
          onChange={(e) => {
            try {
              handleChange(JSON.parse(e.target.value));
            } catch {
              handleChange(e.target.value);
            }
          }}
          rows={6}
          className={`${baseInputClass} resize-none font-mono text-sm`}
          placeholder="{}"
        />
      );

    default:
      return (
        <input
          type="text"
          value={String(fieldValue || "")}
          onChange={(e) => handleChange(e.target.value)}
          className={baseInputClass}
        />
      );
  }
};

const EntryEditorPage: React.FC = () => {
  const router = useRouter();
  const { collectionSlug, entrySlug } = router.query;

  const [schema, setSchema] = useState<CollectionSchema | null>(null);
  const [entry, setEntry] = useState<CollectionEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [status, setStatus] = useState<EntryStatus>("draft");
  const [activeLocale, setActiveLocale] = useState(cmsConfig.defaultLocale);

  const fetchData = useCallback(async () => {
    if (
      !collectionSlug ||
      typeof collectionSlug !== "string" ||
      !entrySlug ||
      typeof entrySlug !== "string"
    )
      return;

    setIsLoading(true);
    try {
      // Fetch schema
      const schemaRes = await fetch(
        `/api/collections/schemas/${collectionSlug}`,
      );
      if (!schemaRes.ok) throw new Error("Collection not found");
      const schemaData = await schemaRes.json();
      setSchema(schemaData.schema);

      // Fetch entry
      const entryRes = await fetch(
        `/api/collections/${collectionSlug}/entries/${entrySlug}`,
      );
      if (!entryRes.ok) throw new Error("Entry not found");
      const entryData = await entryRes.json();

      setEntry(entryData.entry);
      setSlug(entryData.entry.slug);
      setContent(entryData.entry.content);
      setStatus(entryData.entry.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entry");
    } finally {
      setIsLoading(false);
    }
  }, [collectionSlug, entrySlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setContent((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setHasChanges(true);
  };

  const handleSlugChange = (newSlug: string) => {
    setSlug(sanitizeSlug(newSlug));
    setHasChanges(true);
  };

  const validateForm = (): string | null => {
    if (!slug) {
      return "Slug is required";
    }

    // Check required fields
    for (const field of schema?.fields || []) {
      if (field.validation?.required) {
        const value = content[field.name];
        if (field.localized) {
          const localizedValue = (value as Record<string, unknown>)?.[
            cmsConfig.defaultLocale
          ];
          if (!localizedValue) {
            return `${field.label[cmsConfig.defaultLocale] || field.name} is required`;
          }
        } else if (!value) {
          return `${field.label[cmsConfig.defaultLocale] || field.name} is required`;
        }
      }
    }

    return null;
  };

  const handleSave = async (newStatus?: EntryStatus) => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/collections/${collectionSlug}/entries/${entrySlug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: slug !== entrySlug ? slug : undefined,
            content,
            status: newStatus || status,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save entry");
      }

      const { entry: updatedEntry } = await res.json();

      // If slug changed, redirect to new URL
      if (updatedEntry.slug !== entrySlug) {
        router.replace(
          `/admin/collections/${collectionSlug}/entries/${updatedEntry.slug}`,
        );
      } else {
        setEntry(updatedEntry);
        setStatus(updatedEntry.status);
        setHasChanges(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const res = await fetch(
        `/api/collections/${collectionSlug}/entries/${entrySlug}?action=duplicate`,
        { method: "POST" },
      );

      if (!res.ok) throw new Error("Failed to duplicate entry");

      const { entry: duplicatedEntry } = await res.json();
      router.push(
        `/admin/collections/${collectionSlug}/entries/${duplicatedEntry.slug}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this entry? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/collections/${collectionSlug}/entries/${entrySlug}`,
        { method: "DELETE" },
      );

      if (!res.ok) throw new Error("Failed to delete entry");

      router.push(`/admin/collections/${collectionSlug}/entries`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const StatusIcon = statusConfig[status]?.icon || ClockIcon;

  if (!collectionSlug || !entrySlug) {
    return null;
  }

  return (
    <>
      <MetaTags
        title={`Edit Entry - ${schema ? getLocalizedValue(schema.name, cmsConfig.defaultLocale) : "Collection"}`}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  href={`/admin/collections/${collectionSlug}/entries`}
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
                    {schema
                      ? getLocalizedValue(schema.name, cmsConfig.defaultLocale)
                      : "Collection"}
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
                  Edit Entry
                </h1>

                <div className="flex items-center gap-2">
                  {status === "published" && (
                    <a
                      href={`/api/collections/public/${collectionSlug}/${entrySlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                      title="View Public"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </a>
                  )}
                  <button
                    onClick={handleDuplicate}
                    className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    title="Duplicate"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                  </button>
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
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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

              {/* Slug Field */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white font-mono"
                  placeholder="entry-slug"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Used in URLs and API endpoints
                </p>
              </div>

              {/* Content Fields */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Content
                </h2>
                <div className="space-y-6">
                  {schema?.fields.map((field) => (
                    <div key={field.id}>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {getLocalizedValue(
                          field.label,
                          cmsConfig.defaultLocale,
                        )}
                        {field.validation?.required && (
                          <span className="text-red-500">*</span>
                        )}
                        {field.localized && (
                          <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                            Localized
                          </span>
                        )}
                      </label>
                      {field.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                          {getLocalizedValue(
                            field.description as LocalizedString,
                            cmsConfig.defaultLocale,
                          )}
                        </p>
                      )}
                      <FieldRenderer
                        field={field}
                        value={content[field.name]}
                        locale={activeLocale}
                        onChange={(value) =>
                          handleFieldChange(field.name, value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              {entry && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Metadata
                  </h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Created:
                      </span>
                      <span className="ml-2 text-slate-900 dark:text-white">
                        {new Date(entry.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Updated:
                      </span>
                      <span className="ml-2 text-slate-900 dark:text-white">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    {entry.publishedAt && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">
                          Published:
                        </span>
                        <span className="ml-2 text-slate-900 dark:text-white">
                          {new Date(entry.publishedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Status Actions */}
                  {status === "draft" && (
                    <button
                      onClick={() => handleSave("review")}
                      disabled={isSaving}
                      className="px-4 py-2.5 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 font-medium rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all disabled:opacity-50"
                    >
                      Submit for Review
                    </button>
                  )}
                  {status === "review" && (
                    <button
                      onClick={() => handleSave("draft")}
                      disabled={isSaving}
                      className="px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                      Back to Draft
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
                      Restore to Draft
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/collections/${collectionSlug}/entries`}
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    onClick={() => handleSave()}
                    disabled={isSaving || !hasChanges}
                    className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  {(status === "draft" || status === "review") && (
                    <button
                      onClick={() => handleSave("published")}
                      disabled={isSaving}
                      className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Publishing..." : "Publish"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AdminNavIsland />
    </>
  );
};

export default EntryEditorPage;
