import { useIntl } from "react-intl";
import Button from "../common/components/Button";

const formatContact = ({ emailAddress, telNumber }) =>
  [emailAddress, telNumber].filter(Boolean).join("\n");

const ContactPanel = ({ contact, onEdit }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-slate-700 rounded-md p-4">
        <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
          {formatContact(contact)}
        </div>
      </div>
      <Button
        text={formatMessage({
          id: "edit-contact-data",
          defaultMessage: "Edit Contact Data",
        })}
        type="button"
        variant="secondary"
        onClick={onEdit}
      />
    </div>
  );
};

export default ContactPanel;
