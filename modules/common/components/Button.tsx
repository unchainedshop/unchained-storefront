import classNames from "classnames";

const Button = ({
  type,
  icon = null,
  text = "",
  disabled = false,
  className = "",
  onClick = (value) => value,
}) => {
  return (
    <button
      className={classNames(
        "flex w-full justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium  shadow-xs hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 text-white",
        {
          "cursor-not-allowed opacity-30 outline-none": disabled,
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
