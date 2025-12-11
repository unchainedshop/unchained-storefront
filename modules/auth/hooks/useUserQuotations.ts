import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import QuotationFragment from '../../products/fragments/QuotationFragment';

export const USER_QUOTATIONS_QUERY = gql`
  query UserQuotations {
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
  const { data, loading, error } = useQuery<any>(USER_QUOTATIONS_QUERY);

  return {
    loading,
    error,
    quotations: data?.me?.quotations || [],
  };
};

export default useUserQuotations;
