import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { useIntl } from "react-intl";
import ResetPasswordForm from "../modules/auth/components/ResetPasswordForm";
import useResetPassword from "../modules/auth/hooks/useResetPassword";
import AuthLayout from '../modules/auth/components/AuthLayout';

const ResetPassword = () => {
  const { query, ...router } = useRouter();
  const { resetPassword } = useResetPassword();
  const { formatMessage } = useIntl();
  const { token } = query;
  const onSubmit = async ({ newPassword }) => {
    return resetPassword({ newPassword, token });
  };
  const onPasswordChangedSuccessfully = () => {
    toast.success(
      formatMessage({
        id: "password_changed_success",
        defaultMessage: "Password changed successfully.",
      }),
    );
    router.push("/");
  };

  return (
    <AuthLayout
      title={formatMessage({ id: "reset-password-header", defaultMessage: "Reset password" })}
      subtitle={formatMessage({ id: "reset-password-subtitle", defaultMessage: "Set a password for your account" })}
    >
      <ResetPasswordForm
        onSubmit={onSubmit}
        token={token}
        onSubmitSuccess={onPasswordChangedSuccessfully}
      />
    </AuthLayout>
  );
};

export default ResetPassword;

