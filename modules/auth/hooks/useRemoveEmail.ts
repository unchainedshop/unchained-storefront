import { useMutation, gql } from '@apollo/client';

export const REMOVE_EMAIL_MUTATION = gql`
  mutation RemoveEmail($email: String!) {
    removeEmail(email: $email) {
      _id
      emails {
        address
        verified
      }
    }
  }
`;

const useRemoveEmail = () => {
  const [removeEmailMutation, { error }] = useMutation(REMOVE_EMAIL_MUTATION);

  const removeEmail = async (email) => {
    return removeEmailMutation({
      variables: { email },
    });
  };

  return {
    removeEmail,
    error,
  };
};

export default useRemoveEmail;
