/**
 * Settings Page
 * CMS configuration, theme settings, and branding options
 */

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  CheckIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import MediaPickerField from "../../../modules/media/components/MediaPickerField";
import { cmsConfig } from "../../../lib/cms.config";

interface Settings {
  siteName: Record<string, string>;
  defaultLocale: string;
  availableLocales: string[];
  logo: string;
  darkLogo: string;
  primaryColor: string;
  darkModeDefault: boolean;
  adminEmail: string;
  dateFormat: string;
  timeFormat: string;
}

const defaultSettings: Settings = {
  siteName: { en: "", de: "" },
  defaultLocale: cmsConfig.defaultLocale,
  availableLocales: cmsConfig.locales,
  logo: "",
  darkLogo: "",
  primaryColor: "#0f172a",
  darkModeDefault: false,
  adminEmail: "",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "24h",
};

const allLocales = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
];

const dateFormats = [
  { value: "YYYY-MM-DD", label: "2024-01-15 (ISO)" },
  { value: "DD/MM/YYYY", label: "15/01/2024 (EU)" },
  { value: "MM/DD/YYYY", label: "01/15/2024 (US)" },
  { value: "DD.MM.YYYY", label: "15.01.2024 (DE)" },
];

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (err) {
      // Use defaults if settings don't exist yet
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update CSS variables in real-time for live preview of primary color
  useEffect(() => {
    if (settings.primaryColor) {
      const hex = settings.primaryColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const contrastColor = luminance > 0.5 ? "#000000" : "#ffffff";
      const hoverR = Math.max(0, r - 20);
      const hoverG = Math.max(0, g - 20);
      const hoverB = Math.max(0, b - 20);
      const hoverColor = `#${hoverR.toString(16).padStart(2, "0")}${hoverG.toString(16).padStart(2, "0")}${hoverB.toString(16).padStart(2, "0")}`;

      document.documentElement.style.setProperty(
        "--admin-primary",
        settings.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--admin-primary-hover",
        hoverColor,
      );
      document.documentElement.style.setProperty(
        "--admin-primary-text",
        contrastColor,
      );
    }
  }, [settings.primaryColor]);

  const handleChange = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSuccess(false);
  };

  const handleSiteNameChange = (locale: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      siteName: { ...prev.siteName, [locale]: value },
    }));
    setHasChanges(true);
    setSuccess(false);
  };

  const handleLocaleToggle = (locale: string) => {
    setSettings((prev) => {
      const isEnabled = prev.availableLocales.includes(locale);
      const newLocales = isEnabled
        ? prev.availableLocales.filter((l) => l !== locale)
        : [...prev.availableLocales, locale];
      return { ...prev, availableLocales: newLocales };
    });
    setHasChanges(true);
    setSuccess(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess(true);
      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <MetaTags title="Settings - Admin" />
      <div className="min-h-screen pb-48 bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        {/* Hero Header */}
        <div className="relative pt-16 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-200 dark:bg-slate-800 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-slate-300 dark:bg-slate-700 rounded-full opacity-15 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    CMS Settings
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Settings
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    Configure your CMS, theme, and branding options
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchSettings}
                    disabled={isLoading}
                    className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                    title="Refresh"
                  >
                    <ArrowPathIcon
                      className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className="admin-btn-primary group px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                  >
                    {isSaving ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckIcon className="w-5 h-5" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Status Messages */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <CheckIcon className="w-5 h-5 text-emerald-500" />
              <p className="text-emerald-700 dark:text-emerald-400">
                Settings saved successfully
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Settings */}
              <div className="lg:col-span-2 space-y-6">
                {/* CMS Configuration */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <GlobeAltIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        CMS Configuration
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Site name and localization settings
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Site Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Site Name
                      </label>
                      <div className="space-y-3">
                        {settings.availableLocales.map((locale) => (
                          <div key={locale} className="flex items-center gap-3">
                            <span className="w-8 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                              {locale}
                            </span>
                            <input
                              type="text"
                              value={settings.siteName[locale] || ""}
                              onChange={(e) =>
                                handleSiteNameChange(locale, e.target.value)
                              }
                              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                              placeholder={`Site name in ${locale.toUpperCase()}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Default Locale */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Default Locale
                      </label>
                      <select
                        value={settings.defaultLocale}
                        onChange={(e) =>
                          handleChange("defaultLocale", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                      >
                        {settings.availableLocales.map((locale) => (
                          <option key={locale} value={locale}>
                            {allLocales.find((l) => l.code === locale)?.label ||
                              locale.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Available Locales */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Available Locales
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allLocales.map((locale) => {
                          const isEnabled = settings.availableLocales.includes(
                            locale.code,
                          );
                          const isDefault =
                            locale.code === settings.defaultLocale;
                          return (
                            <button
                              key={locale.code}
                              onClick={() => handleLocaleToggle(locale.code)}
                              disabled={isDefault}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                isEnabled
                                  ? "admin-active"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                              } ${isDefault ? "opacity-75 cursor-not-allowed" : ""}`}
                            >
                              {locale.label}
                              {isDefault && (
                                <span className="ml-1 text-xs opacity-60">
                                  (default)
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme & Branding */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <PaintBrushIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Theme & Branding
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Logo, colors, and appearance
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Logo */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Logo (Light Mode)
                        </label>
                        <MediaPickerField
                          value={settings.logo}
                          onChange={(url) => handleChange("logo", url)}
                          placeholder="Select logo..."
                          allowedTypes={["image/*"]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Logo (Dark Mode)
                        </label>
                        <MediaPickerField
                          value={settings.darkLogo}
                          onChange={(url) => handleChange("darkLogo", url)}
                          placeholder="Select dark logo..."
                          allowedTypes={["image/*"]}
                        />
                      </div>
                    </div>

                    {/* Primary Color */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleChange("primaryColor", e.target.value)
                          }
                          className="w-12 h-12 rounded-xl border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) =>
                            handleChange("primaryColor", e.target.value)
                          }
                          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white font-mono"
                          placeholder="#0f172a"
                        />
                      </div>
                    </div>

                    {/* Dark Mode Default */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Dark Mode by Default
                        </label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Enable dark mode as the default theme
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleChange(
                            "darkModeDefault",
                            !settings.darkModeDefault,
                          )
                        }
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          settings.darkModeDefault
                            ? ""
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                        style={
                          settings.darkModeDefault
                            ? { backgroundColor: "var(--admin-primary)" }
                            : undefined
                        }
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow transition-transform ${
                            settings.darkModeDefault ? "translate-x-6" : ""
                          }`}
                          style={{
                            backgroundColor: settings.darkModeDefault
                              ? "var(--admin-primary-text)"
                              : "white",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Settings */}
              <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Cog6ToothIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        General
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Other preferences
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Admin Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) =>
                          handleChange("adminEmail", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                        placeholder="admin@example.com"
                      />
                    </div>

                    {/* Date Format */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) =>
                          handleChange("dateFormat", e.target.value)
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white"
                      >
                        {dateFormats.map((format) => (
                          <option key={format.value} value={format.value}>
                            {format.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Time Format */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Time Format
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleChange("timeFormat", "24h")}
                          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            settings.timeFormat === "24h"
                              ? "admin-active"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          24-hour
                        </button>
                        <button
                          onClick={() => handleChange("timeFormat", "12h")}
                          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            settings.timeFormat === "12h"
                              ? "admin-active"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          12-hour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings Links */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Advanced Settings
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    <Link
                      href="/admin/settings/redirects"
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Redirects
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage 301/302 redirect rules
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                    </Link>
                    <Link
                      href="/admin/settings/roles"
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheckIcon className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            User Roles
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage roles and permissions
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                    </Link>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    About Settings
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Changes to these settings will affect your entire CMS. Some
                    settings like locale changes may require a page refresh to
                    take effect.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AdminNavIsland />
    </>
  );
};

export default SettingsPage;
