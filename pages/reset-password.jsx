import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { useIntl } from "react-intl";
import ResetPasswordForm from "../modules/auth/components/ResetPasswordForm";
import useResetPassword from "../modules/auth/hooks/useResetPassword";

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
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight ">
          {formatMessage({
            id: "reset-password-header",
            defaultMessage: "Reset password",
          })}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {formatMessage({
            id: "reset-password-subtitle",
            defaultMessage: "Set a password for your account",
          })}
        </p>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <ResetPasswordForm
            onSubmit={onSubmit}
            token={token}
            onSubmitSuccess={onPasswordChangedSuccessfully}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

ResetPassword.getLayout = (page) => page;
