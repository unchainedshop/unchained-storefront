/**
 * Design tokens for consistent styling across the application
 * These tokens help maintain design consistency and make global changes easier
 */

export const designTokens = {
  // Color schemes
  colors: {
    primary: {
      bg: 'bg-slate-900',
      bgHover: 'hover:bg-slate-800',
      bgActive: 'active:bg-slate-950',
      text: 'text-white',
      border: 'border-transparent',
      focusRing: 'focus:ring-slate-500',
    },
    secondary: {
      bg: 'bg-white',
      bgHover: 'hover:bg-slate-50',
      bgActive: 'active:bg-slate-100',
      text: 'text-slate-900',
      border: 'border-slate-200',
      borderHover: 'hover:border-slate-300',
      focusRing: 'focus:ring-slate-500',
      // Dark mode variants
      darkBg: 'dark:bg-slate-700',
      darkText: 'dark:text-slate-300',
      darkBorder: 'dark:border-slate-600',
      darkBgHover: 'dark:hover:bg-slate-600',
      darkBorderHover: 'dark:hover:border-slate-500',
      darkBgActive: 'dark:active:bg-slate-800',
    },
    success: {
      bg: 'bg-green-600',
      bgHover: 'hover:bg-green-700',
      bgActive: 'active:bg-green-800',
      text: 'text-white',
      border: 'border-transparent',
      focusRing: 'focus:ring-green-500',
    },
    danger: {
      bg: 'bg-red-600',
      bgHover: 'hover:bg-red-700',
      bgActive: 'active:bg-red-800',
      text: 'text-white',
      border: 'border-transparent',
      focusRing: 'focus:ring-red-500',
    },
  },

  // Spacing
  spacing: {
    button: {
      padding: 'px-6 py-3',
      paddingSmall: 'px-4 py-2',
      paddingLarge: 'px-8 py-4',
    },
    container: {
      padding: 'px-4 sm:px-6 lg:px-8',
      maxWidth: 'max-w-7xl mx-auto',
    },
    section: {
      padding: 'py-16',
      paddingSmall: 'py-8',
      paddingLarge: 'py-24',
    },
  },

  // Typography
  typography: {
    heading: {
      h1: 'text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl',
      h2: 'text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl',
      h3: 'text-lg font-semibold text-slate-900 dark:text-white',
    },
    body: {
      base: 'text-slate-600 dark:text-slate-300',
      large: 'text-lg text-slate-600 dark:text-slate-300',
      small: 'text-sm text-slate-600 dark:text-slate-300',
    },
  },

  // Common component patterns
  components: {
    card: {
      base: 'bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-0',
      padding: 'p-6',
    },
    input: {
      base: 'w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500',
    },
    overlay: {
      backdrop:
        'fixed inset-0 bg-slate-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-75',
    },
  },

  // Animation and transitions
  animation: {
    transition: 'transition-colors duration-200',
    transitionAll: 'transition-all duration-200',
    focus: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    darkFocusOffset: 'dark:focus:ring-offset-slate-900',
  },
} as const;

export const getButtonVariant = (variant: keyof typeof designTokens.colors) => {
  const colorScheme = designTokens.colors[variant];
  const base = 'flex justify-center rounded-md text-sm font-medium';
  const spacing = designTokens.spacing.button.padding;
  const animation = designTokens.animation.transition;
  const focus = designTokens.animation.focus;
  const darkFocus = designTokens.animation.darkFocusOffset;

  const classes = [
    base,
    spacing,
    animation,
    focus,
    darkFocus,
    colorScheme.bg,
    colorScheme.bgHover,
    colorScheme.bgActive,
    colorScheme.text,
    colorScheme.border,
    colorScheme.focusRing,
  ];

  // Type narrowing for secondary variant
  if (variant === 'secondary') {
    const secondaryScheme = designTokens.colors.secondary;
    classes.push(
      secondaryScheme.darkBg,
      secondaryScheme.darkText,
      secondaryScheme.darkBorder,
      secondaryScheme.darkBgHover,
      secondaryScheme.darkBorderHover,
      secondaryScheme.darkBgActive,
    );
  }

  return classes.filter(Boolean).join(' ');
};

export const getCardClasses = () => {
  return [
    designTokens.components.card.base,
    designTokens.components.card.padding,
  ].join(' ');
};

export const getHeadingClasses = (
  level: keyof typeof designTokens.typography.heading,
) => {
  return designTokens.typography.heading[level];
};

export const getBodyClasses = (
  size: keyof typeof designTokens.typography.body = 'base',
) => {
  return designTokens.typography.body[size];
};
