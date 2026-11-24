import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import OrderDeliveryPickUpFragment from '../fragments/OrderDeliveryPickUpFragment';
import AddressFragment from '../../common/fragments/AddressFragment';
import CartTotalsFragment from '../fragments/CartTotalsFragment';
import OrderDeliveryShippingFragment from '../fragments/OrderDeliveryShippingFragment';

export const CART_CHECKOUT_QUERY = gql`
  query CartCheckout {
    me {
      _id
      cart {
        _id
        ...CartTotalsFragment
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
        payment {
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
        supportedDeliveryProviders {
          _id
          type
          isActive
          simulatedPrice {
            amount
            currencyCode
          }
          ... on DeliveryProviderPickUp {
            pickUpLocations {
              _id
              name
              address {
                ...AddressFragment
              }
            }
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
          ...OrderDeliveryPickUpFragment
          ...OrderDeliveryShippingFragment
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
  ${CartTotalsFragment}
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
