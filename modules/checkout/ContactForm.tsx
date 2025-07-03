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
    <div className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
      <div className="px-4 py-6 sm:p-8">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
            {formatMessage({
              id: "contact_information",
              defaultMessage: "Contact Information",
            })}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {formatMessage({
              id: "contact_description",
              defaultMessage:
                "We'll use this information to update you about your order.",
            })}
          </p>

          <form
            onSubmit={submitHandler}
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <div className="sm:col-span-4">
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                {formatMessage({
                  id: "email-address",
                  defaultMessage: "Email Address",
                })}
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required={!emailSupportDisabled || !isSubscribed}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="telNumber"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                {formatMessage({
                  id: "telNumber",
                  defaultMessage: "Phone Number",
                })}
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  id="telNumber"
                  name="telNumber"
                  value={telNumber}
                  onChange={(e) => setTelNumber(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <Toggle
                    onToggle={async () => {
                      if (isSubscribed) {
                        await unsubscribe();
                      } else {
                        await subscribe();
                      }
                    }}
                    toggleText=""
                    toggleKey=""
                    active={isSubscribed}
                    className=""
                  />
                </div>
                <div className="text-sm leading-6">
                  <label className="font-medium text-gray-900 dark:text-white">
                    {formatMessage({
                      id: "order_notifications",
                      defaultMessage: "Order notifications",
                    })}
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatMessage({
                      id: "order_notifications_description",
                      defaultMessage:
                        "Receive order confirmations and status updates.",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
        >
          {formatMessage({
            id: "cancel",
            defaultMessage: "Cancel",
          })}
        </button>
        <button
          type="submit"
          onClick={submitHandler}
          disabled={isDisabled}
          className={classNames(
            "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            {
              "bg-gray-400 cursor-not-allowed": isDisabled,
              "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600":
                !isDisabled,
            },
          )}
        >
          {formatMessage({
            id: "save_contact",
            defaultMessage: "Save Contact",
          })}
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
