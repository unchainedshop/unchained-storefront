import { gql } from '@apollo/client';

import { useApolloClient, useMutation } from '@apollo/client/react';

export const LOGIN_AS_GUEST_MUTATION = gql`
  mutation LoginAsGuest {
    loginAsGuest {
      _id
      tokenExpires
    }
  }
`;

const useLoginAsGuest = () => {
  const client = useApolloClient();
  const [loginAsGuestMutation] = useMutation<any>(LOGIN_AS_GUEST_MUTATION);

  const loginAsGuest = async () => {
    const result = await loginAsGuestMutation({
      awaitRefetchQueries: true,
    });
    await client.resetStore();
    return result;
  };

  return {
    loginAsGuest,
  };
};

export default useLoginAsGuest;
