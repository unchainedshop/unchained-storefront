import { useIntl } from "react-intl";
import EmailField from "../../forms/components/EmailField";
import Form from "../../forms/components/Form";
import SubmitButton from "../../forms/components/SubmitButton";
import useAddEmail from "../hooks/useAddEmail";
import VerifiedStatus from "../../common/components/VerifiedStatus";
import Button from "../../common/components/Button";
import useResendVerificationEmail from "../hooks/useResendVerificationEmail";
import useRemoveEmail from "../hooks/useRemoveEmail";

const EmailAddresses = ({ emails }) => {
  const { formatMessage } = useIntl();
  const { addEmail } = useAddEmail();
  const { resendVerificationEmail } = useResendVerificationEmail();
  const { removeEmail } = useRemoveEmail();

  const onSubmitError = async (e) => {
    if (
      e.message?.toLowerCase().includes("email already exist") ||
      e.message?.toLowerCase().includes("duplicate")
    ) {
      return {
        email: {
          type: "manual",
          message: formatMessage({
            id: "email_exists_error",
            defaultMessage: "Email already exists",
          }),
        },
      };
    }

    return null;
  };

  const onAddNewEmail = async ({ email }) => {
    await addEmail(email);
  };
  return (
    <section
      id="email"
      className="mt-10 space-y-6 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
      aria-labelledby="email-addresses-heading"
    >
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="bg-white py-6 px-4 dark:bg-slate-900 dark:text-slate-200 sm:p-6">
          <div>
            <h3
              id="email-addresses-heading"
              className="text-lg font-medium leading-6 text-slate-900 dark:text-white"
            >
              {formatMessage({
                id: "email-addresses",
                defaultMessage: "Email Addresses",
              })}
            </h3>
          </div>

          <div className="mt-6 space-y-4">
            {emails?.map((e) => (
              <div
                key={e.address}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {e.address}
                  </span>
                  <VerifiedStatus isActive={e.verified} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {!e.verified && (
                    <Button
                      type="button"
                      text={formatMessage({
                        id: "send_verification_email",
                        defaultMessage: "Send Verification Link",
                      })}
                      onClick={() => resendVerificationEmail(e.address)}
                      className="text-xs px-2 py-1"
                    />
                  )}
                  {emails?.length > 1 && (
                    <Button
                      type="button"
                      text={formatMessage({
                        id: "remove",
                        defaultMessage: "Remove",
                      })}
                      onClick={() => removeEmail(e.address)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Form onSubmit={onAddNewEmail} onSubmitError={onSubmitError}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="sm:col-span-2">
                    <EmailField
                      name="email"
                      label={formatMessage({
                        id: "add_email",
                        defaultMessage: "Add Email",
                      })}
                      placeholder={formatMessage({
                        id: "enter_email_address",
                        defaultMessage: "Enter email address",
                      })}
                      required
                    />
                  </div>
                  <div>
                    <SubmitButton className="w-full sm:w-auto text-sm px-3 py-1.5">
                      {formatMessage({
                        id: "add_email",
                        defaultMessage: "Add Email",
                      })}
                    </SubmitButton>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailAddresses;
