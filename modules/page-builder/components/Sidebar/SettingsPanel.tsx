/**
 * Settings Panel - Figma-inspired design
 * Compact, dense layout with collapsible sections
 */

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import {
  XMarkIcon,
  ChevronDownIcon,
  ArrowsPointingOutIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ScissorsIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  usePageBuilder,
  findBlockById,
} from "../../context/PageBuilderContext";
import {
  blockRegistry,
  createBlock,
  generateItemId,
} from "../../utils/blockRegistry";
import { useCollaborationContext } from "../../collaboration/CollaborationContext";
import MediaPickerField from "../../../media/components/MediaPickerField";
import FocalPointPicker from "../../../media/components/FocalPointPicker";
import CropEditor, {
  CropArea,
  AspectRatioPreset,
} from "../../../media/components/CropEditor";
import LinkPickerField from "./LinkPickerField";
import ProductCollectionPickerField from "./ProductCollectionPickerField";
import CollectionPickerField from "./CollectionPickerField";
import GridTemplateEditor from "./GridTemplateEditor";
import GridCellEditor from "./GridCellEditor";
import BlockPickerModal from "../BlockPickerModal";
import { useAdminSettings } from "../../../admin/context/AdminSettingsContext";
import CodeEditor from "./CodeEditor";
import HelpPanel from "./HelpPanel";
import type {
  PageBlock,
  BlockStyle,
  BlockType,
  AlignmentX,
  AlignmentY,
  LocalizedSEOSettings,
  LocalizedString,
  LocalizedContent,
  BlockContent,
  GridContent,
  GridChildPlacement,
} from "../../types";
import { getLocalizedContent } from "../../utils/localization";
import { cmsConfig } from "../../../../lib/cms.config";

interface SettingsPanelProps {
  className?: string;
}

type TabId = "content" | "style" | "advanced" | "help";

// Collapsible Section Component
interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 dark:border-slate-800/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
      >
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <ChevronDownIcon
          className={classNames(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
            !isOpen && "-rotate-90",
          )}
        />
      </button>
      {isOpen && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
};

// Inline Property Row
interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
  inline?: boolean;
}

const PropertyRow: React.FC<PropertyRowProps> = ({
  label,
  children,
  inline = true,
}) => {
  if (!inline) {
    return (
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {label}
        </label>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
        {label}
      </label>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ className }) => {
  const {
    selectedBlock,
    updateBlock,
    selectBlock,
    addBlock,
    deleteBlock,
    saveHistory,
    state,
    updateSEO,
    updatePageMeta,
    activeLocale,
    setFocusSection,
  } = usePageBuilder();
  const seoSectionRef = React.useRef<HTMLDivElement>(null);
  const seoTitleRef = React.useRef<HTMLInputElement>(null);
  const seoDescriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const seoOgImageRef = React.useRef<HTMLDivElement>(null);

  const handleSaveHistory = () => {
    if (selectedBlock) {
      const blockDef = blockRegistry[selectedBlock.type];
      const label = blockDef?.label || selectedBlock.type;
      saveHistory(
        "update",
        `Updated ${label}`,
        selectedBlock.type,
        selectedBlock.id,
      );
    }
  };
  const { lockBlock, unlockBlock, setEditingBlock, isBlockLocked } =
    useCollaborationContext();
  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [showCropEditor, setShowCropEditor] = useState(false);

  // Handle focus section navigation from health score
  useEffect(() => {
    if (!state.focusSection) return;

    // Map focusSection to the appropriate ref
    const focusMap: Record<string, React.RefObject<HTMLElement | null>> = {
      seo: seoSectionRef,
      "seo-title": seoTitleRef,
      "seo-description": seoDescriptionRef,
      "seo-og-image": seoOgImageRef,
    };

    const targetRef = focusMap[state.focusSection];
    if (targetRef?.current) {
      // Scroll to element
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Focus if it's an input/textarea
      if (
        targetRef.current instanceof HTMLInputElement ||
        targetRef.current instanceof HTMLTextAreaElement
      ) {
        setTimeout(() => {
          (
            targetRef.current as HTMLInputElement | HTMLTextAreaElement
          )?.focus();
          (
            targetRef.current as HTMLInputElement | HTMLTextAreaElement
          )?.select();
        }, 300);
      }

      // Add highlight effect
      targetRef.current.classList.add(
        "ring-2",
        "ring-blue-400",
        "ring-offset-2",
      );
      setTimeout(() => {
        targetRef.current?.classList.remove(
          "ring-2",
          "ring-blue-400",
          "ring-offset-2",
        );
      }, 2000);
    }

    // Clear focus section after handling
    setFocusSection(null);
  }, [state.focusSection, setFocusSection]);
  const [isCropping, setIsCropping] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  // cropTarget format: "content.fieldName" or "style.fieldName"
  const [cropTarget, setCropTarget] = useState<string>("content.src");

  // Crop handler for content images, hero images, and background images
  const handleCropImage = async (
    crop: CropArea,
    aspectRatio: AspectRatioPreset,
  ) => {
    if (!cropImageUrl) return;

    setIsCropping(true);
    setShowCropEditor(false);

    try {
      // First, find the asset ID from the URL
      const assetRes = await fetch(
        `/api/media/search?url=${encodeURIComponent(cropImageUrl)}`,
      );

      if (!assetRes.ok) {
        console.error("Could not find asset");
        setIsCropping(false);
        return;
      }

      const assetData = await assetRes.json();
      const assetId = assetData.assets?.[0]?.id;

      if (!assetId) {
        console.error("Asset not found");
        setIsCropping(false);
        return;
      }

      const res = await fetch("/api/media/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          crop: {
            x: crop.x,
            y: crop.y,
            width: crop.width,
            height: crop.height,
          },
          format: "webp",
          quality: 85,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.asset?.url && selectedBlock) {
          // Parse cropTarget to determine where to update
          // Format: "content.fieldName" or "content.arrayField.index" or "style.fieldName"
          const parts = cropTarget.split(".");
          const targetType = parts[0];
          const fieldName = parts[1];
          const arrayIndex = parts[2] !== undefined ? parseInt(parts[2]) : null;

          if (targetType === "style") {
            updateBlock(selectedBlock.id, {
              style: {
                ...selectedBlock.style,
                [fieldName]: data.asset.url,
              },
            });
          } else if (arrayIndex !== null) {
            // Handle array field (e.g., gridImages[0])
            const contentObj = selectedBlock.content as Record<string, any>;
            const currentArray = [...(contentObj[fieldName] || [])];
            currentArray[arrayIndex] = data.asset.url;
            updateBlock(selectedBlock.id, {
              content: {
                ...contentObj,
                [fieldName]: currentArray,
              } as typeof selectedBlock.content,
            });
          } else {
            updateBlock(selectedBlock.id, {
              content: {
                ...selectedBlock.content,
                [fieldName]: data.asset.url,
              },
            });
          }
          handleSaveHistory();
        }
      } else {
        console.error("Crop failed:", await res.text());
      }
    } catch (err) {
      console.error("Crop error:", err);
    } finally {
      setIsCropping(false);
      setCropImageUrl(null);
      setCropTarget("content.src");
    }
  };

  useEffect(() => {
    if (selectedBlock) {
      const acquired = lockBlock(selectedBlock.id);
      if (acquired) {
        setEditingBlock(selectedBlock.id);
      }
    }
    return () => {
      if (selectedBlock) {
        unlockBlock(selectedBlock.id);
        setEditingBlock(null);
      }
    };
  }, [selectedBlock?.id, lockBlock, unlockBlock, setEditingBlock]);

  // Page Settings (shown when no block is selected)
  if (!selectedBlock) {
    const page = state.page;
    if (!page) {
      return (
        <div
          className={classNames(
            "flex flex-col items-center justify-center h-full px-6",
            className,
          )}
        >
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
            No page loaded
          </p>
        </div>
      );
    }

    // Get localized SEO values
    const seo = page.seo || {};
    const seoTitle = seo.title?.[activeLocale] || "";
    const seoDescription = seo.description?.[activeLocale] || "";
    const seoOgImage = seo.ogImage?.[activeLocale] || "";
    const seoNoIndex = seo.noIndex ?? false;

    // Get page title for current locale
    const pageTitle = page.title?.[activeLocale] || "";

    const handleSEOChange = (
      field: keyof LocalizedSEOSettings,
      value: string | boolean,
    ) => {
      if (field === "noIndex") {
        updateSEO({ noIndex: value as boolean });
      } else {
        const currentField = seo[field] as LocalizedString | undefined;
        updateSEO({
          [field]: {
            ...currentField,
            [activeLocale]: value,
          },
        });
      }
    };

    const handlePageTitleChange = (value: string) => {
      updatePageMeta({
        title: {
          ...page.title,
          [activeLocale]: value,
        },
      });
    };

    return (
      <div className={classNames("flex flex-col h-full", className)}>
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/50">
          <DocumentTextIcon className="w-4 h-4 text-slate-500" />
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
            Page Settings
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* General Section */}
          <Section title="General" defaultOpen>
            <PropertyRow label="Title" inline={false}>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => handlePageTitleChange(e.target.value)}
                placeholder="Page title..."
                className="w-full px-2.5 py-1.5 text-[12px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </PropertyRow>
            <PropertyRow label="Slug">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                /{page.slug}
              </span>
            </PropertyRow>
            <PropertyRow label="Status">
              <span
                className={classNames(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  page.status === "published"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : page.status === "draft"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
                )}
              >
                {page.status}
              </span>
            </PropertyRow>
          </Section>

          {/* SEO Section */}
          <div
            ref={seoSectionRef}
            className="transition-all duration-300 rounded-lg"
          >
            <Section title="SEO" defaultOpen>
              <div className="flex items-center gap-1.5 mb-2 px-0.5">
                <MagnifyingGlassIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Editing for: {activeLocale.toUpperCase()}
                </span>
              </div>

              <PropertyRow label="Meta Title" inline={false}>
                <input
                  ref={seoTitleRef}
                  type="text"
                  value={seoTitle}
                  onChange={(e) => handleSEOChange("title", e.target.value)}
                  placeholder="SEO title (defaults to page title)..."
                  className="w-full px-2.5 py-1.5 text-[12px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-300 rounded-md"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {seoTitle.length}/60 characters
                </p>
              </PropertyRow>

              <PropertyRow label="Meta Description" inline={false}>
                <textarea
                  ref={seoDescriptionRef}
                  value={seoDescription}
                  onChange={(e) =>
                    handleSEOChange("description", e.target.value)
                  }
                  placeholder="Brief description for search engines..."
                  rows={3}
                  className="w-full px-2.5 py-1.5 text-[12px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 resize-none transition-all duration-300 rounded-md"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {seoDescription.length}/160 characters
                </p>
              </PropertyRow>

              <PropertyRow label="OG Image" inline={false}>
                <div
                  ref={seoOgImageRef}
                  className="transition-all duration-300 rounded-md"
                >
                  <MediaPickerField
                    value={seoOgImage}
                    onChange={(v) => handleSEOChange("ogImage", v)}
                    allowedTypes={["image/*"]}
                    compact
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Social sharing image (1200×630px recommended)
                </p>
              </PropertyRow>

              <div className="flex items-center justify-between py-1">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  No Index
                </label>
                <button
                  onClick={() => handleSEOChange("noIndex", !seoNoIndex)}
                  className={classNames(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                    seoNoIndex
                      ? "bg-blue-500"
                      : "bg-slate-200 dark:bg-slate-700",
                  )}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                    style={{
                      transform: seoNoIndex
                        ? "translateX(18px)"
                        : "translateX(4px)",
                    }}
                  />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 -mt-1">
                Hide this page from search engines
              </p>
            </Section>
          </div>

          {/* Help text */}
          <div className="px-3 py-4">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Select a block on the canvas to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLocked = isBlockLocked(selectedBlock.id);
  if (isLocked) {
    return (
      <div
        className={classNames(
          "flex flex-col items-center justify-center h-full px-6",
          className,
        )}
      >
        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3">
          <LockClosedIcon className="w-5 h-5 text-amber-500" />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
          Being edited by another user
        </p>
      </div>
    );
  }

  const blockDef = blockRegistry[selectedBlock.type];

  const handleContentChange = (key: string, value: any) => {
    // Only pass the field being updated - the reducer handles locale merging
    updateBlock(selectedBlock.id, {
      content: { [key]: value },
    });
  };

  const handleBatchContentChange = (updates: Record<string, any>) => {
    // Only pass the fields being updated - the reducer handles locale merging
    updateBlock(selectedBlock.id, {
      content: updates,
    });
  };

  const handleStyleChange = (key: keyof BlockStyle, value: any) => {
    // Only pass the field being updated - the reducer handles merging
    updateBlock(selectedBlock.id, {
      style: { [key]: value },
    });
  };

  const handlePaddingChange = (
    side: "top" | "right" | "bottom" | "left",
    value: number,
  ) => {
    // Spread existing padding (needed for nested object) but not full style
    updateBlock(selectedBlock.id, {
      style: {
        padding: {
          ...(selectedBlock.style.padding || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }),
          [side]: value,
        },
      },
    });
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "style", label: "Style" },
    { id: "advanced", label: "Advanced" },
    { id: "help", label: "Help" },
  ];

  return (
    <div className={classNames("h-full flex flex-col", className)}>
      {/* Header - Compact */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
            {blockDef?.label || selectedBlock.type}
          </span>
          {selectedBlock.hidden && (
            <EyeSlashIcon className="w-3.5 h-3.5 text-slate-400" />
          )}
          {selectedBlock.locked && (
            <LockClosedIcon className="w-3.5 h-3.5 text-amber-500" />
          )}
        </div>
        <button
          onClick={() => selectBlock(null)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
        >
          <XMarkIcon className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Tabs - Figma style */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={classNames(
              "flex-1 px-3 py-2 text-[11px] font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "content" && (
          <ContentSettings
            block={selectedBlock}
            onChange={handleContentChange}
            onBatchChange={handleBatchContentChange}
            onBlur={handleSaveHistory}
            onCropImage={(imageUrl, fieldName = "src") => {
              setCropImageUrl(imageUrl);
              setCropTarget(`content.${fieldName}`);
              setShowCropEditor(true);
            }}
            isCropping={isCropping}
            cropTarget={cropTarget}
          />
        )}

        {activeTab === "style" && (
          <StyleSettings
            block={selectedBlock}
            onChange={handleStyleChange}
            onPaddingChange={handlePaddingChange}
            onBlur={handleSaveHistory}
            onCropImage={(imageUrl) => {
              setCropImageUrl(imageUrl);
              setCropTarget("style.backgroundImage");
              setShowCropEditor(true);
            }}
            isCropping={isCropping && cropTarget === "style.backgroundImage"}
          />
        )}

        {activeTab === "advanced" && (
          <AdvancedSettings
            block={selectedBlock}
            onChange={handleStyleChange}
          />
        )}

        {activeTab === "help" && <HelpPanel blockType={selectedBlock.type} />}
      </div>

      {/* Crop Editor Modal */}
      {showCropEditor && cropImageUrl && (
        <CropEditor
          imageUrl={cropImageUrl}
          onSave={handleCropImage}
          onCancel={() => {
            setShowCropEditor(false);
            setCropImageUrl(null);
          }}
        />
      )}
    </div>
  );
};

// Content settings component
interface ContentSettingsProps {
  block: PageBlock;
  onChange: (key: string, value: any) => void;
  onBatchChange: (updates: Record<string, any>) => void;
  onBlur: () => void;
  onCropImage?: (imageUrl: string, fieldName?: string) => void;
  isCropping?: boolean;
  cropTarget?: string;
}

const ContentSettings: React.FC<ContentSettingsProps> = ({
  block,
  onChange,
  onBatchChange,
  onBlur,
  onCropImage,
  isCropping = false,
  cropTarget = "",
}) => {
  const {
    activeLocale,
    state,
    updateBlock,
    addBlock,
    deleteBlock,
    selectBlock,
  } = usePageBuilder();

  // State for block picker in grid bento editor
  const [isGridBlockPickerOpen, setIsGridBlockPickerOpen] = useState(false);
  const [pendingGridPlacement, setPendingGridPlacement] = useState<{
    colStart: number;
    rowStart: number;
    colSpan: number;
    rowSpan: number;
  } | null>(null);

  // Resolve localized content to active locale for display
  const content =
    getLocalizedContent(
      block.content as LocalizedContent<BlockContent>,
      activeLocale,
      cmsConfig.fallbackLocale,
    ) || ({} as any);

  // Check if the selected block's parent is a grid
  const parentId = state.selection.parentId;
  const parentBlock =
    parentId && state.page ? findBlockById(state.page.blocks, parentId) : null;
  const isInsideGrid = parentBlock?.type === "grid";
  const gridContent = isInsideGrid
    ? (getLocalizedContent(
        parentBlock!.content as LocalizedContent<BlockContent>,
        activeLocale,
        cmsConfig.fallbackLocale,
      ) as GridContent)
    : null;
  const gridPlacement =
    gridContent?.childPlacements?.find((p) => p.blockId === block.id) || null;
  const gridTemplate = gridContent?.template?.desktop || {
    columns: ["1fr", "1fr"],
    rows: ["auto"],
  };

  // Handle grid placement changes
  const handleGridPlacementChange = (newPlacement: GridChildPlacement) => {
    if (!parentBlock || !gridContent) return;

    const existingPlacements = gridContent.childPlacements || [];
    const updatedPlacements = existingPlacements.filter(
      (p) => p.blockId !== block.id,
    );
    updatedPlacements.push(newPlacement);

    updateBlock(parentBlock.id, {
      content: {
        childPlacements: updatedPlacements,
      },
    });
  };

  // Grid Cell Editor component for blocks inside grids
  const gridCellEditorSection = isInsideGrid && gridContent && (
    <Section title="Grid Cell Position">
      <GridCellEditor
        placement={gridPlacement}
        template={gridTemplate}
        onChange={handleGridPlacementChange}
        blockId={block.id}
      />
    </Section>
  );

  // Wrapper to prepend gridCellEditorSection to any block's content settings
  const wrapWithGridEditor = (content: React.ReactNode) => {
    if (!gridCellEditorSection) return content;
    return (
      <>
        {gridCellEditorSection}
        {content}
      </>
    );
  };

  switch (block.type) {
    case "section":
      return wrapWithGridEditor(
        <div>
          <Section title="Container">
            <PropertyRow label="Width">
              <SegmentedControl
                value={content.containerWidth || "container"}
                options={[
                  { value: "full", label: "Full" },
                  { value: "container", label: "Default" },
                  { value: "narrow", label: "Narrow" },
                ]}
                onChange={(v) => onChange("containerWidth", v)}
              />
            </PropertyRow>
            <p className="text-[10px] text-slate-400 mt-2 px-1">
              Full: edge-to-edge • Default: max 1280px • Narrow: max 896px
            </p>
          </Section>

          <Section title="Anchor Link" defaultOpen={false}>
            <InputField
              value={content.anchorId || ""}
              onChange={(v) => onChange("anchorId", v)}
              onBlur={onBlur}
              placeholder="about-us"
            />
            <p className="text-[10px] text-slate-400 mt-2 px-1">
              Creates #anchor for in-page navigation
            </p>
          </Section>

          <Section title="HTML Tag" defaultOpen={false}>
            <PropertyRow label="Element">
              <MiniSelect
                value={content.htmlTag || "section"}
                options={[
                  { value: "section", label: "<section>" },
                  { value: "div", label: "<div>" },
                  { value: "article", label: "<article>" },
                  { value: "aside", label: "<aside>" },
                  { value: "header", label: "<header>" },
                  { value: "footer", label: "<footer>" },
                ]}
                onChange={(v) => onChange("htmlTag", v)}
              />
            </PropertyRow>
            <p className="text-[10px] text-slate-400 mt-2 px-1">
              Choose semantic HTML element for accessibility
            </p>
          </Section>
        </div>,
      );

    case "hero-banner":
      return wrapWithGridEditor(
        <div>
          <Section title="Layout">
            <LayoutPicker
              value={content.variant || "centered"}
              onChange={(v) => onChange("variant", v)}
            />
          </Section>

          <Section title="Text">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Primary Button">
            <InputField
              value={content.buttonText || ""}
              onChange={(v) => onChange("buttonText", v)}
              onBlur={onBlur}
              placeholder="Button text"
            />
            <PropertyRow label="Link" inline={false}>
              <LinkPickerField
                value={content.buttonLink || ""}
                onChange={(v) => onChange("buttonLink", v)}
                onBlur={onBlur}
              />
            </PropertyRow>
            <PropertyRow label="Style">
              <MiniSelect
                value={content.buttonVariant || "primary"}
                options={[
                  { value: "primary", label: "Filled" },
                  { value: "secondary", label: "Outline" },
                  { value: "link", label: "Link" },
                ]}
                onChange={(v) => onChange("buttonVariant", v)}
              />
            </PropertyRow>
            <ColorInputRow
              label="Color"
              value={content.buttonColor || ""}
              onChange={(v) => onChange("buttonColor", v)}
              placeholder="Inherit from text"
            />
          </Section>

          <Section title="Secondary Button" defaultOpen={false}>
            <InputField
              value={content.secondaryButtonText || ""}
              onChange={(v) => onChange("secondaryButtonText", v)}
              onBlur={onBlur}
              placeholder="Button text"
            />
            <PropertyRow label="Link" inline={false}>
              <LinkPickerField
                value={content.secondaryButtonLink || ""}
                onChange={(v) => onChange("secondaryButtonLink", v)}
                onBlur={onBlur}
              />
            </PropertyRow>
            <PropertyRow label="Style">
              <MiniSelect
                value={content.secondaryButtonVariant || "secondary"}
                options={[
                  { value: "primary", label: "Filled" },
                  { value: "secondary", label: "Outline" },
                  { value: "link", label: "Link" },
                ]}
                onChange={(v) => onChange("secondaryButtonVariant", v)}
              />
            </PropertyRow>
            <ColorInputRow
              label="Color"
              value={content.secondaryButtonColor || ""}
              onChange={(v) => onChange("secondaryButtonColor", v)}
              placeholder="Inherit from text"
            />
          </Section>

          <Section title="Text Readability" defaultOpen={false}>
            <PropertyRow label="Style">
              <MiniSelect
                value={content.textOverlay || "none"}
                options={[
                  { value: "none", label: "None" },
                  { value: "gradient", label: "Gradient" },
                  { value: "glass", label: "Glass" },
                  { value: "solid", label: "Solid" },
                  { value: "text-shadow", label: "Shadow" },
                ]}
                onChange={(v) => onChange("textOverlay", v)}
              />
            </PropertyRow>
            {content.textOverlay && content.textOverlay !== "none" && (
              <>
                <PropertyRow label="Mode">
                  <SegmentedControl
                    value={content.textOverlayColorMode || "dark"}
                    options={[
                      { value: "auto", label: "Auto" },
                      { value: "dark", label: "Dark" },
                      { value: "light", label: "Light" },
                    ]}
                    onChange={(v) => onChange("textOverlayColorMode", v)}
                  />
                </PropertyRow>
                <PropertyRow label="Intensity">
                  <MiniNumberInput
                    value={content.textOverlayIntensity || 50}
                    min={10}
                    max={100}
                    onChange={(v) => onChange("textOverlayIntensity", v)}
                    suffix="%"
                  />
                </PropertyRow>
              </>
            )}
          </Section>

          <Section title="Hero Image" defaultOpen={false}>
            <PropertyRow label="Image" inline={false}>
              <MediaPickerField
                value={content.heroImage || ""}
                onChange={(v) => onChange("heroImage", v)}
                onBlur={onBlur}
                allowedTypes={["image/*"]}
                compact
              />
            </PropertyRow>
            {content.heroImage && onCropImage && (
              <PropertyRow label="Crop">
                <button
                  onClick={() => onCropImage(content.heroImage, "heroImage")}
                  disabled={isCropping && cropTarget === "content.heroImage"}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50"
                >
                  {isCropping && cropTarget === "content.heroImage" ? (
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ScissorsIcon className="w-3.5 h-3.5" />
                  )}
                  {isCropping && cropTarget === "content.heroImage"
                    ? "Cropping..."
                    : "Crop Image"}
                </button>
              </PropertyRow>
            )}
            {content.heroImage && (
              <PropertyRow label="Focus" inline={false}>
                <FocalPointPicker
                  imageUrl={content.heroImage}
                  value={content.heroImageFocalPoint || { x: 50, y: 50 }}
                  onChange={(v) => onChange("heroImageFocalPoint", v)}
                />
              </PropertyRow>
            )}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Used in split layouts (left/right image)
            </p>
          </Section>

          <Section title="Grid Images" defaultOpen={false}>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2">
              Used in image-grid layouts (up to 3 images)
            </p>
            {[0, 1, 2].map((index) => {
              const gridImages = content.gridImages || [];
              const imageUrl = gridImages[index] || "";
              const targetKey = `content.gridImages.${index}`;
              const focalPoints = content.gridImagesFocalPoints || [];
              const focalPoint = focalPoints[index] || { x: 50, y: 50 };
              return (
                <div
                  key={index}
                  className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:mb-0 last:pb-0"
                >
                  <PropertyRow label={`Image ${index + 1}`} inline={false}>
                    <MediaPickerField
                      value={imageUrl}
                      onChange={(v) => {
                        const newGridImages = [...gridImages];
                        newGridImages[index] = v;
                        onChange("gridImages", newGridImages);
                      }}
                      onBlur={onBlur}
                      allowedTypes={["image/*"]}
                      compact
                    />
                  </PropertyRow>
                  {imageUrl && onCropImage && (
                    <PropertyRow label="Crop">
                      <button
                        onClick={() =>
                          onCropImage(imageUrl, `gridImages.${index}`)
                        }
                        disabled={isCropping && cropTarget === targetKey}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isCropping && cropTarget === targetKey ? (
                          <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ScissorsIcon className="w-3.5 h-3.5" />
                        )}
                        {isCropping && cropTarget === targetKey
                          ? "Cropping..."
                          : "Crop"}
                      </button>
                    </PropertyRow>
                  )}
                  {imageUrl && (
                    <PropertyRow label="Focus" inline={false}>
                      <FocalPointPicker
                        imageUrl={imageUrl}
                        value={focalPoint}
                        onChange={(v) => {
                          const newFocalPoints = [...focalPoints];
                          newFocalPoints[index] = v;
                          onChange("gridImagesFocalPoints", newFocalPoints);
                        }}
                      />
                    </PropertyRow>
                  )}
                </div>
              );
            })}
          </Section>
        </div>,
      );

    case "product-grid":
      return (
        <div>
          <Section title="Data">
            <PropertyRow label="Source">
              <MiniSelect
                value={content.source || "auto"}
                options={[
                  { value: "auto", label: "Auto" },
                  { value: "collection", label: "Collection" },
                  { value: "manual", label: "Manual" },
                ]}
                onChange={(v) => onChange("source", v)}
              />
            </PropertyRow>
            {content.source === "collection" && (
              <PropertyRow label="Collection" inline={false}>
                <ProductCollectionPickerField
                  value={content.collectionId}
                  onChange={(v) => onChange("collectionId", v)}
                  onBlur={onBlur}
                />
              </PropertyRow>
            )}
            <PropertyRow label="Count">
              <MiniNumberInput
                value={content.limit || 8}
                min={1}
                max={24}
                onChange={(v) => onChange("limit", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Layout">
            <PropertyRow label="Columns">
              <MiniNumberInput
                value={content.columns || 4}
                min={1}
                max={6}
                onChange={(v) => onChange("columns", v)}
              />
            </PropertyRow>
            <PropertyRow label="Mobile">
              <MiniNumberInput
                value={content.mobileColumns || 2}
                min={1}
                max={3}
                onChange={(v) => onChange("mobileColumns", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Options">
            <ToggleRow
              label="Sale Badge"
              checked={content.showSaleBadge ?? true}
              onChange={(v) => onChange("showSaleBadge", v)}
            />
            <ToggleRow
              label="Quick Add"
              checked={content.showQuickAdd ?? false}
              onChange={(v) => onChange("showQuickAdd", v)}
            />
          </Section>
        </div>
      );

    case "text-content":
      return wrapWithGridEditor(
        <div>
          <Section title="Content">
            <textarea
              value={content.content || ""}
              onChange={(e) => onChange("content", e.target.value)}
              onBlur={onBlur}
              rows={4}
              placeholder="Enter text..."
              className="w-full px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
            />
            <PropertyRow label="Style">
              <MiniSelect
                value={content.headingLevel || "p"}
                options={[
                  { value: "h1", label: "H1" },
                  { value: "h2", label: "H2" },
                  { value: "h3", label: "H3" },
                  { value: "p", label: "Para" },
                ]}
                onChange={(v) => onChange("headingLevel", v)}
              />
            </PropertyRow>
          </Section>
        </div>,
      );

    case "spacer":
      return wrapWithGridEditor(
        <div>
          <Section title="Size">
            <PropertyRow label="Height">
              <MiniNumberInput
                value={content.height || 48}
                min={8}
                max={200}
                onChange={(v) => onChange("height", v)}
                suffix="px"
              />
            </PropertyRow>
            <PropertyRow label="Mobile">
              <MiniNumberInput
                value={content.mobileHeight || content.height || 24}
                min={8}
                max={200}
                onChange={(v) => onChange("mobileHeight", v)}
                suffix="px"
              />
            </PropertyRow>
          </Section>
        </div>,
      );

    case "columns": {
      const desktopCols = content.columns || 2;
      const laptopCols = content.laptopColumns ?? desktopCols;
      const tabletLgCols = content.tabletLgColumns ?? laptopCols;
      const tabletCols = content.tabletColumns ?? tabletLgCols;
      const mobileCols = content.mobileColumns ?? 1;

      const columnOptions = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
      ];

      return (
        <div>
          <Section title="Layout">
            <PropertyRow label="Gap">
              <MiniNumberInput
                value={content.gap || 24}
                min={0}
                max={100}
                onChange={(v) => onChange("gap", v)}
                suffix="px"
              />
            </PropertyRow>
          </Section>

          <Section title="Columns per Breakpoint">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
                <span>DESKTOP</span>
                <span>1520px+</span>
              </div>
              <PropertyRow label="Desktop">
                <SegmentedControl
                  value={String(desktopCols)}
                  options={columnOptions}
                  onChange={(v) => {
                    onBatchChange({ columns: Number(v), layout: "equal" });
                  }}
                />
              </PropertyRow>
              <PropertyRow label="Laptop">
                <SegmentedControl
                  value={String(laptopCols)}
                  options={columnOptions}
                  onChange={(v) => onChange("laptopColumns", Number(v))}
                />
              </PropertyRow>

              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 pt-2">
                <span>TABLET</span>
                <span>768px - 1279px</span>
              </div>
              <PropertyRow label="Tablet Landscape">
                <SegmentedControl
                  value={String(tabletLgCols)}
                  options={columnOptions}
                  onChange={(v) => onChange("tabletLgColumns", Number(v))}
                />
              </PropertyRow>
              <PropertyRow label="Tablet">
                <SegmentedControl
                  value={String(tabletCols)}
                  options={columnOptions}
                  onChange={(v) => onChange("tabletColumns", Number(v))}
                />
              </PropertyRow>

              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 pt-2">
                <span>MOBILE</span>
                <span>390px</span>
              </div>
              <PropertyRow label="Mobile">
                <SegmentedControl
                  value={String(mobileCols)}
                  options={columnOptions}
                  onChange={(v) => onChange("mobileColumns", Number(v))}
                />
              </PropertyRow>
            </div>
          </Section>
        </div>
      );
    }

    case "grid": {
      const gridContent = content as unknown as GridContent;
      const desktopTemplate = gridContent.template?.desktop || {
        columns: ["1fr", "1fr"],
        rows: ["auto"],
      };

      // Handler to create a new block in a bento area - opens block picker
      const handleBentoAreaCreate = (area: {
        colStart: number;
        rowStart: number;
        colSpan: number;
        rowSpan: number;
      }) => {
        // Store pending placement and open block picker
        setPendingGridPlacement(area);
        setIsGridBlockPickerOpen(true);
      };

      // Handler when block type is selected from picker
      const handleGridBlockSelect = (
        blockType: BlockType,
        overrides?: {
          content?: Record<string, any>;
          style?: Record<string, any>;
        },
      ) => {
        if (!pendingGridPlacement) return;

        // Create the selected block type
        const newBlock = createBlock(blockType) as PageBlock;

        // Apply any overrides (e.g., from hero presets)
        if (overrides?.content) {
          newBlock.content = { ...newBlock.content, ...overrides.content };
        }
        if (overrides?.style) {
          newBlock.style = { ...newBlock.style, ...overrides.style };
        }

        // Add the block as a child of the grid
        addBlock(newBlock, block.id);

        // Create placement for the new block
        const currentPlacements = gridContent.childPlacements || [];
        const newPlacement: GridChildPlacement = {
          blockId: newBlock.id,
          placement: {
            colStart: pendingGridPlacement.colStart,
            rowStart: pendingGridPlacement.rowStart,
            colSpan: pendingGridPlacement.colSpan,
            rowSpan: pendingGridPlacement.rowSpan,
          },
        };

        // Update grid's childPlacements
        onChange("childPlacements", [...currentPlacements, newPlacement]);

        // Select the new block
        selectBlock(newBlock.id, block.id);

        // Clear pending placement
        setPendingGridPlacement(null);
      };

      // Handler to select a child block
      const handleAreaClick = (blockId: string) => {
        selectBlock(blockId, block.id);
      };

      // Handler to delete a child block
      const handleAreaDelete = (blockId: string) => {
        // Remove from placements
        const updatedPlacements = (gridContent.childPlacements || []).filter(
          (p) => p.blockId !== blockId,
        );
        onChange("childPlacements", updatedPlacements);

        // Delete the block
        deleteBlock(blockId);
      };

      return (
        <div>
          <Section title="Grid Layout">
            <GridTemplateEditor
              template={desktopTemplate}
              onChange={(newTemplate) => {
                onChange("template", {
                  ...gridContent.template,
                  desktop: newTemplate,
                });
              }}
              placements={gridContent.childPlacements || []}
              onAreaCreate={handleBentoAreaCreate}
              onAreaClick={handleAreaClick}
              onAreaDelete={handleAreaDelete}
              selectedBlockId={state.selection?.blockId}
            />
          </Section>

          <Section title="Spacing">
            <PropertyRow label="Gap">
              <MiniNumberInput
                value={gridContent.gap || 24}
                min={0}
                max={100}
                onChange={(v) => onChange("gap", v)}
                suffix="px"
              />
            </PropertyRow>
            <PropertyRow label="Row Gap">
              <MiniNumberInput
                value={gridContent.rowGap ?? gridContent.gap ?? 24}
                min={0}
                max={100}
                onChange={(v) => onChange("rowGap", v)}
                suffix="px"
              />
            </PropertyRow>
            <PropertyRow label="Side Padding">
              <MiniNumberInput
                value={gridContent.sidePadding ?? 0}
                min={0}
                max={200}
                onChange={(v) => onChange("sidePadding", v)}
                suffix="px"
              />
            </PropertyRow>
          </Section>

          <Section title="Auto Flow" defaultOpen={false}>
            <PropertyRow label="Direction">
              <MiniSelect
                value={gridContent.autoFlow || "row"}
                options={[
                  { value: "row", label: "Row" },
                  { value: "column", label: "Column" },
                  { value: "dense", label: "Dense" },
                ]}
                onChange={(v) => onChange("autoFlow", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Alignment" defaultOpen={false}>
            <PropertyRow label="Justify Items">
              <SegmentedControl
                value={gridContent.justifyItems || "stretch"}
                options={[
                  { value: "start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "end", label: "End" },
                  { value: "stretch", label: "Fill" },
                ]}
                onChange={(v) => onChange("justifyItems", v)}
              />
            </PropertyRow>
            <PropertyRow label="Align Items">
              <SegmentedControl
                value={gridContent.alignItems || "stretch"}
                options={[
                  { value: "start", label: "Start" },
                  { value: "center", label: "Center" },
                  { value: "end", label: "End" },
                  { value: "stretch", label: "Fill" },
                ]}
                onChange={(v) => onChange("alignItems", v)}
              />
            </PropertyRow>
          </Section>

          {/* Block Picker for grid cell */}
          <BlockPickerModal
            isOpen={isGridBlockPickerOpen}
            onClose={() => {
              setIsGridBlockPickerOpen(false);
              setPendingGridPlacement(null);
            }}
            onSelectBlock={handleGridBlockSelect}
            parentBlockType="grid"
          />
        </div>
      );
    }

    case "image":
      return wrapWithGridEditor(
        <div>
          <Section title="Image">
            <MediaPickerField
              value={content.src || ""}
              onChange={(v) => onChange("src", v)}
              onBlur={onBlur}
              allowedTypes={["image/*"]}
              compact
            />
            <InputField
              value={content.alt || ""}
              onChange={(v) => onChange("alt", v)}
              onBlur={onBlur}
              placeholder="Alt text"
            />
          </Section>

          <Section title="Display">
            <PropertyRow label="Ratio">
              <MiniSelect
                value={content.aspectRatio || "original"}
                options={[
                  { value: "original", label: "Original" },
                  { value: "1:1", label: "1:1" },
                  { value: "4:3", label: "4:3" },
                  { value: "3:2", label: "3:2" },
                  { value: "16:9", label: "16:9" },
                  { value: "21:9", label: "21:9" },
                  { value: "9:16", label: "9:16" },
                ]}
                onChange={(v) => onChange("aspectRatio", v)}
              />
            </PropertyRow>
            <PropertyRow label="Fit">
              <MiniSelect
                value={content.objectFit || "cover"}
                options={[
                  { value: "cover", label: "Cover" },
                  { value: "contain", label: "Contain" },
                  { value: "fill", label: "Fill" },
                  { value: "none", label: "None" },
                ]}
                onChange={(v) => onChange("objectFit", v)}
              />
            </PropertyRow>
            {content.src && content.objectFit !== "contain" && (
              <PropertyRow label="Focus" inline={false}>
                <FocalPointPicker
                  imageUrl={content.src}
                  value={content.focalPoint || { x: 50, y: 50 }}
                  onChange={(v) => onChange("focalPoint", v)}
                />
              </PropertyRow>
            )}
            {content.src && onCropImage && (
              <PropertyRow label="Crop">
                <button
                  onClick={() => onCropImage(content.src, "src")}
                  disabled={isCropping && cropTarget === "content.src"}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50"
                >
                  {isCropping && cropTarget === "content.src" ? (
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ScissorsIcon className="w-3.5 h-3.5" />
                  )}
                  {isCropping && cropTarget === "content.src"
                    ? "Cropping..."
                    : "Crop Image"}
                </button>
              </PropertyRow>
            )}
          </Section>

          <Section title="Link" defaultOpen={false}>
            <LinkPickerField
              value={content.link || ""}
              onChange={(v) => onChange("link", v)}
              onBlur={onBlur}
            />
          </Section>
        </div>,
      );

    case "faq-accordion": {
      const items = content.items || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Options">
            <ToggleRow
              label="Allow multiple open"
              checked={content.allowMultiple ?? false}
              onChange={(v) => onChange("allowMultiple", v)}
            />
            <ToggleRow
              label="Open first by default"
              checked={content.defaultOpenFirst ?? true}
              onChange={(v) => onChange("defaultOpenFirst", v)}
            />
          </Section>

          <Section title="Questions">
            {items.map((item: any, index: number) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Q{index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newItems = items.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("items", newItems);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <InputField
                  value={item.question || ""}
                  onChange={(v) => {
                    const newItems = [...items];
                    newItems[index] = { ...newItems[index], question: v };
                    onChange("items", newItems);
                  }}
                  onBlur={onBlur}
                  placeholder="Question"
                />
                <textarea
                  value={item.answer || ""}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = {
                      ...newItems[index],
                      answer: e.target.value,
                    };
                    onChange("items", newItems);
                  }}
                  onBlur={onBlur}
                  rows={2}
                  placeholder="Answer"
                  className="w-full px-2 py-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newItems = [
                  ...items,
                  {
                    id: generateItemId("faq"),
                    question: "",
                    answer: "",
                  },
                ];
                onChange("items", newItems);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Question
            </button>
          </Section>
        </div>
      );
    }

    case "pricing-table": {
      const plans = content.plans || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Options">
            <ToggleRow
              label="Show toggle"
              checked={content.showToggle ?? true}
              onChange={(v) => onChange("showToggle", v)}
            />
            {content.showToggle && (
              <>
                <InputField
                  value={content.monthlyLabel || "Monthly"}
                  onChange={(v) => onChange("monthlyLabel", v)}
                  onBlur={onBlur}
                  placeholder="Monthly label"
                />
                <InputField
                  value={content.yearlyLabel || "Yearly"}
                  onChange={(v) => onChange("yearlyLabel", v)}
                  onBlur={onBlur}
                  placeholder="Yearly label"
                />
              </>
            )}
          </Section>

          <Section title="Plans">
            {plans.map((plan: any, index: number) => (
              <div
                key={plan.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Plan {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <ToggleRow
                      label="Featured"
                      checked={plan.featured ?? false}
                      onChange={(v) => {
                        const newPlans = [...plans];
                        newPlans[index] = { ...newPlans[index], featured: v };
                        onChange("plans", newPlans);
                      }}
                    />
                    <button
                      onClick={() => {
                        const newPlans = plans.filter(
                          (_: any, i: number) => i !== index,
                        );
                        onChange("plans", newPlans);
                      }}
                      className="text-[10px] text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <InputField
                  value={plan.name || ""}
                  onChange={(v) => {
                    const newPlans = [...plans];
                    newPlans[index] = { ...newPlans[index], name: v };
                    onChange("plans", newPlans);
                  }}
                  onBlur={onBlur}
                  placeholder="Plan name"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <InputField
                    value={plan.monthlyPrice || ""}
                    onChange={(v) => {
                      const newPlans = [...plans];
                      newPlans[index] = { ...newPlans[index], monthlyPrice: v };
                      onChange("plans", newPlans);
                    }}
                    onBlur={onBlur}
                    placeholder="Monthly $"
                  />
                  <InputField
                    value={plan.yearlyPrice || ""}
                    onChange={(v) => {
                      const newPlans = [...plans];
                      newPlans[index] = { ...newPlans[index], yearlyPrice: v };
                      onChange("plans", newPlans);
                    }}
                    onBlur={onBlur}
                    placeholder="Yearly $"
                  />
                </div>
                <InputField
                  value={plan.description || ""}
                  onChange={(v) => {
                    const newPlans = [...plans];
                    newPlans[index] = { ...newPlans[index], description: v };
                    onChange("plans", newPlans);
                  }}
                  onBlur={onBlur}
                  placeholder="Description"
                />
                <textarea
                  value={(plan.features || []).join("\n")}
                  onChange={(e) => {
                    const newPlans = [...plans];
                    newPlans[index] = {
                      ...newPlans[index],
                      features: e.target.value.split("\n").filter(Boolean),
                    };
                    onChange("plans", newPlans);
                  }}
                  onBlur={onBlur}
                  rows={3}
                  placeholder="Features (one per line)"
                  className="w-full px-2 py-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newPlans = [
                  ...plans,
                  {
                    id: generateItemId("plan"),
                    name: "",
                    monthlyPrice: "",
                    yearlyPrice: "",
                    features: [],
                    buttonText: "Get Started",
                  },
                ];
                onChange("plans", newPlans);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Plan
            </button>
          </Section>
        </div>
      );
    }

    case "stats": {
      const stats = content.stats || [];
      return (
        <div>
          <Section title="Layout">
            <PropertyRow label="Columns">
              <SegmentedControl
                value={String(content.columns || 4)}
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
                onChange={(v) => onChange("columns", Number(v))}
              />
            </PropertyRow>
            <PropertyRow label="Style">
              <MiniSelect
                value={content.variant || "simple"}
                options={[
                  { value: "simple", label: "Simple" },
                  { value: "cards", label: "Cards" },
                  { value: "bordered", label: "Bordered" },
                ]}
                onChange={(v) => onChange("variant", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Stats">
            {stats.map((stat: any, index: number) => (
              <div
                key={stat.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Stat {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newStats = stats.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("stats", newStats);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <InputField
                    value={stat.value || ""}
                    onChange={(v) => {
                      const newStats = [...stats];
                      newStats[index] = { ...newStats[index], value: v };
                      onChange("stats", newStats);
                    }}
                    onBlur={onBlur}
                    placeholder="Value (e.g. 99%)"
                  />
                  <InputField
                    value={stat.label || ""}
                    onChange={(v) => {
                      const newStats = [...stats];
                      newStats[index] = { ...newStats[index], label: v };
                      onChange("stats", newStats);
                    }}
                    onBlur={onBlur}
                    placeholder="Label"
                  />
                </div>
                <InputField
                  value={stat.description || ""}
                  onChange={(v) => {
                    const newStats = [...stats];
                    newStats[index] = { ...newStats[index], description: v };
                    onChange("stats", newStats);
                  }}
                  onBlur={onBlur}
                  placeholder="Description (optional)"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newStats = [
                  ...stats,
                  { id: generateItemId("stat"), value: "", label: "" },
                ];
                onChange("stats", newStats);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Stat
            </button>
          </Section>
        </div>
      );
    }

    case "logo-cloud": {
      const logos = content.logos || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
          </Section>

          <Section title="Layout">
            <PropertyRow label="Style">
              <MiniSelect
                value={content.variant || "grid"}
                options={[
                  { value: "grid", label: "Grid" },
                  { value: "scroll", label: "Scroll" },
                  { value: "marquee", label: "Marquee" },
                ]}
                onChange={(v) => onChange("variant", v)}
              />
            </PropertyRow>
            <PropertyRow label="Columns">
              <MiniNumberInput
                value={content.columns || 5}
                min={3}
                max={8}
                onChange={(v) => onChange("columns", v)}
              />
            </PropertyRow>
            <ToggleRow
              label="Grayscale"
              checked={content.grayscale ?? true}
              onChange={(v) => onChange("grayscale", v)}
            />
          </Section>

          <Section title="Logos">
            {logos.map((logo: any, index: number) => (
              <div
                key={logo.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Logo {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newLogos = logos.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("logos", newLogos);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <MediaPickerField
                  value={logo.src || ""}
                  onChange={(v) => {
                    const newLogos = [...logos];
                    newLogos[index] = { ...newLogos[index], src: v };
                    onChange("logos", newLogos);
                  }}
                  onBlur={onBlur}
                  allowedTypes={["image/*"]}
                  compact
                />
                <InputField
                  value={logo.alt || ""}
                  onChange={(v) => {
                    const newLogos = [...logos];
                    newLogos[index] = { ...newLogos[index], alt: v };
                    onChange("logos", newLogos);
                  }}
                  onBlur={onBlur}
                  placeholder="Company name"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newLogos = [
                  ...logos,
                  { id: generateItemId("logo"), src: "", alt: "" },
                ];
                onChange("logos", newLogos);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Logo
            </button>
          </Section>
        </div>
      );
    }

    case "team-grid": {
      const members = content.members || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Layout">
            <PropertyRow label="Columns">
              <SegmentedControl
                value={String(content.columns || 3)}
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
                onChange={(v) => onChange("columns", Number(v))}
              />
            </PropertyRow>
            <ToggleRow
              label="Show bio"
              checked={content.showBio ?? true}
              onChange={(v) => onChange("showBio", v)}
            />
            <ToggleRow
              label="Show social"
              checked={content.showSocial ?? true}
              onChange={(v) => onChange("showSocial", v)}
            />
          </Section>

          <Section title="Members">
            {members.map((member: any, index: number) => (
              <div
                key={member.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Member {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newMembers = members.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("members", newMembers);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <MediaPickerField
                  value={member.image || ""}
                  onChange={(v) => {
                    const newMembers = [...members];
                    newMembers[index] = { ...newMembers[index], image: v };
                    onChange("members", newMembers);
                  }}
                  onBlur={onBlur}
                  allowedTypes={["image/*"]}
                  compact
                />
                <InputField
                  value={member.name || ""}
                  onChange={(v) => {
                    const newMembers = [...members];
                    newMembers[index] = { ...newMembers[index], name: v };
                    onChange("members", newMembers);
                  }}
                  onBlur={onBlur}
                  placeholder="Name"
                />
                <InputField
                  value={member.role || ""}
                  onChange={(v) => {
                    const newMembers = [...members];
                    newMembers[index] = { ...newMembers[index], role: v };
                    onChange("members", newMembers);
                  }}
                  onBlur={onBlur}
                  placeholder="Role"
                />
                {content.showBio && (
                  <textarea
                    value={member.bio || ""}
                    onChange={(e) => {
                      const newMembers = [...members];
                      newMembers[index] = {
                        ...newMembers[index],
                        bio: e.target.value,
                      };
                      onChange("members", newMembers);
                    }}
                    onBlur={onBlur}
                    rows={2}
                    placeholder="Bio"
                    className="w-full px-2 py-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                  />
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const newMembers = [
                  ...members,
                  { id: generateItemId("member"), name: "", role: "", bio: "" },
                ];
                onChange("members", newMembers);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Member
            </button>
          </Section>
        </div>
      );
    }

    case "video":
      return (
        <div>
          <Section title="Video">
            <PropertyRow label="Provider">
              <MiniSelect
                value={content.provider || "youtube"}
                options={[
                  { value: "youtube", label: "YouTube" },
                  { value: "vimeo", label: "Vimeo" },
                  { value: "custom", label: "Custom" },
                ]}
                onChange={(v) => onChange("provider", v)}
              />
            </PropertyRow>
            <PropertyRow label="URL" inline={false}>
              <InputField
                value={content.url || ""}
                onChange={(v) => onChange("url", v)}
                onBlur={onBlur}
                placeholder="Video URL"
              />
            </PropertyRow>
            <PropertyRow label="Thumbnail" inline={false}>
              <MediaPickerField
                value={content.thumbnail || ""}
                onChange={(v) => onChange("thumbnail", v)}
                onBlur={onBlur}
                allowedTypes={["image/*"]}
                compact
              />
            </PropertyRow>
          </Section>

          <Section title="Display">
            <PropertyRow label="Ratio">
              <MiniSelect
                value={content.aspectRatio || "16:9"}
                options={[
                  { value: "16:9", label: "16:9" },
                  { value: "4:3", label: "4:3" },
                  { value: "1:1", label: "1:1" },
                  { value: "9:16", label: "9:16" },
                ]}
                onChange={(v) => onChange("aspectRatio", v)}
              />
            </PropertyRow>
            <InputField
              value={content.caption || ""}
              onChange={(v) => onChange("caption", v)}
              onBlur={onBlur}
              placeholder="Caption (optional)"
            />
          </Section>

          <Section title="Playback">
            <ToggleRow
              label="Autoplay"
              checked={content.autoplay ?? false}
              onChange={(v) => onChange("autoplay", v)}
            />
            <ToggleRow
              label="Muted"
              checked={content.muted ?? false}
              onChange={(v) => onChange("muted", v)}
            />
            <ToggleRow
              label="Loop"
              checked={content.loop ?? false}
              onChange={(v) => onChange("loop", v)}
            />
            <ToggleRow
              label="Controls"
              checked={content.controls ?? true}
              onChange={(v) => onChange("controls", v)}
            />
          </Section>
        </div>
      );

    case "tabs": {
      const tabs = content.tabs || [];
      return (
        <div>
          <Section title="Style">
            <PropertyRow label="Variant">
              <MiniSelect
                value={content.variant || "underline"}
                options={[
                  { value: "underline", label: "Underline" },
                  { value: "pills", label: "Pills" },
                  { value: "boxed", label: "Boxed" },
                ]}
                onChange={(v) => onChange("variant", v)}
              />
            </PropertyRow>
            <PropertyRow label="Alignment">
              <SegmentedControl
                value={content.alignment || "left"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "stretch", label: "Full" },
                ]}
                onChange={(v) => onChange("alignment", v)}
              />
            </PropertyRow>
            <PropertyRow label="Default Tab">
              <MiniNumberInput
                value={(content.defaultTab || 0) + 1}
                min={1}
                max={tabs.length || 1}
                onChange={(v) => onChange("defaultTab", v - 1)}
              />
            </PropertyRow>
          </Section>

          <Section title="Tabs">
            {tabs.map((tab: any, index: number) => (
              <div
                key={tab.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Tab {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newTabs = tabs.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("tabs", newTabs);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <InputField
                  value={tab.label || ""}
                  onChange={(v) => {
                    const newTabs = [...tabs];
                    newTabs[index] = { ...newTabs[index], label: v };
                    onChange("tabs", newTabs);
                  }}
                  onBlur={onBlur}
                  placeholder="Tab label"
                />
                <textarea
                  value={tab.content || ""}
                  onChange={(e) => {
                    const newTabs = [...tabs];
                    newTabs[index] = {
                      ...newTabs[index],
                      content: e.target.value,
                    };
                    onChange("tabs", newTabs);
                  }}
                  onBlur={onBlur}
                  rows={3}
                  placeholder="Tab content (supports markdown)"
                  className="w-full px-2 py-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newTabs = [
                  ...tabs,
                  { id: generateItemId("tab"), label: "", content: "" },
                ];
                onChange("tabs", newTabs);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Tab
            </button>
          </Section>
        </div>
      );
    }

    case "feature-grid": {
      const features = content.features || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Layout">
            <PropertyRow label="Columns">
              <SegmentedControl
                value={String(content.columns || 3)}
                options={[
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                ]}
                onChange={(v) => onChange("columns", Number(v))}
              />
            </PropertyRow>
            <PropertyRow label="Alignment">
              <SegmentedControl
                value={content.alignment || "center"}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                ]}
                onChange={(v) => onChange("alignment", v)}
              />
            </PropertyRow>
            <PropertyRow label="Icon Style">
              <MiniSelect
                value={content.iconStyle || "circle"}
                options={[
                  { value: "none", label: "None" },
                  { value: "circle", label: "Circle" },
                  { value: "square", label: "Square" },
                  { value: "rounded", label: "Rounded" },
                ]}
                onChange={(v) => onChange("iconStyle", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Features">
            {features.map((feature: any, index: number) => (
              <div
                key={feature.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Feature {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newFeatures = features.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("features", newFeatures);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <InputField
                  value={feature.icon || ""}
                  onChange={(v) => {
                    const newFeatures = [...features];
                    newFeatures[index] = { ...newFeatures[index], icon: v };
                    onChange("features", newFeatures);
                  }}
                  onBlur={onBlur}
                  placeholder="Icon (e.g. check, star, bolt)"
                />
                <InputField
                  value={feature.title || ""}
                  onChange={(v) => {
                    const newFeatures = [...features];
                    newFeatures[index] = { ...newFeatures[index], title: v };
                    onChange("features", newFeatures);
                  }}
                  onBlur={onBlur}
                  placeholder="Title"
                />
                <textarea
                  value={feature.description || ""}
                  onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[index] = {
                      ...newFeatures[index],
                      description: e.target.value,
                    };
                    onChange("features", newFeatures);
                  }}
                  onBlur={onBlur}
                  rows={2}
                  placeholder="Description"
                  className="w-full px-2 py-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                />
                <PropertyRow label="Link" inline={false}>
                  <LinkPickerField
                    value={feature.link || ""}
                    onChange={(v) => {
                      const newFeatures = [...features];
                      newFeatures[index] = { ...newFeatures[index], link: v };
                      onChange("features", newFeatures);
                    }}
                    onBlur={onBlur}
                  />
                </PropertyRow>
              </div>
            ))}
            <button
              onClick={() => {
                const newFeatures = [
                  ...features,
                  {
                    id: generateItemId("feature"),
                    icon: "check",
                    title: "",
                    description: "",
                  },
                ];
                onChange("features", newFeatures);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Feature
            </button>
          </Section>
        </div>
      );
    }

    case "shoppable-video": {
      const hotspots = content.hotspots || [];
      return (
        <div>
          <Section title="Video">
            <PropertyRow label="Provider">
              <MiniSelect
                value={content.provider || "custom"}
                options={[
                  { value: "youtube", label: "YouTube" },
                  { value: "vimeo", label: "Vimeo" },
                  { value: "custom", label: "Custom URL" },
                  { value: "hosted", label: "Hosted" },
                ]}
                onChange={(v) => onChange("provider", v)}
              />
            </PropertyRow>
            <PropertyRow label="URL" inline={false}>
              <InputField
                value={content.videoUrl || ""}
                onChange={(v) => onChange("videoUrl", v)}
                onBlur={onBlur}
                placeholder="Video URL"
              />
            </PropertyRow>
            <PropertyRow label="Thumbnail" inline={false}>
              <MediaPickerField
                value={content.thumbnail || ""}
                onChange={(v) => onChange("thumbnail", v)}
                onBlur={onBlur}
                allowedTypes={["image/*"]}
                compact
              />
            </PropertyRow>
          </Section>

          <Section title="Display">
            <PropertyRow label="Ratio">
              <MiniSelect
                value={content.aspectRatio || "16:9"}
                options={[
                  { value: "16:9", label: "16:9" },
                  { value: "4:3", label: "4:3" },
                  { value: "1:1", label: "1:1" },
                  { value: "9:16", label: "9:16" },
                ]}
                onChange={(v) => onChange("aspectRatio", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Playback">
            <ToggleRow
              label="Autoplay"
              checked={content.autoplay ?? false}
              onChange={(v) => onChange("autoplay", v)}
            />
            <ToggleRow
              label="Muted"
              checked={content.muted ?? true}
              onChange={(v) => onChange("muted", v)}
            />
            <ToggleRow
              label="Loop"
              checked={content.loop ?? true}
              onChange={(v) => onChange("loop", v)}
            />
            <ToggleRow
              label="Controls"
              checked={content.controls ?? true}
              onChange={(v) => onChange("controls", v)}
            />
          </Section>

          <Section title="Hotspots">
            <PropertyRow label="Show">
              <MiniSelect
                value={content.showHotspots || "always"}
                options={[
                  { value: "always", label: "Always" },
                  { value: "paused", label: "When Paused" },
                  { value: "never", label: "Never" },
                ]}
                onChange={(v) => onChange("showHotspots", v)}
              />
            </PropertyRow>
            <PropertyRow label="Style">
              <MiniSelect
                value={content.hotspotStyle || "tag"}
                options={[
                  { value: "dot", label: "Dot" },
                  { value: "plus", label: "Plus" },
                  { value: "pulse", label: "Pulse" },
                  { value: "tag", label: "Tag" },
                ]}
                onChange={(v) => onChange("hotspotStyle", v)}
              />
            </PropertyRow>
            <ColorInputRow
              label="Color"
              value={content.hotspotColor || "#ffffff"}
              onChange={(v) => onChange("hotspotColor", v)}
            />

            {hotspots.map((hotspot: any, index: number) => (
              <div
                key={hotspot.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Hotspot {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newHotspots = hotspots.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("hotspots", newHotspots);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <InputField
                  value={hotspot.productId || ""}
                  onChange={(v) => {
                    const newHotspots = [...hotspots];
                    newHotspots[index] = {
                      ...newHotspots[index],
                      productId: v,
                    };
                    onChange("hotspots", newHotspots);
                  }}
                  onBlur={onBlur}
                  placeholder="Product ID"
                />
                <InputField
                  value={hotspot.label || ""}
                  onChange={(v) => {
                    const newHotspots = [...hotspots];
                    newHotspots[index] = { ...newHotspots[index], label: v };
                    onChange("hotspots", newHotspots);
                  }}
                  onBlur={onBlur}
                  placeholder="Label (optional)"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <PropertyRow label="Start">
                    <MiniNumberInput
                      value={hotspot.startTime || 0}
                      min={0}
                      max={9999}
                      onChange={(v) => {
                        const newHotspots = [...hotspots];
                        newHotspots[index] = {
                          ...newHotspots[index],
                          startTime: v,
                        };
                        onChange("hotspots", newHotspots);
                      }}
                      suffix="s"
                    />
                  </PropertyRow>
                  <PropertyRow label="End">
                    <MiniNumberInput
                      value={hotspot.endTime || 10}
                      min={0}
                      max={9999}
                      onChange={(v) => {
                        const newHotspots = [...hotspots];
                        newHotspots[index] = {
                          ...newHotspots[index],
                          endTime: v,
                        };
                        onChange("hotspots", newHotspots);
                      }}
                      suffix="s"
                    />
                  </PropertyRow>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <PropertyRow label="X">
                    <MiniNumberInput
                      value={hotspot.position?.x || 50}
                      min={0}
                      max={100}
                      onChange={(v) => {
                        const newHotspots = [...hotspots];
                        newHotspots[index] = {
                          ...newHotspots[index],
                          position: { ...newHotspots[index].position, x: v },
                        };
                        onChange("hotspots", newHotspots);
                      }}
                      suffix="%"
                    />
                  </PropertyRow>
                  <PropertyRow label="Y">
                    <MiniNumberInput
                      value={hotspot.position?.y || 50}
                      min={0}
                      max={100}
                      onChange={(v) => {
                        const newHotspots = [...hotspots];
                        newHotspots[index] = {
                          ...newHotspots[index],
                          position: { ...newHotspots[index].position, y: v },
                        };
                        onChange("hotspots", newHotspots);
                      }}
                      suffix="%"
                    />
                  </PropertyRow>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newHotspots = [
                  ...hotspots,
                  {
                    id: generateItemId("hotspot"),
                    productId: "",
                    label: "",
                    startTime: 0,
                    endTime: 10,
                    position: { x: 50, y: 50 },
                  },
                ];
                onChange("hotspots", newHotspots);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Hotspot
            </button>
          </Section>
        </div>
      );
    }

    case "size-guide": {
      const sizes = content.sizes || [];
      const columns = content.measurementColumns || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Options">
            <PropertyRow label="Unit">
              <SegmentedControl
                value={content.unit || "cm"}
                options={[
                  { value: "cm", label: "CM" },
                  { value: "in", label: "IN" },
                ]}
                onChange={(v) => onChange("unit", v)}
              />
            </PropertyRow>
            <ToggleRow
              label="Show unit toggle"
              checked={content.showUnitToggle ?? true}
              onChange={(v) => onChange("showUnitToggle", v)}
            />
            <PropertyRow label="Style">
              <MiniSelect
                value={content.tableStyle || "striped"}
                options={[
                  { value: "simple", label: "Simple" },
                  { value: "striped", label: "Striped" },
                  { value: "bordered", label: "Bordered" },
                ]}
                onChange={(v) => onChange("tableStyle", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="How to Measure" defaultOpen={false}>
            <ToggleRow
              label="Show guide"
              checked={content.showHowToMeasure ?? true}
              onChange={(v) => onChange("showHowToMeasure", v)}
            />
            {content.showHowToMeasure && (
              <>
                <PropertyRow label="Image" inline={false}>
                  <MediaPickerField
                    value={content.howToMeasureImage || ""}
                    onChange={(v) => onChange("howToMeasureImage", v)}
                    onBlur={onBlur}
                    allowedTypes={["image/*"]}
                    compact
                  />
                </PropertyRow>
                <textarea
                  value={content.howToMeasureContent || ""}
                  onChange={(e) =>
                    onChange("howToMeasureContent", e.target.value)
                  }
                  onBlur={onBlur}
                  rows={4}
                  placeholder="Instructions (HTML supported)"
                  className="w-full px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                />
              </>
            )}
          </Section>

          <Section title="Measurement Columns">
            <div className="space-y-1.5">
              {columns.map((col: string, index: number) => (
                <div key={index} className="flex items-center gap-1.5">
                  <InputField
                    value={col}
                    onChange={(v) => {
                      const newColumns = [...columns];
                      newColumns[index] = v;
                      onChange("measurementColumns", newColumns);
                    }}
                    onBlur={onBlur}
                    placeholder="Column name"
                  />
                  <button
                    onClick={() => {
                      const newColumns = columns.filter(
                        (_: string, i: number) => i !== index,
                      );
                      onChange("measurementColumns", newColumns);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600 px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  onChange("measurementColumns", [...columns, ""]);
                }}
                className="w-full py-1 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
              >
                + Add Column
              </button>
            </div>
          </Section>

          <Section title="Sizes">
            {sizes.map((size: any, index: number) => (
              <div
                key={size.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <InputField
                    value={size.size || ""}
                    onChange={(v) => {
                      const newSizes = [...sizes];
                      newSizes[index] = { ...newSizes[index], size: v };
                      onChange("sizes", newSizes);
                    }}
                    onBlur={onBlur}
                    placeholder="Size (e.g. S, M, L)"
                  />
                  <button
                    onClick={() => {
                      const newSizes = sizes.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("sizes", newSizes);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600 ml-2"
                  >
                    Remove
                  </button>
                </div>
                {columns.map((col: string) => (
                  <div key={col} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-16 truncate">
                      {col}
                    </span>
                    <InputField
                      value={size.measurements?.[col] || ""}
                      onChange={(v) => {
                        const newSizes = [...sizes];
                        newSizes[index] = {
                          ...newSizes[index],
                          measurements: {
                            ...newSizes[index].measurements,
                            [col]: v,
                          },
                        };
                        onChange("sizes", newSizes);
                      }}
                      onBlur={onBlur}
                      placeholder="Value"
                    />
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={() => {
                const newSizes = [
                  ...sizes,
                  { id: generateItemId("size"), size: "", measurements: {} },
                ];
                onChange("sizes", newSizes);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Size
            </button>
          </Section>
        </div>
      );
    }

    case "store-locator": {
      const stores = content.stores || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Map Settings">
            <PropertyRow label="Zoom">
              <MiniNumberInput
                value={content.defaultZoom || 12}
                min={1}
                max={20}
                onChange={(v) => onChange("defaultZoom", v)}
              />
            </PropertyRow>
            <PropertyRow label="Style">
              <MiniSelect
                value={content.mapStyle || "standard"}
                options={[
                  { value: "standard", label: "Standard" },
                  { value: "silver", label: "Silver" },
                  { value: "dark", label: "Dark" },
                  { value: "retro", label: "Retro" },
                ]}
                onChange={(v) => onChange("mapStyle", v)}
              />
            </PropertyRow>
            <ColorInputRow
              label="Marker"
              value={content.markerColor || "#3B82F6"}
              onChange={(v) => onChange("markerColor", v)}
            />
          </Section>

          <Section title="Display">
            <ToggleRow
              label="Show search"
              checked={content.showSearch ?? true}
              onChange={(v) => onChange("showSearch", v)}
            />
            <ToggleRow
              label="Show store list"
              checked={content.showList ?? true}
              onChange={(v) => onChange("showList", v)}
            />
            {content.showList && (
              <PropertyRow label="List Position">
                <MiniSelect
                  value={content.listPosition || "left"}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                    { value: "bottom", label: "Bottom" },
                  ]}
                  onChange={(v) => onChange("listPosition", v)}
                />
              </PropertyRow>
            )}
            <ToggleRow
              label="Show directions"
              checked={content.showDirectionsLink ?? true}
              onChange={(v) => onChange("showDirectionsLink", v)}
            />
            <ToggleRow
              label="Show phone"
              checked={content.showPhoneLink ?? true}
              onChange={(v) => onChange("showPhoneLink", v)}
            />
          </Section>

          <Section title="Stores">
            {stores.map((store: any, index: number) => (
              <div
                key={store.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Store {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newStores = stores.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("stores", newStores);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <InputField
                  value={store.name || ""}
                  onChange={(v) => {
                    const newStores = [...stores];
                    newStores[index] = { ...newStores[index], name: v };
                    onChange("stores", newStores);
                  }}
                  onBlur={onBlur}
                  placeholder="Store name"
                />
                <InputField
                  value={store.address || ""}
                  onChange={(v) => {
                    const newStores = [...stores];
                    newStores[index] = { ...newStores[index], address: v };
                    onChange("stores", newStores);
                  }}
                  onBlur={onBlur}
                  placeholder="Street address"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <InputField
                    value={store.city || ""}
                    onChange={(v) => {
                      const newStores = [...stores];
                      newStores[index] = { ...newStores[index], city: v };
                      onChange("stores", newStores);
                    }}
                    onBlur={onBlur}
                    placeholder="City"
                  />
                  <InputField
                    value={store.postalCode || ""}
                    onChange={(v) => {
                      const newStores = [...stores];
                      newStores[index] = { ...newStores[index], postalCode: v };
                      onChange("stores", newStores);
                    }}
                    onBlur={onBlur}
                    placeholder="Postal code"
                  />
                </div>
                <InputField
                  value={store.country || ""}
                  onChange={(v) => {
                    const newStores = [...stores];
                    newStores[index] = { ...newStores[index], country: v };
                    onChange("stores", newStores);
                  }}
                  onBlur={onBlur}
                  placeholder="Country"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <PropertyRow label="Lat">
                    <MiniNumberInput
                      value={store.lat || 0}
                      min={-90}
                      max={90}
                      onChange={(v) => {
                        const newStores = [...stores];
                        newStores[index] = { ...newStores[index], lat: v };
                        onChange("stores", newStores);
                      }}
                    />
                  </PropertyRow>
                  <PropertyRow label="Lng">
                    <MiniNumberInput
                      value={store.lng || 0}
                      min={-180}
                      max={180}
                      onChange={(v) => {
                        const newStores = [...stores];
                        newStores[index] = { ...newStores[index], lng: v };
                        onChange("stores", newStores);
                      }}
                    />
                  </PropertyRow>
                </div>
                <InputField
                  value={store.phone || ""}
                  onChange={(v) => {
                    const newStores = [...stores];
                    newStores[index] = { ...newStores[index], phone: v };
                    onChange("stores", newStores);
                  }}
                  onBlur={onBlur}
                  placeholder="Phone"
                />
                <textarea
                  value={store.hours || ""}
                  onChange={(e) => {
                    const newStores = [...stores];
                    newStores[index] = {
                      ...newStores[index],
                      hours: e.target.value,
                    };
                    onChange("stores", newStores);
                  }}
                  onBlur={onBlur}
                  rows={2}
                  placeholder="Opening hours"
                  className="w-full px-2 py-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 resize-y"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const newStores = [
                  ...stores,
                  {
                    id: generateItemId("store"),
                    name: "",
                    address: "",
                    city: "",
                    country: "",
                    lat: 0,
                    lng: 0,
                  },
                ];
                onChange("stores", newStores);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Store
            </button>
          </Section>
        </div>
      );
    }

    case "instagram-feed": {
      const posts = content.posts || [];
      return (
        <div>
          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Account">
            <InputField
              value={content.username || ""}
              onChange={(v) => onChange("username", v)}
              onBlur={onBlur}
              placeholder="@username"
            />
            <ToggleRow
              label="Show follow button"
              checked={content.showFollowButton ?? true}
              onChange={(v) => onChange("showFollowButton", v)}
            />
            {content.showFollowButton && (
              <InputField
                value={content.followButtonText || ""}
                onChange={(v) => onChange("followButtonText", v)}
                onBlur={onBlur}
                placeholder="Button text (optional)"
              />
            )}
          </Section>

          <Section title="Layout">
            <PropertyRow label="Layout">
              <MiniSelect
                value={content.layout || "grid"}
                options={[
                  { value: "grid", label: "Grid" },
                  { value: "masonry", label: "Masonry" },
                  { value: "carousel", label: "Carousel" },
                ]}
                onChange={(v) => onChange("layout", v)}
              />
            </PropertyRow>
            <PropertyRow label="Columns">
              <MiniNumberInput
                value={content.columns || 4}
                min={3}
                max={6}
                onChange={(v) => onChange("columns", v)}
              />
            </PropertyRow>
            <PropertyRow label="Mobile">
              <MiniNumberInput
                value={content.mobileColumns || 2}
                min={2}
                max={3}
                onChange={(v) => onChange("mobileColumns", v)}
              />
            </PropertyRow>
            <PropertyRow label="Gap">
              <MiniNumberInput
                value={content.gap || 8}
                min={0}
                max={32}
                onChange={(v) => onChange("gap", v)}
                suffix="px"
              />
            </PropertyRow>
            <PropertyRow label="Limit">
              <MiniNumberInput
                value={content.limit || 8}
                min={1}
                max={24}
                onChange={(v) => onChange("limit", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Display">
            <PropertyRow label="Aspect Ratio">
              <SegmentedControl
                value={content.aspectRatio || "square"}
                options={[
                  { value: "square", label: "Square" },
                  { value: "original", label: "Original" },
                ]}
                onChange={(v) => onChange("aspectRatio", v)}
              />
            </PropertyRow>
            <PropertyRow label="Caption">
              <MiniSelect
                value={content.showCaption || "hover"}
                options={[
                  { value: "always", label: "Always" },
                  { value: "hover", label: "On Hover" },
                  { value: "never", label: "Never" },
                ]}
                onChange={(v) => onChange("showCaption", v)}
              />
            </PropertyRow>
          </Section>

          <Section title="Posts (Manual)">
            {posts.map((post: any, index: number) => (
              <div
                key={post.id}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400">
                    Post {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      const newPosts = posts.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onChange("posts", newPosts);
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <MediaPickerField
                  value={post.imageUrl || ""}
                  onChange={(v) => {
                    const newPosts = [...posts];
                    newPosts[index] = { ...newPosts[index], imageUrl: v };
                    onChange("posts", newPosts);
                  }}
                  onBlur={onBlur}
                  allowedTypes={["image/*"]}
                  compact
                />
                <InputField
                  value={post.permalink || ""}
                  onChange={(v) => {
                    const newPosts = [...posts];
                    newPosts[index] = { ...newPosts[index], permalink: v };
                    onChange("posts", newPosts);
                  }}
                  onBlur={onBlur}
                  placeholder="Post URL"
                />
                <InputField
                  value={post.caption || ""}
                  onChange={(v) => {
                    const newPosts = [...posts];
                    newPosts[index] = { ...newPosts[index], caption: v };
                    onChange("posts", newPosts);
                  }}
                  onBlur={onBlur}
                  placeholder="Caption (optional)"
                />
                <PropertyRow label="Type">
                  <MiniSelect
                    value={post.mediaType || "IMAGE"}
                    options={[
                      { value: "IMAGE", label: "Image" },
                      { value: "VIDEO", label: "Video" },
                      { value: "CAROUSEL_ALBUM", label: "Carousel" },
                    ]}
                    onChange={(v) => {
                      const newPosts = [...posts];
                      newPosts[index] = { ...newPosts[index], mediaType: v };
                      onChange("posts", newPosts);
                    }}
                  />
                </PropertyRow>
              </div>
            ))}
            <button
              onClick={() => {
                const newPosts = [
                  ...posts,
                  {
                    id: generateItemId("post"),
                    imageUrl: "",
                    permalink: "",
                    caption: "",
                    mediaType: "IMAGE",
                  },
                ];
                onChange("posts", newPosts);
              }}
              className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-dashed border-slate-300 dark:border-slate-600 rounded-md hover:border-slate-400 transition-colors"
            >
              + Add Post
            </button>
          </Section>
        </div>
      );
    }

    case "collection-list": {
      return (
        <div>
          <Section title="Collection">
            <PropertyRow label="Collection" inline={false}>
              <CollectionPickerField
                value={content.collectionSlug}
                onChange={(v) => onChange("collectionSlug", v)}
                onBlur={onBlur}
              />
            </PropertyRow>
          </Section>

          <Section title="Header">
            <InputField
              value={content.heading || ""}
              onChange={(v) => onChange("heading", v)}
              onBlur={onBlur}
              placeholder="Heading"
            />
            <InputField
              value={content.subheading || ""}
              onChange={(v) => onChange("subheading", v)}
              onBlur={onBlur}
              placeholder="Subheading"
            />
          </Section>

          <Section title="Layout">
            <PropertyRow label="Layout">
              <MiniSelect
                value={content.layout || "grid"}
                options={[
                  { value: "grid", label: "Grid" },
                  { value: "list", label: "List" },
                  { value: "cards", label: "Cards" },
                  { value: "carousel", label: "Carousel" },
                ]}
                onChange={(v) => onChange("layout", v)}
              />
            </PropertyRow>
            <PropertyRow label="Columns">
              <MiniNumberInput
                value={content.columns || 3}
                min={2}
                max={4}
                onChange={(v) => onChange("columns", v)}
              />
            </PropertyRow>
            <PropertyRow label="Mobile">
              <MiniNumberInput
                value={content.mobileColumns || 1}
                min={1}
                max={2}
                onChange={(v) => onChange("mobileColumns", v)}
              />
            </PropertyRow>
            <PropertyRow label="Gap">
              <MiniNumberInput
                value={content.gap || 24}
                min={0}
                max={48}
                onChange={(v) => onChange("gap", v)}
                suffix="px"
              />
            </PropertyRow>
          </Section>

          <Section title="Content">
            <PropertyRow label="Limit">
              <MiniNumberInput
                value={content.limit || 6}
                min={1}
                max={24}
                onChange={(v) => onChange("limit", v)}
              />
            </PropertyRow>
            <PropertyRow label="Sort By">
              <MiniSelect
                value={content.sortBy || "createdAt"}
                options={[
                  { value: "createdAt", label: "Created" },
                  { value: "updatedAt", label: "Updated" },
                  { value: "order", label: "Manual" },
                  { value: "title", label: "Title" },
                ]}
                onChange={(v) => onChange("sortBy", v)}
              />
            </PropertyRow>
            <PropertyRow label="Order">
              <SegmentedControl
                value={content.sortOrder || "desc"}
                options={[
                  { value: "desc", label: "Newest" },
                  { value: "asc", label: "Oldest" },
                ]}
                onChange={(v) => onChange("sortOrder", v)}
              />
            </PropertyRow>
            <ToggleRow
              label="Published only"
              checked={content.publishedOnly ?? true}
              onChange={(v) => onChange("publishedOnly", v)}
            />
          </Section>

          <Section title="Display">
            <ToggleRow
              label="Show image"
              checked={content.showImage ?? true}
              onChange={(v) => onChange("showImage", v)}
            />
            <ToggleRow
              label="Show excerpt"
              checked={content.showExcerpt ?? true}
              onChange={(v) => onChange("showExcerpt", v)}
            />
            <ToggleRow
              label="Show read more"
              checked={content.showReadMore ?? true}
              onChange={(v) => onChange("showReadMore", v)}
            />
            {content.showReadMore && (
              <InputField
                value={content.readMoreText || "Read more"}
                onChange={(v) => onChange("readMoreText", v)}
                onBlur={onBlur}
                placeholder="Read more text"
              />
            )}
          </Section>

          <Section title="Links">
            <InputField
              value={content.linkPattern || ""}
              onChange={(v) => onChange("linkPattern", v)}
              onBlur={onBlur}
              placeholder="/blog/{{slug}}"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Use {"{{slug}}"} for entry slug
            </p>
          </Section>
        </div>
      );
    }

    case "custom-html":
      return (
        <div className="space-y-4">
          <Section title="HTML">
            <CodeEditor
              value={content.html || ""}
              onChange={(val) => onChange("html", val)}
              language="html"
              placeholder="<div>Your HTML here...</div>"
              height="200px"
            />
          </Section>

          <Section title="CSS (Optional)">
            <CodeEditor
              value={content.css || ""}
              onChange={(val) => onChange("css", val)}
              language="css"
              placeholder=".my-class { color: red; }"
              height="120px"
            />
          </Section>

          <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-[10px] text-amber-700 dark:text-amber-400">
              ⚠️ Custom HTML is rendered as-is. Ensure your code is safe and
              well-formed.
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div className="px-3 py-6 text-center">
          <p className="text-[11px] text-slate-400">
            No content settings available
          </p>
        </div>
      );
  }
};

// Style settings
interface StyleSettingsProps {
  block: PageBlock;
  onChange: (key: keyof BlockStyle, value: any) => void;
  onPaddingChange: (
    side: "top" | "right" | "bottom" | "left",
    value: number,
  ) => void;
  onBlur: () => void;
  onCropImage?: (imageUrl: string) => void;
  isCropping?: boolean;
}

const StyleSettings: React.FC<StyleSettingsProps> = ({
  block,
  onChange,
  onPaddingChange,
  onBlur,
  onCropImage,
  isCropping = false,
}) => {
  const style = block.style;
  // Hide background image controls for image blocks to avoid confusion
  // (image blocks have their own image picker in Content tab)
  const showBackgroundImage = block.type !== "image";

  return (
    <div>
      <Section title="Fill">
        <ColorInputRow
          label="Color"
          value={style.backgroundColor || ""}
          onChange={(v) => onChange("backgroundColor", v)}
        />
        {showBackgroundImage && (
          <PropertyRow label="Image" inline={false}>
            <MediaPickerField
              value={style.backgroundImage || ""}
              onChange={(v) => onChange("backgroundImage", v)}
              onBlur={onBlur}
              allowedTypes={["image/*"]}
              compact
            />
          </PropertyRow>
        )}
        {showBackgroundImage && style.backgroundImage && (
          <>
            <PropertyRow label="Focal Point" inline={false}>
              <FocalPointPicker
                imageUrl={style.backgroundImage}
                value={style.backgroundFocalPoint || { x: 50, y: 50 }}
                onChange={(v) => onChange("backgroundFocalPoint", v)}
              />
            </PropertyRow>
            <PropertyRow label="Fit">
              <MiniSelect
                value={style.backgroundObjectFit || "cover"}
                options={[
                  { value: "cover", label: "Cover" },
                  { value: "contain", label: "Contain" },
                  { value: "fill", label: "Fill" },
                ]}
                onChange={(v) => onChange("backgroundObjectFit", v)}
              />
            </PropertyRow>
            <PropertyRow label="Overlay">
              <MiniNumberInput
                value={style.backgroundOverlay || 0}
                min={0}
                max={100}
                onChange={(v) => onChange("backgroundOverlay", v)}
                suffix="%"
              />
            </PropertyRow>
            {onCropImage && (
              <PropertyRow label="Crop">
                <button
                  onClick={() => onCropImage(style.backgroundImage!)}
                  disabled={isCropping}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50"
                >
                  {isCropping ? (
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ScissorsIcon className="w-3.5 h-3.5" />
                  )}
                  {isCropping ? "Cropping..." : "Crop Image"}
                </button>
              </PropertyRow>
            )}
          </>
        )}
      </Section>

      <Section title="Text">
        <ColorInputRow
          label="Color"
          value={style.textColor || ""}
          onChange={(v) => onChange("textColor", v)}
        />
      </Section>

      <Section title="Spacing">
        <div className="space-y-2">
          <span className="text-[10px] font-medium text-slate-400 uppercase">
            Padding
          </span>
          <PaddingControl
            top={style.padding?.top || 0}
            right={style.padding?.right || 0}
            bottom={style.padding?.bottom || 0}
            left={style.padding?.left || 0}
            onChange={onPaddingChange}
          />
        </div>
      </Section>

      <Section title="Alignment">
        <PropertyRow label="Horizontal">
          <AlignmentControl
            value={style.alignmentX || "center"}
            options={[
              { value: "left", icon: "align-left" },
              { value: "center", icon: "align-center" },
              { value: "right", icon: "align-right" },
            ]}
            onChange={(v) => onChange("alignmentX", v as AlignmentX)}
          />
        </PropertyRow>
        <PropertyRow label="Vertical">
          <AlignmentControl
            value={style.alignmentY || "center"}
            options={[
              { value: "top", icon: "align-top" },
              { value: "center", icon: "align-middle" },
              { value: "bottom", icon: "align-bottom" },
            ]}
            onChange={(v) => onChange("alignmentY", v as AlignmentY)}
          />
        </PropertyRow>
      </Section>

      <Section title="Size">
        <PropertyRow label="Min Height">
          <MiniNumberInput
            value={style.minHeight || 0}
            min={0}
            max={1000}
            onChange={(v) => onChange("minHeight", v)}
            suffix="px"
          />
        </PropertyRow>
        <PropertyRow label="Radius">
          <MiniNumberInput
            value={style.borderRadius || 0}
            min={0}
            max={50}
            onChange={(v) => onChange("borderRadius", v)}
            suffix="px"
          />
        </PropertyRow>
      </Section>
    </div>
  );
};

// Advanced settings
interface AdvancedSettingsProps {
  block: PageBlock;
  onChange: (key: keyof BlockStyle, value: any) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ block }) => {
  const { updateBlock } = usePageBuilder();

  return (
    <div>
      <Section title="Options">
        <ToggleRow
          label="Full Width"
          checked={block.style.fullWidth ?? false}
          onChange={(v) =>
            updateBlock(block.id, { style: { ...block.style, fullWidth: v } })
          }
        />
        <ToggleRow
          label="Hidden"
          checked={block.hidden ?? false}
          onChange={(v) => updateBlock(block.id, { hidden: v })}
        />
        <ToggleRow
          label="Locked"
          checked={block.locked ?? false}
          onChange={(v) => updateBlock(block.id, { locked: v })}
        />
      </Section>

      <Section title="Debug" defaultOpen={false}>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-md p-2">
          <span className="text-[10px] font-mono text-slate-500 break-all">
            {block.id}
          </span>
        </div>
      </Section>
    </div>
  );
};

// ============ Compact UI Components ============

// Mini Input Field
const InputField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, onBlur, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    placeholder={placeholder}
    className="w-full px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder:text-slate-400"
  />
);

// Mini Number Input
const MiniNumberInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}> = ({ value, onChange, min, max, suffix }) => (
  <div className="relative">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="w-full px-2 py-1 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-right pr-6 tabular-nums"
    />
    {suffix && (
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
        {suffix}
      </span>
    )}
  </div>
);

// Mini Select
const MiniSelect: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-2 py-1 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 appearance-none cursor-pointer"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// Toggle Row
const ToggleRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-0.5">
    <span className="text-[11px] text-slate-600 dark:text-slate-400">
      {label}
    </span>
    <button
      onClick={() => onChange(!checked)}
      className={classNames(
        "w-7 h-4 rounded-full transition-colors relative",
        checked
          ? "bg-slate-900 dark:bg-white"
          : "bg-slate-200 dark:bg-slate-700",
      )}
    >
      <div
        className={classNames(
          "absolute top-0.5 w-3 h-3 rounded-full transition-transform",
          checked
            ? "bg-white dark:bg-slate-900 translate-x-3.5"
            : "bg-white dark:bg-slate-400 translate-x-0.5",
        )}
      />
    </button>
  </div>
);

// Segmented Control
const SegmentedControl: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-0.5 gap-0.5">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onChange(opt.value);
        }}
        className={classNames(
          "flex-1 px-3 py-1.5 text-[10px] font-medium rounded transition-all cursor-pointer",
          value === opt.value
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// Color Input Row - uses dynamic presets from admin settings
// Layout: Label, then palette, then picker + hex
const ColorInputRow: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, value, onChange, placeholder = "#000" }) => {
  const { settings } = useAdminSettings();

  // Build presets: brand color first, then custom presets from settings
  const presets = React.useMemo(() => {
    const result: { color: string; label: string; isBrand?: boolean }[] = [
      { color: settings.primaryColor, label: "Brand", isBrand: true },
    ];
    // Add custom presets from settings
    (settings.colorPresets || []).forEach((preset) => {
      result.push({ color: preset.color, label: preset.name });
    });
    return result;
  }, [settings.primaryColor, settings.colorPresets]);

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </label>

      {/* Color palette + picker inline */}
      <div className="flex flex-wrap items-center gap-1">
        {presets.map((preset) => {
          const isSelected =
            value?.toLowerCase() === preset.color.toLowerCase();
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.color)}
              className={classNames(
                "w-5 h-5 rounded border-2 transition-all hover:scale-110",
                isSelected
                  ? "border-slate-900 dark:border-white"
                  : "border-transparent",
                preset.isBrand && !isSelected && "ring-1 ring-amber-400/50",
              )}
              style={{ backgroundColor: preset.color }}
              title={
                preset.isBrand ? `${preset.label} (Primary)` : preset.label
              }
            />
          );
        })}
        {/* Color picker inline with palette */}
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 cursor-pointer overflow-hidden"
        />
        {/* Hex input */}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-20 px-2 py-1 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
        />
      </div>
    </div>
  );
};

// Padding Control - Figma-style visual box
const PaddingControl: React.FC<{
  top: number;
  right: number;
  bottom: number;
  left: number;
  onChange: (side: "top" | "right" | "bottom" | "left", value: number) => void;
}> = ({ top, right, bottom, left, onChange }) => (
  <div className="relative bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
    {/* Center box */}
    <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 rounded border border-dashed border-slate-300 dark:border-slate-600" />

    {/* Top */}
    <input
      type="number"
      value={top}
      onChange={(e) => onChange("top", Number(e.target.value))}
      className="absolute top-1 left-1/2 -translate-x-1/2 w-10 text-center text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded py-0.5 tabular-nums focus:outline-none focus:ring-1 focus:ring-slate-400"
    />
    {/* Right */}
    <input
      type="number"
      value={right}
      onChange={(e) => onChange("right", Number(e.target.value))}
      className="absolute right-1 top-1/2 -translate-y-1/2 w-10 text-center text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded py-0.5 tabular-nums focus:outline-none focus:ring-1 focus:ring-slate-400"
    />
    {/* Bottom */}
    <input
      type="number"
      value={bottom}
      onChange={(e) => onChange("bottom", Number(e.target.value))}
      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 text-center text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded py-0.5 tabular-nums focus:outline-none focus:ring-1 focus:ring-slate-400"
    />
    {/* Left */}
    <input
      type="number"
      value={left}
      onChange={(e) => onChange("left", Number(e.target.value))}
      className="absolute left-1 top-1/2 -translate-y-1/2 w-10 text-center text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded py-0.5 tabular-nums focus:outline-none focus:ring-1 focus:ring-slate-400"
    />
  </div>
);

// Alignment Control - Figma-style icon buttons
const AlignmentControl: React.FC<{
  value: string;
  options: { value: string; icon: string }[];
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={classNames(
          "flex-1 p-1.5 rounded transition-all flex items-center justify-center",
          value === opt.value
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
        )}
      >
        <AlignIcon type={opt.icon} />
      </button>
    ))}
  </div>
);

// Alignment Icons
const AlignIcon: React.FC<{ type: string }> = ({ type }) => {
  const className = "w-3 h-3";
  switch (type) {
    case "align-left":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="3" width="8" height="2" rx="0.5" />
          <rect x="1" y="7" width="12" height="2" rx="0.5" />
          <rect x="1" y="11" width="6" height="2" rx="0.5" />
        </svg>
      );
    case "align-center":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor">
          <rect x="4" y="3" width="8" height="2" rx="0.5" />
          <rect x="2" y="7" width="12" height="2" rx="0.5" />
          <rect x="5" y="11" width="6" height="2" rx="0.5" />
        </svg>
      );
    case "align-right":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor">
          <rect x="7" y="3" width="8" height="2" rx="0.5" />
          <rect x="3" y="7" width="12" height="2" rx="0.5" />
          <rect x="9" y="11" width="6" height="2" rx="0.5" />
        </svg>
      );
    case "align-top":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="1" width="2" height="8" rx="0.5" />
          <rect x="7" y="1" width="2" height="12" rx="0.5" />
          <rect x="11" y="1" width="2" height="6" rx="0.5" />
        </svg>
      );
    case "align-middle":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="4" width="2" height="8" rx="0.5" />
          <rect x="7" y="2" width="2" height="12" rx="0.5" />
          <rect x="11" y="5" width="2" height="6" rx="0.5" />
        </svg>
      );
    case "align-bottom":
      return (
        <svg className={className} viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="7" width="2" height="8" rx="0.5" />
          <rect x="7" y="3" width="2" height="12" rx="0.5" />
          <rect x="11" y="9" width="2" height="6" rx="0.5" />
        </svg>
      );
    default:
      return null;
  }
};

// Layout Picker for Hero Banner
const LayoutPicker: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const layouts = [
    { value: "centered", label: "Centered", icon: LayoutCenteredIcon },
    { value: "text-left", label: "Text Left", icon: LayoutTextLeftIcon },
    { value: "text-right", label: "Text Right", icon: LayoutTextRightIcon },
    { value: "split-left", label: "Split Left", icon: LayoutSplitLeftIcon },
    { value: "split-right", label: "Split Right", icon: LayoutSplitRightIcon },
    {
      value: "image-grid-right",
      label: "Grid Right",
      icon: LayoutGridRightIcon,
    },
    { value: "image-grid-left", label: "Grid Left", icon: LayoutGridLeftIcon },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {layouts.map((layout) => {
        const Icon = layout.icon;
        const isSelected = value === layout.value;
        return (
          <button
            key={layout.value}
            onClick={() => onChange(layout.value)}
            className={classNames(
              "flex flex-col items-center p-2 rounded-lg transition-all",
              isSelected
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700",
            )}
            title={layout.label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[9px] mt-1 font-medium truncate w-full text-center">
              {layout.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Layout Icons
const LayoutCenteredIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <rect x="9" y="14" width="6" height="2" rx="0.5" fill="currentColor" />
  </svg>
);

const LayoutTextLeftIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <line x1="5" y1="9" x2="12" y2="9" />
    <line x1="5" y1="12" x2="10" y2="12" />
    <rect x="5" y="14" width="5" height="2" rx="0.5" fill="currentColor" />
  </svg>
);

const LayoutTextRightIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <line x1="12" y1="9" x2="19" y2="9" />
    <line x1="14" y1="12" x2="19" y2="12" />
    <rect x="14" y="14" width="5" height="2" rx="0.5" fill="currentColor" />
  </svg>
);

const LayoutSplitLeftIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <line x1="5" y1="9" x2="10" y2="9" />
    <line x1="5" y1="11" x2="9" y2="11" />
    <rect x="5" y="13" width="4" height="2" rx="0.5" fill="currentColor" />
    <rect
      x="13"
      y="7"
      width="6"
      height="10"
      rx="1"
      fill="currentColor"
      opacity="0.3"
    />
  </svg>
);

const LayoutSplitRightIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <rect
      x="5"
      y="7"
      width="6"
      height="10"
      rx="1"
      fill="currentColor"
      opacity="0.3"
    />
    <line x1="14" y1="9" x2="19" y2="9" />
    <line x1="14" y1="11" x2="18" y2="11" />
    <rect x="14" y="13" width="4" height="2" rx="0.5" fill="currentColor" />
  </svg>
);

const LayoutGridRightIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <line x1="5" y1="9" x2="10" y2="9" />
    <line x1="5" y1="11" x2="9" y2="11" />
    <rect x="5" y="13" width="4" height="2" rx="0.5" fill="currentColor" />
    <rect
      x="13"
      y="7"
      width="6"
      height="4"
      rx="0.5"
      fill="currentColor"
      opacity="0.3"
    />
    <rect
      x="13"
      y="12"
      width="3"
      height="5"
      rx="0.5"
      fill="currentColor"
      opacity="0.3"
    />
    <rect
      x="16.5"
      y="12"
      width="2.5"
      height="5"
      rx="0.5"
      fill="currentColor"
      opacity="0.3"
    />
  </svg>
);

const LayoutGridLeftIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <rect
      x="5"
      y="7"
      width="6"
      height="4"
      rx="0.5"
      fill="currentColor"
      opacity="0.3"
    />
    <rect
      x="5"
      y="12"
      width="3"
      height="5"
      rx="0.5"
      fill="currentColor"
      opacity="0.3"
    />
    <rect
      x="8.5"
      y="12"
      width="2.5"
      height="5"
      rx="0.5"
      fill="currentColor"
      opacity="0.3"
    />
    <line x1="14" y1="9" x2="19" y2="9" />
    <line x1="14" y1="11" x2="18" y2="11" />
    <rect x="14" y="13" width="4" height="2" rx="0.5" fill="currentColor" />
  </svg>
);

export default SettingsPanel;
