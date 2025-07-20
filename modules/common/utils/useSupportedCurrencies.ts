import { useQuery, gql } from '@apollo/client';

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
  const { data, loading, error } = useQuery(SUPPORTED_CURRENCIES_QUERY);

  const currencies = data?.currencies || [];

  return {
    currencies,
    loading,
    error,
  };
};

export default useSupportedCurrencies;
