import { NetworkStatus, gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductListItemFragment from '../fragments/ProductListItemFragment';
import { useAppContext } from '../../common/components/AppContextWrapper';

const SearchQuery = gql`
  query Search(
    $queryString: String!
    $offset: Int
    $currency: String
    $filterQuery: [FilterQueryInput!]
  ) {
    searchProducts(queryString: $queryString, filterQuery: $filterQuery) {
      productsCount
      filteredProductsCount
      products(offset: $offset, limit: 12) {
        ...ProductListItemFragment
      }
      filters {
        definition {
          type
          _id
          texts {
            _id
            title
          }
          key
        }
        filteredProductsCount
        productsCount
        isSelected

        options {
          definition {
            _id
            texts {
              _id
              title
            }
            value
          }
          filteredProductsCount
          isSelected
        }
      }
    }
  }
  ${ProductListItemFragment}
`;

const useSearch = ({ queryString, filterQuery = [] }) => {
  const { selectedCurrency } = useAppContext();
  const { loading, error, data, networkStatus, previousData } = useQuery<any>(
    SearchQuery,
    {
      variables: {
        queryString,
        offset: 0,
        filterQuery,
        currency: selectedCurrency,
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

  return {
    loading,
    error,
    products:
      networkStatus === NetworkStatus.setVariables
        ? []
        : products || previousProducts,
    filters: filters || previousFilters,
    filteredProductsCount:
      filteredProductsCount || previousFilteredProductsCount || 0,
  };
};

export default useSearch;
