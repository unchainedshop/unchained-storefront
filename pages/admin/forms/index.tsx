/**
 * Forms Manager
 * Admin page for managing forms and viewing submissions
 */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  DocumentTextIcon,
  InboxIcon,
  EyeIcon,
  PencilSquareIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import toast from "react-hot-toast";

interface Form {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "draft" | "published" | "archived";
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

const FormsPage: React.FC = () => {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await fetch("/api/forms");
      if (!res.ok) throw new Error("Failed to fetch forms");
      const data = await res.json();
      setForms(data.forms || []);
    } catch (error) {
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Untitled Form",
          fields: [],
        }),
      });

      if (!res.ok) throw new Error("Failed to create form");

      const data = await res.json();
      router.push(`/admin/forms/${data.form.id}`);
    } catch (error) {
      toast.error("Failed to create form");
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to delete this form and all its submissions?",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete form");

      setForms(forms.filter((f) => f.id !== id));
      toast.success("Form deleted");
    } catch (error) {
      toast.error("Failed to delete form");
    }
  };

  const getStatusBadge = (status: Form["status"]) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            Published
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
            Archived
          </span>
        );
    }
  };

  const pillStyles = `
    bg-white/80 dark:bg-slate-900/80
    backdrop-blur-xl backdrop-saturate-150
    border border-white/50 dark:border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    ring-1 ring-black/5 dark:ring-white/5
  `;

  return (
    <>
      <Head>
        <title>Forms | Unchained CMS</title>
      </Head>

      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Hero Header */}
        <div className="relative pt-16 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          {/* Decorative grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-200 dark:bg-slate-800 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-slate-300 dark:bg-slate-700 rounded-full opacity-15 blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    Form Builder
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Forms
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    Create and manage contact forms, surveys, and collect
                    submissions
                  </p>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {creating ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <PlusIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  )}
                  New Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ArrowPathIcon className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : forms.length === 0 ? (
            <div className={`rounded-2xl py-16 text-center ${pillStyles}`}>
              <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No forms yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                Create your first form to start collecting submissions from your
                website
              </p>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Create Form
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {forms.map((form) => (
                <Link
                  key={form.id}
                  href={`/admin/forms/${form.id}`}
                  className={`group rounded-2xl p-5 transition-all hover:shadow-lg ${pillStyles}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <DocumentTextIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                            {form.name}
                          </h3>
                          {getStatusBadge(form.status)}
                        </div>
                        {form.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">
                            {form.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <InboxIcon className="w-3.5 h-3.5" />
                            {form.submissionCount} submission
                            {form.submissionCount !== 1 ? "s" : ""}
                          </span>
                          <span>
                            Updated{" "}
                            {new Date(form.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/forms/${form.id}/submissions`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="View submissions"
                      >
                        <InboxIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/admin/forms/${form.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit form"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={(e) => handleDelete(form.id, e)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete form"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

        <AdminNavIsland />
      </div>
    </>
  );
};

export default FormsPage;
