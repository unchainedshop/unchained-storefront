import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const REQUEST_LOGIN_CODE_MUTATION = gql`
  mutation RequestLoginCode($email: String!) {
    requestLoginCode(email: $email)
  }
`;

const LOGIN_WITH_LOGIN_CODE_MUTATION = gql`
  mutation LoginWithLoginCode($email: String, $code: String, $token: String) {
    loginWithLoginCode(email: $email, code: $code, token: $token) {
      _id
      tokenExpires
      user {
        _id
        allowedActions
        roles
      }
    }
  }
`;

const useLoginWithLoginCode = () => {
  const [requestLoginCodeMutation, { loading: requesting }] = useMutation<GQL.RequestLoginCodeMutation, GQL.RequestLoginCodeMutationVariables>(REQUEST_LOGIN_CODE_MUTATION,
  );
  const [loginWithLoginCodeMutation, { client, loading: loggingIn }] =
    useMutation<GQL.LoginWithLoginCodeMutation, GQL.LoginWithLoginCodeMutationVariables>(LOGIN_WITH_LOGIN_CODE_MUTATION);

  const requestLoginCode = async (email: string) =>
    requestLoginCodeMutation({ variables: { email: email.trim() } });

  const loginWithLoginCode = async (
    variables: { email: string; code: string } | { token: string },
  ) => {
    const result = await loginWithLoginCodeMutation({
      variables:
        'token' in variables
          ? variables
          : { email: variables.email.trim(), code: variables.code.trim() },
    });
    await client.resetStore();
    return result;
  };

  return { requestLoginCode, loginWithLoginCode, requesting, loggingIn };
};

export default useLoginWithLoginCode;
