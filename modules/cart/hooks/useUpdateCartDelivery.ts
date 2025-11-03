import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import OrderDeliveryPickUpFragment from '../../orders/fragments/OrderDeliveryPickUpFragment';

export const UPDATE_CART_DELIVERY_PROVIDER_MUTATION = gql`
  mutation UpdateCartDeliveryProvider($deliveryProviderId: ID) {
    updateCart(deliveryProviderId: $deliveryProviderId) {
      _id
      delivery {
        _id
        provider {
          _id
        }
        ...OrderDeliveryPickUpFragment
      }
      status
      taxes: total(category: TAXES) {
        amount
        currencyCode
      }
      total {
        amount
        currencyCode
      }
    }
  }
  ${OrderDeliveryPickUpFragment}
`;

const useUpdateCartDelivery = () => {
  const [updateCartDeliveryMutation] = useMutation<any>(
    UPDATE_CART_DELIVERY_PROVIDER_MUTATION,
  );

  const updateCartDelivery = async ({ deliveryProviderId }) => {
    await updateCartDeliveryMutation({ variables: { deliveryProviderId } });
  };

  return {
    updateCartDelivery,
  };
};

export default useUpdateCartDelivery;
