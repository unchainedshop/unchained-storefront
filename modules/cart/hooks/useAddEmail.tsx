import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const ADD_EMAIL_MUTATION = gql`
  mutation AddEmail($email: String!) {
    addEmail(email: $email) {
      _id
      name
      primaryEmail {
        address
        verified
      }
      emails {
        address
        verified
      }
    }
  }
`;

const useAddEmail = () => {
  const [addEmailMutation] = useMutation<any>(ADD_EMAIL_MUTATION);

  const addEmail = async ({ email }) => {
    await addEmailMutation({ variables: { email } });
  };

  return {
    addEmail,
  };
};

export default useAddEmail;
