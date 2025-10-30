import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductDetailFragment from '../../products/fragments/ProductFragment';
import ProductPriceFragment from '../../products/fragments/ProductPriceFragment';
import AssortmentFragment from '../fragments/assortment';
import AssortmentMediaFragment from '../fragments/AssortmentMedia';
import AssortmentPathFragment from '../fragments/AssortmentPath';
import { useAppContext } from '../../common/components/AppContextWrapper';

export const ASSORTMENT_PRODUCTS_QUERY = gql`
  query AssortmentsProducts(
    $slugs: String!
    $offset: Int
    $limit: Int
    $currency: String
  ) {
    assortment(slug: $slugs) {
      ...AssortmentFragment
      assortmentPaths {
        ...AssortmentPathFragment
      }
      media {
        ...AssortmentMediaFragment
      }
      searchProducts {
        filteredProductsCount
        productsCount
        products(offset: $offset, limit: $limit) {
          ...ProductDetailFragment
          ...ProductPriceFragment
        }
      }
    }
  }
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
  }: { includeLeaves: boolean; slugs: string[] | string } = {
    includeLeaves: true,
    slugs: [],
  },
) => {
  const { selectedCurrency } = useAppContext();
  const { data, loading, error, fetchMore } = useQuery<any>(
    ASSORTMENT_PRODUCTS_QUERY,
    {
      variables: {
        includeLeaves,
        slugs,
        offset: 0,
        limit: 10,
        currency: selectedCurrency,
      },
    },
  );
  const paths = (data?.assortment?.assortmentPaths || []).flat().pop()?.links;
  const products = data?.assortment?.searchProducts.products || [];
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
    filteredProducts: data?.assortment?.searchProducts.filteredProductsCount,
    assortment: data?.assortment || {},
    products,
    paths,
  };
};

export default useAssortmentProducts;
