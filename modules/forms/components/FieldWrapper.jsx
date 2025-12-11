 
import classnames from "classnames";
import { useIntl } from "react-intl";

const FieldWrapper = ({
  children,
  className,
  error,
  disabled,
  required,
  name,
  label,
  hideLabel,
  labelClassName,
}) => {
  const { formatMessage } = useIntl();
  const errorsMap = {
    required: formatMessage(
      {
        id: "error_required",
        defaultMessage: "{label} is a required field",
      },
      {
        label: label || name,
      },
    ),
  };
  return (
    <div
      className={classnames(
        "container",
        {
          "is-invalid": !!error,
          disabled,
          required,
        },
        className,
      )}
    >
      <label
        aria-label={label}
        htmlFor={name}
        className={classnames(
          "mb-2 block text-left text-sm font-medium text-slate-700 dark:text-slate-400",
          {
            "mt-1 mb-5 rounded border border-red-100 dark:border-none bg-red-50 dark:bg-red-300 p-2 pl-4 text-red-400 dark:text-red-800":
              !!error,
            "sr-only": hideLabel,
          },
          labelClassName,
        )}
      >
        {errorsMap[error?.type] ||
          error?.message?.replace(/{label}/gi, label) ||
          label}
      </label>
      {children}
    </div>
  );
};

export default FieldWrapper;
