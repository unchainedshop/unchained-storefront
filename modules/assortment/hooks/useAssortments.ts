import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import AssortmentFragment from '../fragments/assortment';
import AssortmentMediaFragment from '../fragments/AssortmentMedia';
import { useIntl } from 'react-intl';

export const ASSORTMENTS_QUERY = gql`
  query AssortmentsQuery($includeLeaves: Boolean = false, $locale: Locale) {
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
  const { locale } = useIntl();
  const { data, loading, error } = useQuery<any>(ASSORTMENTS_QUERY, {
    variables: {
      includeLeaves,
      locale,
    },
  });

  return {
    loading,
    error,
    assortments: data?.assortments || [],
  };
};

export default useAssortments;
