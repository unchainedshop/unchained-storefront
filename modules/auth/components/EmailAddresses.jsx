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
      id="profileview"
      className="space-y-6 sm:px-6 lg:col-span-9 lg:col-start-4 lg:px-0"
      aria-labelledby="payment-details-heading"
    >
      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5 bg-white">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-200">
          {formatMessage({
            id: "email-addresses",
            defaultMessage: "Email Addresses",
          })}
        </h2>
        <div className="sm:col-span-2">
          <div className="gap-2 md:grid md:grid-cols-2">
            {emails?.map((e) => (
              <div key={e.address} className="mb-1 flex flex-wrap items-center">
                <span className="text-lg font-semibold dark:text-slate-100">
                  {e.address}
                </span>
                <VerifiedStatus isActive={e.verified} />
                <div>
                  {!e.verified && (
                    <Button
                      type="button"
                      text={formatMessage({
                        id: "send_verification_email",
                        defaultMessage: "Send Verification Link",
                      })}
                      className="my-2 mr-2 border-0 bg-slate-900 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      onClick={() => resendVerificationEmail(e.address)}
                    />
                  )}
                  {emails?.length > 1 && (
                    <Button
                      type="button"
                      text={formatMessage({
                        id: "remove",
                        defaultMessage: "Remove",
                      })}
                      className="my-2 border-0 bg-red-500 text-white focus:outline-none focus:ring-2 focus:ring-red-900  focus:ring-offset-2"
                      onClick={() => removeEmail(e.address)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <Form onSubmit={onAddNewEmail} onSubmitError={onSubmitError}>
            <EmailField
              name="email"
              label={formatMessage({
                id: "add_email",
                defaultMessage: "Add Email",
              })}
              placeholder={formatMessage({
                id: "add_email",
                defaultMessage: "Add Email",
              })}
              required
            />

            <SubmitButton>
              {formatMessage({
                id: "add_email",
                defaultMessage: "Add Email",
              })}
            </SubmitButton>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default EmailAddresses;
