import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

import AssortmentFragment from '../fragments/assortment';
import AssortmentPathFragment from '../fragments/AssortmentPath';
import { useIntl } from 'react-intl';

export const ASSORTMENT_PATHS_QUERY = gql`
  query AssortmentPathsQuery($assortmentId: ID!, $locale: Locale) {
    assortment(assortmentId: $assortmentId) {
      ...AssortmentFragment
      assortmentPaths {
        ...AssortmentPathFragment
      }
    }
  }
  ${AssortmentFragment}
  ${AssortmentPathFragment}
`;

const useAssortmentPaths = ({ assortmentId }) => {
  const { locale } = useIntl();
  const { data, loading, error } = useQuery<any>(ASSORTMENT_PATHS_QUERY, {
    variables: {
      assortmentId,
      locale,
    },
  });

  return {
    loading,
    error,
    assortment: data?.assortment,
  };
};

export default useAssortmentPaths;
