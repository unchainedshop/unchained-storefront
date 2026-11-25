import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token) {
      _id
      tokenExpires
    }
  }
`;

const useResetPassword = () => {
  const [resetPasswordMutation, { client }] = useMutation<GQL.ResetPasswordMutation, GQL.ResetPasswordMutationVariables>(RESET_PASSWORD_MUTATION,
  );

  const resetPassword = async (variables: {
    newPassword: string;
    token: string;
  }) => {
    const result = await resetPasswordMutation({
      variables,
      awaitRefetchQueries: true,
    });
    await client.resetStore();
    return result;
  };

  return {
    resetPassword,
  };
};

export default useResetPassword;
