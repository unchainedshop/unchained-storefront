import { gql } from '@apollo/client';
import ProductDetailFragment from '../fragments/ProductFragment';
import { useQuery } from '@apollo/client/react';
import { useAppContext } from '../../common/components/AppContextWrapper';
import { useIntl } from 'react-intl';

export const EventDetailQuery = gql`
  query Event(
    $slug: String
    $productId: ID
    $currency: String
    $locale: Locale
  ) {
    product(slug: $slug, productId: $productId) {
      _id
      tags
      status
      texts(forceLocale: $locale) {
        _id
        title
        slug
        subtitle
        description
        labels
      }
      media {
        _id
        file {
          url
        }
        texts(forceLocale: $locale) {
          _id
          title
        }
      }
      ... on TokenizedProduct {
        texts(forceLocale: $locale) {
          _id
          slug
          title
          subtitle
          description
        }
        media {
          _id
          file {
            _id
            url
          }
        }
        contractConfiguration {
          ercMetadataProperties
          supply
        }
        simulatedStocks {
          quantity
        }
        tokens {
          _id
          invalidatedDate
          isInvalidateable
          user {
            _id
            lastContact {
              emailAddress
              telNumber
            }
          }
          ercMetadata
        }
      }
      ... on ConfigurableProduct {
        simulatedPriceRange(currencyCode: $currency) {
          minPrice {
            amount
            currencyCode
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
            }
            ...ProductDetailFragment
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
  ${ProductDetailFragment}
`;

const useEventDetail = ({ productId }) => {
  const { selectedCurrency } = useAppContext();
  const { locale } = useIntl();
  const { loading, error, data } = useQuery<any>(EventDetailQuery, {
    variables: { productId, currency: selectedCurrency, locale },
    skip: !productId,
  });

  return {
    product: data?.product,
    loading,
    error,
  };
};

export default useEventDetail;
