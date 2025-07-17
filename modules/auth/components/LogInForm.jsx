import classNames from "classnames";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { useIntl } from "react-intl";
import { useAppContext } from "../../common/components/AppContextWrapper";
import useGenerateLoginCredentials from "../hooks/useGenerateLoginCredentials";
import useLoginWithPassword from "../hooks/useLoginWithPassword";
import useLoginWithWebAuthn from "../hooks/useLoginWithWebAuthn";

const GetCurrentStep = ({
  step,
  usernameOrEmail,
  setUsernameOrEmail,
  password,
  setPassword,
  acceptEmail,
}) => {
  const { formatMessage } = useIntl();
  switch (parseInt(step, 10)) {
    case 2:
      return (
        <div className="bg-white">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-brown-600"
          >
            {formatMessage({
              id: "password",
              defaultMessage: "Password",
            })}
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoFocus // eslint-disable-line
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-beige block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 shadow-xs focus:border-red-500 focus:outline-none focus:ring-red-800 sm:text-sm"
            />
          </div>
        </div>
      );
    default:
      return (
        <div>
          <label
            htmlFor="username-or-email"
            className="block text-sm font-medium text-brown-600"
          >
            {!acceptEmail
              ? formatMessage({
                  id: "username",
                  defaultMessage: "Username",
                })
              : formatMessage({
                  id: "username-or-email",
                  defaultMessage: "Username / Email",
                })}
          </label>
          <div className="mt-1">
            <input
              id="username-or-email"
              name="usernameOrEmail"
              className="bg-beige block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 shadow-xs focus:border-red-500 focus:outline-none focus:ring-red-800 sm:text-sm"
              type="text"
              autoComplete="email username"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>
        </div>
      );
  }
};

const LogInForm = () => {
  const router = useRouter();
  const { emailSupportDisabled } = useAppContext();
  const { formatMessage } = useIntl();
  const { logInWithPassword } = useLoginWithPassword();
  const { loginWithWebAuthn } = useLoginWithWebAuthn();
  const [showPasswordNav, setShowPasswordNav] = useState(false);
  const [error, setError] = useState(null);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const step = parseInt(router.query.step, 10) || 1;

  const nextStep = () => {
    setError(null);
    setShowPasswordNav(false);
    router.push({
      query: {
        step: step + 1,
      },
    });
  };

  const previousStep = () => {
    setError(null);
    setShowPasswordNav(false);
    router.push({
      query: {
        step: step - 1,
      },
    });
  };

  const { generateLoginCredentials } = useGenerateLoginCredentials();

  const handleError = (formError) => {
    const message = formError?.message?.toLowerCase();
    if (
      message.includes("invalid credential") ||
      message.includes("incorrect credential")
    ) {
      setError(
        formatMessage({
          id: "invalid-credential-error",
          defaultMessage: "Invalid credential, please try again",
        }),
      );
    } else if (message.includes("no password set")) {
      setError(
        formatMessage({
          id: "no-password-set-error",
          defaultMessage: "User password not set",
        }),
      );
    } else if (message.includes("operation either timed out")) {
      setShowPasswordNav(true);
      setError(
        formatMessage({
          id: "operation-timeout-error",
          defaultMessage: "Operation timed out, please try again.",
        }),
      );
    } else if (message.includes("you have provided all required parameters")) {
      setError(
        formatMessage({
          id: "email-required-login-error",
          defaultMessage: "Email is required when logging in with password",
        }),
      );
    } else {
      setError(message);
    }
  };

  const logInWithWebAuth = async (username) => {
    const webAuthnPublicKeyCredentials = await generateLoginCredentials({
      username,
    });
    if (webAuthnPublicKeyCredentials) {
      const { data } = await loginWithWebAuthn({
        webAuthnPublicKeyCredentials,
      });
      if (data && data?.loginWithWebAuthn) {
        router.push("/");
        return true;
      }
    }

    return false;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let data;
    try {
      if (step === 1) {
        const success = await logInWithWebAuth(usernameOrEmail);
        if (!success) {
          nextStep();
          return false;
        }
      } else if (step === 2) {
        data = await logInWithPassword({
          usernameOrEmail,
          password,
          disableHashing: true,
        });
      }
    } catch (e) {
      handleError(e);
      return false;
    }

    if (!data?.errors?.length) {
      router.push("/");
      return true;
    }
    handleError(data.errors[0]);
    return false;
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight dark:text-white ">
            {formatMessage({ id: "log_in", defaultMessage: "Log In" })}
          </h2>
          {!emailSupportDisabled ? (
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-white">
              <Link
                href="/forgot-password"
                className="ml-1 font-medium text-slate-600 hover:text-slate-800 dark:text-white"
              >
                {formatMessage({
                  id: "forgot_password",
                  defaultMessage: "Forgot your password?",
                })}
              </Link>
            </p>
          ) : null}
        </div>
        {step > 1 && (
          <button
            type="button"
            id="previous-button"
            name="previous-button"
            onClick={previousStep}
            className="text-red-600 text-sm mx-auto block mt-5"
          >
            {formatMessage({
              id: "back",
              defaultMessage: "← Back",
            })}
          </button>
        )}

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white dark:bg-slate-500">
          <div
            className={classNames("py-8 px-4 shadow sm:rounded-lg sm:px-10")}
          >
            <div className="space-y-6 sm:rounded-lg">
              <form onSubmit={onSubmit}>
                <GetCurrentStep
                  step={step}
                  {...{
                    usernameOrEmail,
                    setUsernameOrEmail,
                    password,
                    setPassword,
                  }}
                  acceptEmail={!emailSupportDisabled}
                />
                {error && <div className="mt-3 text-red-600">{error}</div>}
                {showPasswordNav && (
                  <p className="text-center font-semibold text-red-700 cursor-pointer">
                    <button type="button" onClick={nextStep}>
                      {formatMessage({
                        id: "use-password-to-authenticate",
                        defaultMessage: "Or Use password to authenticate",
                      })}
                    </button>
                  </p>
                )}
                <div className="mt-4">
                  <input
                    type="submit"
                    id="submit"
                    name="submit"
                    value={formatMessage({
                      id: "continue",
                      defaultMessage: "Continue",
                    })}
                    className="flex w-full justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
                  />
                </div>
              </form>
              <div className="text-sm text-slate-800 dark:text-slate-200">
                {formatMessage({
                  id: "dont-have-account",
                  defaultMessage: `Don't have an account?`,
                })}
                <Link
                  href="/sign-up"
                  className="ml-1 font-medium text-slate-600 hover:text-slate-800 dark:text-slate-800 "
                >
                  {formatMessage({
                    id: "join-now",
                    defaultMessage: "Join now",
                  })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
