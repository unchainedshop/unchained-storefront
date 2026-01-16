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
    <div className="border-b border-slate-100/80 dark:border-slate-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-1.5 px-3 py-2 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
      >
        <Icon className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        <span className="flex-1 text-left text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {badge}
        <ChevronDownIcon
          className={`w-3 h-3 text-slate-300 dark:text-slate-600 transition-transform duration-150 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </button>
      <div
        className={`transition-all duration-150 ease-in-out ${
          isOpen
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-3 pb-2.5">{children}</div>
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
      <div className="flex-1 overflow-y-auto pt-2">
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
      <div className="p-2.5 border-t border-slate-100/80 dark:border-slate-800/50">
        <div className="flex items-center gap-1.5 mb-2">
          <ArrowTopRightOnSquareIcon className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Quick Actions
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 mb-2">
          <button
            onClick={handlePreview}
            disabled={!state.page?.slug}
            className="flex flex-col items-center gap-0.5 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <EyeIcon className="w-3.5 h-3.5" />
            <span className="text-[9px]">Preview</span>
          </button>
          <button
            onClick={() => togglePreview()}
            className="flex flex-col items-center gap-0.5 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            <span className="text-[9px]">
              {state.isPreviewMode ? "Edit" : "Canvas"}
            </span>
          </button>
          <button
            onClick={handleExportJSON}
            disabled={!state.page}
            className="flex flex-col items-center gap-0.5 py-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ClipboardDocumentIcon className="w-3.5 h-3.5" />
            <span className="text-[9px]">Export</span>
          </button>
        </div>
        <div className="space-y-0.5">
          <Link
            href="/admin/pages"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors"
          >
            <DocumentTextIcon className="w-3 h-3" />
            All Pages
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors"
          >
            <PhotoIcon className="w-3 h-3" />
            Media Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlockLibrary;
