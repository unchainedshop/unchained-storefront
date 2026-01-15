/**
 * Redirects Manager
 * Admin page for managing 301/302 redirect rules
 */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowLongRightIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import toast from "react-hot-toast";

interface Redirect {
  id: string;
  from: string;
  to: string;
  type: 301 | 302;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const RedirectsPage: React.FC = () => {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    type: 301 as 301 | 302,
  });

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      const res = await fetch("/api/redirects");
      if (!res.ok) throw new Error("Failed to fetch redirects");
      const data = await res.json();
      setRedirects(data.redirects || []);
    } catch (error) {
      toast.error("Failed to load redirects");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.from || !formData.to) {
      toast.error("Both paths are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create redirect");
      }

      const data = await res.json();
      setRedirects([...redirects, data.redirect]);
      setFormData({ from: "", to: "", type: 301 });
      setIsAdding(false);
      toast.success("Redirect created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create redirect");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/redirects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update redirect");
      }

      const data = await res.json();
      setRedirects(redirects.map((r) => (r.id === id ? data.redirect : r)));
      setEditingId(null);
      setFormData({ from: "", to: "", type: 301 });
      toast.success("Redirect updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update redirect");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (redirect: Redirect) => {
    try {
      const res = await fetch(`/api/redirects/${redirect.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !redirect.enabled }),
      });

      if (!res.ok) throw new Error("Failed to toggle redirect");

      const data = await res.json();
      setRedirects(redirects.map((r) => (r.id === redirect.id ? data.redirect : r)));
    } catch (error) {
      toast.error("Failed to toggle redirect");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect?")) return;

    try {
      const res = await fetch(`/api/redirects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete redirect");

      setRedirects(redirects.filter((r) => r.id !== id));
      toast.success("Redirect deleted");
    } catch (error) {
      toast.error("Failed to delete redirect");
    }
  };

  const startEditing = (redirect: Redirect) => {
    setEditingId(redirect.id);
    setFormData({
      from: redirect.from,
      to: redirect.to,
      type: redirect.type,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ from: "", to: "", type: 301 });
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
        <title>Redirects | Settings | Unchained CMS</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Hero Header */}
        <div className="relative pt-20 pb-8 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-6">
            {/* Breadcrumb */}
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-6"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Settings
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Redirects
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Manage URL redirects (301 permanent, 302 temporary)
                </p>
              </div>

              <button
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setFormData({ from: "", to: "", type: 301 });
                }}
                disabled={isAdding}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg disabled:opacity-50"
              >
                <PlusIcon className="w-5 h-5" />
                Add Redirect
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ArrowPathIcon className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className={`rounded-2xl overflow-hidden ${pillStyles}`}>
              {/* Add new redirect form */}
              {isAdding && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      placeholder="/old-path"
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    />
                    <ArrowLongRightIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      placeholder="/new-path or https://..."
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    />
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: Number(e.target.value) as 301 | 302 })}
                      className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    >
                      <option value={301}>301</option>
                      <option value={302}>302</option>
                    </select>
                    <button
                      onClick={handleAdd}
                      disabled={saving}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Redirects table */}
              {redirects.length === 0 && !isAdding ? (
                <div className="py-16 text-center">
                  <ArrowTopRightOnSquareIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No redirects yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Add your first redirect to manage URL routing
                  </p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Redirect
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {/* Header */}
                  {redirects.length > 0 && (
                    <div className="grid grid-cols-[1fr,auto,1fr,auto,auto,auto] gap-3 px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/30">
                      <div>From</div>
                      <div></div>
                      <div>To</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div></div>
                    </div>
                  )}

                  {redirects.map((redirect) => (
                    <div key={redirect.id}>
                      {editingId === redirect.id ? (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={formData.from}
                              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                            />
                            <ArrowLongRightIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <input
                              type="text"
                              value={formData.to}
                              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                              className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                            />
                            <select
                              value={formData.type}
                              onChange={(e) => setFormData({ ...formData, type: Number(e.target.value) as 301 | 302 })}
                              className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                            >
                              <option value={301}>301</option>
                              <option value={302}>302</option>
                            </select>
                            <button
                              onClick={() => handleUpdate(redirect.id)}
                              disabled={saving}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            >
                              <CheckIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-[1fr,auto,1fr,auto,auto,auto] gap-3 px-4 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <div className="font-mono text-sm text-slate-900 dark:text-white truncate">
                            {redirect.from}
                          </div>
                          <ArrowLongRightIcon className="w-5 h-5 text-slate-400" />
                          <div className="font-mono text-sm text-slate-600 dark:text-slate-400 truncate">
                            {redirect.to}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              redirect.type === 301
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                            }`}
                          >
                            {redirect.type}
                          </span>
                          <button
                            onClick={() => handleToggle(redirect)}
                            className={`relative w-10 h-6 rounded-full transition-colors ${
                              redirect.enabled
                                ? "bg-green-500"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                redirect.enabled ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditing(redirect)}
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(redirect.id)}
                              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Info footer */}
              {redirects.length > 0 && (
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <strong>301</strong> = Permanent redirect (SEO-friendly) &bull; <strong>302</strong> = Temporary redirect
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        <AdminNavIsland />
      </div>
    </>
  );
};

export default RedirectsPage;
