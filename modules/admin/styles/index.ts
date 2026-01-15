/**
 * Admin Shared Styles
 * Centralized style constants for admin pages
 */

/**
 * Glassmorphism pill/card style
 * Used for floating elements with blur backdrop
 */
export const PILL_STYLES = `
  bg-white/80 dark:bg-slate-900/80
  backdrop-blur-xl backdrop-saturate-150
  border border-white/50 dark:border-white/10
  shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
  ring-1 ring-black/5 dark:ring-white/5
`;

/**
 * Standard card style for content sections
 */
export const CARD_STYLES = `
  bg-white dark:bg-slate-900
  rounded-2xl
  shadow-sm
  border border-slate-200 dark:border-slate-800
`;

/**
 * Input field base styles
 */
export const INPUT_STYLES = `
  px-4 py-2.5
  bg-slate-50 dark:bg-slate-800
  border border-slate-200 dark:border-slate-700
  rounded-xl
  text-slate-900 dark:text-white
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white
  focus:border-transparent
  transition-colors
`;

/**
 * Primary button styles
 * Uses CSS variables for dynamic theming via admin-btn-primary class
 */
export const PRIMARY_BUTTON_STYLES = `
  admin-btn-primary
  inline-flex items-center gap-2
  px-4 py-2
  font-medium
  rounded-xl
  transition-colors
  disabled:opacity-50
  shadow-lg hover:shadow-xl hover:-translate-y-0.5
  disabled:hover:translate-y-0 disabled:hover:shadow-lg
`;

/**
 * Secondary button styles
 */
export const SECONDARY_BUTTON_STYLES = `
  inline-flex items-center gap-2
  px-4 py-2
  bg-slate-100 dark:bg-slate-800
  text-slate-700 dark:text-slate-300
  font-medium
  rounded-xl
  hover:bg-slate-200 dark:hover:bg-slate-700
  transition-colors
  disabled:opacity-50
`;

/**
 * Danger button styles (for destructive actions)
 */
export const DANGER_BUTTON_STYLES = `
  inline-flex items-center gap-2
  px-4 py-2
  bg-red-600 dark:bg-red-500
  text-white
  font-medium
  rounded-xl
  hover:bg-red-700 dark:hover:bg-red-600
  transition-colors
  disabled:opacity-50
`;

/**
 * Label styles for form fields
 */
export const LABEL_STYLES = `
  block text-sm font-medium
  text-slate-700 dark:text-slate-300
  mb-1.5
`;

/**
 * Status badge colors by status type
 */
export const STATUS_COLORS = {
  published: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  active: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  draft: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  scheduled: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
  archived: {
    bg: "bg-slate-100 dark:bg-slate-700",
    text: "text-slate-600 dark:text-slate-400",
  },
  inactive: {
    bg: "bg-slate-100 dark:bg-slate-700",
    text: "text-slate-600 dark:text-slate-400",
  },
  new: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
  read: {
    bg: "bg-slate-100 dark:bg-slate-700",
    text: "text-slate-600 dark:text-slate-400",
  },
  spam: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
  },
} as const;

export type StatusType = keyof typeof STATUS_COLORS;
