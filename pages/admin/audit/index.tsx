/**
 * Audit Log Viewer Page
 * View and filter audit entries for the CMS
 */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import type {
  AuditEntry,
  AuditAction,
  AuditEntityType,
} from "../../../modules/cms/types/audit";
import {
  actionLabels,
  entityTypeLabels,
} from "../../../modules/cms/types/audit";

interface AuditResponse {
  entries: AuditEntry[];
  total: number;
}

const actionOptions: AuditAction[] = [
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "submit_review",
  "approve",
  "reject",
  "restore",
  "upload",
  "duplicate",
  "schedule",
];

const entityTypeOptions: AuditEntityType[] = ["page", "media", "folder"];

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [actionFilter, setActionFilter] = useState<AuditAction | "">("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<
    AuditEntityType | ""
  >("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(0);
  const limit = 25;

  useEffect(() => {
    fetchAuditLog();
  }, [actionFilter, entityTypeFilter, startDate, endDate, page]);

  const fetchAuditLog = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set("action", actionFilter);
      if (entityTypeFilter) params.set("entityType", entityTypeFilter);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      params.set("limit", limit.toString());
      params.set("offset", (page * limit).toString());

      const response = await fetch(`/api/audit?${params.toString()}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You do not have permission to view the audit log");
        }
        throw new Error("Failed to fetch audit log");
      }

      const data: AuditResponse = await response.json();
      setEntries(data.entries);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action: AuditAction): string => {
    switch (action) {
      case "create":
      case "upload":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "update":
      case "duplicate":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "delete":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "publish":
      case "approve":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "unpublish":
      case "reject":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "submit_review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "schedule":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "restore":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Head>
        <title>Audit Log | CMS Admin</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
                <h1 className="text-xl font-semibold text-white">Audit Log</h1>
              </div>
              <span className="text-sm text-slate-400">{total} entries</span>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="border-b border-white/10 bg-black/10">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Action Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Action:</label>
                <select
                  value={actionFilter}
                  onChange={(e) => {
                    setActionFilter(e.target.value as AuditAction | "");
                    setPage(0);
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">All Actions</option>
                  {actionOptions.map((action) => (
                    <option key={action} value={action}>
                      {actionLabels[action]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity Type Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">Type:</label>
                <select
                  value={entityTypeFilter}
                  onChange={(e) => {
                    setEntityTypeFilter(e.target.value as AuditEntityType | "");
                    setPage(0);
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="">All Types</option>
                  {entityTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {entityTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(0);
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(0);
                  }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Clear Filters */}
              {(actionFilter || entityTypeFilter || startDate || endDate) && (
                <button
                  onClick={() => {
                    setActionFilter("");
                    setEntityTypeFilter("");
                    setStartDate("");
                    setEndDate("");
                    setPage(0);
                  }}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="mx-auto max-w-7xl px-6 py-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-slate-500 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-400">No audit entries found</p>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your filters or date range
              </p>
            </div>
          ) : (
            <>
              {/* Entries Table */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Entity
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {formatDate(entry.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-white font-medium">
                            {entry.userName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getActionColor(entry.action)}`}
                          >
                            {actionLabels[entry.action]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 uppercase">
                              {entityTypeLabels[entry.entityType]}
                            </span>
                            <span className="text-sm text-white truncate max-w-[200px]">
                              {entry.entityTitle}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {entry.details ? (
                            <span className="text-xs text-slate-400">
                              {Object.entries(entry.details)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </span>
                          ) : entry.locale ? (
                            <span className="text-xs text-slate-400">
                              Locale: {entry.locale.toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-slate-400">
                    Showing {page * limit + 1} -{" "}
                    {Math.min((page + 1) * limit, total)} of {total} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-400">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage(Math.min(totalPages - 1, page + 1))
                      }
                      disabled={page >= totalPages - 1}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
