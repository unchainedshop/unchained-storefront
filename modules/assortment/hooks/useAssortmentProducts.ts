import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductDetailFragment from '../../products/fragments/ProductFragment';
import ProductPriceFragment from '../../products/fragments/ProductPriceFragment';
import AssortmentFragment from '../fragments/assortment';
import AssortmentMediaFragment from '../fragments/AssortmentMedia';
import AssortmentPathFragment from '../fragments/AssortmentPath';
import { useAppContext } from '../../common/components/AppContextWrapper';
import LoadedFilterFragment from '../../products/fragments/LoadedFilterFragment';
import type * as GQL from '../../apollo/generated';

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
      linkedAssortments {
        _id
        parent {
          _id
        }
        child {
          ...AssortmentFragment
          media {
            ...AssortmentMediaFragment
          }
        }
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
    slugs,
    filterQuery,
    queryString,
  }: {
    slugs: string;
    filterQuery?: any[];
    queryString?: string;
  } = {
    slugs: "",
    filterQuery: null,
  },
) => {
  const { selectedCurrency } = useAppContext();
  const { data, loading, error, fetchMore, previousData } = useQuery<GQL.AssortmentsProductsQuery, GQL.AssortmentsProductsQueryVariables>(ASSORTMENT_PRODUCTS_QUERY,
    {
      variables: {
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
    assortment: normalizedData?.assortment,
    // Links point both ways; children are the ones this assortment is parent of.
    subcategories: (normalizedData?.assortment?.linkedAssortments || [])
      .filter((link) => link.parent?._id === normalizedData?.assortment?._id)
      .map((link) => link.child),
    products,
    paths,
    filters,
  };
};

export default useAssortmentProducts;
