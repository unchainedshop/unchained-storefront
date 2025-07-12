import type { Config } from "tailwindcss";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

const tailwindConfig = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./modules/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Badge component color variants
    "bg-green-100",
    "bg-green-900/20",
    "text-green-800",
    "text-green-300",
    "border-green-400",
    "border-green-600",
    "text-green-400",
    "hover:bg-green-200",
    "hover:bg-green-800/30",
    "focus:bg-green-500",

    "bg-red-100",
    "bg-red-900/20",
    "text-red-800",
    "text-red-300",
    "border-red-400",
    "border-red-600",
    "text-red-400",
    "hover:bg-red-200",
    "hover:bg-red-800/30",
    "focus:bg-red-500",

    "bg-yellow-100",
    "bg-yellow-900/20",
    "text-yellow-800",
    "text-yellow-300",
    "border-yellow-400",
    "border-yellow-600",
    "text-yellow-400",
    "hover:bg-yellow-200",
    "hover:bg-yellow-800/30",
    "focus:bg-yellow-500",

    "bg-blue-100",
    "bg-blue-900/20",
    "text-blue-800",
    "text-blue-300",
    "border-blue-400",
    "border-blue-600",
    "text-blue-400",
    "hover:bg-blue-200",
    "hover:bg-blue-800/30",
    "focus:bg-blue-500",

    // Dark mode variants for header styling
    "dark:border-slate-700",
    "dark:border-slate-800",
    "text-white",
    "[&_*]:text-white",
  ],
  plugins: [aspectRatio, typography, forms],
} satisfies Config;

export default tailwindConfig;
