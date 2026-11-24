import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const ADD_EMAIL_MUTATION = gql`
  mutation AddEmail($email: String!) {
    addEmail(email: $email) {
      _id
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
  const [addEmailMutation, { error }] = useMutation<GQL.AddEmailMutation, GQL.AddEmailMutationVariables>(ADD_EMAIL_MUTATION);

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
