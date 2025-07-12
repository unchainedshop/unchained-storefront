import type { Config } from "tailwindcss";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

const tailwindConfig = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./modules/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Ensure dark border classes are not purged
    "dark:border-slate-700",
    "dark:border-slate-800",
    "dark:border-slate-900",
    "dark:border-zinc-700",
    "dark:border-zinc-800",
    "dark:border-zinc-900",
    "border-slate-200",
    "border-slate-300",
    "border-slate-400",
    // Background classes
    "dark:bg-slate-900",
    "dark:bg-slate-950",
    "dark:bg-zinc-900",
    "dark:bg-zinc-950",
    // Text classes
    "dark:text-white",
    "dark:text-slate-100",
    "dark:text-slate-200",
    "dark:text-slate-300",
    "dark:text-slate-400",
    "dark:text-zinc-100",
    "dark:text-zinc-200",
    "dark:text-zinc-300",
    "dark:text-zinc-400",
    // Hero header white text classes
    "text-white",
    "text-white/80", 
    "[&_*]:text-white",
    "[&_button]:text-white/80",
    "[&_button:hover]:text-white",
    "[&_a]:text-white/80",
    "[&_a:hover]:text-white",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors (preserved for compatibility)
        "dark-gray": "#495057",
        "color-light-dark": "#454545",
        "light-black": "#ced4da",
        "light-blue": "#80bdff",
        "color-brand": "#232323",
        "color-brand-lightest": "#e7e7e7",
        "color-brand-darker": "#121212",
        "color-dark": "#232323",
        "color-grey-lightest": "#ececec",
        "color-danger-100": "#FEE2E2",
        "color-danger-200": "#FECACA",
        "color-danger-600": "#DC2626",
        "color-danger-900": "#7F1D1D",
        "color-warning-100": "#FEF3C7",
        "color-warning-200": "#FDE68A",
        "color-warning-900": "#78350F",
        "color-success-100": "#D1FAE5",
        "color-success-200": "#A7F3D0",
        "color-success-900": "#064E3B",

        // Modern color palette
        primary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        accent: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      boxShadow: {
        0: "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
        soft: "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
        "soft-lg": "0 4px 16px -4px rgba(0, 0, 0, 0.1)",
        "soft-xl": "0 8px 32px -8px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      spacing: {
        sp: "calc(1em - 5px)",
        "sp-1": "calc(100% + 3em)",
        18: "4.5rem",
        88: "22rem",
        92: "23rem",
        96: "24rem",
      },
      flex: {
        2: "0 0 50%",
        3: "0 0 100%",
        4: "0 0 33.333333%",
        5: "0 0 25%",
        6: "0 0 66.666667%%",
        7: "0 0 75%",
      },
      maxWidth: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "1/4": "25%",
        "2/3": "66.666667%%",
        "3/4": "75%",
        "8xl": "88rem",
        "9xl": "96rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        scale: "scale 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scale: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [aspectRatio, typography, forms],
} satisfies Config;

export default tailwindConfig;

// const tailwindConfig = {
//   theme: {},
//   // corePlugins: {
//   //   aspectRatio: false,
//   // },
//   // plugins: [
//   // ],
// };

// export default tailwindConfig;
