import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import EnrollmentDetailFragment from '../../products/fragments/EnrollmentDetailFragment';

export const USER_SUBSCRIPTIONS_QUERY = gql`
  query UserSubscriptions {
    me {
      _id
      enrollments {
        ...EnrollmentDetailFragment
      }
    }
  }
  ${EnrollmentDetailFragment}
`;

const useUserSubscriptions = () => {
  const { data, loading, error } = useQuery<any>(USER_SUBSCRIPTIONS_QUERY);

  return {
    loading,
    error,
    subscriptions: data?.me?.enrollments ?? [],
  };
};

export default useUserSubscriptions;
