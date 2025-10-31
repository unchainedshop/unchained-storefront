import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const FiltersQuery = gql`
  query Filters(
    $queryString: String
    $limit: Int
    $offset: Int
    $includeInactive: Boolean
    $sort: [SortOptionInput!]
  ) {
    filters(
      queryString: $queryString
      limit: $limit
      offset: $offset
      includeInactive: $includeInactive
      sort: $sort
    ) {
      _id
      updated
      created
      key
      isActive
      type

      options {
        _id
        texts {
          _id
          title
          subtitle
          locale
        }
        value
      }
      texts {
        _id
        title
        subtitle
        locale
      }
    }
    filtersCount(includeInactive: $includeInactive, queryString: $queryString)
  }
`;

const useFilters = ({
  queryString = '',
  limit = 20,
  offset = 0,
  includeInactive = true,
  sort = [],
  forceLocale = '',
} = {}) => {
  const { data, loading, error, fetchMore } = useQuery<any>(FiltersQuery, {
    context: {
      headers: {
        forceLocale,
      },
    },
    variables: {
      queryString,
      limit,
      offset,
      includeInactive,
      sort,
    },
  });
  const filters = data?.filters || [];
  const filtersCount = data?.filtersCount;
  const hasMore = filters?.length < filtersCount;
  const loadMore = () => {
    fetchMore({
      variables: { offset: filters?.length },
    });
  };
  return {
    filters,
    filtersCount,
    hasMore,
    loading,
    error,
    loadMore,
  };
};

export default useFilters;
