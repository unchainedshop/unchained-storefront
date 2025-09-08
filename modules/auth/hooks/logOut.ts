import { ApolloClient, gql } from '@apollo/client';

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

const logOut = async (apollo: ApolloClient) => {
  await apollo.mutate({
    mutation: LOGOUT_MUTATION,
    awaitRefetchQueries: true,
  });
  await apollo.resetStore();
};

export default logOut;
