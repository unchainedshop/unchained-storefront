/**
 * Page Health Score
 * Analyzes page content for SEO, accessibility, performance, and mobile readiness
 */

import React, { useMemo, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import type {
  Page,
  PageBlock,
  BlockType,
  LocalizedSEOSettings,
  ImageBlockContent,
  HeroBannerContent,
  ShoppableImageContent,
  BeforeAfterContent,
  VideoContent,
  LogoCloudContent,
  TeamGridContent,
  ShoppableVideoContent,
  SizeGuideContent,
  StoreLocatorContent,
  InstagramFeedContent,
  TextContentBlock,
} from "../../types";

// =============================================================================
// TYPES
// =============================================================================

type IssueSeverity = "error" | "warning" | "info";

interface HealthIssue {
  id: string;
  message: string;
  severity: IssueSeverity;
  blockId?: string;
  blockType?: BlockType;
  fix?: string;
}

interface CategoryScore {
  score: number;
  maxScore: number;
  issues: HealthIssue[];
}

interface HealthAnalysis {
  overall: number;
  seo: CategoryScore;
  accessibility: CategoryScore;
  performance: CategoryScore;
  mobile: CategoryScore;
}

// =============================================================================
// ANALYSIS HELPERS
// =============================================================================

function getBlockContent<T>(block: PageBlock, locale: string): T | null {
  const localized = block.content as Record<string, T>;
  return (
    localized[locale] || localized["en"] || Object.values(localized)[0] || null
  );
}

function countBlocks(blocks: PageBlock[]): number {
  let count = 0;
  for (const block of blocks) {
    count++;
    if (block.children) {
      count += countBlocks(block.children);
    }
  }
  return count;
}

function getMaxNestingDepth(blocks: PageBlock[], currentDepth = 0): number {
  let maxDepth = currentDepth;
  for (const block of blocks) {
    if (block.children && block.children.length > 0) {
      const childDepth = getMaxNestingDepth(block.children, currentDepth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  }
  return maxDepth;
}

function findBlocksOfType(
  blocks: PageBlock[],
  types: BlockType[],
): PageBlock[] {
  const result: PageBlock[] = [];
  for (const block of blocks) {
    if (types.includes(block.type)) {
      result.push(block);
    }
    if (block.children) {
      result.push(...findBlocksOfType(block.children, types));
    }
  }
  return result;
}

function getAllBlocks(blocks: PageBlock[]): PageBlock[] {
  const result: PageBlock[] = [];
  for (const block of blocks) {
    result.push(block);
    if (block.children) {
      result.push(...getAllBlocks(block.children));
    }
  }
  return result;
}

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

function analyzeSEO(page: Page, locale: string): CategoryScore {
  const issues: HealthIssue[] = [];
  let score = 0;
  const maxScore = 100;

  const seo = page.seo as LocalizedSEOSettings;
  const title = seo.title?.[locale] || seo.title?.["en"] || "";
  const description =
    seo.description?.[locale] || seo.description?.["en"] || "";
  const ogImage = seo.ogImage?.[locale] || seo.ogImage?.["en"] || "";

  // Meta title (25 points)
  if (!title) {
    issues.push({
      id: "seo-no-title",
      message: "Missing meta title",
      severity: "error",
      fix: "Add a meta title in page settings (50-60 characters recommended)",
    });
  } else if (title.length < 30) {
    issues.push({
      id: "seo-title-short",
      message: `Meta title is too short (${title.length} chars)`,
      severity: "warning",
      fix: "Expand your title to 50-60 characters for better SEO",
    });
    score += 15;
  } else if (title.length > 60) {
    issues.push({
      id: "seo-title-long",
      message: `Meta title is too long (${title.length} chars)`,
      severity: "warning",
      fix: "Shorten your title to 60 characters or less",
    });
    score += 15;
  } else {
    score += 25;
  }

  // Meta description (25 points)
  if (!description) {
    issues.push({
      id: "seo-no-description",
      message: "Missing meta description",
      severity: "error",
      fix: "Add a meta description in page settings (150-160 characters recommended)",
    });
  } else if (description.length < 120) {
    issues.push({
      id: "seo-description-short",
      message: `Meta description is too short (${description.length} chars)`,
      severity: "warning",
      fix: "Expand your description to 150-160 characters",
    });
    score += 15;
  } else if (description.length > 160) {
    issues.push({
      id: "seo-description-long",
      message: `Meta description is too long (${description.length} chars)`,
      severity: "warning",
      fix: "Shorten your description to 160 characters or less",
    });
    score += 15;
  } else {
    score += 25;
  }

  // OG Image (20 points)
  if (!ogImage) {
    issues.push({
      id: "seo-no-og-image",
      message: "Missing Open Graph image",
      severity: "warning",
      fix: "Add an OG image for better social media sharing",
    });
  } else {
    score += 20;
  }

  // Heading structure (30 points)
  const textBlocks = findBlocksOfType(page.blocks, ["text-content"]);
  const heroBlocks = findBlocksOfType(page.blocks, ["hero-banner"]);

  let h1Count = 0;
  const headingLevels: string[] = [];

  // Check text blocks for headings
  for (const block of textBlocks) {
    const content = getBlockContent<TextContentBlock>(block, locale);
    if (content?.headingLevel === "h1") {
      h1Count++;
      headingLevels.push("h1");
    } else if (content?.headingLevel) {
      headingLevels.push(content.headingLevel);
    }
  }

  // Hero blocks typically act as H1
  if (heroBlocks.length > 0) {
    h1Count += heroBlocks.length;
  }

  if (h1Count === 0) {
    issues.push({
      id: "seo-no-h1",
      message: "No H1 heading found",
      severity: "error",
      fix: "Add a Hero Banner or Text block with H1 heading level",
    });
  } else if (h1Count > 1) {
    issues.push({
      id: "seo-multiple-h1",
      message: `Multiple H1 headings found (${h1Count})`,
      severity: "warning",
      fix: "Use only one H1 per page. Change extra headings to H2 or lower",
    });
    score += 15;
  } else {
    score += 30;
  }

  return { score, maxScore, issues };
}

function analyzeAccessibility(page: Page, locale: string): CategoryScore {
  const issues: HealthIssue[] = [];
  let score = 100;
  const maxScore = 100;

  const allBlocks = getAllBlocks(page.blocks);

  // Check image blocks for alt text (40 points max deduction)
  const imageBlocks = findBlocksOfType(page.blocks, ["image"]);
  let missingAltCount = 0;

  for (const block of imageBlocks) {
    const content = getBlockContent<ImageBlockContent>(block, locale);
    if (content?.src && !content?.alt) {
      missingAltCount++;
      if (missingAltCount <= 3) {
        issues.push({
          id: `a11y-missing-alt-${block.id}`,
          message: "Image missing alt text",
          severity: "error",
          blockId: block.id,
          blockType: block.type,
          fix: "Add descriptive alt text for screen readers",
        });
      }
    }
  }

  if (missingAltCount > 3) {
    issues.push({
      id: "a11y-missing-alt-more",
      message: `...and ${missingAltCount - 3} more images missing alt text`,
      severity: "error",
    });
  }

  if (missingAltCount > 0) {
    score -= Math.min(40, missingAltCount * 10);
  }

  // Check shoppable images for alt text
  const shoppableImages = findBlocksOfType(page.blocks, ["shoppable-image"]);
  for (const block of shoppableImages) {
    const content = getBlockContent<ShoppableImageContent>(block, locale);
    if (content?.image && !content?.altText) {
      issues.push({
        id: `a11y-shoppable-alt-${block.id}`,
        message: "Shoppable image missing alt text",
        severity: "error",
        blockId: block.id,
        blockType: block.type,
        fix: "Add descriptive alt text for the shoppable image",
      });
      score -= 10;
    }
  }

  // Check before/after images
  const beforeAfterBlocks = findBlocksOfType(page.blocks, ["before-after"]);
  for (const block of beforeAfterBlocks) {
    const content = getBlockContent<BeforeAfterContent>(block, locale);
    if (content?.beforeImage && !content?.beforeLabel) {
      issues.push({
        id: `a11y-before-label-${block.id}`,
        message: "Before/After block missing labels",
        severity: "warning",
        blockId: block.id,
        blockType: block.type,
        fix: "Add before and after labels for accessibility",
      });
      score -= 5;
    }
  }

  // Check videos for captions/accessibility (20 points max deduction)
  const videoBlocks = findBlocksOfType(page.blocks, [
    "video",
    "shoppable-video",
  ]);
  for (const block of videoBlocks) {
    const content = getBlockContent<VideoContent | ShoppableVideoContent>(
      block,
      locale,
    );
    if (content && !("caption" in content && content.caption)) {
      issues.push({
        id: `a11y-video-caption-${block.id}`,
        message: "Video without caption/description",
        severity: "warning",
        blockId: block.id,
        blockType: block.type,
        fix: "Add a caption to describe the video content",
      });
      score -= 10;
    }
  }

  // Check for color contrast hints in hero/text blocks
  const heroBlocks = findBlocksOfType(page.blocks, ["hero-banner"]);
  for (const block of heroBlocks) {
    const content = getBlockContent<HeroBannerContent>(block, locale);
    const hasBackground = block.style?.backgroundImage;
    const hasOverlay = content?.textOverlay && content.textOverlay !== "none";

    if (hasBackground && !hasOverlay) {
      issues.push({
        id: `a11y-contrast-${block.id}`,
        message: "Hero with background image may have contrast issues",
        severity: "info",
        blockId: block.id,
        blockType: block.type,
        fix: "Consider adding a text overlay for better readability",
      });
    }
  }

  // Check logo cloud for alt text
  const logoBlocks = findBlocksOfType(page.blocks, ["logo-cloud"]);
  for (const block of logoBlocks) {
    const content = getBlockContent<LogoCloudContent>(block, locale);
    const logosWithoutName = content?.logos?.filter((l) => !l.name) || [];
    if (logosWithoutName.length > 0) {
      issues.push({
        id: `a11y-logo-names-${block.id}`,
        message: `${logosWithoutName.length} logos missing names`,
        severity: "warning",
        blockId: block.id,
        blockType: block.type,
        fix: "Add names to logos for screen readers",
      });
      score -= 5;
    }
  }

  return { score: Math.max(0, score), maxScore, issues };
}

function analyzePerformance(page: Page): CategoryScore {
  const issues: HealthIssue[] = [];
  let score = 100;
  const maxScore = 100;

  const totalBlocks = countBlocks(page.blocks);
  const nestingDepth = getMaxNestingDepth(page.blocks);

  // Block count check (30 points max deduction)
  if (totalBlocks > 50) {
    issues.push({
      id: "perf-too-many-blocks",
      message: `High block count (${totalBlocks} blocks)`,
      severity: "error",
      fix: "Consider simplifying the page structure",
    });
    score -= 30;
  } else if (totalBlocks > 30) {
    issues.push({
      id: "perf-many-blocks",
      message: `Many blocks on page (${totalBlocks})`,
      severity: "warning",
      fix: "Monitor page load performance",
    });
    score -= 15;
  }

  // Nesting depth check (20 points max deduction)
  if (nestingDepth > 4) {
    issues.push({
      id: "perf-deep-nesting",
      message: `Deep block nesting (${nestingDepth} levels)`,
      severity: "warning",
      fix: "Flatten the structure where possible",
    });
    score -= 20;
  } else if (nestingDepth > 3) {
    issues.push({
      id: "perf-nesting",
      message: `Moderate nesting depth (${nestingDepth} levels)`,
      severity: "info",
    });
    score -= 5;
  }

  // Heavy blocks check (30 points max deduction)
  const heavyBlockTypes: BlockType[] = [
    "instagram-feed",
    "store-locator",
    "shoppable-video",
  ];
  const heavyBlocks = findBlocksOfType(page.blocks, heavyBlockTypes);

  if (heavyBlocks.length > 3) {
    issues.push({
      id: "perf-heavy-blocks",
      message: `Many resource-heavy blocks (${heavyBlocks.length})`,
      severity: "warning",
      fix: "Instagram feeds, store locators, and shoppable videos are resource-intensive",
    });
    score -= 20;
  } else if (heavyBlocks.length > 1) {
    issues.push({
      id: "perf-some-heavy",
      message: `${heavyBlocks.length} resource-intensive blocks`,
      severity: "info",
    });
    score -= 5;
  }

  // Video count check
  const videoBlocks = findBlocksOfType(page.blocks, [
    "video",
    "shoppable-video",
  ]);
  if (videoBlocks.length > 3) {
    issues.push({
      id: "perf-many-videos",
      message: `Multiple videos on page (${videoBlocks.length})`,
      severity: "warning",
      fix: "Consider lazy loading or reducing video count",
    });
    score -= 10;
  }

  // Custom HTML warning
  const customHtmlBlocks = findBlocksOfType(page.blocks, ["custom-html"]);
  if (customHtmlBlocks.length > 0) {
    issues.push({
      id: "perf-custom-html",
      message: `${customHtmlBlocks.length} custom HTML block(s)`,
      severity: "info",
      fix: "Custom HTML may affect performance and security",
    });
  }

  return { score: Math.max(0, score), maxScore, issues };
}

function analyzeMobile(page: Page): CategoryScore {
  const issues: HealthIssue[] = [];
  let score = 100;
  const maxScore = 100;

  const allBlocks = getAllBlocks(page.blocks);
  let blocksWithMobileOverrides = 0;
  let blocksNeedingMobileCheck = 0;

  // Block types that benefit from mobile optimization
  const mobileRelevantTypes: BlockType[] = [
    "hero-banner",
    "product-grid",
    "columns",
    "pricing-table",
    "stats",
    "team-grid",
    "feature-grid",
    "logo-cloud",
    "tabs",
  ];

  for (const block of allBlocks) {
    if (mobileRelevantTypes.includes(block.type)) {
      blocksNeedingMobileCheck++;
      if (
        block.responsive?.mobile &&
        Object.keys(block.responsive.mobile).length > 0
      ) {
        blocksWithMobileOverrides++;
      }
    }
  }

  // Calculate mobile optimization percentage
  const mobileOptimizationRate =
    blocksNeedingMobileCheck > 0
      ? Math.round((blocksWithMobileOverrides / blocksNeedingMobileCheck) * 100)
      : 100;

  if (blocksNeedingMobileCheck > 0 && mobileOptimizationRate < 30) {
    issues.push({
      id: "mobile-few-overrides",
      message: `Only ${mobileOptimizationRate}% of relevant blocks have mobile styles`,
      severity: "warning",
      fix: "Add mobile-specific styling to improve responsive behavior",
    });
    score -= 30;
  } else if (blocksNeedingMobileCheck > 0 && mobileOptimizationRate < 60) {
    issues.push({
      id: "mobile-some-overrides",
      message: `${mobileOptimizationRate}% mobile optimization rate`,
      severity: "info",
      fix: "Consider adding mobile styles to more blocks",
    });
    score -= 10;
  }

  // Check for columns blocks without mobile configuration
  const columnBlocks = findBlocksOfType(page.blocks, ["columns"]);
  const columnsWithoutMobile = columnBlocks.filter(
    (b) =>
      !b.responsive?.mobile || Object.keys(b.responsive.mobile).length === 0,
  );

  if (columnsWithoutMobile.length > 0) {
    issues.push({
      id: "mobile-columns",
      message: `${columnsWithoutMobile.length} column block(s) without mobile layout`,
      severity: "warning",
      blockId: columnsWithoutMobile[0].id,
      blockType: "columns",
      fix: "Configure mobile column behavior for better small-screen layout",
    });
    score -= Math.min(20, columnsWithoutMobile.length * 5);
  }

  // Check for large fixed heights
  let largeHeightCount = 0;
  for (const block of allBlocks) {
    if (block.style?.minHeight && block.style.minHeight > 600) {
      if (!block.responsive?.mobile?.minHeight) {
        largeHeightCount++;
      }
    }
  }

  if (largeHeightCount > 0) {
    issues.push({
      id: "mobile-large-heights",
      message: `${largeHeightCount} block(s) with large fixed heights`,
      severity: "info",
      fix: "Consider reducing heights on mobile viewports",
    });
    score -= Math.min(15, largeHeightCount * 5);
  }

  return { score: Math.max(0, score), maxScore, issues };
}

function analyzePageHealth(page: Page | null, locale: string): HealthAnalysis {
  if (!page) {
    return {
      overall: 0,
      seo: { score: 0, maxScore: 100, issues: [] },
      accessibility: { score: 0, maxScore: 100, issues: [] },
      performance: { score: 0, maxScore: 100, issues: [] },
      mobile: { score: 0, maxScore: 100, issues: [] },
    };
  }

  const seo = analyzeSEO(page, locale);
  const accessibility = analyzeAccessibility(page, locale);
  const performance = analyzePerformance(page);
  const mobile = analyzeMobile(page);

  // Weighted average
  const overall = Math.round(
    seo.score * 0.3 +
      accessibility.score * 0.3 +
      performance.score * 0.2 +
      mobile.score * 0.2,
  );

  return { overall, seo, accessibility, performance, mobile };
}

// =============================================================================
// COMPONENTS
// =============================================================================

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "lg";
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, size = "lg" }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-slate-700 dark:text-slate-200";
    if (s >= 60) return "text-slate-600 dark:text-slate-300";
    return "text-slate-500 dark:text-slate-400";
  };

  const getScoreRingColor = (s: number) => {
    if (s >= 80) return "stroke-slate-700 dark:stroke-slate-300";
    if (s >= 60) return "stroke-slate-500 dark:stroke-slate-400";
    return "stroke-slate-400 dark:stroke-slate-500";
  };

  const dimensions =
    size === "lg" ? { size: 80, stroke: 6 } : { size: 40, stroke: 4 };
  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative ${size === "lg" ? "w-20 h-20" : "w-10 h-10"}`}>
      <svg
        className="transform -rotate-90"
        width={dimensions.size}
        height={dimensions.size}
      >
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          strokeWidth={dimensions.stroke}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          strokeWidth={dimensions.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getScoreRingColor(score)} transition-all duration-500`}
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          size === "lg" ? "text-lg" : "text-xs"
        } font-bold ${getScoreColor(score)}`}
      >
        {score}
      </div>
    </div>
  );
};

interface CategoryCardProps {
  icon: React.ElementType;
  label: string;
  category: CategoryScore;
  onBlockClick?: (blockId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon: Icon,
  label,
  category,
  onBlockClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasIssues = category.issues.length > 0;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-slate-700 dark:text-slate-200";
    if (s >= 60) return "text-slate-600 dark:text-slate-300";
    return "text-slate-500 dark:text-slate-400";
  };

  const getScoreBadgeBg = (s: number) => {
    if (s >= 80) return "bg-slate-200 dark:bg-slate-700";
    if (s >= 60) return "bg-slate-100 dark:bg-slate-700/50";
    return "bg-slate-100/50 dark:bg-slate-800";
  };

  const getSeverityIcon = (severity: IssueSeverity) => {
    switch (severity) {
      case "error":
        return (
          <XCircleIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
        );
      case "warning":
        return (
          <ExclamationTriangleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
        );
      default:
        return (
          <CheckCircleIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        );
    }
  };

  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
      <button
        onClick={() => hasIssues && setIsExpanded(!isExpanded)}
        className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
          hasIssues ? "hover:bg-slate-100 dark:hover:bg-slate-800" : ""
        }`}
        disabled={!hasIssues}
      >
        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {label}
            </span>
            {hasIssues && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({category.issues.length})
              </span>
            )}
          </div>
        </div>
        <div
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getScoreBadgeBg(
            category.score,
          )} ${getScoreColor(category.score)}`}
        >
          {category.score}%
        </div>
        {hasIssues && (
          <div className="text-slate-400">
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </div>
        )}
      </button>

      {isExpanded && hasIssues && (
        <div className="px-3 pb-3 space-y-2">
          {category.issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-2.5 rounded-lg bg-white dark:bg-slate-900/50 ${
                issue.blockId
                  ? "cursor-pointer hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600"
                  : ""
              }`}
              onClick={() => issue.blockId && onBlockClick?.(issue.blockId)}
            >
              <div className="flex items-start gap-2">
                {getSeverityIcon(issue.severity)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {issue.message}
                  </p>
                  {issue.fix && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {issue.fix}
                    </p>
                  )}
                  {issue.blockId && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Click to select block
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const PageHealthScore: React.FC = () => {
  const { state, selectBlock } = usePageBuilder();
  const locale = state.activeLocale || "en";

  const analysis = useMemo(
    () => analyzePageHealth(state.page, locale),
    [state.page, locale],
  );

  const getOverallLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 60) return "Needs Work";
    return "Poor";
  };

  const getOverallColor = (score: number) => {
    if (score >= 80) return "text-slate-900 dark:text-white";
    if (score >= 60) return "text-slate-700 dark:text-slate-200";
    return "text-slate-600 dark:text-slate-300";
  };

  const handleBlockClick = (blockId: string) => {
    selectBlock(blockId);
  };

  const totalIssues =
    analysis.seo.issues.length +
    analysis.accessibility.issues.length +
    analysis.performance.issues.length +
    analysis.mobile.issues.length;

  const errorCount = [
    ...analysis.seo.issues,
    ...analysis.accessibility.issues,
    ...analysis.performance.issues,
    ...analysis.mobile.issues,
  ].filter((i) => i.severity === "error").length;

  if (!state.page) {
    return (
      <div className="p-5 text-center text-slate-500 dark:text-slate-400">
        <p className="text-sm">No page loaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Overall Score */}
      <div className="flex items-center gap-3">
        <ScoreCircle score={analysis.overall} size="lg" />
        <div className="flex-1">
          <p
            className={`text-lg font-bold ${getOverallColor(analysis.overall)}`}
          >
            {getOverallLabel(analysis.overall)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {totalIssues === 0
              ? "No issues found"
              : `${totalIssues} issue${totalIssues !== 1 ? "s" : ""} found${
                  errorCount > 0 ? ` (${errorCount} critical)` : ""
                }`}
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <div className="space-y-2">
        <CategoryCard
          icon={MagnifyingGlassIcon}
          label="SEO"
          category={analysis.seo}
          onBlockClick={handleBlockClick}
        />
        <CategoryCard
          icon={EyeIcon}
          label="Accessibility"
          category={analysis.accessibility}
          onBlockClick={handleBlockClick}
        />
        <CategoryCard
          icon={BoltIcon}
          label="Performance"
          category={analysis.performance}
          onBlockClick={handleBlockClick}
        />
        <CategoryCard
          icon={DevicePhoneMobileIcon}
          label="Mobile"
          category={analysis.mobile}
          onBlockClick={handleBlockClick}
        />
      </div>
    </div>
  );
};

export default PageHealthScore;
