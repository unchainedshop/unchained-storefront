import { useIntl } from "react-intl";
import { useState } from "react";
import classNames from "classnames";
import { useAppContext } from "../common/components/AppContextWrapper";
import Button from "../common/components/Button";

import Toggle from "../common/components/Toggle";
import usePushNotification from "../context/push-notification/usePushNotification";

const ContactForm = ({ contact, onSubmit, onCancel }) => {
  const { formatMessage } = useIntl();
  const { isSubscribed, subscribe, unsubscribe } = usePushNotification();
  const [emailAddress, setEmailAddress] = useState(contact?.emailAddress);
  const [telNumber, setTelNumber] = useState(contact?.telNumber);
  const { emailSupportDisabled } = useAppContext();
  const submitHandler = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await onSubmit({ emailAddress, telNumber });
  };

  const isDisabled = !emailAddress && !isSubscribed;
  return (
    <form onSubmit={submitHandler}>
      <div className="mb-3">
        <label
          htmlFor="emailAddress"
          className="mb-2 block text-left text-sm font-medium text-slate-700 dark:text-slate-400"
        >
          {formatMessage({
            id: "email-address",
            defaultMessage: "Email Address",
          })}
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required={!emailSupportDisabled || !isSubscribed}
            className="relative mt-1 block w-full dark:focus:autofill dark:hover:autofill dark:autofill dark:placeholder:text-white dark:bg-slate-900 dark:text-slate-200 appearance-none rounded-md border-2  dark:border-slate-700 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            name="emailAddress"
            id="emailAddress"
          />
        </label>
      </div>
      <div className="mb-3">
        <label
          htmlFor="telNumber"
          className="mb-2 block text-left text-sm font-medium text-slate-700 dark:text-slate-400"
        >
          {formatMessage({
            id: "telNumber",
            defaultMessage: "Mobile Phone",
          })}
          <input
            type="tel"
            value={telNumber}
            id="telNumber"
            name="telNumber"
            onChange={(e) => setTelNumber(e.target.value)}
            className="relative mt-1 block w-full dark:focus:autofill dark:hover:autofill dark:autofill dark:placeholder:text-white dark:bg-slate-900 dark:text-slate-200 appearance-none rounded-md border-2  dark:border-slate-700 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </label>
      </div>
      <Toggle
        className=""
        onToggle={async () => {
          if (isSubscribed) {
            await unsubscribe();
          } else {
            await subscribe();
          }
        }}
        toggleText="Receive order confirmation / order status update"
        toggleKey=""
        active={isSubscribed}
      />

      <div className="pt-3">
        <div className="mt-4">
          <input
            type="submit"
            id="submit"
            disabled={isDisabled}
            name="submit"
            value={formatMessage({
              id: "save_contact",
              defaultMessage: "Save Contact Data",
            })}
            className={classNames(
              "flex w-full justify-center rounded-md border border-transparent  py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2",
              {
                "bg-slate-400": isDisabled,
                "bg-slate-800": !isDisabled,
              },
            )}
          />
        </div>
        <Button
          text={formatMessage({
            id: "cancel",
            defaultMessage: "Cancel",
          })}
          type="button"
          className={classNames(
            "inline-flex justify-center mt-2 mr-1 rounded-md border border-transparent py-2 px-4 text-sm font-medium  bg-black slate-800 shadow-xs hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2",
          )}
          onClick={onCancel}
        />
      </div>
    </form>
  );
};

export default ContactForm;
