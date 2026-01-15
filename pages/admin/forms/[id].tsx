/**
 * Form Editor
 * Visual editor for building form fields
 */

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowPathIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  CloudArrowUpIcon,
  Bars2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  Cog6ToothIcon,
  InboxIcon,
  ClipboardIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import toast from "react-hot-toast";

type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file";

interface FormFieldOption {
  label: string;
  value: string;
}

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FormFieldOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  width?: "full" | "half";
  order: number;
}

interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  emailNotification: {
    enabled: boolean;
    to: string[];
    subject: string;
    includeSubmissionData: boolean;
  };
  captcha: {
    enabled: boolean;
    provider?: "recaptcha" | "hcaptcha";
  };
  limitSubmissions?: {
    enabled: boolean;
    maxPerUser?: number;
    maxTotal?: number;
  };
}

interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  status: "draft" | "published" | "archived";
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

const fieldTypeLabels: Record<FieldType, string> = {
  text: "Text",
  email: "Email",
  tel: "Phone",
  number: "Number",
  textarea: "Long Text",
  select: "Dropdown",
  radio: "Single Choice",
  checkbox: "Multiple Choice",
  date: "Date",
  file: "File Upload",
};

const fieldTypeIcons: Record<FieldType, string> = {
  text: "Aa",
  email: "@",
  tel: "#",
  number: "123",
  textarea: "¶",
  select: "▾",
  radio: "○",
  checkbox: "☑",
  date: "📅",
  file: "📎",
};

function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Draggable field item
const DraggableField: React.FC<{
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDragging: boolean;
}> = ({ field, isSelected, onSelect, onDelete, isDragging }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: field.id,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onSelect}
      className={`relative group p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isDragging
          ? "opacity-30"
          : isSelected
            ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
            : "border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          onClick={(e) => e.stopPropagation()}
        >
          <Bars2Icon className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-500">
              {fieldTypeIcons[field.type]}
            </span>
            <span className="font-medium text-slate-900 dark:text-white truncate">
              {field.label || "Untitled Field"}
            </span>
            {field.required && <span className="text-red-500 text-sm">*</span>}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {fieldTypeLabels[field.type]}
            {field.width === "half" && " • Half width"}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Drop zone between fields
const DropZone: React.FC<{ id: string; isOver: boolean }> = ({
  id,
  isOver,
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-1 transition-all ${
        isOver
          ? "h-12 bg-blue-100 dark:bg-blue-900/30 border-2 border-dashed border-blue-400 rounded-lg mx-4"
          : ""
      }`}
    />
  );
};

// Drag overlay
const DragOverlayContent: React.FC<{ field: FormField }> = ({ field }) => (
  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-2xl ring-2 ring-blue-500 w-72">
    <div className="flex items-center gap-2">
      <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-mono">
        {fieldTypeIcons[field.type]}
      </span>
      <span className="font-medium text-slate-900 dark:text-white">
        {field.label || "Untitled Field"}
      </span>
    </div>
  </div>
);

const FormEditorPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"fields" | "settings">("fields");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    if (id) {
      fetchForm(id as string);
    }
  }, [id]);

  const fetchForm = async (formId: string) => {
    try {
      const res = await fetch(`/api/forms/${formId}`);
      if (!res.ok) throw new Error("Failed to fetch form");
      const data = await res.json();
      setForm(data.form);
    } catch (error) {
      toast.error("Failed to load form");
      router.push("/admin/forms");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = useCallback((updates: Partial<Form>) => {
    setForm((prev) => (prev ? { ...prev, ...updates } : null));
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save form");

      const data = await res.json();
      setForm(data.form);
      setHasChanges(false);
      toast.success("Form saved");
    } catch (error) {
      toast.error("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!form) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "published" }),
      });

      if (!res.ok) throw new Error("Failed to publish form");

      const data = await res.json();
      setForm(data.form);
      setHasChanges(false);
      toast.success("Form published");
    } catch (error) {
      toast.error("Failed to publish form");
    } finally {
      setSaving(false);
    }
  };

  const addField = (type: FieldType) => {
    if (!form) return;

    const newField: FormField = {
      id: generateFieldId(),
      type,
      label: fieldTypeLabels[type],
      required: false,
      width: "full",
      order: form.fields.length,
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
            ]
          : undefined,
    };

    updateForm({ fields: [...form.fields, newField] });
    setSelectedFieldId(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!form) return;

    const newFields = form.fields.map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f,
    );
    updateForm({ fields: newFields });
  };

  const deleteField = (fieldId: string) => {
    if (!form) return;

    const newFields = form.fields
      .filter((f) => f.id !== fieldId)
      .map((f, i) => ({ ...f, order: i }));
    updateForm({ fields: newFields });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const duplicateField = (fieldId: string) => {
    if (!form) return;

    const field = form.fields.find((f) => f.id === fieldId);
    if (!field) return;

    const newField: FormField = {
      ...field,
      id: generateFieldId(),
      label: `${field.label} (Copy)`,
      order: form.fields.length,
    };

    updateForm({ fields: [...form.fields, newField] });
    setSelectedFieldId(newField.id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: any) => {
    setOverId(event.over?.id ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!form || !over || active.id === over.id) return;

    const oldIndex = form.fields.findIndex((f) => f.id === active.id);
    if (oldIndex === -1) return;

    let newIndex: number;
    if (String(over.id).startsWith("drop-")) {
      newIndex = parseInt(String(over.id).replace("drop-", ""), 10);
    } else {
      newIndex = form.fields.findIndex((f) => f.id === over.id);
      if (oldIndex < newIndex) newIndex++;
    }

    if (oldIndex === newIndex) return;

    const newFields = [...form.fields];
    const [removed] = newFields.splice(oldIndex, 1);
    newFields.splice(newIndex > oldIndex ? newIndex - 1 : newIndex, 0, removed);

    updateForm({
      fields: newFields.map((f, i) => ({ ...f, order: i })),
    });
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  const selectedField = form?.fields.find((f) => f.id === selectedFieldId);
  const activeField = form?.fields.find((f) => f.id === activeId);

  const pillStyles = `
    bg-white/80 dark:bg-slate-900/80
    backdrop-blur-xl backdrop-saturate-150
    border border-white/50 dark:border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    ring-1 ring-black/5 dark:ring-white/5
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <ArrowPathIcon className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{form.name} | Form Editor | Unchained CMS</title>
      </Head>

      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/forms"
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                <UnchainedLogo
                  size={16}
                  className="text-slate-900 dark:text-white"
                />
                <div className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Form Builder
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  className="text-lg font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 dark:text-white p-0"
                  placeholder="Form name"
                />
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-xs">{form.slug}</span>
                  <span>•</span>
                  <span
                    className={
                      form.status === "published"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }
                  >
                    {form.status}
                  </span>
                  <span>•</span>
                  <span>{form.submissionCount} submissions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/admin/forms/${form.id}/submissions`}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <InboxIcon className="w-4 h-4" />
                Submissions
              </Link>

              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  hasChanges
                    ? "admin-btn-primary"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                Save
              </button>

              {form.status !== "published" ? (
                <button
                  onClick={handlePublish}
                  disabled={saving || hasChanges}
                  className="admin-btn-primary px-4 py-2 rounded-lg font-medium disabled:cursor-not-allowed"
                >
                  <CloudArrowUpIcon className="w-4 h-4" />
                  Publish
                </button>
              ) : (
                <Link
                  href={`/forms/${form.slug}`}
                  target="_blank"
                  className="admin-btn-primary px-4 py-2 rounded-lg font-medium"
                >
                  <EyeIcon className="w-4 h-4" />
                  View Form
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left: Field Types Panel */}
          <div className="w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Add Field
            </h3>
            <div className="space-y-1">
              {(Object.keys(fieldTypeLabels) as FieldType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => addField(type)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-500">
                    {fieldTypeIcons[type]}
                  </span>
                  {fieldTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Form Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className={`max-w-xl mx-auto rounded-2xl p-6 ${pillStyles}`}>
              {/* Tabs */}
              <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => setActiveTab("fields")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "fields"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Fields
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "settings"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Settings
                </button>
              </div>

              {activeTab === "fields" ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  {form.fields.length === 0 ? (
                    <div className="text-center py-12">
                      <ClipboardIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                        No fields yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-4">
                        Click a field type on the left to add it
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <DropZone id="drop-0" isOver={overId === "drop-0"} />
                      {form.fields.map((field, index) => (
                        <React.Fragment key={field.id}>
                          <DraggableField
                            field={field}
                            isSelected={selectedFieldId === field.id}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onDelete={() => deleteField(field.id)}
                            isDragging={activeId === field.id}
                          />
                          <DropZone
                            id={`drop-${index + 1}`}
                            isOver={overId === `drop-${index + 1}`}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                  <DragOverlay dropAnimation={null}>
                    {activeField && <DragOverlayContent field={activeField} />}
                  </DragOverlay>
                </DndContext>
              ) : (
                /* Settings Tab */
                <div className="space-y-6">
                  {/* Form Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={form.description || ""}
                      onChange={(e) =>
                        updateForm({ description: e.target.value })
                      }
                      placeholder="Optional description for this form"
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Submit Button Text
                    </label>
                    <input
                      type="text"
                      value={form.settings.submitButtonText}
                      onChange={(e) =>
                        updateForm({
                          settings: {
                            ...form.settings,
                            submitButtonText: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Success Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Success Message
                    </label>
                    <textarea
                      value={form.settings.successMessage}
                      onChange={(e) =>
                        updateForm({
                          settings: {
                            ...form.settings,
                            successMessage: e.target.value,
                          },
                        })
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Redirect URL */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Redirect URL (optional)
                    </label>
                    <input
                      type="text"
                      value={form.settings.redirectUrl || ""}
                      onChange={(e) =>
                        updateForm({
                          settings: {
                            ...form.settings,
                            redirectUrl: e.target.value || undefined,
                          },
                        })
                      }
                      placeholder="https://example.com/thank-you"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Email Notification */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Receive email when form is submitted
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          updateForm({
                            settings: {
                              ...form.settings,
                              emailNotification: {
                                ...form.settings.emailNotification,
                                enabled:
                                  !form.settings.emailNotification.enabled,
                              },
                            },
                          })
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          form.settings.emailNotification.enabled
                            ? "bg-emerald-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            form.settings.emailNotification.enabled
                              ? "translate-x-5"
                              : ""
                          }`}
                        />
                      </button>
                    </div>

                    {form.settings.emailNotification.enabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Recipients (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={form.settings.emailNotification.to.join(
                              ", ",
                            )}
                            onChange={(e) =>
                              updateForm({
                                settings: {
                                  ...form.settings,
                                  emailNotification: {
                                    ...form.settings.emailNotification,
                                    to: e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean),
                                  },
                                },
                              })
                            }
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Subject
                          </label>
                          <input
                            type="text"
                            value={form.settings.emailNotification.subject}
                            onChange={(e) =>
                              updateForm({
                                settings: {
                                  ...form.settings,
                                  emailNotification: {
                                    ...form.settings.emailNotification,
                                    subject: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Field Settings Panel */}
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
            {selectedField ? (
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Field Settings
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateField(selectedField.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteField(selectedField.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Label */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={selectedField.label}
                      onChange={(e) =>
                        updateField(selectedField.id, { label: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Placeholder */}
                  {["text", "email", "tel", "number", "textarea"].includes(
                    selectedField.type,
                  ) && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={selectedField.placeholder || ""}
                        onChange={(e) =>
                          updateField(selectedField.id, {
                            placeholder: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {/* Help Text */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Help Text
                    </label>
                    <input
                      type="text"
                      value={selectedField.helpText || ""}
                      onChange={(e) =>
                        updateField(selectedField.id, {
                          helpText: e.target.value,
                        })
                      }
                      placeholder="Optional help text"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  {/* Required Toggle */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Required
                      </div>
                      <div className="text-xs text-slate-500">
                        Field must be filled
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        updateField(selectedField.id, {
                          required: !selectedField.required,
                        })
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        selectedField.required
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          selectedField.required ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Width */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Width
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateField(selectedField.id, { width: "full" })
                        }
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedField.width === "full"
                            ? "admin-active"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Full
                      </button>
                      <button
                        onClick={() =>
                          updateField(selectedField.id, { width: "half" })
                        }
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedField.width === "half"
                            ? "admin-active"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        Half
                      </button>
                    </div>
                  </div>

                  {/* Options for select/radio/checkbox */}
                  {["select", "radio", "checkbox"].includes(
                    selectedField.type,
                  ) && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {selectedField.options?.map((opt, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => {
                                const newOptions = [
                                  ...(selectedField.options || []),
                                ];
                                newOptions[index] = {
                                  label: e.target.value,
                                  value: e.target.value
                                    .toLowerCase()
                                    .replace(/\s+/g, "-"),
                                };
                                updateField(selectedField.id, {
                                  options: newOptions,
                                });
                              }}
                              className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                            />
                            <button
                              onClick={() => {
                                const newOptions =
                                  selectedField.options?.filter(
                                    (_, i) => i !== index,
                                  );
                                updateField(selectedField.id, {
                                  options: newOptions,
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newOptions = [
                              ...(selectedField.options || []),
                              {
                                label: `Option ${(selectedField.options?.length || 0) + 1}`,
                                value: `option${(selectedField.options?.length || 0) + 1}`,
                              },
                            ];
                            updateField(selectedField.id, {
                              options: newOptions,
                            });
                          }}
                          className="w-full px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                        >
                          + Add option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Validation for number */}
                  {selectedField.type === "number" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Min
                        </label>
                        <input
                          type="number"
                          value={selectedField.validation?.min ?? ""}
                          onChange={(e) =>
                            updateField(selectedField.id, {
                              validation: {
                                ...selectedField.validation,
                                min: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Max
                        </label>
                        <input
                          type="number"
                          value={selectedField.validation?.max ?? ""}
                          onChange={(e) =>
                            updateField(selectedField.id, {
                              validation: {
                                ...selectedField.validation,
                                max: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Validation for text/textarea */}
                  {["text", "textarea"].includes(selectedField.type) && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Min Length
                        </label>
                        <input
                          type="number"
                          value={selectedField.validation?.minLength ?? ""}
                          onChange={(e) =>
                            updateField(selectedField.id, {
                              validation: {
                                ...selectedField.validation,
                                minLength: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Max Length
                        </label>
                        <input
                          type="number"
                          value={selectedField.validation?.maxLength ?? ""}
                          onChange={(e) =>
                            updateField(selectedField.id, {
                              validation: {
                                ...selectedField.validation,
                                maxLength: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <Cog6ToothIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Select a field
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Click on a field to edit its settings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormEditorPage;
