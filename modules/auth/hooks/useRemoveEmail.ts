import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

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
  const [removeEmailMutation, { error }] = useMutation<any>(
    REMOVE_EMAIL_MUTATION,
  );

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
