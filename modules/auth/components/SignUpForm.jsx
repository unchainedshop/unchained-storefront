import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { useAppContext } from "../../common/components/AppContextWrapper";
import Toggle from "../../common/components/Toggle";
import EmailField from "../../forms/components/EmailField";
import Form from "../../forms/components/Form";
import FormErrors from "../../forms/components/FormErrors";

import PasswordField from "../../forms/components/PasswordField";
import SubmitButton from "../../forms/components/SubmitButton";
import TextField from "../../forms/components/TextField";

import useCreateUser from "../hooks/useCreateUser";
import useGenerateWebAuthCredentials from "../hooks/useGenerateWebAuthCredentials";

const SignUpForm = () => {
  const { formatMessage } = useIntl();
  const [authenticateWithDevice, setAuthenticateWithDevice] = useState(true);
  const { generateWebAuthCredentials } = useGenerateWebAuthCredentials();
  const { createUser } = useCreateUser();
  const { push } = useRouter();
  const { emailSupportDisabled } = useAppContext();

  const onSubmitError = async (e) => {
    if (e.message?.toLowerCase().includes("email already exist")) {
      return {
        email: {
          type: "manual",
          message: formatMessage({
            id: "email_exists_error",
            defaultMessage: "Email already exists",
          }),
        },
      };
    }
    if (
      e.message?.includes("challenge mismatch") ||
      e.message?.includes("already exists")
    ) {
      return {
        email: {
          type: "manual",
          message: formatMessage({
            id: "username_or_email_taken",
            defaultMessage:
              "Username taken, Please provided different username",
          }),
        },
      };
    }

    return null;
  };

  const registerWithWebAuth = async (username) => {
    const webAuthnPublicKeyCredentials = await generateWebAuthCredentials({
      username,
    });

    await createUser({
      username,
      webAuthnPublicKeyCredentials,
    });
  };

  const onSubmit = async ({ email, username, password }) => {
    if (authenticateWithDevice) await registerWithWebAuth(username);

    if (!authenticateWithDevice)
      await createUser({
        username,
        email,
        password,
      });

    toast.success(
      formatMessage({
        id: "registration-complete",
        defaultMessage: "Registered successfully",
      }),
    );
    push("/account");
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold text-slate-900 dark:text-slate-200">
            {formatMessage({
              id: "sign_up_header",
              defaultMessage: "Create new account",
            })}
          </h2>
        </div>

        <Form
          onSubmit={onSubmit}
          onSubmitError={onSubmitError}
          className="mt-8 space-y-6 pt-4 pb-8 shadow sm:rounded-lg sm:px-10"
          name="signUpForm"
        >
          <input type="hidden" name="remember" value="true" />
          <div className="space-y-6 rounded-md shadow-xs">
            <TextField
              id="username"
              name="username"
              required={authenticateWithDevice}
              type="text"
              label={formatMessage({
                id: "username",
                defaultMessage: "Username",
              })}
            />

            {!authenticateWithDevice && (
              <>
                {!emailSupportDisabled ? (
                  <EmailField
                    id="email"
                    name="email"
                    required={!authenticateWithDevice}
                    label={formatMessage({
                      id: "email",
                      defaultMessage: "Email",
                    })}
                  />
                ) : null}
                <PasswordField
                  id="password"
                  name="password"
                  required={!authenticateWithDevice}
                  label={formatMessage({
                    id: "password",
                    defaultMessage: "Password",
                  })}
                />
              </>
            )}
            <Toggle
              onToggle={() =>
                setAuthenticateWithDevice(!authenticateWithDevice)
              }
              toggleText={formatMessage({
                id: "use_authenticator",
                defaultMessage: "Use authenticator",
              })}
              className="ml-2 my-3"
              toggleKey="webauthn"
              active={authenticateWithDevice}
            />
          </div>
          <FormErrors />

          <div className="my-2">
            <SubmitButton>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-slate-500 group-hover:text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              {formatMessage({
                id: "sign_up",
                defaultMessage: "Sign up",
              })}
            </SubmitButton>
          </div>

          <div className="text-sm text-slate-400 dark:text-slate-200">
            {formatMessage({
              id: "already_got_a_user",
              defaultMessage: "Already got a user?",
            })}
            <Link
              href="/login"
              className=" ml-2 font-medium text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300"
            >
              {formatMessage({
                id: "log_in",
                defaultMessage: "Log In",
              })}
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUpForm;
