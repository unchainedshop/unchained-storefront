import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import EnrollmentDetailFragment from '../../products/fragments/EnrollmentDetailFragment';
import { useAppContext } from '../../common/components/AppContextWrapper';
import type * as GQL from '../../apollo/generated';

export const USER_SUBSCRIPTIONS_QUERY = gql`
  query UserSubscriptions($currency: String) {
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
  const { selectedCurrency } = useAppContext();
  const { data, loading, error } = useQuery<GQL.UserSubscriptionsQuery, GQL.UserSubscriptionsQueryVariables>(USER_SUBSCRIPTIONS_QUERY, {
    variables: { currency: selectedCurrency },
  });

  return {
    loading,
    error,
    subscriptions: data?.me?.enrollments ?? [],
  };
};

export default useUserSubscriptions;
