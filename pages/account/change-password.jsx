import { KeyIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { useIntl } from "react-intl";

import useChangePassword from "../../modules/auth/hooks/useChangePassword";

import MetaTags from "../../modules/common/components/MetaTags";
import Form from "../../modules/forms/components/Form";
import FormErrors from "../../modules/forms/components/FormErrors";
import PasswordField from "../../modules/forms/components/PasswordField";
import SubmitButton from "../../modules/forms/components/SubmitButton";

const ChangePassword = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const { changePassword } = useChangePassword();

  const onBeforeSubmitValidator = ({
    newPassword,
    confirmPassword,
    oldPassword,
  }) => {
    if (confirmPassword && newPassword && newPassword !== confirmPassword)
      return {
        confirmPassword: {
          type: "manual",
          message: formatMessage({
            id: "password-does-not-match",
            defaultMessage: "Password does not match",
          }),
        },
      };
    if (newPassword === oldPassword)
      return {
        newPassword: {
          type: "manual",
          message: formatMessage({
            id: "password_identical",
            defaultMessage:
              "Provided new password identical to previous password",
          }),
        },
      };

    return null;
  };
  const onSubmit = async ({ newPassword, oldPassword }) => {
    await changePassword({ oldPassword, newPassword });
    toast.success(
      formatMessage({
        id: "password-change-success",
        defaultMessage: "Password changed successfully.",
      }),
    );
    router.push("/account");
  };

  const onSubmitError = async (error) => {
    if (error?.message?.toLowerCase().includes("incorrect credential")) {
      return {
        oldPassword: {
          type: "manual",
          message: formatMessage({
            id: "old_password_not_correct",
            defaultMessage: "Wrong password, please try again",
          }),
        },
      };
    }
    if (
      error?.message?.toLowerCase()?.includes("password is not set for account")
    ) {
      return {
        submit: {
          type: "manual",
          message: formatMessage({
            id: "password-not-set-error",
            defaultMessage:
              "Password is not set for account. please assign a password using set password instead or contact system admin",
          }),
        },
      };
    }

    return {
      submit: {
        type: "manual",
        message: formatMessage(
          {
            id: "password_change_failed",
            defaultMessage: "Password change failed, {error} try again later",
          },
          { error: error.message },
        ),
      },
    };
  };

  return (
    <>
      <MetaTags
        title={formatMessage({
          id: "update_password",
          defaultMessage: "Update Password",
        })}
      />
      <div className="bg-white dark:bg-slate-950">
        <div className="mx-auto mt-5 w-full p-10 sm:max-w-md md:max-w-lg lg:max-w-xl">
          <div className="rounded-lg p-4 shadow-xs dark:bg-slate-500">
            <div>
              <KeyIcon className="mx-auto mb-3 h-8 w-8 text-slate-900 dark:text-white" />
            </div>
            <h1 className="text-center text-3xl font-semibold text-slate-900 dark:text-slate-300">
              {formatMessage({
                id: "change_password",
                defaultMessage: "Change Password",
              })}
            </h1>

            <Form
              onSubmit={onSubmit}
              className="mt-10 space-y-4"
              onSubmitError={onSubmitError}
              onBeforeSubmitValidator={onBeforeSubmitValidator}
            >
              <PasswordField
                required
                label={formatMessage({
                  id: "current_password",
                  defaultMessage: "Current password",
                })}
                name="oldPassword"
                id="oldPassword"
              />
              <PasswordField
                required
                label={formatMessage({
                  id: "new_password",
                  defaultMessage: "New password",
                })}
                name="newPassword"
                id="newPassword"
                className="text-sm"
              />
              <PasswordField
                required
                label={formatMessage({
                  id: "confirm-password",
                  defaultMessage: "Confirm password",
                })}
                name="confirmPassword"
                id="confirmPassword"
                className="text-sm"
              />

              <FormErrors />

              <SubmitButton>
                {formatMessage({
                  id: "reset_password",
                  defaultMessage: "Reset password",
                })}
              </SubmitButton>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
