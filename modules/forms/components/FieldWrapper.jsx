import classnames from "classnames";
import { useIntl } from "react-intl";

export const fieldErrorId = (name) => `${name}-error`;

const FieldWrapper = ({
  children,
  className,
  error,
  required,
  name,
  label,
  hideLabel,
  labelClassName,
}) => {
  const { formatMessage } = useIntl();
  const message =
    error?.type === "required"
      ? formatMessage(
          { id: "error_required", defaultMessage: "{label} is a required field" },
          { label: label || name },
        )
      : error?.message?.replace(/{label}/gi, label);

  return (
    <div className={classnames("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className={classnames("label", { "sr-only": hideLabel }, labelClassName)}
        >
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p id={fieldErrorId(name)} role="alert" className="mt-1.5 text-sm text-danger">
          {message}
        </p>
      )}
    </div>
  );
};

export default FieldWrapper;
