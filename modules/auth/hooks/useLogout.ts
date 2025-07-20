import { useMutation, useApolloClient, gql } from '@apollo/client';

export const LOG_OUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

const useLogoutMutation = () => {
  const client = useApolloClient();
  const [logoutMutation] = useMutation(LOG_OUT_MUTATION);

  const logout = async () => {
    const result = await logoutMutation();
    client.resetStore();
    return result;
  };

  return {
    logout,
  };
};

export default useLogoutMutation;
