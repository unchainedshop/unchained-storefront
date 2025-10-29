import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ProductAssortmentPathFragment } from '../../assortment/fragments/AssortmentPath';
import ProductDetailFragment from '../fragments/ProductFragment';
import ProductPriceFragment from '../fragments/ProductPriceFragment';
import ProductListItemFragment from '../fragments/ProductListItemFragment';

const PRODUCT_DETAIL_QUERY = gql`
  query ProductDetails($slug: String) {
    product(slug: $slug) {
      status
      tags
      assortmentPaths {
        ...ProductAssortmentPathFragment
      }
      siblings(limit: 4) {
        ...ProductListItemFragment
      }
      ... on PlanProduct {
        plan {
          usageCalculationType
          billingInterval
          billingIntervalCount
          trialInterval
          trialIntervalCount
        }
        salesUnit
      }
      proxies {
        ... on ConfigurableProduct {
          _id
          variations {
            key
            texts {
              _id
              title
            }
            options {
              value
              texts {
                _id
                title
              }
            }
          }
          assignments {
            _id
            product {
              _id
              texts {
                _id
                title
                slug
              }
              ...ProductPriceFragment
            }
            vectors {
              _id
              variation {
                key
              }
              option {
                value
              }
            }
          }
        }
      }
      ...ProductDetailFragment
      ...ProductPriceFragment
    }
  }

  ${ProductDetailFragment}
  ${ProductPriceFragment}
  ${ProductAssortmentPathFragment}
  ${ProductListItemFragment}
`;

const useProductDetail = ({ slug }) => {
  const { data, loading, error } = useQuery<any>(PRODUCT_DETAIL_QUERY, {
    variables: { slug },
  });

  const paths = (data?.product?.assortmentPaths || []).flat().pop()?.links;

  return {
    product: data?.product,
    paths,
    loading,
    error,
  };
};

export default useProductDetail;
