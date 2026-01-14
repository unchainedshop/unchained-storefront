/**
 * Translation Overview
 * Compact translation status for the Overview tab with untranslated block detection
 */

import React, { useMemo, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { cmsConfig } from "../../../../lib/cms.config";
import { calculateBlockCompleteness } from "../../utils/localization";
import type { PageBlock, BlockType } from "../../types";
import { blockRegistry } from "../../utils/blockRegistry";

// =============================================================================
// TYPES
// =============================================================================

interface UntranslatedBlock {
  id: string;
  type: BlockType;
  label: string;
  completeness: number;
  missingFields: string[];
}

interface LocaleStatus {
  locale: string;
  completeness: number;
  untranslatedBlocks: UntranslatedBlock[];
  isSource: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function getBlockLabel(type: BlockType): string {
  return blockRegistry[type]?.label || type;
}

function getMissingFields(
  content: Record<string, unknown>,
  sourceContent: Record<string, unknown>,
): string[] {
  const missing: string[] = [];

  for (const key of Object.keys(sourceContent)) {
    const sourceValue = sourceContent[key];
    const targetValue = content[key];

    if (typeof sourceValue === "string" && sourceValue !== "") {
      if (typeof targetValue !== "string" || targetValue === "") {
        // Format key as readable label
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase())
          .trim();
        missing.push(label);
      }
    }
  }

  return missing;
}

function analyzeBlockTranslation(
  block: PageBlock,
  locale: string,
  sourceLocale: string,
): UntranslatedBlock | null {
  const completeness = calculateBlockCompleteness(
    block.content,
    locale,
    sourceLocale,
  );

  if (completeness >= 100) return null;

  const sourceContent = block.content[sourceLocale] as unknown as
    | Record<string, unknown>
    | undefined;
  const targetContent = block.content[locale] as unknown as
    | Record<string, unknown>
    | undefined;

  const missingFields =
    sourceContent && targetContent
      ? getMissingFields(targetContent, sourceContent)
      : sourceContent
        ? Object.keys(sourceContent).filter(
            (k) =>
              typeof sourceContent[k] === "string" && sourceContent[k] !== "",
          )
        : [];

  return {
    id: block.id,
    type: block.type,
    label: getBlockLabel(block.type),
    completeness,
    missingFields: missingFields.slice(0, 3), // Limit to first 3
  };
}

function getAllUntranslatedBlocks(
  blocks: PageBlock[],
  locale: string,
  sourceLocale: string,
): UntranslatedBlock[] {
  const untranslated: UntranslatedBlock[] = [];

  function processBlock(block: PageBlock) {
    const result = analyzeBlockTranslation(block, locale, sourceLocale);
    if (result) {
      untranslated.push(result);
    }
    if (block.children) {
      block.children.forEach(processBlock);
    }
  }

  blocks.forEach(processBlock);
  return untranslated;
}

function analyzeAllLocales(
  blocks: PageBlock[],
  sourceLocale: string,
  translations: Record<string, { completeness: number }> | undefined,
): LocaleStatus[] {
  return cmsConfig.locales.map((locale) => {
    const isSource = locale === sourceLocale;
    const completeness = isSource
      ? 100
      : translations?.[locale]?.completeness || 0;
    const untranslatedBlocks = isSource
      ? []
      : getAllUntranslatedBlocks(blocks, locale, sourceLocale);

    return {
      locale,
      completeness,
      untranslatedBlocks,
      isSource,
    };
  });
}

// =============================================================================
// COMPONENTS
// =============================================================================

interface LocaleRowProps {
  status: LocaleStatus;
  isActive: boolean;
  onSelect: () => void;
  onBlockClick: (blockId: string) => void;
  onCopyFromSource: () => void;
  sourceLocale: string;
}

const LocaleRow: React.FC<LocaleRowProps> = ({
  status,
  isActive,
  onSelect,
  onBlockClick,
  onCopyFromSource,
  sourceLocale,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasIssues = status.untranslatedBlocks.length > 0;
  const isComplete = status.completeness >= 100;

  return (
    <div
      className={`rounded-lg overflow-hidden transition-colors ${
        isActive
          ? "bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-600"
          : "bg-slate-50 dark:bg-slate-800/50"
      }`}
    >
      {/* Main row */}
      <div
        className={`flex items-center gap-2 p-2.5 cursor-pointer ${
          hasIssues ? "hover:bg-slate-100 dark:hover:bg-slate-800" : ""
        }`}
        onClick={() => {
          onSelect();
          if (hasIssues) setIsExpanded(!isExpanded);
        }}
      >
        {/* Expand icon */}
        <div className="w-4 h-4 flex items-center justify-center text-slate-400">
          {hasIssues ? (
            isExpanded ? (
              <ChevronDownIcon className="w-3.5 h-3.5" />
            ) : (
              <ChevronRightIcon className="w-3.5 h-3.5" />
            )
          ) : null}
        </div>

        {/* Locale */}
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase w-6">
          {status.locale}
        </span>

        {/* Source badge */}
        {status.isSource && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-200 text-slate-700 rounded dark:bg-slate-700 dark:text-slate-300">
            Source
          </span>
        )}

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 bg-slate-600 dark:bg-slate-400"
            style={{ width: `${status.completeness}%` }}
          />
        </div>

        {/* Percentage or checkmark */}
        <div className="w-10 text-right">
          {isComplete ? (
            <CheckCircleIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 inline" />
          ) : (
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {status.completeness}%
            </span>
          )}
        </div>
      </div>

      {/* Expanded content - untranslated blocks */}
      {isExpanded && hasIssues && (
        <div className="px-2.5 pb-2.5 space-y-1.5">
          {/* Copy from source button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyFromSource();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <DocumentDuplicateIcon className="w-3.5 h-3.5" />
            Copy all from {sourceLocale.toUpperCase()}
          </button>

          {/* Untranslated blocks list */}
          <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide px-1 pt-1">
            {status.untranslatedBlocks.length} block
            {status.untranslatedBlocks.length !== 1 ? "s" : ""} need translation
          </div>

          {status.untranslatedBlocks.slice(0, 5).map((block) => (
            <div
              key={block.id}
              onClick={(e) => {
                e.stopPropagation();
                onBlockClick(block.id);
              }}
              className="flex items-start gap-2 p-2 rounded bg-white dark:bg-slate-900/50 cursor-pointer hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all"
            >
              <ExclamationCircleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {block.label}
                </div>
                {block.missingFields.length > 0 && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Missing: {block.missingFields.join(", ")}
                    {block.missingFields.length < 3 ? "" : "..."}
                  </div>
                )}
              </div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {block.completeness}%
              </div>
            </div>
          ))}

          {status.untranslatedBlocks.length > 5 && (
            <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center py-1">
              +{status.untranslatedBlocks.length - 5} more blocks
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const TranslationOverview: React.FC = () => {
  const { state, selectBlock, setActiveLocale, copyContentToLocale } =
    usePageBuilder();

  const sourceLocale =
    state.page?.translations?.sourceLocale || cmsConfig.defaultLocale;
  const activeLocale = state.activeLocale;

  const localeStatuses = useMemo(() => {
    if (!state.page) return [];
    return analyzeAllLocales(
      state.page.blocks,
      sourceLocale,
      state.page.translations?.status,
    );
  }, [state.page, sourceLocale]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const nonSourceLocales = localeStatuses.filter((l) => !l.isSource);
    if (nonSourceLocales.length === 0)
      return { avg: 100, complete: 0, total: 0 };

    const avg = Math.round(
      nonSourceLocales.reduce((sum, l) => sum + l.completeness, 0) /
        nonSourceLocales.length,
    );
    const complete = nonSourceLocales.filter(
      (l) => l.completeness >= 100,
    ).length;

    return { avg, complete, total: nonSourceLocales.length };
  }, [localeStatuses]);

  const handleBlockClick = (blockId: string) => {
    selectBlock(blockId);
  };

  const handleCopyFromSource = (targetLocale: string) => {
    copyContentToLocale(sourceLocale, targetLocale);
  };

  if (!state.page) {
    return null;
  }

  // Check if there are multiple locales configured
  if (cmsConfig.locales.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Compact summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {overallStats.complete}/{overallStats.total} complete
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {overallStats.avg}% avg
        </span>
      </div>

      {/* Locale rows */}
      <div className="space-y-1.5">
        {localeStatuses.map((status) => (
          <LocaleRow
            key={status.locale}
            status={status}
            isActive={status.locale === activeLocale}
            onSelect={() => setActiveLocale(status.locale)}
            onBlockClick={handleBlockClick}
            onCopyFromSource={() => handleCopyFromSource(status.locale)}
            sourceLocale={sourceLocale}
          />
        ))}
      </div>
    </div>
  );
};

export default TranslationOverview;
