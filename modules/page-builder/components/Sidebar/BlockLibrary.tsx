/**
 * Block Library / Overview
 * Page health score and quick actions panel
 * (Blocks are added via modal - click + buttons on canvas)
 */

import React, { useState } from "react";
import Link from "next/link";
import {
  DocumentTextIcon,
  PhotoIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
  HeartIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import PageHealthScore from "./PageHealthScore";
import TranslationOverview from "./TranslationOverview";

// =============================================================================
// COLLAPSIBLE SECTION
// =============================================================================

interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon: Icon,
  defaultOpen = true,
  badge,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200/50 dark:border-slate-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
      >
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span className="flex-1 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
          {title}
        </span>
        {badge}
        <ChevronDownIcon
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </button>
      <div
        className={`transition-all duration-200 pt-3 ease-in-out ${
          isOpen
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const BlockLibrary: React.FC = () => {
  const { state, togglePreview } = usePageBuilder();

  const handlePreview = () => {
    if (state.page?.slug) {
      window.open(`/p/${state.page.slug}`, "_blank");
    }
  };

  const handleExportJSON = () => {
    if (!state.page) return;
    const data = JSON.stringify(state.page, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.page.slug || "page"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Health Score & Translation Overview */}
      <div className="flex-1 overflow-y-auto">
        <CollapsibleSection
          title="Page Health"
          icon={HeartIcon}
          defaultOpen={true}
        >
          <PageHealthScore />
        </CollapsibleSection>

        <CollapsibleSection
          title="Translations"
          icon={LanguageIcon}
          defaultOpen={true}
        >
          <TranslationOverview />
        </CollapsibleSection>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Quick Actions
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={handlePreview}
            disabled={!state.page?.slug}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EyeIcon className="w-5 h-5" />
            <span className="text-xs">Preview</span>
          </button>
          <button
            onClick={() => togglePreview()}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span className="text-xs">
              {state.isPreviewMode ? "Edit" : "Canvas"}
            </span>
          </button>
          <button
            onClick={handleExportJSON}
            disabled={!state.page}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClipboardDocumentIcon className="w-5 h-5" />
            <span className="text-xs">Export</span>
          </button>
        </div>
        <div className="space-y-1">
          <Link
            href="/admin/pages"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <DocumentTextIcon className="w-4 h-4" />
            All Pages
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <PhotoIcon className="w-4 h-4" />
            Media Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlockLibrary;
