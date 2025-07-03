import { useIntl } from "react-intl";
import Button from "../common/components/Button";

const formatContact = ({ emailAddress, telNumber }) =>
  [emailAddress, telNumber].filter(Boolean).join("\n");

const ContactPanel = ({ contact, onEdit }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="mt-4">
      <div style={{ whiteSpace: "pre-wrap" }}>{formatContact(contact)}</div>
      <Button
        text={formatMessage({
          id: "edit-contact-data",
          defaultMessage: "Edit Contact Data",
        })}
        type="button"
        className="inline-flex justify-center mt-2 rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        onClick={onEdit}
      />
    </div>
  );
};

export default ContactPanel;
