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
  const baseClasses = "flex w-full justify-center rounded-md py-3 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  
  const variantClasses = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 border border-transparent",
    secondary: "bg-white text-slate-900 hover:bg-gray-50 hover:border-gray-300 focus:ring-slate-500 border-2 border-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
  };

  return (
    <button
      className={classNames(
        baseClasses,
        variantClasses[variant],
        {
          "cursor-not-allowed opacity-30": disabled,
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
