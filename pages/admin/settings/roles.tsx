/**
 * User Roles Manager
 * Admin page for managing roles and permissions
 */

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import toast from "react-hot-toast";

type Permission = string;

interface PermissionDef {
  id: Permission;
  label: string;
  group: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as Permission[],
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
    } catch (error) {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name) {
      toast.error("Role name is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create role");
      }

      const data = await res.json();
      setRoles([...roles, data.role]);
      setFormData({ name: "", description: "", permissions: [] });
      setIsAdding(false);
      toast.success("Role created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create role",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      const data = await res.json();
      setRoles(roles.map((r) => (r.id === id ? data.role : r)));
      setEditingId(null);
      setFormData({ name: "", description: "", permissions: [] });
      toast.success("Role updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (role?.isSystem) {
      toast.error("Cannot delete system roles");
      return;
    }

    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const res = await fetch(`/api/roles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete role");
      }

      setRoles(roles.filter((r) => r.id !== id));
      toast.success("Role deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete role",
      );
    }
  };

  const startEditing = (role: Role) => {
    setEditingId(role.id);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const togglePermission = (permission: Permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const toggleAllInGroup = (group: string, enabled: boolean) => {
    const groupPermissions = permissions
      .filter((p) => p.group === group)
      .map((p) => p.id);
    setFormData((prev) => ({
      ...prev,
      permissions: enabled
        ? [...new Set([...prev.permissions, ...groupPermissions])]
        : prev.permissions.filter((p) => !groupPermissions.includes(p)),
    }));
  };

  // Group permissions by category
  const permissionGroups = permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) acc[perm.group] = [];
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, PermissionDef[]>,
  );

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
        <title>User Roles | Settings | Unchained CMS</title>
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
                  User Roles
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Manage roles and permissions for CMS users
                </p>
              </div>

              <button
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                  setFormData({ name: "", description: "", permissions: [] });
                }}
                disabled={isAdding}
                className="admin-btn-primary px-4 py-2.5 font-medium shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                Add Role
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
            <div className="space-y-4">
              {/* Add new role form */}
              {isAdding && (
                <div className={`rounded-2xl overflow-hidden ${pillStyles}`}>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Create New Role
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="e.g., Content Manager"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Brief description of this role"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Permissions */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Permissions
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(permissionGroups).map(
                            ([group, perms]) => {
                              const allSelected = perms.every((p) =>
                                formData.permissions.includes(p.id),
                              );
                              const someSelected = perms.some((p) =>
                                formData.permissions.includes(p.id),
                              );
                              return (
                                <div
                                  key={group}
                                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      {group}
                                    </span>
                                    <button
                                      onClick={() =>
                                        toggleAllInGroup(group, !allSelected)
                                      }
                                      className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    >
                                      {allSelected ? "None" : "All"}
                                    </button>
                                  </div>
                                  <div className="space-y-1">
                                    {perms.map((perm) => (
                                      <label
                                        key={perm.id}
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={formData.permissions.includes(
                                            perm.id,
                                          )}
                                          onChange={() =>
                                            togglePermission(perm.id)
                                          }
                                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-slate-400"
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                          {perm.label}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAdd}
                          disabled={saving}
                          className="admin-btn-primary px-4 py-2 text-sm font-medium rounded-lg"
                        >
                          {saving ? "Creating..." : "Create Role"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Roles list */}
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`rounded-2xl overflow-hidden ${pillStyles}`}
                >
                  {editingId === role.id ? (
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Edit Role
                        {role.isSystem && (
                          <span className="ml-2 text-xs font-normal text-amber-600 dark:text-amber-400">
                            (System role - name cannot be changed)
                          </span>
                        )}
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              disabled={role.isSystem}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              disabled={role.isSystem}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Permissions */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            Permissions
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(permissionGroups).map(
                              ([group, perms]) => {
                                const allSelected = perms.every((p) =>
                                  formData.permissions.includes(p.id),
                                );
                                return (
                                  <div
                                    key={group}
                                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        {group}
                                      </span>
                                      <button
                                        onClick={() =>
                                          toggleAllInGroup(group, !allSelected)
                                        }
                                        className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                      >
                                        {allSelected ? "None" : "All"}
                                      </button>
                                    </div>
                                    <div className="space-y-1">
                                      {perms.map((perm) => (
                                        <label
                                          key={perm.id}
                                          className="flex items-center gap-2 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={formData.permissions.includes(
                                              perm.id,
                                            )}
                                            onChange={() =>
                                              togglePermission(perm.id)
                                            }
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-slate-400"
                                          />
                                          <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {perm.label}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdate(role.id)}
                            disabled={saving}
                            className="admin-btn-primary px-4 py-2 text-sm font-medium rounded-lg"
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              role.isSystem
                                ? "bg-amber-100 dark:bg-amber-900/30"
                                : "bg-slate-100 dark:bg-slate-800"
                            }`}
                          >
                            {role.isSystem ? (
                              <LockClosedIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            ) : (
                              <ShieldCheckIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {role.name}
                              </h3>
                              {role.isSystem && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                                  System
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {role.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {role.permissions.slice(0, 5).map((perm) => (
                                <span
                                  key={perm}
                                  className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                                >
                                  {perm}
                                </span>
                              ))}
                              {role.permissions.length > 5 && (
                                <span className="px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400">
                                  +{role.permissions.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditing(role)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          {!role.isSystem && (
                            <button
                              onClick={() => handleDelete(role.id)}
                              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {roles.length === 0 && !isAdding && (
                <div className={`rounded-2xl py-16 text-center ${pillStyles}`}>
                  <ShieldCheckIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No roles found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Something went wrong loading roles
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

export default RolesPage;
