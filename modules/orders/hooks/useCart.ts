import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import OrderDeliveryPickUpFragment from '../fragments/OrderDeliveryPickUpFragment';
import AddressFragment from '../../common/fragments/AddressFragment';
import OrderDeliveryShippingFragment from '../fragments/OrderDeliveryShippingFragment';

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
        totalDiscount: total(category: DISCOUNTS) {
          amount
          currencyCode
        }
        discounts {
          _id
          trigger
          code
          interface {
            _id
            label
            version
          }
          total {
            amount
            currencyCode
            isTaxable
            isNetPrice
          }
          discounted {
            _id
            orderDiscount {
              _id
              total {
                amount
                currencyCode
                isTaxable
                isNetPrice
              }
            }
            total {
              amount
              currencyCode
              isTaxable
              isNetPrice
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
        delivery {
          _id
          ...OrderDeliveryPickUpFragment
          ...OrderDeliveryShippingFragment
        }
        supportedDeliveryProviders {
          _id
          type
          isActive
          simulatedPrice {
            amount
            currencyCode
          }
        }
        contact {
          telNumber
          emailAddress
        }
        billingAddress {
          ...AddressFragment
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
              ...AddressFragment
            }
          }
        }
      }
    }
  }
  ${AddressFragment}
  ${OrderDeliveryPickUpFragment}
  ${OrderDeliveryShippingFragment}
`;

const useCart = () => {
  const { loading, error, data, previousData } = useQuery<any>(
    CART_CHECKOUT_QUERY,
    {
      notifyOnNetworkStatusChange: true,
    },
  );

  const { cart } = data?.me || previousData?.me || {};
  return {
    cart,
    loading,
    error,
  };
};

export default useCart;
