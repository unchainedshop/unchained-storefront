import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

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
  const { data, loading, error } = useQuery<any>(SUPPORTED_CURRENCIES_QUERY);

  const currencies = data?.currencies || [];

  return {
    currencies,
    loading,
    error,
  };
};

export default useSupportedCurrencies;
