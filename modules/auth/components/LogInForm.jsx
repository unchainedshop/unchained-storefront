import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { useIntl } from "react-intl";
import { useAppContext } from "../../common/components/AppContextWrapper";
import useGenerateLoginCredentials from "../hooks/useGenerateLoginCredentials";
import useLoginWithPassword from "../hooks/useLoginWithPassword";
import useLoginWithWebAuthn from "../hooks/useLoginWithWebAuthn";
import useLoginWithLoginCode from "../hooks/useLoginWithLoginCode";
import AuthLayout from "./AuthLayout";
import useShopInfo from "../../common/hooks/useShopInfo";
import isEmail from "../../common/utils/isEmail";

const GetCurrentStep = ({
  step,
  usernameOrEmail,
  setUsernameOrEmail,
  password,
  setPassword,
  acceptEmail,
  forgotLink,
}) => {
  const { formatMessage } = useIntl();
  switch (parseInt(step, 10)) {
    case 2:
      return (
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label">
              {formatMessage({ id: "password", defaultMessage: "Password" })}
            </label>
            {forgotLink}
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus  
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
        </div>
      );
    default:
      return (
        <div>
          <label htmlFor="username-or-email" className="label">
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
          <div>
            <input
              id="username-or-email"
              name="usernameOrEmail"
              className="input"
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

  const forgotLink = !emailSupportDisabled ? (
    <Link href="/forgot-password" className="link text-sm">
      {formatMessage({ id: "forgot_password", defaultMessage: "Forgot your password?" })}
    </Link>
  ) : null;

  return (
    <AuthLayout
      title={formatMessage({ id: "log_in", defaultMessage: "Log In" })}
      subtitle={formatMessage({
        id: "log_in_subtitle",
        defaultMessage: "Welcome back! Sign in to see your orders and wishlist.",
      })}
      footer={
        <>
          {formatMessage({ id: "dont-have-account", defaultMessage: "Don't have an account?" })}
          <Link href="/sign-up" className="link ml-1">
            {formatMessage({ id: "join-now", defaultMessage: "Join now" })}
          </Link>
        </>
      }
    >
      {(step > 1 || loginCodeSent) && (
        <button
          type="button"
          onClick={loginCodeSent ? cancelLoginCode : previousStep}
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {formatMessage({ id: "back", defaultMessage: "← Back" })}
        </button>
      )}
      {step > 1 && !loginCodeSent && (
        <p className="mb-4 truncate rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          {usernameOrEmail}
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        {loginCodeSent ? (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              {formatMessage(
                {
                  id: "login-code-sent",
                  defaultMessage:
                    "If {email} belongs to an account, we sent it a login link and code. Click the link or enter the code here.",
                },
                { email: usernameOrEmail },
              )}
            </p>
            <label htmlFor="login-code" className="label">
              {formatMessage({ id: "login-code", defaultMessage: "Login code" })}
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
              className="input tracking-widest"
            />
          </div>
        ) : (
          <GetCurrentStep
            step={step}
            {...{ usernameOrEmail, setUsernameOrEmail, password, setPassword, forgotLink }}
            acceptEmail={!emailSupportDisabled}
          />
        )}
        {error && (
          <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        {showPasswordNav && (
          <button type="button" onClick={nextStep} className="link text-sm">
            {formatMessage({
              id: "use-password-to-authenticate",
              defaultMessage: "Or Use password to authenticate",
            })}
          </button>
        )}
        <button type="submit" className="btn btn-primary w-full">
          {formatMessage({ id: "continue", defaultMessage: "Continue" })}
        </button>
        {step === 1 && !loginCodeSent && canUseLoginCode && (
          <button
            type="button"
            disabled={requesting}
            onClick={onRequestLoginCode}
            className="btn btn-secondary w-full"
          >
            {formatMessage({ id: "email-me-login-code", defaultMessage: "Email me a login code" })}
          </button>
        )}
      </form>
    </AuthLayout>
  );
};

export default LogInForm;
