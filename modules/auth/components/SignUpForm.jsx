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
import AuthLayout from "./AuthLayout";

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
    <AuthLayout
      title={formatMessage({ id: "sign_up_header", defaultMessage: "Create new account" })}
      footer={
        <>
          {formatMessage({ id: "already_got_a_user", defaultMessage: "Already got a user?" })}
          <Link href="/login" className="link ml-1">
            {formatMessage({ id: "log_in", defaultMessage: "Log In" })}
          </Link>
        </>
      }
    >
        <Form
          onSubmit={onSubmit}
          onSubmitError={onSubmitError}
          className="space-y-5"
          name="signUpForm"
        >
          <input type="hidden" name="remember" value="true" />
          <div className="space-y-5">
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
              className=""
              toggleKey="webauthn"
              active={authenticateWithDevice}
            />
          </div>
          <FormErrors />

          <div>
            <SubmitButton>


              {formatMessage({
                id: "sign_up",
                defaultMessage: "Sign up",
              })}
            </SubmitButton>
          </div>


        </Form>
    </AuthLayout>
  );
};

export default SignUpForm;
