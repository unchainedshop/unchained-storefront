import classNames from "classnames";
import { useIntl } from "react-intl";
import Button from "../../common/components/Button";

const SaveAndCancelButtons = ({
  cancelText,
  showCancel = true,
  submitText,
  showSubmit = true,
  onCancel,
  className,
}) => {
  const { formatMessage } = useIntl();
  return (
    <span
      className={classNames(
        "flex flex-shrink-0 items-center space-x-4 py-5 pl-1",
        className,
      )}
    >
      {showCancel ? (
        <button
          onClick={onCancel}
          data-id="cancel_update"
          type="button"
          className={classNames(
            "focus:ring-indigo-400",
            "inline-flex items-center rounded-md border dark:text-indigo-400 border-slate-300 dark:border-0 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2",
          )}
        >
          {cancelText ||
            formatMessage({
              id: "cancel",
              defaultMessage: "Cancel",
            })}
        </button>
      ) : null}
      {showSubmit ? (
        <Button
          text={
            submitText ||
            formatMessage({
              id: "save",
              defaultMessage: "Save",
            })
          }
        />
      ) : null}
    </span>
  );
};

export default SaveAndCancelButtons;
