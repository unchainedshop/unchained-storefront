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
  plugins: [aspectRatio, typography, forms],
} satisfies Config;

export default tailwindConfig;
