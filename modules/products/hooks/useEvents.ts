import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductListItemFragment from '../fragments/ProductListItemFragment';

export const EventsQuery = gql`
  query Events($tags: [LowerCaseString!], $queryString: String, $limit: Int) {
    products(
      tags: $tags
      queryString: $queryString
      sort: [{ key: "created", value: DESC }]
      limit: $limit
    ) {
      _id
      texts {
        _id
        slug
        title
        subtitle
        labels
      }
      media {
        _id
        file {
          _id
          url
        }
      }
      ... on TokenizedProduct {
        contractConfiguration {
          ercMetadataProperties
          supply
        }
        simulatedPrice {
          amount
          currencyCode
        }
        simulatedStocks {
          quantity
        }
      }
      ... on ConfigurableProduct {
        simulatedPriceRange {
          minPrice {
            amount
            currencyCode
          }
        }
        products {
          _id
          texts {
            _id
            slug
            title
            subtitle
            labels
          }
          ... on TokenizedProduct {
            simulatedPrice {
              amount
              currencyCode
            }
            simulatedStocks {
              quantity
            }
          }
        }
        variations {
          _id
          key
          texts {
            _id
            title
          }
          options {
            _id
            value
            texts {
              _id
              title
            }
          }
        }
        assignments(includeInactive: true) {
          _id
          product {
            _id
            texts {
              _id
              slug
              title
              subtitle
              labels
              slug
            }
            ...ProductListItemFragment
          }
          vectors {
            _id
            option {
              _id
              value
              texts {
                _id
                title
              }
            }
            variation {
              _id
              key
              texts {
                _id
                title
              }
            }
          }
        }
      }
    }
  }
  ${ProductListItemFragment}
`;

const useEvents = () => {
  const { loading, error, data } = useQuery(EventsQuery, {
    variables: {
      tags: ['event'],
    },
  });

  const products = (data as any)?.products || [];
  return {
    events: products,
    loading,
    error,
  };
};

export default useEvents;
