import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import EnrollmentDetailFragment from '../../products/fragments/EnrollmentDetailFragment';
import { useIntl } from 'react-intl';
import { useAppContext } from '../../common/components/AppContextWrapper';

export const USER_SUBSCRIPTIONS_QUERY = gql`
  query UserSubscriptions($locale: Locale, $currency: String) {
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
  const { locale } = useIntl();
  const { selectedCurrency } = useAppContext();
  const { data, loading, error } = useQuery<any>(USER_SUBSCRIPTIONS_QUERY, {
    variables: { locale, currency: selectedCurrency },
  });

  return {
    loading,
    error,
    subscriptions: data?.me?.enrollments ?? [],
  };
};

export default useUserSubscriptions;
