import { useIntl } from "react-intl";

const formatContact = ({ emailAddress, telNumber }) =>
  [emailAddress, telNumber].filter(Boolean).join("\n");

const ContactPanel = ({ contact, onEdit }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-700 rounded-md p-4">
        <div className="text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
          {formatContact(contact)}
        </div>
      </div>
    </div>
  );
};

export default ContactPanel;
