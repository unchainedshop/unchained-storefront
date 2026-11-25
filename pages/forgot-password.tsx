import { useIntl } from 'react-intl';
import ForgotPasswordForm from '../modules/auth/components/ForgotPasswordForm';
import AuthLayout from '../modules/auth/components/AuthLayout';

const ForgotPassword = () => {
  const { formatMessage } = useIntl();

  return (
    <AuthLayout
      title={formatMessage({ id: 'forgot_password', defaultMessage: 'Forgot your password?' })}
      subtitle={formatMessage({ id: 'forgot-password-description', defaultMessage: "Enter your email address below and we'll send you an email with a link to reset your password!" })}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;

