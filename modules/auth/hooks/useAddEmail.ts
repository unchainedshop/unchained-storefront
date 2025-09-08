import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const ADD_EMAIL_MUTATION = gql`
  mutation AddEmail($email: String!) {
    addEmail(email: $email) {
      _id
      emails {
        address
        verified
      }
    }
  }
`;

const useAddEmail = () => {
  const [addEmailMutation, { error }] = useMutation<any>(ADD_EMAIL_MUTATION);

  const addEmail = async (email) => {
    return addEmailMutation({
      variables: { email },
    });
  };

  return {
    addEmail,
    error,
  };
};

export default useAddEmail;
