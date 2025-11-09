import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import QuotationFragment from '../../products/fragments/QuotationFragment';
import { useIntl } from 'react-intl';

export const USER_QUOTATIONS_QUERY = gql`
  query UserQuotations($locale: Locale) {
    me {
      _id
      quotations {
        ...QuotationFragment
      }
    }
  }
  ${QuotationFragment}
`;

const useUserQuotations = () => {
  const { locale } = useIntl();
  const { data, loading, error } = useQuery<any>(USER_QUOTATIONS_QUERY, {
    variables: { locale },
  });

  return {
    loading,
    error,
    quotations: data?.me?.quotations || [],
  };
};

export default useUserQuotations;
