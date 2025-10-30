import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductDetailFragment from '../fragments/ProductFragment';
import ProductPriceFragment from '../fragments/ProductPriceFragment';
import { ProductAssortmentPathFragment } from '../../assortment/fragments/AssortmentPath';
import { useAppContext } from '../../common/components/AppContextWrapper';

export const PRODUCTS_QUERY = gql`
  query Products(
    $tags: [LowerCaseString!]
    $limit: Int
    $queryString: String
    $currency: String
  ) {
    products(tags: $tags, limit: $limit, queryString: $queryString) {
      _id
      assortmentPaths {
        ...ProductAssortmentPathFragment
      }
      ...ProductDetailFragment
      ...ProductPriceFragment
    }
  }
  ${ProductDetailFragment}
  ${ProductPriceFragment}
  ${ProductAssortmentPathFragment}
`;

const useProducts = ({ tags = [], limit = 50, queryString = null } = {}) => {
  const { selectedCurrency } = useAppContext();
  const { data, loading, error } = useQuery<any>(PRODUCTS_QUERY, {
    variables: {
      tags: tags.length > 0 ? tags : undefined,
      limit,
      queryString,
      currency: selectedCurrency,
    },
  });

  return {
    loading,
    error,
    products: data?.products || [],
  };
};

export default useProducts;
