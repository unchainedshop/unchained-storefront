import classnames from "classnames";
import { bgColor, textColor, borderColor } from "../data/miscellaneous";

const Badge = ({
  text,
  className: classes = "",
  dotted = null,
  color = "green",
  square = null,
  onClick = null,
}) => {
  const normalizedColor = color?.trim();

  return (
    <span
      id="badge"
      className={classnames(
        `inline-flex items-center shadow-xs border ${borderColor(
          normalizedColor,
          400,
        )} px-2.5 py-0.5 text-sm font-medium ${bgColor(
          normalizedColor,
          100,
        )} ${textColor(normalizedColor, 800)}`,
        classes,
        {
          "rounded-full": !square,
          "rounded-md": square,
        },
      )}
    >
      {dotted && (
        <svg
          className={`-ml-1 mr-1.5 h-2 w-2 ${textColor(normalizedColor, 400)}`}
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
          className={`ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${textColor(
            normalizedColor,
            400,
          )} hover:${bgColor(
            normalizedColor,
            200,
          )} hover:text-${normalizedColor}-500 focus:outline-none focus:${bgColor(
            normalizedColor,
            500,
          )} focus:text-white`}
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
