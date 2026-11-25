import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import OrderDeliveryPickUpFragment from '../../orders/fragments/OrderDeliveryPickUpFragment';
import type * as GQL from '../../apollo/generated';

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
  const [updateCartDeliveryMutation] = useMutation<GQL.UpdateCartDeliveryProviderMutation, GQL.UpdateCartDeliveryProviderMutationVariables>(UPDATE_CART_DELIVERY_PROVIDER_MUTATION,
  );

  const updateCartDelivery = async ({ deliveryProviderId }) => {
    await updateCartDeliveryMutation({ variables: { deliveryProviderId } });
  };

  return {
    updateCartDelivery,
  };
};

export default useUpdateCartDelivery;
