import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const CART_CHECKOUT_QUERY = gql`
  query CartCheckout {
    me {
      _id
      cart {
        _id
        items {
          _id
          quantity
          unitPrice {
            amount
            currencyCode
          }
          total {
            amount
            currencyCode
          }
          product {
            _id
            texts {
              title
              subtitle
            }
            media {
              _id
              file {
                url
              }
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
          }
        }
        itemsTotal: total(category: ITEMS) {
          amount
          currencyCode
        }
        taxesTotal: total(category: TAXES) {
          amount
          currencyCode
        }
        deliveryTotal: total(category: DELIVERY) {
          amount
          currencyCode
        }
        grandTotal: total {
          amount
          currencyCode
        }
        payment {
          _id
          fee {
            amount
            currencyCode
          }
          provider {
            _id
            type
            interface {
              _id
              label
              version
            }
          }
        }
        supportedPaymentProviders {
          _id
          type
          interface {
            _id
            label
            version
          }
        }
        contact {
          telNumber
          emailAddress
        }
        billingAddress {
          firstName
          lastName
          addressLine
          addressLine2
          postalCode
          regionCode
          city
          countryCode
        }
        delivery {
          _id
          provider {
            _id
            type
            interface {
              _id
              label
              version
            }
          }
          ... on OrderDeliveryShipping {
            address {
              firstName
              lastName
              addressLine
              addressLine2
              postalCode
              regionCode
              city
              countryCode
            }
          }
        }
      }
    }
  }
`;

const useCart = () => {
  const { loading, error, data } = useQuery<any>(CART_CHECKOUT_QUERY, {
    notifyOnNetworkStatusChange: true,
  });

  const { cart } = data?.me || {};
  return {
    cart,
    loading,
    error,
  };
};

export default useCart;
