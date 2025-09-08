import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

const LOGIN_WITH_WEB_AUTHN_MUTATION = gql`
  mutation LoginWithWebAuthn($webAuthnPublicKeyCredentials: JSON!) {
    loginWithWebAuthn(
      webAuthnPublicKeyCredentials: $webAuthnPublicKeyCredentials
    ) {
      _id
      tokenExpires
    }
  }
`;

const useLoginWithWebAuthn = () => {
  const [loginWithWebAuthnMutation, { client }] = useMutation<any>(
    LOGIN_WITH_WEB_AUTHN_MUTATION,
  );

  const loginWithWebAuthn = async ({ webAuthnPublicKeyCredentials }) => {
    const result = await loginWithWebAuthnMutation({
      variables: { webAuthnPublicKeyCredentials },
      awaitRefetchQueries: true,
    });
    await client.resetStore();
    return result;
  };
  return { loginWithWebAuthn };
};

export default useLoginWithWebAuthn;
