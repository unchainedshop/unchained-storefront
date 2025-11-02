import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductDetailFragment from '../../products/fragments/ProductFragment';
import ProductPriceFragment from '../../products/fragments/ProductPriceFragment';
import AssortmentFragment from '../fragments/assortment';
import AssortmentMediaFragment from '../fragments/AssortmentMedia';
import AssortmentPathFragment from '../fragments/AssortmentPath';
import { useAppContext } from '../../common/components/AppContextWrapper';
import LoadedFilterFragment from '../../products/fragments/LoadedFilterFragment';

export const ASSORTMENT_PRODUCTS_QUERY = gql`
  query AssortmentsProducts(
    $slugs: String!
    $offset: Int
    $limit: Int
    $currency: String
    $filterQuery: [FilterQueryInput!]
    $queryString: String
  ) {
    assortment(slug: $slugs) {
      ...AssortmentFragment
      assortmentPaths {
        ...AssortmentPathFragment
      }
      media {
        ...AssortmentMediaFragment
      }
      searchProducts(filterQuery: $filterQuery, queryString: $queryString) {
        filteredProductsCount
        productsCount
        products(offset: $offset, limit: $limit) {
          ...ProductDetailFragment
          ...ProductPriceFragment
        }
        filters {
          ...LoadedFilterFragment
        }
      }
    }
  }
  ${LoadedFilterFragment}
  ${ProductPriceFragment}
  ${AssortmentFragment}
  ${ProductDetailFragment}
  ${AssortmentPathFragment}
  ${AssortmentMediaFragment}
`;

const useAssortmentProducts = (
  {
    includeLeaves,
    slugs,
    filterQuery,
    queryString,
  }: {
    includeLeaves: boolean;
    slugs: string[] | string;
    filterQuery?: any[];
    queryString?: string;
  } = {
    includeLeaves: true,
    slugs: [],
    filterQuery: null,
  },
) => {
  const { selectedCurrency } = useAppContext();
  const { data, loading, error, fetchMore, previousData } = useQuery<any>(
    ASSORTMENT_PRODUCTS_QUERY,
    {
      variables: {
        includeLeaves,
        slugs,
        offset: 0,
        limit: 10,
        currency: selectedCurrency,
        filterQuery,
        queryString,
      },
    },
  );
  const normalizedData = data || previousData;
  const paths = (normalizedData?.assortment?.assortmentPaths || [])
    .flat()
    .pop()?.links;
  const products = normalizedData?.assortment?.searchProducts.products || [];
  const filters = normalizedData?.assortment?.searchProducts.filters || [];
  const loadMore = () => {
    fetchMore({
      variables: {
        offset: products.length,
        includeLeaves,
        slugs,
        limit: 10,
      },
    });
  };

  return {
    loading,
    loadMore,
    error,
    filteredProducts:
      normalizedData?.assortment?.searchProducts.filteredProductsCount,
    assortment: normalizedData?.assortment || {},
    products,
    paths,
    filters,
  };
};

export default useAssortmentProducts;
