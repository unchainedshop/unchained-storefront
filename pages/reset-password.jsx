import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { useIntl } from "react-intl";
import ResetPasswordForm from "../modules/auth/components/ResetPasswordForm";
import useResetPassword from "../modules/auth/hooks/useResetPassword";
import AuthLayout from '../modules/auth/components/AuthLayout';
import Link from "next/link";
import Loading from "../modules/common/components/Loading";
import useValidateResetPasswordToken from "../modules/auth/hooks/useValidateResetPasswordToken";

const ResetPassword = () => {
  const { query, ...router } = useRouter();
  const { resetPassword } = useResetPassword();
  const { formatMessage } = useIntl();
  const { token } = query;
  const { isValid: tokenValid, loading: validating } = useValidateResetPasswordToken(token);
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

  if (validating) return <Loading />;
  if (!tokenValid)
    return (
      <AuthLayout
        title={formatMessage({ id: "reset-link-invalid", defaultMessage: "This reset link is no longer valid" })}
        subtitle={formatMessage({
          id: "reset-link-invalid-hint",
          defaultMessage: "Reset links expire after a while and can only be used once. Request a new one below.",
        })}
      >
        <Link href="/forgot-password" className="btn btn-primary w-full">
          {formatMessage({ id: "request-new-reset-link", defaultMessage: "Request a new link" })}
        </Link>
      </AuthLayout>
    );

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

