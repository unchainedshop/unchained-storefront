/**
 * Cell Style Presets
 * CSS definitions for one-click beautiful cell styles
 */

import type {
  CellStylePreset,
  CellGradient,
  CellPattern,
  GridCellStyle,
} from "../types";

export interface PresetDefinition {
  id: CellStylePreset;
  label: string;
  description: string;
  css: React.CSSProperties;
  className?: string;
}

// Gradient presets
export const GRADIENT_PRESETS: Record<string, CellGradient> = {
  aurora: {
    type: "linear",
    angle: 135,
    from: "#667eea",
    via: "#764ba2",
    to: "#f093fb",
  },
  sunset: {
    type: "linear",
    angle: 135,
    from: "#fa709a",
    to: "#fee140",
  },
  ocean: {
    type: "linear",
    angle: 135,
    from: "#667eea",
    to: "#764ba2",
  },
  forest: {
    type: "linear",
    angle: 135,
    from: "#11998e",
    to: "#38ef7d",
  },
  midnight: {
    type: "linear",
    angle: 135,
    from: "#232526",
    to: "#414345",
  },
  lavender: {
    type: "radial",
    from: "#e0c3fc",
    to: "#8ec5fc",
  },
  peach: {
    type: "linear",
    angle: 135,
    from: "#ffecd2",
    to: "#fcb69f",
  },
  mint: {
    type: "linear",
    angle: 135,
    from: "#d4fc79",
    to: "#96e6a1",
  },
};

// Pattern presets - CSS patterns
export const PATTERN_PRESETS: Record<string, { css: string; label: string }> = {
  dots: {
    label: "Dots",
    css: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
  },
  grid: {
    label: "Grid",
    css: `linear-gradient(currentColor 1px, transparent 1px),
          linear-gradient(90deg, currentColor 1px, transparent 1px)`,
  },
  lines: {
    label: "Lines",
    css: `repeating-linear-gradient(
      0deg,
      currentColor,
      currentColor 1px,
      transparent 1px,
      transparent 20px
    )`,
  },
  diagonal: {
    label: "Diagonal",
    css: `repeating-linear-gradient(
      45deg,
      currentColor,
      currentColor 1px,
      transparent 1px,
      transparent 10px
    )`,
  },
  crosses: {
    label: "Crosses",
    css: `linear-gradient(currentColor 2px, transparent 2px),
          linear-gradient(90deg, currentColor 2px, transparent 2px)`,
  },
};

// Build gradient CSS string
export function buildGradientCSS(gradient: CellGradient): string {
  const { type = "linear", from, to, via, angle = 135 } = gradient;

  if (type === "radial") {
    return via
      ? `radial-gradient(circle, ${from}, ${via}, ${to})`
      : `radial-gradient(circle, ${from}, ${to})`;
  }

  if (type === "conic") {
    return via
      ? `conic-gradient(from ${angle}deg, ${from}, ${via}, ${to})`
      : `conic-gradient(from ${angle}deg, ${from}, ${to})`;
  }

  // Linear gradient
  return via
    ? `linear-gradient(${angle}deg, ${from}, ${via}, ${to})`
    : `linear-gradient(${angle}deg, ${from}, ${to})`;
}

// Build pattern CSS
export function buildPatternCSS(
  pattern: CellPattern,
): { backgroundImage: string; backgroundSize: string } {
  const { type, color = "rgba(0,0,0,0.1)", size = 20 } = pattern;

  const patternCSS: Record<string, { bg: string; size: string }> = {
    dots: {
      bg: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      size: `${size}px ${size}px`,
    },
    grid: {
      bg: `linear-gradient(${color} 1px, transparent 1px),
           linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      size: `${size}px ${size}px`,
    },
    lines: {
      bg: `repeating-linear-gradient(0deg, ${color}, ${color} 1px, transparent 1px, transparent ${size}px)`,
      size: "100% 100%",
    },
    noise: {
      bg: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
      size: `${size * 10}px ${size * 10}px`,
    },
    waves: {
      bg: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        ${color} 10px,
        ${color} 11px
      )`,
      size: `${size}px ${size}px`,
    },
    crosses: {
      bg: `linear-gradient(${color} 2px, transparent 2px),
           linear-gradient(90deg, ${color} 2px, transparent 2px)`,
      size: `${size}px ${size}px`,
    },
  };

  const preset = patternCSS[type] || patternCSS.dots;
  return {
    backgroundImage: preset.bg,
    backgroundSize: preset.size,
  };
}

// Cell style presets - full configurations
export const CELL_PRESETS: PresetDefinition[] = [
  {
    id: "none",
    label: "None",
    description: "No styling",
    css: {},
  },
  {
    id: "glass",
    label: "Glass",
    description: "Frosted glass effect",
    css: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
  },
  {
    id: "glass-dark",
    label: "Dark Glass",
    description: "Dark frosted glass",
    css: {
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    },
  },
  {
    id: "neumorphic",
    label: "Soft",
    description: "Soft shadows (neumorphism)",
    css: {
      backgroundColor: "#f0f0f3",
      borderRadius: "16px",
      boxShadow: "8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff",
    },
  },
  {
    id: "gradient",
    label: "Gradient",
    description: "Beautiful gradient fill",
    css: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  },
  {
    id: "gradient-radial",
    label: "Radial",
    description: "Radial gradient",
    css: {
      background: "radial-gradient(circle at center, #e0c3fc 0%, #8ec5fc 100%)",
    },
  },
  {
    id: "pattern-dots",
    label: "Dots",
    description: "Dot pattern overlay",
    css: {
      backgroundColor: "#fafafa",
      backgroundImage: "radial-gradient(circle, #e0e0e0 1px, transparent 1px)",
      backgroundSize: "16px 16px",
    },
  },
  {
    id: "pattern-grid",
    label: "Grid",
    description: "Grid pattern",
    css: {
      backgroundColor: "#fafafa",
      backgroundImage: `linear-gradient(#e0e0e0 1px, transparent 1px),
                        linear-gradient(90deg, #e0e0e0 1px, transparent 1px)`,
      backgroundSize: "20px 20px",
    },
  },
  {
    id: "pattern-noise",
    label: "Noise",
    description: "Grain/noise texture",
    css: {
      backgroundColor: "#f8f8f8",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
    },
  },
  {
    id: "blur",
    label: "Blur",
    description: "Strong blur effect",
    css: {
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
];

// Get CSS for a cell style preset
export function getPresetCSS(preset: CellStylePreset): React.CSSProperties {
  const definition = CELL_PRESETS.find((p) => p.id === preset);
  return definition?.css || {};
}

// Build complete cell style CSS from GridCellStyle
export function buildCellStyleCSS(cellStyle: GridCellStyle): React.CSSProperties {
  const css: React.CSSProperties = {};

  // Apply preset base styles
  if (cellStyle.preset && cellStyle.preset !== "none") {
    Object.assign(css, getPresetCSS(cellStyle.preset));
  }

  // Override with custom gradient
  if (cellStyle.gradient) {
    css.background = buildGradientCSS(cellStyle.gradient);
  }

  // Add pattern overlay
  if (cellStyle.pattern) {
    const patternCSS = buildPatternCSS(cellStyle.pattern);
    // Layer pattern on top of existing background
    if (css.background) {
      css.backgroundImage = `${patternCSS.backgroundImage}, ${css.background}`;
    } else {
      css.backgroundImage = patternCSS.backgroundImage;
    }
    css.backgroundSize = patternCSS.backgroundSize;
  }

  // Custom blur intensity
  if (cellStyle.blurIntensity !== undefined) {
    css.backdropFilter = `blur(${cellStyle.blurIntensity}px)`;
    css.WebkitBackdropFilter = `blur(${cellStyle.blurIntensity}px)`;
  }

  // Border radius
  if (cellStyle.borderRadius !== undefined) {
    css.borderRadius = `${cellStyle.borderRadius}px`;
  }

  // Border glow
  if (cellStyle.borderGlow) {
    const { color, intensity } = cellStyle.borderGlow;
    css.boxShadow = `0 0 ${intensity * 2}px ${color}, 0 0 ${intensity * 4}px ${color}`;
  }

  // Custom box shadow
  if (cellStyle.boxShadow) {
    css.boxShadow = cellStyle.boxShadow;
  }

  // Existing style properties
  if (cellStyle.backgroundColor) {
    css.backgroundColor = cellStyle.backgroundColor;
  }

  if (cellStyle.padding) {
    css.padding = `${cellStyle.padding.top}px ${cellStyle.padding.right}px ${cellStyle.padding.bottom}px ${cellStyle.padding.left}px`;
  }

  if (cellStyle.zIndex) {
    css.zIndex = cellStyle.zIndex;
  }

  return css;
}

// Hover effect CSS generators
export const HOVER_EFFECTS: Record<string, { css: string; label: string }> = {
  scale: {
    label: "Scale Up",
    css: "transform: scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.15);",
  },
  lift: {
    label: "Lift",
    css: "transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.2);",
  },
  glow: {
    label: "Glow",
    css: "box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);",
  },
  darken: {
    label: "Darken",
    css: "filter: brightness(0.9);",
  },
  brighten: {
    label: "Brighten",
    css: "filter: brightness(1.1);",
  },
  blur: {
    label: "Blur BG",
    css: "backdrop-filter: blur(20px);",
  },
};

export function getHoverEffectCSS(effect: string): string {
  return HOVER_EFFECTS[effect]?.css || "";
}
