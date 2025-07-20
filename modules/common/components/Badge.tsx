import classnames from 'classnames';

// Modern color variants - only includes colors actually used in the project
const colorVariants = {
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-400 dark:border-green-600',
    dot: 'text-green-400',
    hover: 'hover:bg-green-200 dark:hover:bg-green-800/30',
    focus: 'focus:bg-green-500',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-400 dark:border-red-600',
    dot: 'text-red-400',
    hover: 'hover:bg-red-200 dark:hover:bg-red-800/30',
    focus: 'focus:bg-red-500',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-400 dark:border-yellow-600',
    dot: 'text-yellow-400',
    hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-800/30',
    focus: 'focus:bg-yellow-500',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-400 dark:border-blue-600',
    dot: 'text-blue-400',
    hover: 'hover:bg-blue-200 dark:hover:bg-blue-800/30',
    focus: 'focus:bg-blue-500',
  },
};

const Badge = ({
  text,
  className: classes = '',
  dotted = null,
  color = 'green',
  square = null,
  onClick = null,
}) => {
  const normalizedColor = color?.trim() || 'green';
  const colors = colorVariants[normalizedColor] || colorVariants.green;

  return (
    <span
      id="badge"
      className={classnames(
        'inline-flex items-center shadow-xs border px-2.5 py-0.5 text-sm font-medium',
        colors.bg,
        colors.text,
        colors.border,
        classes,
        {
          'rounded-full': !square,
          'rounded-md': square,
        },
      )}
    >
      {dotted && (
        <svg
          className={classnames('-ml-1 mr-1.5 h-2 w-2', colors.dot)}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx="4" cy="4" r="3" />
        </svg>
      )}
      {text}
      {onClick && (
        <button
          id="badge-x-button"
          type="button"
          onClick={onClick}
          className={classnames(
            'ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full focus:outline-none focus:text-white',
            colors.dot,
            colors.hover,
            colors.focus,
          )}
        >
          <span className="sr-only">Button</span>
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M1 1l6 6m0-6L1 7"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
