/**
 * Cell Style Editor
 * UI for editing grid cell presets, gradients, patterns, and animations
 */

import React, { useState } from "react";
import {
  SparklesIcon,
  ArrowPathIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import type {
  GridCellStyle,
  CellStylePreset,
  CellGradient,
  CellPattern,
  CellScrollAnimation,
  ScrollRevealType,
} from "../../types";
import { CELL_PRESETS, GRADIENT_PRESETS } from "../../utils/cellPresets";
import {
  SCROLL_ANIMATION_OPTIONS,
  DURATION_PRESETS,
} from "../../utils/scrollAnimations";

interface CellStyleEditorProps {
  cellStyle: GridCellStyle;
  onChange: (style: GridCellStyle) => void;
}

// Color input component
const ColorInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label?: string;
}> = ({ value, onChange, label }) => (
  <div className="flex items-center gap-2">
    {label && <span className="text-[10px] text-slate-400 w-10">{label}</span>}
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-6 h-6 rounded cursor-pointer border border-slate-200 dark:border-slate-600"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-2 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded"
    />
  </div>
);

// Mini select component
const MiniSelect: React.FC<{
  value: string | number;
  options: Array<{ value: string | number; label: string }>;
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// Section header
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ icon, title, isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex items-center gap-2 w-full py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
  >
    {icon}
    <span>{title}</span>
    <span className="ml-auto text-slate-400">{isOpen ? "−" : "+"}</span>
  </button>
);

const CellStyleEditor: React.FC<CellStyleEditorProps> = ({
  cellStyle,
  onChange,
}) => {
  const [openSections, setOpenSections] = useState({
    preset: true,
    gradient: false,
    pattern: false,
    animation: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateStyle = (updates: Partial<GridCellStyle>) => {
    onChange({ ...cellStyle, ...updates });
  };

  return (
    <div className="space-y-3">
      {/* Style Presets Section */}
      <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
        <SectionHeader
          icon={<SparklesIcon className="w-4 h-4" />}
          title="Style Preset"
          isOpen={openSections.preset}
          onToggle={() => toggleSection("preset")}
        />
        {openSections.preset && (
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {CELL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateStyle({ preset: preset.id })}
                className={`px-2 py-2 text-[10px] rounded-lg border transition-all ${
                  cellStyle.preset === preset.id
                    ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-700 font-medium"
                    : "border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gradient Section */}
      <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
        <SectionHeader
          icon={<PaintBrushIcon className="w-4 h-4" />}
          title="Gradient"
          isOpen={openSections.gradient}
          onToggle={() => toggleSection("gradient")}
        />
        {openSections.gradient && (
          <div className="space-y-3 mt-2">
            {/* Gradient Presets */}
            <div>
              <p className="text-[10px] text-slate-400 mb-2">Quick Presets</p>
              <div className="grid grid-cols-4 gap-1">
                {Object.entries(GRADIENT_PRESETS).map(([key, gradient]) => (
                  <button
                    key={key}
                    onClick={() => updateStyle({ gradient, preset: "none" })}
                    className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-600 overflow-hidden"
                    title={key}
                    style={{
                      background:
                        gradient.type === "radial"
                          ? `radial-gradient(circle, ${gradient.from}, ${gradient.to})`
                          : `linear-gradient(${gradient.angle || 135}deg, ${gradient.from}${gradient.via ? `, ${gradient.via}` : ""}, ${gradient.to})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Custom Gradient */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400">Custom Colors</p>
              <ColorInput
                label="From"
                value={cellStyle.gradient?.from || "#667eea"}
                onChange={(from) =>
                  updateStyle({
                    gradient: { ...cellStyle.gradient, from, to: cellStyle.gradient?.to || "#764ba2" },
                    preset: "none",
                  })
                }
              />
              <ColorInput
                label="To"
                value={cellStyle.gradient?.to || "#764ba2"}
                onChange={(to) =>
                  updateStyle({
                    gradient: { ...cellStyle.gradient, from: cellStyle.gradient?.from || "#667eea", to },
                    preset: "none",
                  })
                }
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-10">Angle</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={cellStyle.gradient?.angle || 135}
                  onChange={(e) =>
                    updateStyle({
                      gradient: {
                        ...cellStyle.gradient,
                        from: cellStyle.gradient?.from || "#667eea",
                        to: cellStyle.gradient?.to || "#764ba2",
                        angle: Number(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="text-[10px] font-mono text-slate-500 w-8">
                  {cellStyle.gradient?.angle || 135}°
                </span>
              </div>
            </div>

            {/* Clear Gradient */}
            {cellStyle.gradient && (
              <button
                onClick={() => updateStyle({ gradient: undefined })}
                className="w-full py-1.5 text-[10px] text-slate-500 hover:text-red-500 transition-colors"
              >
                Clear Gradient
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pattern Section */}
      <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
        <SectionHeader
          icon={
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="5" cy="5" r="1.5" />
              <circle cx="10" cy="5" r="1.5" />
              <circle cx="15" cy="5" r="1.5" />
              <circle cx="5" cy="10" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="15" cy="10" r="1.5" />
              <circle cx="5" cy="15" r="1.5" />
              <circle cx="10" cy="15" r="1.5" />
              <circle cx="15" cy="15" r="1.5" />
            </svg>
          }
          title="Pattern Overlay"
          isOpen={openSections.pattern}
          onToggle={() => toggleSection("pattern")}
        />
        {openSections.pattern && (
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-3 gap-1">
              {(
                ["dots", "grid", "lines", "noise", "waves", "crosses"] as const
              ).map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    updateStyle({
                      pattern: {
                        type,
                        color: cellStyle.pattern?.color || "rgba(0,0,0,0.1)",
                        size: cellStyle.pattern?.size || 20,
                      },
                    })
                  }
                  className={`px-2 py-1.5 text-[10px] rounded border capitalize transition-colors ${
                    cellStyle.pattern?.type === type
                      ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-700"
                      : "border-slate-200 dark:border-slate-600 hover:border-slate-400"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {cellStyle.pattern && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-10">Size</span>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    value={cellStyle.pattern.size || 20}
                    onChange={(e) =>
                      updateStyle({
                        pattern: {
                          ...cellStyle.pattern!,
                          size: Number(e.target.value),
                        },
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-[10px] font-mono text-slate-500 w-6">
                    {cellStyle.pattern.size || 20}
                  </span>
                </div>

                <button
                  onClick={() => updateStyle({ pattern: undefined })}
                  className="w-full py-1.5 text-[10px] text-slate-500 hover:text-red-500 transition-colors"
                >
                  Clear Pattern
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Scroll Animation Section */}
      <div>
        <SectionHeader
          icon={<ArrowPathIcon className="w-4 h-4" />}
          title="Scroll Animation"
          isOpen={openSections.animation}
          onToggle={() => toggleSection("animation")}
        />
        {openSections.animation && (
          <div className="space-y-3 mt-2">
            {/* Animation Type */}
            <div>
              <p className="text-[10px] text-slate-400 mb-2">Effect</p>
              <MiniSelect
                value={cellStyle.scrollAnimation?.type || "none"}
                options={SCROLL_ANIMATION_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
                onChange={(type) =>
                  updateStyle({
                    scrollAnimation: {
                      ...cellStyle.scrollAnimation,
                      type: type as ScrollRevealType,
                    },
                  })
                }
              />
            </div>

            {/* Duration */}
            {cellStyle.scrollAnimation?.type &&
              cellStyle.scrollAnimation.type !== "none" && (
                <>
                  <div>
                    <p className="text-[10px] text-slate-400 mb-2">Duration</p>
                    <div className="grid grid-cols-4 gap-1">
                      {DURATION_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() =>
                            updateStyle({
                              scrollAnimation: {
                                ...cellStyle.scrollAnimation!,
                                duration: preset.value,
                              },
                            })
                          }
                          className={`px-2 py-1.5 text-[10px] rounded transition-colors ${
                            (cellStyle.scrollAnimation?.duration || 600) ===
                            preset.value
                              ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delay */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-10">
                      Delay
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={cellStyle.scrollAnimation?.delay || 0}
                      onChange={(e) =>
                        updateStyle({
                          scrollAnimation: {
                            ...cellStyle.scrollAnimation!,
                            delay: Number(e.target.value),
                          },
                        })
                      }
                      className="flex-1"
                    />
                    <span className="text-[10px] font-mono text-slate-500 w-12">
                      {cellStyle.scrollAnimation?.delay || 0}ms
                    </span>
                  </div>

                  {/* Easing */}
                  <div>
                    <p className="text-[10px] text-slate-400 mb-2">Easing</p>
                    <MiniSelect
                      value={cellStyle.scrollAnimation?.easing || "ease"}
                      options={[
                        { value: "ease", label: "Ease" },
                        { value: "ease-in", label: "Ease In" },
                        { value: "ease-out", label: "Ease Out" },
                        { value: "ease-in-out", label: "Ease In Out" },
                        { value: "spring", label: "Spring" },
                      ]}
                      onChange={(easing) =>
                        updateStyle({
                          scrollAnimation: {
                            ...cellStyle.scrollAnimation!,
                            easing: easing as CellScrollAnimation["easing"],
                          },
                        })
                      }
                    />
                  </div>

                  {/* Once toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cellStyle.scrollAnimation?.once !== false}
                      onChange={(e) =>
                        updateStyle({
                          scrollAnimation: {
                            ...cellStyle.scrollAnimation!,
                            once: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-slate-300"
                    />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">
                      Animate only once
                    </span>
                  </label>
                </>
              )}
          </div>
        )}
      </div>

      {/* Additional Options */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-16">Blur</span>
          <input
            type="range"
            min="0"
            max="30"
            value={cellStyle.blurIntensity || 0}
            onChange={(e) =>
              updateStyle({ blurIntensity: Number(e.target.value) || undefined })
            }
            className="flex-1"
          />
          <span className="text-[10px] font-mono text-slate-500 w-8">
            {cellStyle.blurIntensity || 0}px
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-16">Radius</span>
          <input
            type="range"
            min="0"
            max="48"
            value={cellStyle.borderRadius || 0}
            onChange={(e) =>
              updateStyle({ borderRadius: Number(e.target.value) || undefined })
            }
            className="flex-1"
          />
          <span className="text-[10px] font-mono text-slate-500 w-8">
            {cellStyle.borderRadius || 0}px
          </span>
        </div>
      </div>
    </div>
  );
};

export default CellStyleEditor;
