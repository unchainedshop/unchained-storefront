/**
 * Create New Menu
 * Admin page to create a new navigation menu
 */

import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import { cmsConfig } from "../../../lib/cms.config";
import type {
  MenuType,
  CreateMenuInput,
} from "../../../modules/menu-builder/types";

const menuTypes: {
  type: MenuType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    type: "header",
    label: "Header Menu",
    description: "Top navigation bar links",
    icon: GlobeAltIcon,
  },
  {
    type: "sidebar",
    label: "Sidebar Menu",
    description: "Mobile navigation drawer",
    icon: DevicePhoneMobileIcon,
  },
  {
    type: "footer",
    label: "Footer Menu",
    description: "Footer navigation links",
    icon: RectangleGroupIcon,
  },
];

const NewMenuPage: React.FC = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<MenuType>("sidebar");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const input: CreateMenuInput = {
        slug: slug.trim(),
        name: { [cmsConfig.defaultLocale]: name.trim() },
        type: selectedType,
      };

      const res = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create menu");
      }

      const data = await res.json();
      router.push(`/admin/menus/${data.menu.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create menu");
      setIsCreating(false);
    }
  };

  return (
    <>
      <MetaTags title="Create Menu - Admin" />
      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="relative pt-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14">
              {/* Back link */}
              <Link
                href="/admin/menus"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Menus
              </Link>

              {/* Logo & Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                  <UnchainedLogo
                    size={20}
                    className="text-slate-900 dark:text-white"
                  />
                  <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Menu Builder
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Create New Menu
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Create a new navigation menu for your storefront
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <form onSubmit={handleCreate}>
            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Menu Type */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Menu Type
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {menuTypes.map(({ type, label, description, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType === type
                        ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mb-3 ${
                        selectedType === type
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400"
                      }`}
                    />
                    <div
                      className={`font-semibold ${
                        selectedType === type
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {label}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Slug */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Details
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Main Navigation"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    autoFocus
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      )
                    }
                    placeholder="e.g., main-navigation"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                  />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Used to fetch this menu in the frontend code
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/admin/menus"
                className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isCreating || !name.trim() || !slug.trim()}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Menu"}
              </button>
            </div>
          </form>
        </div>

        {/* Admin Navigation */}
        <AdminNavIsland />
      </div>
    </>
  );
};

export default NewMenuPage;
