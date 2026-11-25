import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const COUNTRIES_QUERY = gql`
  query Countries {
    countries {
      _id
      isoCode
      isBase
      flagEmoji
      name
      defaultCurrency {
        _id
        isoCode
      }
    }
  }
`;

const useCountries = () => {
  const { data, loading } = useQuery<GQL.CountriesQuery, GQL.CountriesQueryVariables>(COUNTRIES_QUERY);
  return { countries: data?.countries || [], loading };
};

export default useCountries;
