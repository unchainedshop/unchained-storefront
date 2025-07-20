import { useQuery, gql } from '@apollo/client';
import CurrentUserFragment from '../fragments/CurrentUserFragment';

export const USER_QUERY = gql`
  query User {
    me {
      ...CurrentUser
    }
  }
  ${CurrentUserFragment}
`;

const useUser = () => {
  const { data, loading, error, refetch } = useQuery(USER_QUERY);

  return {
    loading,
    error,
    user: data?.me,
    cart: data?.me?.cart,
    refetch,
  };
};

export default useUser;
