import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductListItemFragment from '../fragments/ProductListItemFragment';
import { useAppContext } from '../../common/components/AppContextWrapper';
import { useIntl } from 'react-intl';

export const EventsQuery = gql`
  query Events(
    $tags: [LowerCaseString!]
    $queryString: String
    $limit: Int
    $currency: String
    $locale: Locale
  ) {
    products(
      tags: $tags
      queryString: $queryString
      sort: [{ key: "created", value: DESC }]
      limit: $limit
    ) {
      _id
      texts(forceLocale: $locale) {
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
        simulatedPrice(currencyCode: $currency) {
          amount
          currencyCode
        }
        simulatedStocks {
          quantity
        }
      }
      ... on ConfigurableProduct {
        simulatedPriceRange(currencyCode: $currency) {
          minPrice {
            amount
            currencyCode
          }
        }
        products {
          _id
          texts(forceLocale: $locale) {
            _id
            slug
            title
            subtitle
            labels
          }
          ... on TokenizedProduct {
            simulatedPrice(currencyCode: $currency) {
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
          texts(forceLocale: $locale) {
            _id
            title
          }
          options {
            _id
            value
            texts(forceLocale: $locale) {
              _id
              title
            }
          }
        }
        assignments(includeInactive: true) {
          _id
          product {
            _id
            texts(forceLocale: $locale) {
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
              texts(forceLocale: $locale) {
                _id
                title
              }
            }
            variation {
              _id
              key
              texts(forceLocale: $locale) {
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
  const { selectedCurrency } = useAppContext();
  const { locale } = useIntl();
  const { loading, error, data } = useQuery(EventsQuery, {
    variables: {
      tags: ['event'],
      currency: selectedCurrency,
      locale,
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
