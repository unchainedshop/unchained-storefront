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
        <Button
          onClick={onCancel}
          variant="secondary"
          size="small"
          type="button"
          text={
            cancelText ||
            formatMessage({
              id: "cancel",
              defaultMessage: "Cancel",
            })
          }
          fullWidth={false}
          className="focus:ring-indigo-400"
        />
      ) : null}
      {showSubmit ? (
        <Button
          variant="primary"
          size="small"
          type="submit"
          fullWidth={false}
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
