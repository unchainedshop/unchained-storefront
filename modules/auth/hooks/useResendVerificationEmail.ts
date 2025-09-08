import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation SendVerificationEmail($email: String!) {
    sendVerificationEmail(email: $email) {
      success
    }
  }
`;

const useResendVerificationEmail = () => {
  const [resendVerificationEmailMutation, { error }] = useMutation<any>(
    RESEND_VERIFICATION_EMAIL_MUTATION,
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
