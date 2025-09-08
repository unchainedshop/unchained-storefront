import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductFragment from '../fragments/ProductFragment';
import ProductPriceFragment from '../fragments/ProductPriceFragment';
import { ProductAssortmentPathFragment } from '../../assortment/fragments/AssortmentPath';

export const PRODUCTS_QUERY = gql`
  query Products($tags: [LowerCaseString!], $limit: Int) {
    products(tags: $tags, limit: $limit) {
      _id
      assortmentPaths {
        ...ProductAssortmentPathFragment
      }
      ...ProductDetails
      ...ProductPriceFragment
    }
  }
  ${ProductFragment}
  ${ProductPriceFragment}
  ${ProductAssortmentPathFragment}
`;

const useProducts = ({ tags = [], limit = 50 } = {}) => {
  const { data, loading, error } = useQuery<any>(PRODUCTS_QUERY, {
    variables: {
      tags: tags.length > 0 ? tags : undefined,
      limit,
    },
  });

  return {
    loading,
    error,
    products: data?.products || [],
  };
};

export default useProducts;
