import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const SET_USERNAME_MUTATION = gql`
  mutation SetUsername($username: String!, $userId: ID!) {
    setUsername(username: $username, userId: $userId) {
      _id
      username
    }
  }
`;

const useSetUsername = () => {
  const [setUsernameMutation, { error }] = useMutation<GQL.SetUsernameMutation, GQL.SetUsernameMutationVariables>(SET_USERNAME_MUTATION,
  );

  const setUsername = async ({ username, userId }) => {
    return setUsernameMutation({
      variables: { username, userId },
    });
  };

  return {
    setUsername,
    error,
  };
};

export default useSetUsername;
