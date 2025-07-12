import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

import Form from "../../forms/components/Form";
import FormErrors from "../../forms/components/FormErrors";
import PasswordField from "../../forms/components/PasswordField";
import SubmitButton from "../../forms/components/SubmitButton";

import useResetPassword from "../hooks/useResetPassword";

const ResetPasswordForm = ({ token }) => {
  const { formatMessage } = useIntl();
  const { resetPassword } = useResetPassword();
  const router = useRouter();

  const onSubmit = async ({ newPassword }) => {
    await resetPassword({ newPassword, token });
    toast.success(
      formatMessage({
        id: "password_changed_success",
        defaultMessage: "Password changed successfully.",
      }),
    );
    router.push("/");
  };
  const onSubmitError = async (e) => {
    if (e?.message?.toLowerCase().includes("expired")) {
      return {
        submit: {
          type: "manual",
          message: formatMessage({
            id: "reset_token_expired",
            defaultMessage: "Token link invalid or has expired",
          }),
        },
      };
    }

    return null;
  };

  const beforeSubmitValidator = ({ newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      return {
        confirmPassword: {
          type: "manual",
          message: "Passwords do not match",
        },
      };
    }
    return null;
  };

  return (
    <Form
      onSubmit={onSubmit}
      onSubmitError={onSubmitError}
      onBeforeSubmitValidator={beforeSubmitValidator}
      className="flex flex-col gap-4"
    >
      <PasswordField
        name="newPassword"
        id="new-password"
        label={formatMessage({
          id: "new_password",
          defaultMessage: "New password",
        })}
        required
      />

      <PasswordField
        required
        name="confirmPassword"
        id="confirm-password"
        label={formatMessage({
          id: "confirm_password",
          defaultMessage: "Confirm password",
        })}
      />

      <FormErrors />
      <SubmitButton className="w-full">
        {formatMessage({
          id: "rest_password",
          defaultMessage: "Reset password",
        })}
      </SubmitButton>
    </Form>
  );
};

export default ResetPasswordForm;
