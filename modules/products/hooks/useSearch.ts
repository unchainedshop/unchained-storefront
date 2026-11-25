import { NetworkStatus, gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductListItemFragment from '../fragments/ProductListItemFragment';
import { useAppContext } from '../../common/components/AppContextWrapper';
import LoadedFilterFragment from '../fragments/LoadedFilterFragment';
import AssortmentFragment from '../../assortment/fragments/assortment';
import type * as GQL from '../../apollo/generated';

const SearchQuery = gql`
  query Search(
    $queryString: String
    $offset: Int
    $limit: Int
    $currency: String
    $filterQuery: [FilterQueryInput!]
    $withCategories: Boolean!
  ) {
    searchProducts(queryString: $queryString, filterQuery: $filterQuery) {
      productsCount
      filteredProductsCount
      products(offset: $offset, limit: $limit) {
        ...ProductListItemFragment
      }
      filters {
        ...LoadedFilterFragment
      }
    }
    searchAssortments(queryString: $queryString) @include(if: $withCategories) {
      assortments(limit: 6) {
        ...AssortmentFragment
      }
    }
  }
  ${LoadedFilterFragment}
  ${AssortmentFragment}
  ${ProductListItemFragment}
`;

// Without a queryString this lists the whole published catalog, which is how
// products outside of any category stay browsable.
const useSearch = ({ queryString = null, filterQuery = [], limit = 12 }: { queryString?: string | null; filterQuery?: any[]; limit?: number }) => {
  const { selectedCurrency } = useAppContext();
  const { loading, error, data, networkStatus, previousData, fetchMore } = useQuery<GQL.SearchQuery, GQL.SearchQueryVariables>(SearchQuery,
    {
      variables: {
        queryString: queryString || null,
        offset: 0,
        limit,
        filterQuery,
        currency: selectedCurrency,
        withCategories: Boolean(queryString),
      },
    },
  );
  const { filteredProductsCount, filters, products } =
    data?.searchProducts || {};
  const {
    filteredProductsCount: previousFilteredProductsCount,
    filters: previousFilters,
    products: previousProducts,
  } = previousData?.searchProducts || {};

  const currentProducts = products || previousProducts || [];
  const loadMore = () =>
    fetchMore({ variables: { offset: currentProducts.length, limit } });

  return {
    loading,
    error,
    loadMore,
    products:
      networkStatus === NetworkStatus.setVariables
        ? []
        : products || previousProducts,
    filters: filters || previousFilters,
    categories: (data || previousData)?.searchAssortments?.assortments || [],
    filteredProductsCount:
      filteredProductsCount || previousFilteredProductsCount || 0,
  };
};

export default useSearch;
