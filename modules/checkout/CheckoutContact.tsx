import { useState } from "react";
import Link from "next/link";

import { useIntl } from "react-intl";
import ContactForm from "./ContactForm";
import ContactPanel from "./ContactPanel";
import useAddEmail from "../cart/hooks/useAddEmail";
import useUpdateCartContact from "../cart/hooks/useUpdateCartContact";

const CheckoutContact = ({ cart, isInitial }) => {
  const { updateCartContact } = useUpdateCartContact();
  const [editMode, setEditMode] = useState(isInitial);
  const { addEmail } = useAddEmail();
  const [showLogin, setShowLogin] = useState(false);
  const { formatMessage } = useIntl();

  const updateContact = async (contactInfo) => {
    try {
      if (contactInfo.emailAddress)
        await addEmail({
          email: contactInfo.emailAddress,
        });

      await updateCartContact({
        contact: contactInfo,
      });
      setShowLogin(false);
      setEditMode(false);
    } catch (error) {
      if ((error as any)?.message.includes("duplicate")) setShowLogin(true);
      throw error;
    }
  };

  const contact = { ...(cart.contact || {}) };
  delete contact?.__typename;

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-600">
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
        {formatMessage({
          id: "contact-info",
          defaultMessage: "Contact info",
        })}
      </h2>

      {showLogin && editMode && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm">
            {formatMessage({
              id: "email-not-available",
              defaultMessage: "E-Mail address is not available, please",
            })}{" "}
            <Link
              href="/login"
              className="font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {formatMessage({
                id: "sign-in",
                defaultMessage: "Sign in",
              })}
            </Link>{" "}
            {formatMessage({
              id: "or-choose-another",
              defaultMessage: "or choose another one",
            })}
          </p>
        </div>
      )}

      {editMode ? (
        <ContactForm
          contact={contact}
          onSubmit={updateContact}
          onCancel={toggleEditMode}
        />
      ) : (
        <ContactPanel contact={contact} onEdit={toggleEditMode} />
      )}
    </div>
  );
};

export default CheckoutContact;
