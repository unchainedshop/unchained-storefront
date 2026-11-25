import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
    }
  }
`;

const useForgotPassword = () => {
  const [forgotPasswordMutation] = useMutation<GQL.ForgotPasswordMutation, GQL.ForgotPasswordMutationVariables>(FORGOT_PASSWORD_MUTATION);

  const forgotPassword = async ({ email }) => {
    return forgotPasswordMutation({
      variables: { email },
    });
  };

  return {
    forgotPassword,
  };
};

export default useForgotPassword;
