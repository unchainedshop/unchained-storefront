import { useMutation, gql } from '@apollo/client';

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation SendVerificationEmail($email: String!) {
    sendVerificationEmail(email: $email) {
      success
    }
  }
`;

const useResendVerificationEmail = () => {
  const [resendVerificationEmailMutation, { error }] = useMutation(
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
