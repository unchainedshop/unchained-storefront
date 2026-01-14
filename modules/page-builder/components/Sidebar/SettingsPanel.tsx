/**
 * Settings Panel
 * Displays and edits settings for the selected block
 */

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePageBuilder } from "../../context/PageBuilderContext";
import { blockRegistry } from "../../utils/blockRegistry";
import { useCollaborationContext } from "../../collaboration/CollaborationContext";
import MediaPickerField from "../../../media/components/MediaPickerField";
import type {
  PageBlock,
  BlockStyle,
  AlignmentX,
  AlignmentY,
} from "../../types";

interface SettingsPanelProps {
  className?: string;
}

type TabId = "content" | "style" | "advanced";

const SettingsPanel: React.FC<SettingsPanelProps> = ({ className }) => {
  const { selectedBlock, updateBlock, selectBlock, saveHistory } =
    usePageBuilder();

  // Save history when user finishes editing (on blur)
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

  // Acquire lock when block is selected for editing
  useEffect(() => {
    if (selectedBlock) {
      const acquired = lockBlock(selectedBlock.id);
      if (acquired) {
        setEditingBlock(selectedBlock.id);
      }
    }

    // Release lock when deselecting or unmounting
    return () => {
      if (selectedBlock) {
        unlockBlock(selectedBlock.id);
        setEditingBlock(null);
      }
    };
  }, [selectedBlock?.id, lockBlock, unlockBlock, setEditingBlock]);

  if (!selectedBlock) {
    return (
      <div
        className={classNames(
          "flex items-center justify-center h-full",
          className,
        )}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-4">
          Select a block to edit its settings
        </p>
      </div>
    );
  }

  // Check if block is locked by another user
  const isLocked = isBlockLocked(selectedBlock.id);
  if (isLocked) {
    return (
      <div
        className={classNames(
          "flex items-center justify-center h-full",
          className,
        )}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-4">
          This block is being edited by another user
        </p>
      </div>
    );
  }

  const blockDef = blockRegistry[selectedBlock.type];

  const handleContentChange = (key: string, value: any) => {
    updateBlock(selectedBlock.id, {
      content: { ...selectedBlock.content, [key]: value },
    });
  };

  const handleStyleChange = (key: keyof BlockStyle, value: any) => {
    updateBlock(selectedBlock.id, {
      style: { ...selectedBlock.style, [key]: value },
    });
  };

  const handlePaddingChange = (
    side: "top" | "right" | "bottom" | "left",
    value: number,
  ) => {
    updateBlock(selectedBlock.id, {
      style: {
        ...selectedBlock.style,
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
  ];

  return (
    <div className={classNames("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-medium text-slate-900 dark:text-white">
          {blockDef?.label || selectedBlock.type}
        </h3>
        <button
          onClick={() => selectBlock(null)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
        >
          <XMarkIcon className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={classNames(
              "flex-1 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "content" && (
          <ContentSettings
            block={selectedBlock}
            onChange={handleContentChange}
            onBlur={handleSaveHistory}
          />
        )}

        {activeTab === "style" && (
          <StyleSettings
            block={selectedBlock}
            onChange={handleStyleChange}
            onPaddingChange={handlePaddingChange}
            onBlur={handleSaveHistory}
          />
        )}

        {activeTab === "advanced" && (
          <AdvancedSettings
            block={selectedBlock}
            onChange={handleStyleChange}
          />
        )}
      </div>
    </div>
  );
};

// Content settings component
interface ContentSettingsProps {
  block: PageBlock;
  onChange: (key: string, value: any) => void;
  onBlur: () => void;
}

const ContentSettings: React.FC<ContentSettingsProps> = ({
  block,
  onChange,
  onBlur,
}) => {
  const content = block.content as Record<string, any>;

  // Render different fields based on block type
  switch (block.type) {
    case "hero-banner":
      return (
        <div className="space-y-4">
          <InputField
            label="Heading"
            value={content.heading || ""}
            onChange={(v) => onChange("heading", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Subheading"
            value={content.subheading || ""}
            onChange={(v) => onChange("subheading", v)}
            onBlur={onBlur}
          />

          {/* Primary Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                Primary Button
              </h4>
              {(content.buttonText || content.buttonLink) && (
                <button
                  onClick={() => {
                    onChange("buttonText", "");
                    onChange("buttonLink", "");
                    onChange("buttonVariant", "primary");
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-3">
              <InputField
                label="Text"
                value={content.buttonText || ""}
                onChange={(v) => onChange("buttonText", v)}
                onBlur={onBlur}
                placeholder="e.g. Shop Now"
              />
              <InputField
                label="Link"
                value={content.buttonLink || ""}
                onChange={(v) => onChange("buttonLink", v)}
                onBlur={onBlur}
                placeholder="e.g. /products"
              />
              <SelectField
                label="Style"
                value={content.buttonVariant || "primary"}
                options={[
                  { value: "primary", label: "Primary (Filled)" },
                  { value: "secondary", label: "Secondary (Outline)" },
                  { value: "link", label: "Link (Text only)" },
                ]}
                onChange={(v) => onChange("buttonVariant", v)}
              />
            </div>
          </div>

          {/* Secondary Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium text-slate-900 dark:text-white">
                Secondary Button
              </h4>
              {(content.secondaryButtonText || content.secondaryButtonLink) && (
                <button
                  onClick={() => {
                    onChange("secondaryButtonText", "");
                    onChange("secondaryButtonLink", "");
                    onChange("secondaryButtonVariant", "secondary");
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-3">
              <InputField
                label="Text"
                value={content.secondaryButtonText || ""}
                onChange={(v) => onChange("secondaryButtonText", v)}
                onBlur={onBlur}
                placeholder="e.g. Learn More"
              />
              <InputField
                label="Link"
                value={content.secondaryButtonLink || ""}
                onChange={(v) => onChange("secondaryButtonLink", v)}
                onBlur={onBlur}
                placeholder="e.g. /about"
              />
              <SelectField
                label="Style"
                value={content.secondaryButtonVariant || "secondary"}
                options={[
                  { value: "primary", label: "Primary (Filled)" },
                  { value: "secondary", label: "Secondary (Outline)" },
                  { value: "link", label: "Link (Text only)" },
                ]}
                onChange={(v) => onChange("secondaryButtonVariant", v)}
              />
            </div>
          </div>
        </div>
      );

    case "product-grid":
      return (
        <div className="space-y-4">
          <SelectField
            label="Source"
            value={content.source || "auto"}
            options={[
              { value: "auto", label: "Automatic" },
              { value: "collection", label: "Collection" },
              { value: "manual", label: "Manual Selection" },
            ]}
            onChange={(v) => onChange("source", v)}
          />
          <NumberField
            label="Products to Show"
            value={content.limit || 8}
            min={1}
            max={24}
            onChange={(v) => onChange("limit", v)}
          />
          <NumberField
            label="Columns (Desktop)"
            value={content.columns || 4}
            min={1}
            max={6}
            onChange={(v) => onChange("columns", v)}
          />
          <NumberField
            label="Columns (Mobile)"
            value={content.mobileColumns || 2}
            min={1}
            max={3}
            onChange={(v) => onChange("mobileColumns", v)}
          />
          <CheckboxField
            label="Show Sale Badge"
            checked={content.showSaleBadge ?? true}
            onChange={(v) => onChange("showSaleBadge", v)}
          />
          <CheckboxField
            label="Show Quick Add"
            checked={content.showQuickAdd ?? false}
            onChange={(v) => onChange("showQuickAdd", v)}
          />
        </div>
      );

    case "text-content":
      return (
        <div className="space-y-4">
          <TextareaField
            label="Content"
            value={content.content || ""}
            onChange={(v) => onChange("content", v)}
            onBlur={onBlur}
          />
          <SelectField
            label="Text Style"
            value={content.headingLevel || "p"}
            options={[
              { value: "h1", label: "Heading 1" },
              { value: "h2", label: "Heading 2" },
              { value: "h3", label: "Heading 3" },
              { value: "h4", label: "Heading 4" },
              { value: "p", label: "Paragraph" },
            ]}
            onChange={(v) => onChange("headingLevel", v)}
          />
        </div>
      );

    case "newsletter":
      return (
        <div className="space-y-4">
          <InputField
            label="Heading"
            value={content.heading || ""}
            onChange={(v) => onChange("heading", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Subheading"
            value={content.subheading || ""}
            onChange={(v) => onChange("subheading", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Button Text"
            value={content.buttonText || ""}
            onChange={(v) => onChange("buttonText", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Placeholder"
            value={content.placeholder || ""}
            onChange={(v) => onChange("placeholder", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Success Message"
            value={content.successMessage || ""}
            onChange={(v) => onChange("successMessage", v)}
            onBlur={onBlur}
          />
          <CheckboxField
            label="Show Consent Checkbox"
            checked={content.showConsent ?? true}
            onChange={(v) => onChange("showConsent", v)}
          />
        </div>
      );

    case "spacer":
      return (
        <div className="space-y-4">
          <NumberField
            label="Height (px)"
            value={content.height || 48}
            min={8}
            max={200}
            onChange={(v) => onChange("height", v)}
          />
          <NumberField
            label="Mobile Height (px)"
            value={content.mobileHeight || content.height || 24}
            min={8}
            max={200}
            onChange={(v) => onChange("mobileHeight", v)}
          />
        </div>
      );

    case "countdown-timer":
      return (
        <div className="space-y-4">
          <InputField
            label="End Date"
            type="datetime-local"
            value={content.endDate?.slice(0, 16) || ""}
            onChange={(v) => onChange("endDate", new Date(v).toISOString())}
            onBlur={onBlur}
          />
          <InputField
            label="Heading"
            value={content.heading || ""}
            onChange={(v) => onChange("heading", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Button Text"
            value={content.buttonText || ""}
            onChange={(v) => onChange("buttonText", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Button Link"
            value={content.buttonLink || ""}
            onChange={(v) => onChange("buttonLink", v)}
            onBlur={onBlur}
          />
          <InputField
            label="Expired Message"
            value={content.expiredMessage || ""}
            onChange={(v) => onChange("expiredMessage", v)}
            onBlur={onBlur}
          />
        </div>
      );

    case "columns": {
      const currentColumns = content.columns || 2;
      const currentLayout = content.layout || "equal";

      // Available layouts based on column count
      const layoutsFor2 = [
        { id: "equal", label: "Equal", widths: [1, 1] },
        { id: "1-2", label: "1:2", widths: [1, 2] },
        { id: "2-1", label: "2:1", widths: [2, 1] },
      ];
      const layoutsFor3 = [
        { id: "equal", label: "Equal", widths: [1, 1, 1] },
        { id: "1-2-1", label: "1:2:1", widths: [1, 2, 1] },
      ];

      const availableLayouts =
        currentColumns === 2
          ? layoutsFor2
          : currentColumns === 3
            ? layoutsFor3
            : [
                {
                  id: "equal",
                  label: "Equal",
                  widths: Array(currentColumns).fill(1),
                },
              ];

      return (
        <div className="space-y-4">
          {/* Column Count */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              Columns
            </label>
            <div className="flex gap-2">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    onChange("columns", count);
                    // Reset to equal layout when changing column count
                    onChange("layout", "equal");
                  }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    currentColumns === count
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Options (shown only if multiple layouts available) */}
          {availableLayouts.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                Layout
              </label>
              <div className="flex gap-2">
                {availableLayouts.map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => onChange("layout", layout.id)}
                    className={`flex-1 p-2 rounded-lg border-2 transition-all ${
                      currentLayout === layout.id ||
                      (layout.id === "equal" &&
                        !["1-2", "2-1", "1-2-1"].includes(currentLayout))
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                    title={layout.label}
                  >
                    <div className="flex gap-0.5 h-6">
                      {layout.widths.map((w, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            currentLayout === layout.id ||
                            (layout.id === "equal" &&
                              !["1-2", "2-1", "1-2-1"].includes(currentLayout))
                              ? "bg-blue-500"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                          style={{ flex: w }}
                        />
                      ))}
                    </div>
                    <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                      {layout.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <NumberField
            label="Gap (px)"
            value={content.gap || 24}
            min={0}
            max={100}
            onChange={(v) => onChange("gap", v)}
          />

          {/* Responsive Settings */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-medium text-slate-900 dark:text-white mb-3">
              Responsive
            </h4>

            <CheckboxField
              label="Stack on mobile"
              checked={content.stackOnMobile !== false}
              onChange={(v) => onChange("stackOnMobile", v)}
            />

            {content.stackOnMobile === false && (
              <div className="mt-3">
                <NumberField
                  label="Mobile Columns"
                  value={content.mobileColumns || 1}
                  min={1}
                  max={4}
                  onChange={(v) => onChange("mobileColumns", v)}
                />
              </div>
            )}

            <div className="mt-3">
              <NumberField
                label="Tablet Columns"
                value={content.tabletColumns || currentColumns}
                min={1}
                max={4}
                onChange={(v) => onChange("tabletColumns", v)}
              />
            </div>
          </div>
        </div>
      );
    }

    case "before-after":
      return (
        <div className="space-y-4">
          <MediaPickerField
            label="Before Image"
            value={content.beforeImage || ""}
            onChange={(v) => onChange("beforeImage", v)}
            onBlur={onBlur}
            allowedTypes={["image/*"]}
          />
          <MediaPickerField
            label="After Image"
            value={content.afterImage || ""}
            onChange={(v) => onChange("afterImage", v)}
            onBlur={onBlur}
            allowedTypes={["image/*"]}
          />
          <InputField
            label="Before Label"
            value={content.beforeLabel || "Before"}
            onChange={(v) => onChange("beforeLabel", v)}
            onBlur={onBlur}
          />
          <InputField
            label="After Label"
            value={content.afterLabel || "After"}
            onChange={(v) => onChange("afterLabel", v)}
            onBlur={onBlur}
          />
          <NumberField
            label="Initial Position (%)"
            value={content.initialPosition || 50}
            min={0}
            max={100}
            onChange={(v) => onChange("initialPosition", v)}
          />
          <SelectField
            label="Orientation"
            value={content.orientation || "horizontal"}
            options={[
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ]}
            onChange={(v) => onChange("orientation", v)}
          />
          <CheckboxField
            label="Show Labels"
            checked={content.showLabels ?? true}
            onChange={(v) => onChange("showLabels", v)}
          />
        </div>
      );

    case "shoppable-image":
      return (
        <div className="space-y-4">
          <MediaPickerField
            label="Image"
            value={content.image || ""}
            onChange={(v) => onChange("image", v)}
            onBlur={onBlur}
            allowedTypes={["image/*"]}
          />
          <InputField
            label="Alt Text"
            value={content.altText || ""}
            onChange={(v) => onChange("altText", v)}
            onBlur={onBlur}
            placeholder="Describe the image"
          />
          <SelectField
            label="Hotspot Style"
            value={content.hotspotStyle || "pulse"}
            options={[
              { value: "dot", label: "Dot" },
              { value: "plus", label: "Plus" },
              { value: "pulse", label: "Pulse (Animated)" },
            ]}
            onChange={(v) => onChange("hotspotStyle", v)}
          />
          <ColorField
            label="Hotspot Color"
            value={content.hotspotColor || "#ffffff"}
            onChange={(v) => onChange("hotspotColor", v)}
          />
          <SelectField
            label="Show Labels"
            value={content.showLabels || "hover"}
            options={[
              { value: "always", label: "Always" },
              { value: "hover", label: "On Hover" },
              { value: "never", label: "Never" },
            ]}
            onChange={(v) => onChange("showLabels", v)}
          />

          {/* Hotspots List */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-medium text-slate-900 dark:text-white mb-3">
              Product Hotspots ({(content.hotspots || []).length})
            </h4>
            {(content.hotspots || []).length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No hotspots added yet. Click &quot;Add Hotspot&quot; to place
                product markers on your image.
              </p>
            ) : (
              <div className="space-y-2">
                {(content.hotspots || []).map(
                  (
                    hotspot: {
                      id: string;
                      productTitle?: string;
                      position: { x: number; y: number };
                    },
                    index: number,
                  ) => (
                    <div
                      key={hotspot.id}
                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {hotspot.productTitle || `Hotspot ${index + 1}`}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Position: {Math.round(hotspot.position.x)}%,{" "}
                          {Math.round(hotspot.position.y)}%
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newHotspots = [...(content.hotspots || [])];
                          newHotspots.splice(index, 1);
                          onChange("hotspots", newHotspots);
                        }}
                        className="ml-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Remove hotspot"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}
            <button
              onClick={() => {
                const newHotspot = {
                  id: `hotspot_${Date.now()}`,
                  productId: "",
                  productTitle: "New Product",
                  productPrice: "$0.00",
                  position: { x: 50, y: 50 },
                };
                onChange("hotspots", [...(content.hotspots || []), newHotspot]);
              }}
              className="mt-3 w-full py-2 px-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              + Add Hotspot
            </button>
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <MediaPickerField
            label="Image"
            value={content.src || ""}
            onChange={(v) => onChange("src", v)}
            onBlur={onBlur}
            allowedTypes={["image/*"]}
          />
          <InputField
            label="Alt Text"
            value={content.alt || ""}
            onChange={(v) => onChange("alt", v)}
            onBlur={onBlur}
            placeholder="Describe the image"
          />
          <InputField
            label="Link URL"
            value={content.link || ""}
            onChange={(v) => onChange("link", v)}
            onBlur={onBlur}
            placeholder="https://..."
          />
          <InputField
            label="Caption"
            value={content.caption || ""}
            onChange={(v) => onChange("caption", v)}
            onBlur={onBlur}
          />
          <SelectField
            label="Aspect Ratio"
            value={content.aspectRatio || "auto"}
            options={[
              { value: "auto", label: "Auto" },
              { value: "1:1", label: "Square (1:1)" },
              { value: "4:3", label: "Standard (4:3)" },
              { value: "16:9", label: "Widescreen (16:9)" },
              { value: "21:9", label: "Ultra Wide (21:9)" },
            ]}
            onChange={(v) => onChange("aspectRatio", v)}
          />
        </div>
      );

    default:
      return (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Content settings for this block type are not yet available.
        </div>
      );
  }
};

// Style settings component
interface StyleSettingsProps {
  block: PageBlock;
  onChange: (key: keyof BlockStyle, value: any) => void;
  onPaddingChange: (
    side: "top" | "right" | "bottom" | "left",
    value: number,
  ) => void;
  onBlur: () => void;
}

const StyleSettings: React.FC<StyleSettingsProps> = ({
  block,
  onChange,
  onPaddingChange,
  onBlur,
}) => {
  const style = block.style;

  return (
    <div className="space-y-6">
      {/* Background */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Background
        </h4>
        <div className="space-y-3">
          <ColorField
            label="Color"
            value={style.backgroundColor || ""}
            onChange={(v) => onChange("backgroundColor", v)}
          />
          <MediaPickerField
            label="Background Image"
            value={style.backgroundImage || ""}
            onChange={(v) => onChange("backgroundImage", v)}
            onBlur={onBlur}
            allowedTypes={["image/*"]}
          />
          {style.backgroundImage && (
            <>
              <NumberField
                label="Overlay Opacity (%)"
                value={style.backgroundOverlay || 0}
                min={0}
                max={100}
                onChange={(v) => onChange("backgroundOverlay", v)}
              />
              <ColorField
                label="Overlay Color"
                value={style.backgroundOverlayColor || "#000000"}
                onChange={(v) => onChange("backgroundOverlayColor", v)}
              />
            </>
          )}
        </div>
      </div>

      {/* Text */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Text
        </h4>
        <ColorField
          label="Text Color"
          value={style.textColor || ""}
          onChange={(v) => onChange("textColor", v)}
        />
      </div>

      {/* Padding */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Padding
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Top"
            value={style.padding?.top || 0}
            min={0}
            max={200}
            onChange={(v) => onPaddingChange("top", v)}
          />
          <NumberField
            label="Right"
            value={style.padding?.right || 0}
            min={0}
            max={200}
            onChange={(v) => onPaddingChange("right", v)}
          />
          <NumberField
            label="Bottom"
            value={style.padding?.bottom || 0}
            min={0}
            max={200}
            onChange={(v) => onPaddingChange("bottom", v)}
          />
          <NumberField
            label="Left"
            value={style.padding?.left || 0}
            min={0}
            max={200}
            onChange={(v) => onPaddingChange("left", v)}
          />
        </div>
      </div>

      {/* Alignment */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Alignment
        </h4>
        <div className="space-y-3">
          <SelectField
            label="Horizontal"
            value={style.alignmentX || "center"}
            options={[
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ]}
            onChange={(v) => onChange("alignmentX", v as AlignmentX)}
          />
          <SelectField
            label="Vertical"
            value={style.alignmentY || "center"}
            options={[
              { value: "top", label: "Top" },
              { value: "center", label: "Center" },
              { value: "bottom", label: "Bottom" },
            ]}
            onChange={(v) => onChange("alignmentY", v as AlignmentY)}
          />
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Size
        </h4>
        <div className="space-y-3">
          <NumberField
            label="Min Height (px)"
            value={style.minHeight || 0}
            min={0}
            max={1000}
            onChange={(v) => onChange("minHeight", v)}
          />
          <NumberField
            label="Border Radius (px)"
            value={style.borderRadius || 0}
            min={0}
            max={50}
            onChange={(v) => onChange("borderRadius", v)}
          />
        </div>
      </div>
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
    <div className="space-y-4">
      <CheckboxField
        label="Full Width"
        checked={block.style.fullWidth ?? false}
        onChange={(v) =>
          updateBlock(block.id, { style: { ...block.style, fullWidth: v } })
        }
      />
      <CheckboxField
        label="Hidden"
        checked={block.hidden ?? false}
        onChange={(v) => updateBlock(block.id, { hidden: v })}
      />
      <CheckboxField
        label="Locked"
        checked={block.locked ?? false}
        onChange={(v) => updateBlock(block.id, { locked: v })}
      />

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Block ID
        </p>
        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {block.id}
        </code>
      </div>
    </div>
  );
};

// Field components
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      rows={4}
      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
    />
  </div>
);

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
    />
    <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
  </label>
);

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
      {label}
    </label>
    <div className="flex gap-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border border-slate-200 dark:border-slate-600 cursor-pointer"
      />
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

export default SettingsPanel;
