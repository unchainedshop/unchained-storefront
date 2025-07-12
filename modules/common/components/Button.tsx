import classNames from "classnames";

const Button = ({
  type,
  variant = "primary",
  icon = null,
  text = "",
  disabled = false,
  className = "",
  onClick = (value) => value,
}) => {
  const baseClasses =
    "flex w-full justify-center rounded-md py-3 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform";

  const variantClasses = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:bg-slate-950 active:scale-[0.98] focus:ring-slate-500 focus:ring-offset-2 border border-transparent dark:focus:ring-offset-slate-900",
    secondary:
      "bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] active:bg-slate-100 active:scale-[0.98] focus:ring-slate-500 focus:ring-offset-2 border-2 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:border-slate-500 dark:active:bg-slate-800 dark:focus:ring-offset-slate-900",
  };

  return (
    <button
      className={classNames(
        baseClasses,
        variantClasses[variant],
        {
          "cursor-not-allowed opacity-30 !transform-none !scale-100 hover:!scale-100 active:!scale-100": disabled,
        },
        className,
      )}
      type={type === "submit" ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && icon}
      {text}
    </button>
  );
};

export default Button;
