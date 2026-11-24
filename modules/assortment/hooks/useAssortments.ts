import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import AssortmentFragment from '../fragments/assortment';
import AssortmentMediaFragment from '../fragments/AssortmentMedia';
import type * as GQL from '../../apollo/generated';

export const ASSORTMENTS_QUERY = gql`
  query AssortmentsQuery($includeLeaves: Boolean = false) {
    assortments(includeLeaves: $includeLeaves) {
      ...AssortmentFragment
      media {
        ...AssortmentMediaFragment
      }
    }
  }
  ${AssortmentFragment}
  ${AssortmentMediaFragment}
`;

const useAssortments = ({ includeLeaves = false } = {}) => {
  const { data, loading, error } = useQuery<GQL.AssortmentsQueryQuery, GQL.AssortmentsQueryQueryVariables>(ASSORTMENTS_QUERY, {
    variables: {
      includeLeaves,
    },
  });

  return {
    loading,
    error,
    assortments: data?.assortments || [],
  };
};

export default useAssortments;
