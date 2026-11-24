import classNames from "classnames";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { useIntl } from "react-intl";
import { useAppContext } from "../../common/components/AppContextWrapper";
import useGenerateLoginCredentials from "../hooks/useGenerateLoginCredentials";
import useLoginWithPassword from "../hooks/useLoginWithPassword";
import useLoginWithWebAuthn from "../hooks/useLoginWithWebAuthn";
import useLoginWithLoginCode from "../hooks/useLoginWithLoginCode";
import useShopInfo from "../../common/hooks/useShopInfo";
import isEmail from "../../common/utils/isEmail";

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
        <div className="bg-surface">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-muted-foreground"
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
              autoFocus  
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-surface block w-full appearance-none rounded-md border border-input px-3 py-2 shadow-xs focus:border-danger focus:outline-none focus:ring-danger sm:text-sm"
            />
          </div>
        </div>
      );
    default:
      return (
        <div>
          <label
            htmlFor="username-or-email"
            className="block text-sm font-medium text-muted-foreground"
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
              className="bg-surface block w-full appearance-none rounded-md border border-input px-3 py-2 shadow-xs focus:border-danger focus:outline-none focus:ring-danger sm:text-sm"
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
  const [loginCodeSent, setLoginCodeSent] = useState(false);
  const [loginCode, setLoginCode] = useState("");
  const { loginCodeEnabled } = useShopInfo();
  const { requestLoginCode, loginWithLoginCode, requesting } =
    useLoginWithLoginCode();
  const canUseLoginCode =
    loginCodeEnabled && !emailSupportDisabled && isEmail(usernameOrEmail);
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
    const message = formError?.message?.toLowerCase() || "";
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

  const onRequestLoginCode = async () => {
    setError(null);
    try {
      await requestLoginCode(usernameOrEmail);
      setLoginCodeSent(true);
    } catch (e) {
      handleError(e);
    }
  };

  const cancelLoginCode = () => {
    setError(null);
    setLoginCode("");
    setLoginCodeSent(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let data;
    try {
      if (loginCodeSent) {
        data = await loginWithLoginCode({
          email: usernameOrEmail,
          code: loginCode,
        });
      } else if (step === 1) {
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
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight">
            {formatMessage({ id: "log_in", defaultMessage: "Log In" })}
          </h2>
          {!emailSupportDisabled ? (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              <Link
                href="/forgot-password"
                className="ml-1 font-medium text-muted-foreground hover:text-foreground"
              >
                {formatMessage({
                  id: "forgot_password",
                  defaultMessage: "Forgot your password?",
                })}
              </Link>
            </p>
          ) : null}
        </div>
        {(step > 1 || loginCodeSent) && (
          <button
            type="button"
            id="previous-button"
            name="previous-button"
            onClick={loginCodeSent ? cancelLoginCode : previousStep}
            className="text-danger text-sm mx-auto block mt-5"
          >
            {formatMessage({
              id: "back",
              defaultMessage: "← Back",
            })}
          </button>
        )}

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-surface">
          <div
            className={classNames("py-8 px-4 shadow sm:rounded-lg sm:px-10")}
          >
            <div className="space-y-6 sm:rounded-lg">
              <form onSubmit={onSubmit}>
                {loginCodeSent ? (
                  <div>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {formatMessage(
                        {
                          id: "login-code-sent",
                          defaultMessage:
                            "If {email} belongs to an account, we sent it a login link and code. Click the link or enter the code here.",
                        },
                        { email: usernameOrEmail },
                      )}
                    </p>
                    <label
                      htmlFor="login-code"
                      className="block text-sm font-medium text-muted-foreground"
                    >
                      {formatMessage({
                        id: "login-code",
                        defaultMessage: "Login code",
                      })}
                    </label>
                    <input
                      id="login-code"
                      name="loginCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      autoFocus
                      required
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value)}
                      className="mt-1 bg-surface block w-full appearance-none rounded-md border border-input px-3 py-2 tracking-widest shadow-xs focus:border-danger focus:outline-none focus:ring-danger sm:text-sm"
                    />
                  </div>
                ) : (
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
                )}
                {error && <div className="mt-3 text-danger">{error}</div>}
                {showPasswordNav && (
                  <p className="text-center font-semibold text-danger cursor-pointer">
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
                    className="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  {step === 1 && !loginCodeSent && canUseLoginCode && (
                    <button
                      type="button"
                      disabled={requesting}
                      onClick={onRequestLoginCode}
                      className="mt-3 flex w-full justify-center rounded-md border border-input bg-surface py-2 px-4 text-sm font-medium text-foreground shadow-xs hover:bg-muted disabled:opacity-50"
                    >
                      {formatMessage({
                        id: "email-me-login-code",
                        defaultMessage: "Email me a login code",
                      })}
                    </button>
                  )}
                </div>
              </form>
              <div className="text-sm text-foreground">
                {formatMessage({
                  id: "dont-have-account",
                  defaultMessage: `Don't have an account?`,
                })}
                <Link
                  href="/sign-up"
                  className="ml-1 font-medium text-muted-foreground hover:text-foreground"
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
