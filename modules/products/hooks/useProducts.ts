import { useQuery, gql } from '@apollo/client';
import ProductFragment from '../fragments/ProductFragment';
import SimpleProductPrice from '../fragments/SimpleProductPrice';
import { ProductAssortmentPathFragment } from '../../assortment/fragments/AssortmentPath';

export const PRODUCTS_QUERY = gql`
  query Products($tags: [LowerCaseString!], $limit: Int) {
    products(tags: $tags, limit: $limit) {
      _id
      assortmentPaths {
        ...ProductAssortmentPathFragment
      }
      ...ProductDetails
      ...SimpleProductPrice
    }
  }
  ${ProductFragment}
  ${SimpleProductPrice}
  ${ProductAssortmentPathFragment}
`;

const useProducts = ({ tags = [], limit = 50 } = {}) => {
  const { data, loading, error } = useQuery(PRODUCTS_QUERY, {
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
