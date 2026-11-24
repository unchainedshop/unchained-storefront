import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const SUPPORTED_CURRENCIES_QUERY = gql`
  query SupportedCurrencies {
    currencies {
      _id
      isoCode
      decimals
    }
  }
`;

const useSupportedCurrencies = () => {
  const { data, loading, error } = useQuery<GQL.SupportedCurrenciesQuery, GQL.SupportedCurrenciesQueryVariables>(SUPPORTED_CURRENCIES_QUERY);

  const currencies = data?.currencies || [];

  return {
    currencies,
    loading,
    error,
  };
};

export default useSupportedCurrencies;
