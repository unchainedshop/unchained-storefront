/**
 * Form Submissions Viewer
 * View and manage form submissions
 */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowPathIcon,
  ArrowLeftIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  InboxIcon,
  EnvelopeIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import UnchainedLogo from "../../../../modules/page-builder/components/UnchainedLogo";
import toast from "react-hot-toast";

interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  metadata: {
    userAgent?: string;
    ip?: string;
    referrer?: string;
    locale?: string;
  };
  status: "new" | "read" | "archived" | "spam";
  submittedAt: string;
}

interface FormField {
  id: string;
  type: string;
  label: string;
}

interface Form {
  id: string;
  name: string;
  slug: string;
  fields: FormField[];
  status: string;
  submissionCount: number;
}

const statusConfig = {
  new: {
    label: "New",
    icon: EnvelopeIcon,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  read: {
    label: "Read",
    icon: CheckCircleIcon,
    color: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
  },
  archived: {
    label: "Archived",
    icon: ArchiveBoxIcon,
    color:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  },
  spam: {
    label: "Spam",
    icon: ExclamationTriangleIcon,
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
};

const SubmissionsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<FormSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (id) {
      fetchForm(id as string);
      fetchSubmissions(id as string);
    }
  }, [id, statusFilter, page]);

  const fetchForm = async (formId: string) => {
    try {
      const res = await fetch(`/api/forms/${formId}`);
      if (!res.ok) throw new Error("Failed to fetch form");
      const data = await res.json();
      setForm(data.form);
    } catch (error) {
      toast.error("Failed to load form");
      router.push("/admin/forms");
    }
  };

  const fetchSubmissions = async (formId: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const res = await fetch(`/api/forms/${formId}/submissions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (
    submissionId: string,
    status: FormSubmission["status"],
  ) => {
    try {
      const res = await fetch(`/api/forms/${id}/submissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status } : s)),
      );
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission((prev) => (prev ? { ...prev, status } : null));
      }
      toast.success(`Marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteSubmission = async (submissionId: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const res = await fetch(`/api/forms/${id}/submissions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      if (!res.ok) throw new Error("Failed to delete submission");

      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(null);
      }
      setTotal((prev) => prev - 1);
      toast.success("Submission deleted");
    } catch (error) {
      toast.error("Failed to delete submission");
    }
  };

  const getFieldLabel = (fieldId: string): string => {
    const field = form?.fields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  const pillStyles = `
    bg-white/80 dark:bg-slate-900/80
    backdrop-blur-xl backdrop-saturate-150
    border border-white/50 dark:border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    ring-1 ring-black/5 dark:ring-white/5
  `;

  if (!form) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <ArrowPathIcon className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Submissions | {form.name} | Unchained CMS</title>
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

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

              {/* Breadcrumb */}
              <Link
                href={`/admin/forms/${form.id}`}
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to {form.name}
              </Link>

              {/* Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Submissions
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    {total} total submission{total !== 1 ? "s" : ""} for{" "}
                    {form.name}
                  </p>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <FunnelIcon className="w-4 h-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                    <option value="spam">Spam</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ArrowPathIcon className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : submissions.length === 0 ? (
            <div className={`rounded-2xl py-16 text-center ${pillStyles}`}>
              <InboxIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No submissions yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {statusFilter !== "all"
                  ? `No ${statusFilter} submissions found. Try changing the filter.`
                  : "Submissions will appear here once someone fills out your form."}
              </p>
            </div>
          ) : (
            <div className="flex gap-6">
              {/* Submissions List */}
              <div className="flex-1">
                <div className={`rounded-2xl overflow-hidden ${pillStyles}`}>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {submissions.map((submission) => {
                      const StatusIcon = statusConfig[submission.status].icon;
                      const isSelected =
                        selectedSubmission?.id === submission.id;

                      return (
                        <div
                          key={submission.id}
                          onClick={() => {
                            setSelectedSubmission(submission);
                            if (submission.status === "new") {
                              updateSubmissionStatus(submission.id, "read");
                            }
                          }}
                          className={`p-4 cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig[submission.status].color}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  {statusConfig[submission.status].label}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date(
                                    submission.submittedAt,
                                  ).toLocaleString()}
                                </span>
                              </div>
                              {/* Preview first few fields */}
                              <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                {Object.entries(submission.data)
                                  .slice(0, 2)
                                  .map(([key, value]) => (
                                    <span key={key} className="mr-3">
                                      <span className="font-medium">
                                        {getFieldLabel(key)}:
                                      </span>{" "}
                                      {formatValue(value)}
                                    </span>
                                  ))}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSubmission(submission.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Page {page} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={page === totalPages}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Detail */}
              <div className="w-96">
                {selectedSubmission ? (
                  <div className={`rounded-2xl p-6 sticky top-6 ${pillStyles}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Submission Details
                      </h3>
                      <button
                        onClick={() => setSelectedSubmission(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(["new", "read", "archived", "spam"] as const).map(
                        (status) => {
                          const config = statusConfig[status];
                          const StatusIcon = config.icon;
                          const isActive = selectedSubmission.status === status;

                          return (
                            <button
                              key={status}
                              onClick={() =>
                                updateSubmissionStatus(
                                  selectedSubmission.id,
                                  status,
                                )
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                isActive
                                  ? config.color
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                              }`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {config.label}
                            </button>
                          );
                        },
                      )}
                    </div>

                    {/* Submission Data */}
                    <div className="space-y-4">
                      {Object.entries(selectedSubmission.data).map(
                        ([key, value]) => (
                          <div key={key}>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                              {getFieldLabel(key)}
                            </label>
                            <div className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap break-words">
                              {formatValue(value)}
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Metadata
                      </h4>
                      <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <p>
                          <span className="font-medium">Submitted:</span>{" "}
                          {new Date(
                            selectedSubmission.submittedAt,
                          ).toLocaleString()}
                        </p>
                        {selectedSubmission.metadata.ip && (
                          <p>
                            <span className="font-medium">IP:</span>{" "}
                            {selectedSubmission.metadata.ip}
                          </p>
                        )}
                        {selectedSubmission.metadata.referrer && (
                          <p>
                            <span className="font-medium">Referrer:</span>{" "}
                            <span className="truncate block">
                              {selectedSubmission.metadata.referrer}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteSubmission(selectedSubmission.id)}
                      className="w-full mt-6 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                    >
                      Delete Submission
                    </button>
                  </div>
                ) : (
                  <div className={`rounded-2xl p-6 text-center ${pillStyles}`}>
                    <EyeIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Select a submission
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Click on a submission to view its details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SubmissionsPage;
