import { useState } from 'react';
import Link from 'next/link';

import { useIntl } from 'react-intl';
import ContactForm from './ContactForm';
import ContactPanel from './ContactPanel';
import useAddEmail from '../auth/hooks/useAddEmail';
import useUpdateCartContact from '../cart/hooks/useUpdateCartContact';
import Button from '../common/components/Button';

const CheckoutContact = ({ cart, isInitial }) => {
  const { updateCartContact } = useUpdateCartContact();
  const [editMode, setEditMode] = useState(isInitial);
  const { addEmail } = useAddEmail();
  const [showLogin, setShowLogin] = useState(false);
  const { formatMessage } = useIntl();

  const updateContact = async (contactInfo) => {
    try {
      if (contactInfo.emailAddress)
        await addEmail(contactInfo.emailAddress);

      await updateCartContact({
        contact: contactInfo,
      });
      setShowLogin(false);
      setEditMode(false);
    } catch (error) {
      if ((error as any)?.message.includes('duplicate')) setShowLogin(true);
      throw error;
    }
  };

  const contact = { ...(cart.contact || {}) };
  delete contact?.__typename;

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {formatMessage({
            id: 'contact-info',
            defaultMessage: 'Contact info',
          })}
        </h2>
        {!editMode && (
          <Button
            type="button"
            variant="link"
            onClick={toggleEditMode}
            text={formatMessage({
              id: 'edit-contact-data',
              defaultMessage: 'Edit Contact Data',
            })}
            className="text-accent hover:text-accent"
            fullWidth={false}
          />
        )}
      </div>

      {showLogin && editMode && (
        <div className="mb-4 p-4 bg-danger-soft border border-danger/40 rounded-md">
          <p className="text-danger text-sm">
            {formatMessage({
              id: 'email-not-available',
              defaultMessage: 'E-Mail address is not available, please',
            })}{' '}
            <Link
              href="/login"
              className="font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
            >
              {formatMessage({
                id: 'sign-in',
                defaultMessage: 'Sign in',
              })}
            </Link>{' '}
            {formatMessage({
              id: 'or-choose-another',
              defaultMessage: 'or choose another one',
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
