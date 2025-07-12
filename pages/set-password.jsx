import { useIntl } from "react-intl";
import SetPasswordForm from "../modules/auth/components/SetPasswordForm";
import useUser from "../modules/auth/hooks/useUser";

const SetPassword = () => {
  const { formatMessage } = useIntl();

  const { user } = useUser();

  return (
    <div className="flex min-h-screen justify-center bg-slate-100 dark:bg-slate-950 antialiased">
      <div className="container my-auto mt-24 max-w-md border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow rounded dark:shadow-none p-3 sm:mt-40">
        <div className="m-6 text-center">
          <h1 className="text-3xl font-semibold text-brown-600 dark:text-slate-200">
            {formatMessage({
              id: "set-password-header",
              defaultMessage: "Set password",
            })}
          </h1>
          <p className="text-slate-500 dark:text-slate-300">
            {formatMessage({
              id: "set-password-subtitle",
              defaultMessage: "Set a password for your account",
            })}
          </p>
        </div>
        <div className="p-2">
          <SetPasswordForm userId={user?._id} />
        </div>
      </div>
    </div>
  );
};

export default SetPassword;

SetPassword.getLayout = (page) => page;
