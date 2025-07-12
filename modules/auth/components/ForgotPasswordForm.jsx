import Link from "next/link";

import toast from "react-hot-toast";
import { useIntl } from "react-intl";

import EmailField from "../../forms/components/EmailField";
import Form from "../../forms/components/Form";
import FormErrors from "../../forms/components/FormErrors";
import SubmitButton from "../../forms/components/SubmitButton";

import useForgotPassword from "../hooks/useForgotPassword";

const ForgotPasswordForm = () => {
  const { formatMessage } = useIntl();

  const { forgotPassword } = useForgotPassword();

  const onSubmit = async ({ email }) => {
    await forgotPassword({ email });
    toast.success(
      formatMessage(
        {
          id: "reset_link_sent",
          defaultMessage: "Password reset link sent to {email} ",
        },
        {
          email,
        },
      ),
    );
  };
  const onSubmitError = async (e) => {
    const message = e.message?.toLowerCase();
    if (message.includes("not found")) {
      return {
        email: {
          type: "manual",
          message: formatMessage({
            id: "email_address_not_exist",
            defaultMessage: "Provided email does not exist",
          }),
        },
      };
    }
    return null;
  };

  return (
    <Form onSubmit={onSubmit} onSubmitError={onSubmitError} className="form">
      <EmailField
        name="email"
        id="email-address"
        type="email"
        label={formatMessage({
          id: "email_address",
          defaultMessage: "Email Address",
        })}
        required
      />

      <FormErrors />
      <div className="mb-6 mt-6">
        <SubmitButton>
          {formatMessage({
            id: "send_rest_link",
            defaultMessage: "Send reset link",
          })}
        </SubmitButton>
      </div>
      <p className="text-center text-sm text-slate-400">
        {formatMessage({
          id: "dont_have_account",
          defaultMessage: "Don't have an account yet?",
        })}
        <Link
          href="/sign-up"
          className="ml-1 font-semibold text-slate-500 dark:text-slate-400 focus:text-slate-600 dark:hover:text-slate-300 focus:underline focus:outline-none"
        >
          {formatMessage({ id: "sign_up", defaultMessage: "Sign up" })}
        </Link>
        .
      </p>
    </Form>
  );
};

export default ForgotPasswordForm;
