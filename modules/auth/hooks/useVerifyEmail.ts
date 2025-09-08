import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      _id
      tokenExpires
      user {
        _id
        emails {
          address
          verified
        }
      }
    }
  }
`;

const useVerifyEmail = () => {
  const [verifyEmailMutation, { client, ...props }] = useMutation<any>(
    VERIFY_EMAIL_MUTATION,
  );
  const verifyEmail = async ({ token }) => {
    const result = await verifyEmailMutation({
      variables: {
        token,
      },
      awaitRefetchQueries: true,
    });
    await client.resetStore();
    return result;
  };

  return {
    verifyEmail,
    ...props,
  };
};

export default useVerifyEmail;
