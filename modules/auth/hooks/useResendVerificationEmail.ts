import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation SendVerificationEmail($email: String!) {
    sendVerificationEmail(email: $email) {
      success
    }
  }
`;

const useResendVerificationEmail = () => {
  const [resendVerificationEmailMutation, { error }] = useMutation<GQL.SendVerificationEmailMutation, GQL.SendVerificationEmailMutationVariables>(RESEND_VERIFICATION_EMAIL_MUTATION,
  );

  const resendVerificationEmail = async (email) => {
    return resendVerificationEmailMutation({
      variables: { email },
    });
  };

  return {
    resendVerificationEmail,
    error,
  };
};

export default useResendVerificationEmail;
