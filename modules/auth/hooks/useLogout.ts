import { gql } from '@apollo/client';

import { useApolloClient, useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const LOG_OUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

const useLogoutMutation = () => {
  const client = useApolloClient();
  const [logoutMutation] = useMutation<GQL.LogoutMutation, GQL.LogoutMutationVariables>(LOG_OUT_MUTATION);

  const logout = async () => {
    const result = await logoutMutation();
    await client.resetStore();
    return result;
  };

  return {
    logout,
  };
};

export default useLogoutMutation;
