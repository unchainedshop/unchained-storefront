/**
 * Admin Settings Context
 * Provides CMS settings to admin pages and applies theme CSS variables
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface ColorPreset {
  id: string;
  name: string;
  color: string;
}

export interface AdminSettings {
  siteName: Record<string, string>;
  defaultLocale: string;
  availableLocales: string[];
  logo: string;
  darkLogo: string;
  primaryColor: string;
  colorPresets: ColorPreset[];
  darkModeDefault: boolean;
  adminEmail: string;
  dateFormat: string;
  timeFormat: string;
}

// Unchained Brand Color Palette
// A sophisticated, modern palette that evokes freedom, innovation, and premium quality
const unchainedColorPresets: ColorPreset[] = [
  // Core brand colors
  { id: "midnight", name: "Midnight", color: "#0f172a" },
  { id: "ocean", name: "Ocean", color: "#0EA5E9" },
  { id: "emerald", name: "Emerald", color: "#10B981" },
  // Accent colors
  { id: "amber", name: "Amber", color: "#F59E0B" },
  { id: "coral", name: "Coral", color: "#F43F5E" },
  { id: "violet", name: "Violet", color: "#8B5CF6" },
  // Neutrals
  { id: "slate", name: "Slate", color: "#64748B" },
  { id: "cloud", name: "Cloud", color: "#F1F5F9" },
  { id: "snow", name: "Snow", color: "#FFFFFF" },
];

const defaultSettings: AdminSettings = {
  siteName: { en: "", de: "" },
  defaultLocale: "en",
  availableLocales: ["en", "de"],
  logo: "",
  darkLogo: "",
  primaryColor: "#0EA5E9",
  colorPresets: unchainedColorPresets,
  darkModeDefault: false,
  adminEmail: "",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "24h",
};

interface AdminSettingsContextValue {
  settings: AdminSettings;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const AdminSettingsContext = createContext<AdminSettingsContextValue>({
  settings: defaultSettings,
  isLoading: true,
  refetch: async () => {},
});

/**
 * Helper to calculate contrasting text color (white or black)
 */
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Helper to darken a hex color for hover states
 */
function darkenColor(hexColor: string, percent: number): string {
  const hex = hexColor.replace("#", "");
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - percent);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - percent);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - percent);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Apply CSS custom properties for the primary color
 */
function applyPrimaryColorCSS(primaryColor: string) {
  const root = document.documentElement;
  const contrastColor = getContrastColor(primaryColor);
  const hoverColor = darkenColor(primaryColor, 20);

  root.style.setProperty("--admin-primary", primaryColor);
  root.style.setProperty("--admin-primary-hover", hoverColor);
  root.style.setProperty("--admin-primary-text", contrastColor);
}

interface AdminSettingsProviderProps {
  children: ReactNode;
}

export const AdminSettingsProvider: React.FC<AdminSettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const loadedSettings = { ...defaultSettings, ...data.settings };
        setSettings(loadedSettings);
        applyPrimaryColorCSS(loadedSettings.primaryColor);
      }
    } catch {
      // Use defaults if settings don't exist
      applyPrimaryColorCSS(defaultSettings.primaryColor);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Re-apply CSS when settings change
  useEffect(() => {
    if (!isLoading) {
      applyPrimaryColorCSS(settings.primaryColor);
    }
  }, [settings.primaryColor, isLoading]);

  return (
    <AdminSettingsContext.Provider
      value={{ settings, isLoading, refetch: fetchSettings }}
    >
      {children}
    </AdminSettingsContext.Provider>
  );
};

export const useAdminSettings = () => useContext(AdminSettingsContext);

export default AdminSettingsContext;
