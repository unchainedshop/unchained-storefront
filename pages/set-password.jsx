import { useIntl } from "react-intl";
import SetPasswordForm from "../modules/auth/components/SetPasswordForm";
import useUser from "../modules/auth/hooks/useUser";
import AuthLayout from '../modules/auth/components/AuthLayout';

const SetPassword = () => {
  const { formatMessage } = useIntl();

  const { user } = useUser();

  return (
    <AuthLayout
      title={formatMessage({ id: "set-password-header", defaultMessage: "Set password" })}
      subtitle={formatMessage({ id: "set-password-subtitle", defaultMessage: "Set a password for your account" })}
    >
      <SetPasswordForm userId={user?._id} />
    </AuthLayout>
  );
};

export default SetPassword;

