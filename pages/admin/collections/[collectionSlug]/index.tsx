/**
 * Collection Schema Editor
 * Edit a collection's schema (fields, settings, etc.)
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  Bars3Icon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../../modules/page-builder/components/AdminNavIsland";
import {
  getLocalizedValue,
  generateFieldId,
} from "../../../../modules/collections/utils/helpers";
import {
  fieldRegistry,
  getAllFieldsByCategory,
} from "../../../../modules/collections/utils/fieldRegistry";
import { cmsConfig } from "../../../../lib/cms.config";
import type {
  CollectionSchema,
  FieldDefinition,
  FieldType,
  LocalizedString,
  SelectOption,
} from "../../../../modules/collections/types";

const SchemaEditorPage: React.FC = () => {
  const router = useRouter();
  const { collectionSlug } = router.query;

  const [schema, setSchema] = useState<CollectionSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [name, setName] = useState<LocalizedString>({});
  const [description, setDescription] = useState<LocalizedString>({});
  const [titleField, setTitleField] = useState<string>("");

  // UI State
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showFieldLibrary, setShowFieldLibrary] = useState(true);
  const [activeLocale, setActiveLocale] = useState(cmsConfig.defaultLocale);

  const fetchSchema = useCallback(async () => {
    if (!collectionSlug || typeof collectionSlug !== "string") return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/collections/schemas/${collectionSlug}`);
      if (!res.ok) throw new Error("Collection not found");
      const data = await res.json();

      setSchema(data.schema);
      setFields(data.schema.fields);
      setName(data.schema.name);
      setDescription(data.schema.description || {});
      setTitleField(data.schema.titleField || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load collection",
      );
    } finally {
      setIsLoading(false);
    }
  }, [collectionSlug]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  const handleAddField = (type: FieldType) => {
    const template = fieldRegistry[type];
    if (!template) return;

    const newField: FieldDefinition = {
      id: generateFieldId(),
      name: `${type}_${Date.now()}`,
      type,
      label: { [cmsConfig.defaultLocale]: template.label },
      localized: template.defaultConfig?.localized ?? false,
      config: template.defaultConfig?.config,
      validation: template.defaultConfig?.validation,
      order: fields.length,
    };

    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (
    fieldId: string,
    updates: Partial<FieldDefinition>,
  ) => {
    setFields(fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)));
  };

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    const index = fields.findIndex((f) => f.id === fieldId);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const newFields = [...fields];
    [newFields[index], newFields[newIndex]] = [
      newFields[newIndex],
      newFields[index],
    ];
    setFields(newFields.map((f, i) => ({ ...f, order: i })));
  };

  const handleDuplicateField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;

    const newField: FieldDefinition = {
      ...field,
      id: generateFieldId(),
      name: `${field.name}_copy`,
      label: {
        ...field.label,
        [cmsConfig.defaultLocale]: `${getLocalizedValue(field.label, cmsConfig.defaultLocale)} (Copy)`,
      },
      order: fields.length,
    };

    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/collections/schemas/${collectionSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          titleField,
          fields,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save schema");
      }

      const { schema: updatedSchema } = await res.json();
      setSchema(updatedSchema);
      setSuccessMessage("Schema saved successfully");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);
  const fieldCategories = getAllFieldsByCategory();

  if (!collectionSlug) {
    return null;
  }

  return (
    <>
      <MetaTags
        title={`Edit Schema - ${schema ? getLocalizedValue(schema.name, cmsConfig.defaultLocale) : "Collection"}`}
      />
      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="relative pt-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14 flex items-center justify-between">
              <div className="flex items-center gap-4">
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
                    Schema Editor
                  </span>
                </div>

                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  {schema
                    ? getLocalizedValue(schema.name, cmsConfig.defaultLocale)
                    : "Loading..."}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/collections/${collectionSlug}/entries`}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  View Entries
                </Link>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Schema"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {(error || successMessage) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                <XMarkIcon className="w-5 h-5 text-red-500" />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                <p className="text-emerald-700 dark:text-emerald-400">
                  {successMessage}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex gap-6">
              {/* Field Library */}
              {showFieldLibrary && (
                <div className="w-72 flex-shrink-0">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-slate-900 dark:text-white">
                        Field Types
                      </h2>
                      <button
                        onClick={() => setShowFieldLibrary(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {Object.entries(fieldCategories).map(
                        ([category, types]) => (
                          <div key={category}>
                            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                              {category}
                            </h3>
                            <div className="space-y-1">
                              {types.map((type) => {
                                const template = fieldRegistry[type];
                                return (
                                  <button
                                    key={type}
                                    onClick={() => handleAddField(type)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                  >
                                    <span className="text-slate-400">+</span>
                                    <span>{template.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Fields List */}
              <div className="flex-1 min-w-0">
                {/* Collection Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Cog6ToothIcon className="w-5 h-5 text-slate-400" />
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      Collection Settings
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Name
                      </label>
                      <div className="flex gap-2">
                        {cmsConfig.locales.slice(0, 2).map((locale) => (
                          <input
                            key={locale}
                            type="text"
                            value={name[locale] || ""}
                            onChange={(e) =>
                              setName({ ...name, [locale]: e.target.value })
                            }
                            placeholder={locale.toUpperCase()}
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Title Field */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Title Field
                      </label>
                      <select
                        value={titleField}
                        onChange={(e) => setTitleField(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white cursor-pointer"
                      >
                        <option value="">None (use slug)</option>
                        {fields
                          .filter((f) => ["text", "textarea"].includes(f.type))
                          .map((f) => (
                            <option key={f.id} value={f.name}>
                              {getLocalizedValue(
                                f.label,
                                cmsConfig.defaultLocale,
                              )}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description[cmsConfig.defaultLocale] || ""}
                        onChange={(e) =>
                          setDescription({
                            ...description,
                            [cmsConfig.defaultLocale]: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white resize-none"
                        placeholder="Brief description of this collection..."
                      />
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="w-5 h-5 text-slate-400" />
                      <h2 className="font-semibold text-slate-900 dark:text-white">
                        Fields ({fields.length})
                      </h2>
                    </div>

                    {!showFieldLibrary && (
                      <button
                        onClick={() => setShowFieldLibrary(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add Field
                      </button>
                    )}
                  </div>

                  {fields.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      <DocumentTextIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        No fields yet. Add fields from the library.
                      </p>
                      {!showFieldLibrary && (
                        <button
                          onClick={() => setShowFieldLibrary(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Show Field Library
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedFieldId === field.id
                              ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
                              : "border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                          onClick={() => setSelectedFieldId(field.id)}
                        >
                          <div className="flex flex-col gap-0.5 opacity-50 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveField(field.id, "up");
                              }}
                              disabled={index === 0}
                              className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                            >
                              <ChevronUpIcon className="w-3 h-3 text-slate-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveField(field.id, "down");
                              }}
                              disabled={index === fields.length - 1}
                              className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded disabled:opacity-30"
                            >
                              <ChevronDownIcon className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>

                          <Bars3Icon className="w-4 h-4 text-slate-300 dark:text-slate-600" />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {getLocalizedValue(
                                  field.label,
                                  cmsConfig.defaultLocale,
                                )}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
                                {field.type}
                              </span>
                              {field.localized && (
                                <GlobeAltIcon className="w-4 h-4 text-slate-400" />
                              )}
                              {field.validation?.required && (
                                <span className="text-red-500 text-xs">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {field.name}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateField(field.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                              title="Duplicate"
                            >
                              <DocumentDuplicateIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteField(field.id);
                              }}
                              className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Field Settings Panel */}
              {selectedField && (
                <div className="w-80 flex-shrink-0">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-slate-900 dark:text-white">
                        Field Settings
                      </h2>
                      <button
                        onClick={() => setSelectedFieldId(null)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Field Name */}
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Field Name
                        </label>
                        <input
                          type="text"
                          value={selectedField.name}
                          onChange={(e) =>
                            handleUpdateField(selectedField.id, {
                              name: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9_]/g, "_"),
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Label */}
                      <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Label
                        </label>
                        <div className="space-y-2">
                          {cmsConfig.locales.map((locale) => (
                            <div key={locale} className="flex gap-2">
                              <span className="w-8 text-xs text-slate-400 py-2">
                                {locale.toUpperCase()}
                              </span>
                              <input
                                type="text"
                                value={selectedField.label[locale] || ""}
                                onChange={(e) =>
                                  handleUpdateField(selectedField.id, {
                                    label: {
                                      ...selectedField.label,
                                      [locale]: e.target.value,
                                    },
                                  })
                                }
                                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Localized Toggle */}
                      <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Localized
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedField.localized}
                            onChange={(e) =>
                              handleUpdateField(selectedField.id, {
                                localized: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-900 dark:peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                        </label>
                      </div>

                      {/* Required Toggle */}
                      <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Required
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              selectedField.validation?.required ?? false
                            }
                            onChange={(e) =>
                              handleUpdateField(selectedField.id, {
                                validation: {
                                  ...selectedField.validation,
                                  required: e.target.checked,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-900 dark:peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                        </label>
                      </div>

                      {/* Type-specific settings */}
                      {(selectedField.type === "select" ||
                        selectedField.type === "multiselect" ||
                        selectedField.type === "radio" ||
                        selectedField.type === "checkbox") && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Options
                          </label>
                          <textarea
                            value={
                              (selectedField.config?.options as SelectOption[])
                                ?.map((o) => {
                                  const labelStr =
                                    typeof o.label === "string"
                                      ? o.label
                                      : getLocalizedValue(
                                          o.label,
                                          cmsConfig.defaultLocale,
                                        );
                                  return `${o.value}:${labelStr}`;
                                })
                                .join("\n") || ""
                            }
                            onChange={(e) => {
                              const options: SelectOption[] = e.target.value
                                .split("\n")
                                .filter((line) => line.trim())
                                .map((line) => {
                                  const [value, ...labelParts] =
                                    line.split(":");
                                  const labelStr =
                                    labelParts.join(":").trim() || value.trim();
                                  return {
                                    value: value.trim(),
                                    label: {
                                      [cmsConfig.defaultLocale]: labelStr,
                                    },
                                  };
                                });
                              handleUpdateField(selectedField.id, {
                                config: {
                                  ...selectedField.config,
                                  options,
                                },
                              });
                            }}
                            rows={4}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white resize-none"
                            placeholder="value:Label&#10;value2:Label 2"
                          />
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            One per line: value:Label
                          </p>
                        </div>
                      )}

                      {selectedField.type === "number" && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Min
                              </label>
                              <input
                                type="number"
                                value={selectedField.validation?.min ?? ""}
                                onChange={(e) =>
                                  handleUpdateField(selectedField.id, {
                                    validation: {
                                      ...selectedField.validation,
                                      min: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Max
                              </label>
                              <input
                                type="number"
                                value={selectedField.validation?.max ?? ""}
                                onChange={(e) =>
                                  handleUpdateField(selectedField.id, {
                                    validation: {
                                      ...selectedField.validation,
                                      max: e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                    },
                                  })
                                }
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {(selectedField.type === "text" ||
                        selectedField.type === "textarea") && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Placeholder
                          </label>
                          <input
                            type="text"
                            value={
                              typeof selectedField.config?.placeholder ===
                              "string"
                                ? selectedField.config.placeholder
                                : selectedField.config?.placeholder
                                  ? getLocalizedValue(
                                      selectedField.config.placeholder,
                                      cmsConfig.defaultLocale,
                                    )
                                  : ""
                            }
                            onChange={(e) =>
                              handleUpdateField(selectedField.id, {
                                config: {
                                  ...selectedField.config,
                                  placeholder: {
                                    [cmsConfig.defaultLocale]: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AdminNavIsland />
    </>
  );
};

export default SchemaEditorPage;
