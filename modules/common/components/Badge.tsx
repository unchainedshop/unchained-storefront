import classnames from 'classnames';

// Modern color variants - only includes colors actually used in the project
const colorVariants = {
  green: {
    bg: 'bg-success-soft ',
    text: 'text-success ',
    border: 'border-success ',
    dot: 'text-success',
    hover: 'hover:bg-success-soft ',
    focus: 'focus:bg-success',
  },
  red: {
    bg: 'bg-danger-soft ',
    text: 'text-danger ',
    border: 'border-danger ',
    dot: 'text-danger',
    hover: 'hover:bg-danger-soft ',
    focus: 'focus:bg-danger',
  },
  yellow: {
    bg: 'bg-warning-soft ',
    text: 'text-warning ',
    border: 'border-warning ',
    dot: 'text-warning',
    hover: 'hover:bg-warning-soft ',
    focus: 'focus:bg-warning',
  },
  blue: {
    bg: 'bg-accent-soft ',
    text: 'text-accent ',
    border: 'border-accent ',
    dot: 'text-accent',
    hover: 'hover:bg-accent-soft ',
    focus: 'focus:bg-accent',
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
