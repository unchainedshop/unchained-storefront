import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

import AssortmentFragment from '../fragments/assortment';
import AssortmentPathFragment from '../fragments/AssortmentPath';
import type * as GQL from '../../apollo/generated';

export const ASSORTMENT_PATHS_QUERY = gql`
  query AssortmentPathsQuery($assortmentId: ID!) {
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
  const { data, loading, error } = useQuery<GQL.AssortmentPathsQueryQuery, GQL.AssortmentPathsQueryQueryVariables>(ASSORTMENT_PATHS_QUERY, {
    variables: {
      assortmentId,
    },
  });

  return {
    loading,
    error,
    assortment: data?.assortment,
  };
};

export default useAssortmentPaths;
