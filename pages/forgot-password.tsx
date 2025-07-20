import { useIntl } from 'react-intl';
import ForgotPasswordForm from '../modules/auth/components/ForgotPasswordForm';

const ForgotPassword = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 dark:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight ">
          {formatMessage({
            id: 'forgot_password',
            defaultMessage: 'Forgot your password?',
          })}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-white">
          {formatMessage({
            id: 'forgot-password-description',
            defaultMessage:
              "Enter your email address below and we'll send you an email with a link to reset your password!",
          })}
        </p>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

ForgotPassword.getLayout = (page) => page;
