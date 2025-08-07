import { useIntl } from 'react-intl';
import { useState } from 'react';
import classNames from 'classnames';
import { useAppContext } from '../common/components/AppContextWrapper';
import Button from '../common/components/Button';
import Form from '../forms/components/Form';
import TextField from '../forms/components/TextField';
import FormErrors from '../forms/components/FormErrors';

import Toggle from '../common/components/Toggle';
import usePushNotification from '../context/push-notification/usePushNotification';

const ContactForm = ({ contact, onSubmit, onCancel }) => {
  const { formatMessage } = useIntl();
  const { isSubscribed, subscribe, unsubscribe, disabledForCurrentBrowser } =
    usePushNotification();
  const { emailSupportDisabled } = useAppContext();
  const [localNotificationSubscribed, setLocalNotificationSubscribed] =
    useState(false);

  const submitHandler = async (data) => {
    await onSubmit(data);
  };

  const onSubmitError = async (e) => {
    return {
      root: {
        message: e.message,
      },
    };
  };

  return (
    <Form
      onSubmit={submitHandler}
      onSubmitError={onSubmitError}
      defaultValues={{ ...contact }}
      className="space-y-6"
    >
      <TextField
        label={formatMessage({
          id: 'email-address',
          defaultMessage: 'Email Address',
        })}
        name="emailAddress"
        type="email"
        required={!emailSupportDisabled || !isSubscribed}
      />

      <TextField
        label={formatMessage({
          id: 'telNumber',
          defaultMessage: 'Mobile Phone',
        })}
        name="telNumber"
        type="tel"
      />

      <Toggle
        className=""
        onToggle={() => {
          setLocalNotificationSubscribed(!localNotificationSubscribed);
        }}
        toggleText="Receive order confirmation / order status update"
        toggleKey=""
        active={localNotificationSubscribed}
        disabled={false}
      />

      <FormErrors />

      <div className="flex gap-4 pt-4">
        <Button
          text={formatMessage({
            id: 'cancel',
            defaultMessage: 'Cancel',
          })}
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
        />
        <Button
          text={formatMessage({
            id: 'save_contact',
            defaultMessage: 'Save Contact Data',
          })}
          type="submit"
          variant="primary"
          className="flex-[2]"
        />{' '}
      </div>
    </Form>
  );
};

export default ContactForm;
